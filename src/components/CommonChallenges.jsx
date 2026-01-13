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
        const isActive = activeQualitativeTheme && 
          activeQualitativeTheme.type === 'challenges' && 
          activeQualitativeTheme.theme === theme;
          
        if (isActive) {
          onQualitativeThemeFilter(null, null);
        } else {
          onQualitativeThemeFilter('challenges', theme);
        }
      });

      container.appendChild(challengeItem);
    });
  };

  // Get description for challenge theme - UPDATED to match actual theme names
  const getChallengeDescription = (theme) => {
    const descriptions = {
      'Resource Constraints': 'Funding, staffing, budget limitations, and capacity challenges',
      'Scaling & Growth': 'Difficulties expanding initiatives and ensuring sustainability',
      'Stakeholder Engagement': 'Building buy-in, adoption, and participation across groups',
      'Technical Complexity': 'Technology integration, systems, and platform challenges',
      'Coordination Challenges': 'Communication, collaboration, and alignment across silos'
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