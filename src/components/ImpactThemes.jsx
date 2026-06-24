import React, { useEffect, useRef } from 'react';

const ImpactThemes = ({
  data,
  onQualitativeThemeFilter,
  activeQualitativeTheme,
  getQualitativeKeywords
}) => {
  const containerRef = useRef(null);

  const normalizeArray = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (!value) return [];

    if (typeof value === 'string') {
      return value
        .replace(/^\{/, '')
        .replace(/\}$/, '')
        .split(',')
        .map((item) => item.replace(/^"|"$/g, '').trim())
        .filter(Boolean);
    }

    return [];
  };

  const getStoredImpactThemes = (project) => {
    return [
      ...normalizeArray(project.impact_themes),
      ...normalizeArray(project.impactThemes),
      ...normalizeArray(project.raw_supabase_project?.impact_themes),
      ...normalizeArray(project.raw_supabase_project?.impactThemes)
    ];
  };

  const hasStoredImpactField = (project) => {
    return (
      Object.prototype.hasOwnProperty.call(project, 'impact_themes') ||
      Object.prototype.hasOwnProperty.call(project, 'impactThemes') ||
      Object.prototype.hasOwnProperty.call(
        project.raw_supabase_project || {},
        'impact_themes'
      )
    );
  };

  const getImpactDescription = (theme) => {
    const descriptions = {
      'Student Success':
        'Improved learning outcomes, retention, and student engagement',
      'Operational Efficiency':
        'Streamlined processes, automation, and productivity gains',
      'Community Building':
        'Stronger networks, connections, and collaborative partnerships',
      'Research Advancement':
        'Knowledge discovery, publications, and research findings'
    };

    return descriptions[theme] || 'Significant positive outcomes and transformational results';
  };

  const createImpactThemes = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const impactKeywords = getQualitativeKeywords
      ? getQualitativeKeywords().impact
      : {
          'Student Success': [],
          'Operational Efficiency': [],
          'Community Building': [],
          'Research Advancement': []
        };

    const impactCounts = {};

    Object.keys(impactKeywords).forEach((theme) => {
      let count = 0;

      data.projects.forEach((project) => {
        const storedImpactThemes = getStoredImpactThemes(project);

        // For migrated Supabase records, use stored DB category arrays.
        // Blank/null values intentionally remain uncategorized.
        if (hasStoredImpactField(project)) {
          if (storedImpactThemes.includes(theme)) {
            count++;
          }
          return;
        }

        // Fallback only for older/static records.
        const text = `${project.qualitative?.challenges || ''} ${project.qualitative?.impact || ''}`.toLowerCase();
        const keywords = impactKeywords[theme] || [];

        if (keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
          count++;
        }
      });

      if (count > 0) {
        impactCounts[theme] = count;
      }
    });

    const sortedImpacts = Object.entries(impactCounts).sort((a, b) => b[1] - a[1]);

    if (sortedImpacts.length === 0) {
      container.innerHTML = '<div class="no-data">No impact themes identified</div>';
      return;
    }

    sortedImpacts.forEach(([theme, count]) => {
      const impactItem = document.createElement('div');
      impactItem.className = 'impact-item';

      const isActive =
        activeQualitativeTheme &&
        activeQualitativeTheme.type === 'impact' &&
        activeQualitativeTheme.theme === theme;

      impactItem.innerHTML = `
        <div class="impact-content">
          <div class="impact-theme">${theme}</div>
          <div class="impact-description">${getImpactDescription(theme)}</div>
        </div>
        <div class="impact-number ${isActive ? 'active-filter' : ''}" data-theme="${theme}" data-type="impact">
          ${count}
        </div>
      `;

      const countNumber = impactItem.querySelector('.impact-number');

      countNumber.addEventListener('click', () => {
        const currentlyActive =
          activeQualitativeTheme &&
          activeQualitativeTheme.type === 'impact' &&
          activeQualitativeTheme.theme === theme;

        if (currentlyActive) {
          onQualitativeThemeFilter(null, null);
        } else {
          onQualitativeThemeFilter('impact', theme);
        }
      });

      container.appendChild(impactItem);
    });
  };

  useEffect(() => {
    createImpactThemes();
  }, [data, activeQualitativeTheme]);

  return (
    <div className="impact-themes" ref={containerRef}>
      <div className="loading">Analyzing impact themes</div>
    </div>
  );
};

export default ImpactThemes;