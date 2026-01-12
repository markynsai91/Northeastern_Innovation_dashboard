import React, { useEffect, useRef } from 'react';

const StrategyFocus = ({ data, onThemeFilter, activeTheme, getThemeKeywords }) => {
  const containerRef = useRef(null);

  // Category descriptions for tooltips
  const categoryDescriptions = {
    'AI & Technology': 'Projects leveraging artificial intelligence, digital platforms, AR/VR, databases, and emerging technologies to enhance education and operations.',
    'Healthcare': 'Healthcare, medical, and wellness-related innovations improving health outcomes and education.',
    'Research': 'Innovations centered on research methodology, laboratory-based experimentation, academic inquiry, and scholarly investigation.',
    'Cross-Campus Initiatives': 'Collaborative initiatives strengthening programs across multiple campuses, fostering institutional cohesion throughout the university network.',
    'Partnerships': 'Industry collaborations, external alliances, and embedded partnership programs connecting academia with practice and community organizations.',
    'Career Development': 'Programs preparing students for professional success, including workforce development and career transition support.',
    'Student Services': 'Programs enhancing student experience through mentorship, advising, support systems, and campus life initiatives.',
    'Campus Operations': 'Infrastructure and facility innovations including spaces, housing, sustainability, and campus environment improvements.',
    'Academic Programs': 'Curriculum, admissions processes, experiential learning, co-op, and educational innovation delivery methods across disciplines.'
  };

  // Extract themes from project data
  const extractThemes = () => {
    const themeKeywords = getThemeKeywords();
    const themeCounts = {};

    Object.keys(themeKeywords).forEach(theme => {
      themeCounts[theme] = 0;
      data.projects.forEach(project => {
        const text = (project.title + ' ' + project.college).toLowerCase();
        if (themeKeywords[theme].some(keyword => text.includes(keyword.toLowerCase()))) {
          themeCounts[theme]++;
        }
      });
    });

    return Object.entries(themeCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 9); // Show all 9 categories
  };

  // Create theme constellation
  const createConstellation = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const themes = extractThemes();
    const containerWidth = container.offsetWidth || 400;
    
    // Calculate positions with MORE VERTICAL SPACING between rows
    const nodeWidth = 145;
    const nodeHeight = 52;
    const marginX = 12;
    const marginY = 28; // INCREASED from 10 to 28 for more row spacing
    
    const cols = 3;
    const rows = Math.ceil(themes.length / cols);
    
    const totalHeight = (rows * nodeHeight) + ((rows - 1) * marginY);
    const totalWidth = (cols * nodeWidth) + ((cols - 1) * marginX);
    
    const startX = (containerWidth - totalWidth) / 2;
    const startY = 10; // Start near top with small padding

    themes.forEach(([theme, count], index) => {
      // Create wrapper for node and tooltip
      const wrapper = document.createElement('div');
      wrapper.className = 'theme-node-wrapper';
      
      // Create the node
      const node = document.createElement('div');
      node.className = `theme-node ${activeTheme === theme ? 'theme-active' : ''}`;
      node.textContent = `${theme} (${count})`;
      node.dataset.theme = theme;
      
      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'theme-tooltip';
      tooltip.textContent = categoryDescriptions[theme] || 'Innovation focus area';
      
      // Add click handler for filtering
      node.addEventListener('click', () => {
        onThemeFilter(theme);
      });
      
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = startX + (col * (nodeWidth + marginX));
      const y = startY + (row * (nodeHeight + marginY));
      
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
  };

  useEffect(() => {
    createConstellation();
  }, [data, activeTheme]);

  // Handle container resize
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