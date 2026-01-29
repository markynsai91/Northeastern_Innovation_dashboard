import React, { useEffect, useRef } from 'react';

const CommonChallenges = ({ 
  data, 
  onQualitativeThemeFilter, 
  activeQualitativeTheme, 
  getQualitativeKeywords 
}) => {
  const containerRef = useRef(null);
  const excludedTitlesByTheme = {
    'Resource Constraints': new Set([
      'Writing Creatively in the Age of AI',
      'SIG (Student Interest Group) Leader Training Module',
      'Align Online',
      'The Innovation Nexus',
      'Redevelopment and Expansion of EESC3000 – Values, Ethics, and Professionalism in the Sciences',
      'Integration of UG curriculum to PlusOne',
      'Impact Project',
      'Embedded Partners Program',
      'Proposed Global Urban Studies Major/Minor',
      'CAMD10',
      'Student Leadership Development (Student Interest Groups & Graduate Leadership Institute) - Toronto Campus',
      'Experiential Learning Insights (E.L.I) Dashboard',
      'UIP in Applied Sustainability',
      'Drone Flying Program',
      'Co-curricular Experiential Project (Pilot)'
    ].map(title => title.toLowerCase())),
    'Stakeholder Engagement': new Set([
      'The Neurodiversity Initiative',
      'Miami Innovation Academy',
      'The Innovation Nexus',
      'Redevelopment and Expansion of EESC3000 – Values, Ethics, and Professionalism in the Sciences',
      'Campus as a Living Laboratory: Community-Led Urban Greening through the California Climate Action Corps',
      'Health Forward',
      'Value Creation',
      'Public Transportation and Traffic Analysis in Toronto - Northeastern University in Toronto and the City of Toronto',
      'Experiential Learning Insights (E.L.I) Dashboard',
      'COS Science Connects to Innovation',
      'CUNEF Universidad Co-Enrollment Residency Partnership',
      'Northeastern University Global Innovation Challenge',
      'cPort Credit Union Language Translation Tool',
      'Campfire Chats',
      'AI Readiness Survey',
      'EDHEC Partnership',
      'Working Lab',
      'Pre-Arrival Career Development Program',
      'Use of Airtable and Airtable AI for Operational Effiency at Scale',
      'Building An Entrepreneurship Eco-System To Serve London & The Global Network',
      'Belonging in Practice: Driving Innovation in UK Higher Education through New Institutional Practices for Holistic Inclusion'
    ].map(title => title.toLowerCase())),
    'Technical Complexity': new Set([
      'Miami Innovation Academy',
      'The Innovation Nexus',
      'Accelerated Bachelor of Science in Nursing (ABSN) Program, Simulation Rooms, & Skills Lab',
      'Speech-Language Center',
      'Chan Norris Scholars program',
      'Campus as a Living Laboratory: Community-Led Urban Greening through the California Climate Action Corps',
      'Investigating the International Big Picture Learning Credential (IBPLC) for U.S. Admissions and Workforce Pathways',
      'Impact Project',
      'Support for Federal Employees, Federal Contractors, and Military/Veterans in Transition',
      'Media Studios Organization (MSO): A Centralized Creative Technology Ecosystem',
      'Northeastern University Global Innovation Challenge',
      'AI Readiness Survey',
      'Healthcare Gap Year Program',
      'MaineSeq',
      'AI Solutions Hub',
      'Arlington County Leader’s Challenge Program',
      'Pre-Arrival Career Development Program',
      'Embedded Partner Ecosystem - Vancouver Campus.',
      'Building An Entrepreneurship Eco-System To Serve London & The Global Network',
      'Belonging in Practice: Driving Innovation in UK Higher Education through New Institutional Practices for Holistic Inclusion',
      'Utilising Artificial Intelligence as a Learning Tool to Explore the Development of Undergraduate Students’ Mathematical Resilience',
      'BioDesign for Rural Maine',
      'Northeastern Toronto Entrepreneurship (Enactus)'
    ].map(title => title.toLowerCase())),
    'Coordination Challenges': new Set([
      'Speech-Language Center',
      'Campus as a Living Laboratory: Community-Led Urban Greening through the California Climate Action Corps',
      'Health Forward',
      'Res Hall Royale',
      'InStage AI Reflection Tool for Co-op',
      'Pioneering Academia-Industry Collaborations at the Intersection of Artificial Intelligence & Philosophy',
      'BioDesign for Rural Maine',
      'Northeastern Toronto Entrepreneurship (Enactus)'
    ].map(title => title.toLowerCase())),
    'Scaling & Growth': new Set([
      'Accelerated Bachelor of Science in Nursing (ABSN) Program, Simulation Rooms, & Skills Lab',
      'Impact Project',
      'Embedded Partners Program',
      'Toronto Peer Mentorship Program',
      'Student Leadership Development (Student Interest Groups & Graduate Leadership Institute) - Toronto Campus',
      'Sustainability Initiatives',
      'Behavior Changing Workplace Learning',
      'AI Readiness Survey',
      'MaineSeq',
      'Building An Entrepreneurship Eco-System To Serve London & The Global Network',
      'Pioneering Academia-Industry Collaborations at the Intersection of Artificial Intelligence & Philosophy',
      'Co-curricular Experiential Project (Pilot)'
    ].map(title => title.toLowerCase()))
  };

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
        const excludeSet = excludedTitlesByTheme[theme];
        if (excludeSet && excludeSet.has(project.title.toLowerCase())) {
          return;
        }
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
