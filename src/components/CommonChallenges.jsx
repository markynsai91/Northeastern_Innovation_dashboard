import React, { useEffect, useRef } from 'react';

const CommonChallenges = ({
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

  const getStoredCommonChallenges = (project) => {
    return [
      ...normalizeArray(project.common_challenges),
      ...normalizeArray(project.commonChallenges),
      ...normalizeArray(project.raw_supabase_project?.common_challenges),
      ...normalizeArray(project.raw_supabase_project?.commonChallenges)
    ];
  };

  const hasStoredChallengeField = (project) => {
    return (
      Object.prototype.hasOwnProperty.call(project, 'common_challenges') ||
      Object.prototype.hasOwnProperty.call(project, 'commonChallenges') ||
      Object.prototype.hasOwnProperty.call(project.raw_supabase_project || {}, 'common_challenges')
    );
  };

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

  const createChallengesAnalysis = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const challengeKeywords = getQualitativeKeywords
      ? getQualitativeKeywords().challenges
      : {
          'Resource Constraints': [],
          'Scaling & Growth': [],
          'Stakeholder Engagement': [],
          'Technical Complexity': [],
          'Coordination Challenges': []
        };

    const challengeCounts = {};

    Object.keys(challengeKeywords).forEach((theme) => {
      let count = 0;

      data.projects.forEach((project) => {
        const storedChallenges = getStoredCommonChallenges(project);

        // For migrated Supabase records, use stored DB category arrays.
        // Blank/null values intentionally remain uncategorized.
        if (hasStoredChallengeField(project)) {
          if (storedChallenges.includes(theme)) {
            count++;
          }
          return;
        }

        // Fallback only for older/static records.
        const text = `${project.qualitative?.challenges || ''} ${project.qualitative?.impact || ''}`.toLowerCase();
        const keywords = challengeKeywords[theme] || [];

        if (keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
          count++;
        }
      });

      if (count > 0) {
        challengeCounts[theme] = count;
      }
    });

    const sortedChallenges = Object.entries(challengeCounts).sort((a, b) => b[1] - a[1]);

    if (sortedChallenges.length === 0) {
      container.innerHTML = '<div class="no-data">No challenge themes identified</div>';
      return;
    }

    sortedChallenges.forEach(([theme, count]) => {
      const challengeItem = document.createElement('div');
      challengeItem.className = 'challenge-item';

      const isActive =
        activeQualitativeTheme &&
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

      const countBadge = challengeItem.querySelector('.challenge-count');

      countBadge.addEventListener('click', () => {
        const currentlyActive =
          activeQualitativeTheme &&
          activeQualitativeTheme.type === 'challenges' &&
          activeQualitativeTheme.theme === theme;

        if (currentlyActive) {
          onQualitativeThemeFilter(null, null);
        } else {
          onQualitativeThemeFilter('challenges', theme);
        }
      });

      container.appendChild(challengeItem);
    });
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