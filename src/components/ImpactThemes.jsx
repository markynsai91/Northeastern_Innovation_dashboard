import React, { useEffect, useRef } from 'react';

const ImpactThemes = ({ 
  data, 
  onQualitativeThemeFilter, 
  activeQualitativeTheme, 
  getQualitativeKeywords 
}) => {
  const containerRef = useRef(null);
  const excludedTitlesByTheme = {
    'Research Advancement': new Set([
      'Graduate Leadership Institute-Seattle Campus',
      'Case Study Simulation Program',
      'Redevelopment and Expansion of EESC3000 – Values, Ethics, and Professionalism in the Sciences',
      'Impact Project',
      'Student Leadership Development (Student Interest Groups & Graduate Leadership Institute) - Toronto Campus',
      'Behavior Changing Workplace Learning',
      'Campfire Chats',
      'MaineSeq',
      'Pre-Arrival Career Development Program'
    ].map(title => title.toLowerCase()))
  };
  const includedTitlesByTheme = {
    'Operational Efficiency': new Set([
      'Seattle Campus Innovative Spaces',
      'Integration of UG curriculum to PlusOne',
      'Embedded Partners Program',
      'AI Coach',
      'Media Studios Organization (MSO): A Centralized Creative Technology Ecosystem',
      'Partner Hub: Connecting Industry and Academia',
      'InStage AI Reflection Tool for Co-op',
      'Use of Airtable and Airtable AI for Operational Effiency at Scale',
      'Embedded Partner Ecosystem - Vancouver Campus.',
      'Graduate Student Advising Model: Graduate Faculty Advisor/Program Director Training / Faculty Advisor Use of Navigate'
    ].map(title => title.toLowerCase()))
  };

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
        const includeSet = includedTitlesByTheme[theme];
        if (includeSet && !includeSet.has(project.title.toLowerCase())) {
          return;
        }
        const excludeSet = excludedTitlesByTheme[theme];
        if (excludeSet && excludeSet.has(project.title.toLowerCase())) {
          return;
        }
        if (includeSet) {
          count++;
          return;
        }
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
        const isActive = activeQualitativeTheme && 
          activeQualitativeTheme.type === 'impact' && 
          activeQualitativeTheme.theme === theme;
          
        if (isActive) {
          onQualitativeThemeFilter(null, null);
        } else {
          onQualitativeThemeFilter('impact', theme);
        }
      });

      container.appendChild(impactItem);
    });
  };

  // Get description for impact theme - UPDATED to match actual theme names
  const getImpactDescription = (theme) => {
    const descriptions = {
      'Student Success': 'Improved learning outcomes, retention, and student engagement',
      'Operational Efficiency': 'Streamlined processes, automation, and productivity gains',
      'Community Building': 'Stronger networks, connections, and collaborative partnerships',
      'Research Advancement': 'Knowledge discovery, publications, and research findings'
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
