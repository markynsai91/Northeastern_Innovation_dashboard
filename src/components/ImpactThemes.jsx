import React, { useEffect, useRef } from 'react';

const ImpactThemes = ({ 
  data, 
  onQualitativeThemeFilter, 
  activeQualitativeTheme, 
  getQualitativeKeywords 
}) => {
  const containerRef = useRef(null);

  // Create impact themes analysis with dynamic counting
  const createImpactThemes = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const impactKeywords = getQualitativeKeywords().impact;
    const impactCounts = {};

    // Calculate counts using same filtering logic
    Object.entries(impactKeywords).forEach(([theme, keywords]) => {
      let count = 0;
      data.projects.forEach(project => {
        const text = (project.qualitative.challenges + ' ' + project.qualitative.impact).toLowerCase();
        if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
          count++;
        }
      });
      if (count > 0) {
        impactCounts[theme] = count;
      }
    });

    // Sort by frequency
    const sortedImpacts = Object.entries(impactCounts)
      .sort((a, b) => b[1] - a[1]);

    if (sortedImpacts.length === 0) {
      container.innerHTML = '<div class="no-data">No impact themes identified</div>';
      return;
    }

    sortedImpacts.forEach(([theme, count]) => {
      const impactItem = document.createElement('div');
      impactItem.className = 'impact-item';
      
      // Check if this theme is active
      const isActive = activeQualitativeTheme && 
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

     // Add click handler to the count number
      const countNumber = impactItem.querySelector('.impact-number');
      countNumber.addEventListener('click', () => {
        // Check if this filter is already active (toggle functionality)
        const isActive = activeQualitativeTheme && 
          activeQualitativeTheme.type === 'impact' && 
          activeQualitativeTheme.theme === theme;
          
        if (isActive) {
          // If already active, clear the filter by passing null
          onQualitativeThemeFilter(null, null);
        } else {
          // Apply the filter
          onQualitativeThemeFilter('impact', theme);
        }
      });

      container.appendChild(impactItem);
    });
  };

  // Get description for impact theme
  const getImpactDescription = (theme) => {
    const descriptions = {
      'Student Outcomes': 'Direct positive effects on student learning and success',
      'Faculty Development': 'Professional growth and capacity building for educators',
      'Institutional Change': 'University-wide improvements and organizational transformation',
      'Community Impact': 'External benefits to broader communities and stakeholders',
      'Research Advancement': 'Contributions to knowledge discovery and academic research',
      'Process Improvement': 'Enhanced efficiency and streamlined operational procedures'
    };
    return descriptions[theme] || 'Significant positive outcomes and transformational results';
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