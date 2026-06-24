import React, { useEffect, useRef } from 'react';

const StrategyFocus = ({
  data,
  onThemeFilter,
  activeTheme,
  getThemeKeywords,
  isThemeProjectExcluded,
  isThemeProjectIncluded,
  themeHasIncludeList
}) => {
  const containerRef = useRef(null);

  const categoryDescriptions = {
    'AI & Technology':
      'Projects leveraging artificial intelligence, digital platforms, AR/VR, databases, and emerging technologies to enhance education and operations.',
    Healthcare:
      'Healthcare, medical, and wellness-related innovations improving health outcomes and education.',
    Research:
      'Innovations centered on research methodology, laboratory-based experimentation, and scholarly investigation.',
    'Cross-Campus Initiatives':
      'Collaborative initiatives strengthening programs across multiple campuses.',
    'External Partnerships':
      'Industry collaborations, external alliances, and embedded partnership programs connecting academia with practice and community organizations.',
    'Career Development':
      'Programs preparing students for professional success, including workforce development, mentorship, and career transition support.',
    'Student Services':
      'Programs enhancing student experience through mentorship, advising, support systems, and campus life initiatives.',
    'Campus Operations':
      'Infrastructure and facility innovations including spaces, housing, sustainability, and campus environment improvements.',
    'Academic Programs':
      'Curriculum, admissions processes, experiential learning, co-op, and educational innovation delivery methods across disciplines.'
  };

  const normalizeArray = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (!value) return [];

    if (typeof value === 'string') {
      // Handles normal comma strings and Postgres-style array strings.
      return value
        .replace(/^\{/, '')
        .replace(/\}$/, '')
        .split(',')
        .map((item) => item.replace(/^"|"$/g, '').trim())
        .filter(Boolean);
    }

    return [];
  };

  const getStoredStrategicFocusAreas = (project) => {
    return [
      ...normalizeArray(project.strategic_focus_areas),
      ...normalizeArray(project.strategicFocusAreas),
      ...normalizeArray(project.raw_supabase_project?.strategic_focus_areas),
      ...normalizeArray(project.raw_supabase_project?.strategicFocusAreas)
    ];
  };

  const projectHasStoredTheme = (project, theme) => {
    return getStoredStrategicFocusAreas(project).includes(theme);
  };

  const hasStoredCategoryField = (project) => {
    return (
      Object.prototype.hasOwnProperty.call(project, 'strategic_focus_areas') ||
      Object.prototype.hasOwnProperty.call(project, 'strategicFocusAreas') ||
      Object.prototype.hasOwnProperty.call(project.raw_supabase_project || {}, 'strategic_focus_areas')
    );
  };

  const projectMatchesLegacyTheme = (project, theme, themeKeywords) => {
    if (isThemeProjectIncluded && isThemeProjectIncluded(theme, project)) {
      return true;
    }

    if (themeHasIncludeList && themeHasIncludeList(theme)) {
      return false;
    }

    if (isThemeProjectExcluded && isThemeProjectExcluded(theme, project)) {
      return false;
    }

    const text = `${project.title || ''} ${project.college || ''}`.toLowerCase();

    return themeKeywords[theme]?.some((keyword) =>
      text.includes(keyword.toLowerCase())
    );
  };

  const extractThemes = () => {
    const themeKeywords = getThemeKeywords ? getThemeKeywords() : {};
    const allThemes = Object.keys(categoryDescriptions);
    const themeCounts = {};

    allThemes.forEach((theme) => {
      themeCounts[theme] = 0;

      data.projects.forEach((project) => {
        const storedAreas = getStoredStrategicFocusAreas(project);

        // For live Supabase migrated records, use the stored categories.
        if (hasStoredCategoryField(project)) {
          if (storedAreas.includes(theme)) {
            themeCounts[theme]++;
          }
          return;
        }

        // Fallback only for older/static records.
        if (projectMatchesLegacyTheme(project, theme, themeKeywords)) {
          themeCounts[theme]++;
        }
      });
    });

    return Object.entries(themeCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 9);
  };

  const createConstellation = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const themes = extractThemes();
    const containerWidth = container.offsetWidth || 400;

    const nodeWidth = 145;
    const nodeHeight = 52;
    const marginX = 12;
    const marginY = 28;

    const cols = 3;
    const totalWidth = cols * nodeWidth + (cols - 1) * marginX;

    const startX = (containerWidth - totalWidth) / 2;
    const startY = 10;

    themes.forEach(([theme, count], index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'theme-node-wrapper';

      const node = document.createElement('div');
      node.className = `theme-node ${activeTheme === theme ? 'theme-active' : ''}`;
      node.textContent = `${theme} (${count})`;
      node.dataset.theme = theme;

      const tooltip = document.createElement('div');
      tooltip.className = 'theme-tooltip';
      tooltip.textContent = categoryDescriptions[theme] || 'Innovation focus area';

      const col = index % cols;

      if (col === 0) {
        tooltip.classList.add('tooltip-left');
      } else if (col === 2) {
        tooltip.classList.add('tooltip-right');
      } else {
        tooltip.classList.add('tooltip-center');
      }

      node.addEventListener('click', () => {
        if (onThemeFilter) {
          onThemeFilter(theme);
        }
      });

      const row = Math.floor(index / cols);

      const x = startX + col * (nodeWidth + marginX);
      const y = startY + row * (nodeHeight + marginY);

      wrapper.style.position = 'absolute';
      wrapper.style.left = `${Math.max(0, x)}px`;
      wrapper.style.top = `${Math.max(0, y)}px`;
      wrapper.style.width = `${nodeWidth}px`;
      wrapper.style.height = `${nodeHeight}px`;

      node.style.width = '100%';
      node.style.height = '100%';

      wrapper.appendChild(node);
      wrapper.appendChild(tooltip);
      container.appendChild(wrapper);
    });

    if (themes.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'loading';
      emptyState.textContent = 'No strategic focus mappings available';
      container.appendChild(emptyState);
    }
  };

  useEffect(() => {
    createConstellation();
  }, [data, activeTheme]);

  useEffect(() => {
    const handleResize = () => {
      createConstellation();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="theme-constellation" ref={containerRef}>
      <div className="loading">Analyzing strategic focus areas</div>
    </div>
  );
};

export default StrategyFocus;