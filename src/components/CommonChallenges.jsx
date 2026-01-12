import React, { useEffect, useRef } from 'react';

const CommonChallenges = ({ 
  data, 
  onQualitativeThemeFilter, 
  activeQualitativeTheme, 
  getQualitativeKeywords 
}) => {
  const containerRef = useRef(null);

  // Create challenges analysis with dynamic counting
  const createChallengesAnalysis = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const challengeKeywords = getQualitativeKeywords().challenges;
    const challengeCounts = {};

    // Calculate counts using same filtering logic
    Object.entries(challengeKeywords).forEach(([theme, keywords]) => {
      let count = 0;
      data.projects.forEach(project => {
        const text = (project.qualitative.challenges + ' ' + project.qualitative.impact).toLowerCase();
        if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
          count++;
        }
      });
      if (count > 0) {
        challengeCounts[theme] = count;
      }
    });

    // Sort by frequency
    const sortedChallenges = Object.entries(challengeCounts)
      .sort((a, b) => b[1] - a[1]);

    if (sortedChallenges.length === 0) {
      container.innerHTML = '<div class="no-data">No challenge themes identified</div>';
      return;
    }

    sortedChallenges.forEach(([theme, count]) => {
      const challengeItem = document.createElement('div');
      challengeItem.className = 'challenge-item';
      
      // Check if this theme is active
      const isActive = activeQualitativeTheme && 
        activeQualitativeTheme.type === 'challenges' && 
        activeQualitativeTheme.theme === theme;

      challengeItem.innerHTML = `
        <div class="challenge-content">
          <div class="challenge-theme">${theme}</div>
          <div class="challenge-description">${getChallengeDescription(theme)}</div>
        </div>
        <div class="challenge-count ${isActive ? 'active-filter' : ''}" data-theme="${theme}" data-type="challenges">
          ${count}
        </div>
      `;

            // Add click handler to the count badge
      const countBadge = challengeItem.querySelector('.challenge-count');
      countBadge.addEventListener('click', () => {
        // Check if this filter is already active (toggle functionality)
        const isActive = activeQualitativeTheme && 
          activeQualitativeTheme.type === 'challenges' && 
          activeQualitativeTheme.theme === theme;
          
        if (isActive) {
          // If already active, clear the filter by passing null
          onQualitativeThemeFilter(null, null);
        } else {
          // Apply the filter
          onQualitativeThemeFilter('challenges', theme);
        }
      });

      container.appendChild(challengeItem);
    });
  };

  // Get description for challenge theme
  const getChallengeDescription = (theme) => {
    const descriptions = {
      'Student Engagement': 'Challenges in maintaining student participation and involvement',
      'Time Management': 'Issues with timelines, scheduling, and deadline management', 
      'Resource Allocation': 'Funding, staffing, and resource distribution challenges',
      'Technology Integration': 'Difficulties with systems, platforms, and digital tools',
      'Stakeholder Coordination': 'Communication and collaboration coordination issues',
      'Scaling Challenges': 'Difficulties in expanding and growing initiatives'
    };
    return descriptions[theme] || 'Common operational and strategic challenges';
  };

  useEffect(() => {
    createChallengesAnalysis();
  }, [data, activeQualitativeTheme]);

  return (
    <div className="challenges-analysis" ref={containerRef}>
      <div className="loading">Analyzing innovation challenges</div>
    </div>
  );
};

export default CommonChallenges;