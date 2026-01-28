import React, { useState, useEffect } from 'react';
import { dashboardData } from '../data/projectData';
import Header from './Header';
import Introduction from './Introduction';
import MetricsGrid from './MetricsGrid';
import InsightsGrid from './InsightsGrid';
import InsightsHub from './InsightsHub';
import Controls from './Controls';
import ProjectTable from './ProjectTable';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [filteredData, setFilteredData] = useState(dashboardData);
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    campus: 'all',
    stage: 'all',
    dataStatus: 'all',
    theme: null,
    qualitativeTheme: null
  });

  const themeExcludedTitles = {
    'Academic Programs': new Set([
      'Husky Bridge Job-Shadow Program',
      'SIG (Student Interest Group) Leader Training Module',
      'cPort Credit Union Language Translation Tool',
      'Pre-Arrival Career Development Program',
      'BaseCamp Studio Program',
      'Use of Airtable and Airtable AI for Operational Effiency at Scale',
      'Co-curricular Experiential Project (Pilot)'
    ].map(title => title.toLowerCase())),
    'Student Services': new Set([
      'Experience Expo',
      'COS Deans Research Scholars',
      'Campfire Chats',
      'Utilising Artificial Intelligence as a Learning Tool to Explore the Development of Undergraduate Students’ Mathematical Resilience',
      'MaineSeq'
    ].map(title => title.toLowerCase())),
    'Healthcare': new Set([
      'BioPILOT/BioCoLAB'
    ].map(title => title.toLowerCase())),
    'AI & Technology': new Set([
      'IDEXX Database Working Lab',
      'Drone Flying Program'
    ].map(title => title.toLowerCase())),
    'Career Development': new Set([
      'Redevelopment and Expansion of EESC3000 – Values, Ethics, and Professionalism in the Sciences',
      'Support for Federal Employees, Federal Contractors, and Military/Veterans in Transition',
      'Use of Airtable and Airtable AI for Operational Effiency at Scale'
    ].map(title => title.toLowerCase())),
    'Research': new Set([
      'Accelerated Bachelor of Science in Nursing (ABSN) Program, Simulation Rooms, & Skills Lab',
      'Real-Time Co-op Competency Assessment and College-to-Career Research',
      'BioPILOT/BioCoLAB',
      'Working Lab',
      'BioDesign for Rural Maine'
    ].map(title => title.toLowerCase()))
  };

  const themeIncludedTitles = {
    'Academic Programs': new Set([
      'COS Deans Research Scholars',
      'Utilising Artificial Intelligence as a Learning Tool to Explore the Development of Undergraduate Students’ Mathematical Resilience',
      'BioPILOT/BioCoLAB',
      'MaineSeq',
      'Working Lab',
      'Pioneering Academia-Industry Collaborations at the Intersection of Artificial Intelligence & Philosophy',
      'BioDesign for Rural Maine',
      'Graduate Leadership Institute-Seattle Campus',
      'PAWsome Connections Mixer Networking Event',
      'Case Study Simulation Program'
    ].map(title => title.toLowerCase())),
    'External Partnerships': new Set([
      'The Neurodiversity Initiative',
      'Physical AI Research (PAIR) Center',
      'Miami Innovation Academy',
      'Entrepreneurship TREK',
      'NextLevel X Northeastern',
      'MS Sustainability Engineering Leadership double-degree with University College-London',
      'Case Study Simulation Program',
      'Apprenticeships',
      'The Innovation Nexus',
      'Accelerated Bachelor of Science in Nursing (ABSN) Program, Simulation Rooms, & Skills Lab',
      'Speech-Language Center',
      'CAMD F1RST',
      'Experience Expo',
      'Campus as a Living Laboratory: Community-Led Urban Greening through the California Climate Action Corps',
      'Building a Regional Credentialing Ecosystem for Lifelong Learning and Workforce Pathways',
      'Investigating the International Big Picture Learning Credential (IBPLC) for U.S. Admissions and Workforce Pathways',
      'Impact Project',
      'Embedded Partners Program',
      'AI Coach',
      'Value Creation',
      'Real-Time Co-op Competency Assessment and College-to-Career Research',
      'Innovation Lab Grants',
      'Student Leadership Development (Student Interest Groups & Graduate Leadership Institute) - Toronto Campus',
      'Public Transportation and Traffic Analysis in Toronto - Northeastern University in Toronto and the City of Toronto',
      'Partner Hub: Connecting Industry and Academia',
      'Bouvé Health Fair',
      'CUNEF Universidad Co-Enrollment Residency Partnership',
      'Intraprenuership for Nonprofits',
      'Behavior Changing Workplace Learning',
      'Capstone Immersion',
      'cPort Credit Union Language Translation Tool',
      'BioPILOT/BioCoLAB',
      'Campfire Chats',
      'Healthcare Gap Year Program',
      'EDHEC Partnership',
      'MaineSeq',
      'Valorization of Dirigo Sea Farm Waste',
      'Working Lab',
      'Arlington County Leader’s Challenge Program',
      'Embedded Partner Ecosystem - Vancouver Campus.',
      'BUILDING AN ENTREPRENEURSHIP ECO-SYSTEM TO SERVE LONDON & THE GLOBAL NETWORK',
      'SafeTALK and Support the Pack',
      'Pioneering Academia-Industry Collaborations at the Intersection of Artificial Intelligence & Philosophy',
      'Belonging in Practice: Driving Innovation in UK Higher Education through New Institutional Practices for Holistic Inclusion',
      'Leveraging Award-Winning Apprenticeship Degrees to Embed Authentic, Industry-Validated Experiential Learning Across the Institution',
      'Mixed Reality Ultrasound Training',
      'IDEXX Database Working Lab',
      'BioDesign for Rural Maine',
      'NU/Knox Clinic Multi-Disciplinary/Generational Collaboration',
      'Co-curricular Experiential Project (Pilot)',
      'Northeastern Toronto Entrepreneurship (Enactus)'
    ].map(title => title.toLowerCase())),
    'Campus Operations': new Set([
      'The Neurodiversity Initiative',
      'Graduate Leadership Institute-Seattle Campus',
      'The Evolving Skills Landscape in the Age of AI: Regional Employers Focus Groups',
      'SIG (Student Interest Group) Leader Training Module',
      'Align Online',
      'PAWsome Connections Mixer Networking Event',
      'Seattle Campus Innovative Spaces',
      'Integration of UG curriculum to PlusOne',
      'Experience Expo',
      'Building a Regional Credentialing Ecosystem for Lifelong Learning and Workforce Pathways',
      'Embedded Partners Program',
      'AI Coach',
      'Value Creation',
      'Media Studios Organization (MSO): A Centralized Creative Technology Ecosystem',
      'Partner Hub: Connecting Industry and Academia',
      'Bouve Undergraduate Researcher Badge',
      'BIOL 2309: Biology Project Laboratory and integration into MakerSpace',
      'Northeastern University Global Innovation Challenge',
      'Intraprenuership for Nonprofits',
      'Behavior Changing Workplace Learning',
      'AI Readiness Survey',
      'Valorization of Dirigo Sea Farm Waste',
      'Pre-Arrival Career Development Program',
      'BaseCamp Studio Program',
      'InStage AI Reflection Tool for Co-op',
      'Use of Airtable and Airtable AI for Operational Effiency at Scale',
      'Embedded Partner Ecosystem - Vancouver Campus.',
      'BUILDING AN ENTREPRENEURSHIP ECO-SYSTEM TO SERVE LONDON & THE GLOBAL NETWORK',
      'Graduate Student Advising Model: Graduate Faculty Advisor/Program Director Training / Faculty Advisor Use of Navigate',
      'Belonging in Practice: Driving Innovation in UK Higher Education through New Institutional Practices for Holistic Inclusion',
      'MSDS/MSCS Co-rooming',
      'Leveraging Award-Winning Apprenticeship Degrees to Embed Authentic, Industry-Validated Experiential Learning Across the Institution'
    ].map(title => title.toLowerCase())),
    'Cross-Campus Initiatives': new Set([
      'Writing Creatively in the Age of AI',
      'The Evolving Skills Landscape in the Age of AI: Regional Employers Focus Groups',
      'Undergraduate Research Badging Program',
      'Impact Project',
      'Proposed Global Urban Studies Major/Minor',
      'Research Justice at the Intersections',
      'Media Studios Organization (MSO): A Centralized Creative Technology Ecosystem',
      'Sustainability Initiatives',
      'CUNEF Universidad Co-Enrollment Residency Partnership',
      'Northeastern University Global Innovation Challenge',
      'Healthcare Gap Year Program',
      'Arlington County Leader’s Challenge Program',
      'Pre-Arrival Career Development Program',
      'InStage AI Reflection Tool for Co-op',
      'Use of Airtable and Airtable AI for Operational Effiency at Scale',
      'BUILDING AN ENTREPRENEURSHIP ECO-SYSTEM TO SERVE LONDON & THE GLOBAL NETWORK'
    ].map(title => title.toLowerCase()))
  };

  const isThemeProjectExcluded = (theme, project) => {
    const excludeSet = themeExcludedTitles[theme];
    if (!excludeSet) return false;
    return excludeSet.has(project.title.toLowerCase());
  };

  const isThemeProjectIncluded = (theme, project) => {
    const includeSet = themeIncludedTitles[theme];
    if (!includeSet) return false;
    return includeSet.has(project.title.toLowerCase());
  };
  const themeHasIncludeList = (theme) => Boolean(themeIncludedTitles[theme]);

  // Filter projects based on active filters
  const applyFilters = () => {
    const { search, campus, stage, dataStatus, theme, qualitativeTheme } = activeFilters;
    
    const filtered = dashboardData.projects.filter(project => {
      // Search filter
      const matchesSearch = !search || 
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.college.toLowerCase().includes(search.toLowerCase()) ||
        project.campus.toLowerCase().includes(search.toLowerCase());

      // Campus filter
      const matchesCampus = campus === 'all' || project.campus === campus;

      // Stage filter (maturity)
      let matchesStage = stage === 'all';
      if (stage !== 'all') {
        const projectStage = getProjectStage(project);
        matchesStage = projectStage === stage;
      }

      // Data status filter
      let matchesDataStatus = dataStatus === 'all';
      if (dataStatus === 'Data Ready' && project.dataStatus.includes('Yes')) matchesDataStatus = true;
      if (dataStatus === 'Collection Planned' && project.dataStatus.includes('planned')) matchesDataStatus = true;
      if (dataStatus === 'No Data' && !project.dataStatus.includes('Yes') && !project.dataStatus.includes('planned')) matchesDataStatus = true;

      // Theme filter (Strategic Focus Areas)
      let matchesTheme = !theme;
      if (theme) {
        if (themeHasIncludeList(theme)) {
          matchesTheme = isThemeProjectIncluded(theme, project);
          if (matchesTheme && isThemeProjectExcluded(theme, project)) {
            matchesTheme = false;
          }
        } else {
          const themeKeywords = getThemeKeywords();
          if (themeKeywords[theme]) {
            const text = (project.title + ' ' + project.college).toLowerCase();
            matchesTheme = themeKeywords[theme].some(keyword => 
              text.includes(keyword.toLowerCase())
            );
            if (matchesTheme && isThemeProjectExcluded(theme, project)) {
              matchesTheme = false;
            }
          }
        }
      }

      // Qualitative theme filter (Challenges/Impact themes)
      let matchesQualitativeTheme = !qualitativeTheme;
      if (qualitativeTheme) {
        const keywords = getQualitativeKeywords();
        const text = (project.qualitative.challenges + ' ' + project.qualitative.impact).toLowerCase();
        if (keywords[qualitativeTheme.type] && keywords[qualitativeTheme.type][qualitativeTheme.theme]) {
          matchesQualitativeTheme = keywords[qualitativeTheme.type][qualitativeTheme.theme].some(keyword =>
            text.includes(keyword.toLowerCase())
          );
        }
      }

      return matchesSearch && matchesCampus && matchesStage && matchesDataStatus && matchesTheme && matchesQualitativeTheme;
    });

    setFilteredData({ projects: filtered });
  };

  // Get project stage based on duration
  const getProjectStage = (project) => {
    const duration = project.duration;
    
    if (duration === 'Less than 6 months' || duration === '6 months - 1 year') {
      return 'Emerging';
    } else if (duration === '1-2 years' || duration === '2-3 years') {
      return 'Growing';
    } else {
      return 'Mature';
    }
  };

  // ============================================
  // STRATEGIC FOCUS AREAS - 9 CATEGORIES
  // ============================================
  const getThemeKeywords = () => ({
    'AI & Technology': [
      'AI ', ' AI', 'Artificial Intelligence', 'Agent Arena', 'AR/VR', 'VR use',
      'Sandbox', 'Database', 'Dashboard', 'Drone', 'Virtual', 'Augmented',
      'Airtable', 'Mixed Reality', 'Hackathon', 'Digital', 'InStage',
      'AI Coach', 'AI Readiness', 'AI Solutions', 'PAIR', 'Technology Ecosystem'
    ],
    
    'Healthcare': [
      'Health', 'Healthcare', 'Medical', 'Nursing', 'Clinical', 'Wellness',
      'ABSN', 'Ultrasound', 'Speech-Language', 'Bouvé', 'Bouve', 'Clinic',
      'Patient', 'Therapy', 'Biomedical'
    ],
    
    'Research': [
      'Research', 'Laboratory', ' Lab', 'Working Lab', 'Discovery',
      'Investigation', 'Methodology', 'Experiment', 'Inquiry', 'Scholarly',
      'Scientific', 'Empirical', 'BioPILOT', 'BioCoLAB', 'MaineSeq', 
      'BioDesign', 'Valorization', 'Sea Farm', 'Drone Flying Program'
    ],
    
    'Cross-Campus Initiatives': [
      'Global', 'International', 'London', 'Toronto', 'Vancouver', 'Miami',
      'Oakland', 'Seattle', 'Arlington', 'UK Higher Education', 'CUNEF',
      'EDHEC', 'UCL', 'University College-London', 'Multi-Campus', 'Network',
      'Regional', 'Campus Network', 'Maine'
    ],
    
    'External Partnerships': [
      'Partner', 'Collaboration', 'Industry', 'Embedded', 'Hub', 'Ecosystem',
      'Alliance', 'Corporate', 'Employer', 'Community', 'Nonprofit',
      'Government', 'Entrepreneurship', 'Innovation Nexus', 'TREK', 'NextLevel',
      'Value Creation', 'Impact Project', 'Intrapreneurship', 'Academia-Industry',
      'Knox', 'cPort', 'IDEXX', 'Focus Groups', 'Connects to Innovation',
      'Working Lab'
    ],
    
    'Career Development': [
      'Career', 'Job', 'Professional', 'Workforce', 'Employment', 'Job-Shadow',
      'Pre-Arrival', 'Co-op', 'Competency', 'College-to-Career', 'Transition',
      'Federal Employees', 'Veterans', 'Military', 'Apprenticeship',
      'Experience Expo', 'Campfire Chats', 'PAWsome Connections',
      'BaseCamp Studio', 'Co-curricular', 'Experiential Project',
      'Miami Innovation Academy', 'Entrepreneurship TREK', 'TREK',
      'Graduate Leadership Institute', 'Introduction to Professional Communication',
      'Global Learner', 'Real-Time Co-op Competency Assessment'
    ],
    
    'Student Services': [
      'Student', 'Mentorship', 'Mentor', 'Advising', 'Advisor', 'Support',
      'Orientation', 'Mixer', 'Connections', 'Peer', 'Counseling',
      'Scholars', 'F1RST', 'Neurodiversity', 'SafeTALK', 'Belonging',
      'Leadership Development', 'Leadership Institute', 'Experience Expo', 
      'Campfire Chats', 'CAMD10', 'SIG', 'Student Interest Group',
      'Federal Employees', 'Military/Veterans', 'Veterans in Transition'
    ],
    
    'Campus Operations': [
      'Spaces', 'Facilities', 'Housing', 'Residence', 'Res Hall', 'Recreation',
      'Sports', 'Infrastructure', 'Building', 'Sustainability', 'Green',
      'Living Laboratory', 'Urban Greening', 'Skills Lab', 'MakerSpace',
      'Studio', 'BaseCamp', 'Personal Training', 'Transportation'
    ],
    
    'Academic Programs': [
      'Curriculum', 'Course', 'Degree', 'Major', 'Minor', 'Admissions',
      'MSCS', 'MSDS', 'Align', 'PlusOne', 'Co-Enrollment', 'Experiential',
      'Pedagogy', 'Certificate', 'Capstone', 'Module', 'Credential', 
      'Non-Degree', 'Framework', 'Credit', 'BIOL', 'EESC', 'STICs', 
      'Writing Creatively', 'Simulation', 'Professional Communication', 
      'Workplace Learning', 'Badging', 'Lifelong Learning', 'Science Program', 
      'Immersion', 'Center', 'ABSN', 'Nursing'
    ]
  });

  // Qualitative themes keywords (for Common Challenges and Impact Themes)
  const getQualitativeKeywords = () => ({
    challenges: {
      'Resource Constraints': ['funding', 'budget', 'resources', 'staff', 'time', 'capacity', 'limited'],
      'Scaling & Growth': ['scale', 'scaling', 'expand', 'growth', 'replicate', 'sustainability'],
      'Stakeholder Engagement': ['engagement', 'buy-in', 'adoption', 'stakeholder', 'participation', 'awareness'],
      'Technical Complexity': ['technical', 'technology', 'integration', 'system', 'platform', 'data'],
      'Coordination Challenges': ['coordination', 'collaboration', 'communication', 'alignment', 'silos']
    },
    impact: {
      'Student Success': ['student', 'learning', 'outcomes', 'success', 'retention', 'engagement'],
      'Operational Efficiency': ['efficiency', 'process', 'streamline', 'automation', 'productivity'],
      'Community Building': ['community', 'network', 'connection', 'collaboration', 'partnership'],
      'Innovation Culture': ['innovation', 'culture', 'mindset', 'creativity', 'entrepreneurship'],
      'Research Advancement': ['research', 'discovery', 'knowledge', 'publication', 'findings']
    }
  });

  // Update filter
  const updateFilter = (filterType, value) => {
    const newFilters = { ...activeFilters };
    
    if (filterType === 'theme') {
      // Toggle theme filter - if same theme clicked, clear it
      newFilters[filterType] = activeFilters.theme === value ? null : value;
    } else if (filterType === 'stage') {
      // Toggle stage filter
      newFilters[filterType] = activeFilters.stage === value ? 'all' : value;
    } else if (filterType === 'qualitativeTheme') {
      // Handle qualitative theme clearing when value is null
      if (value === null) {
        newFilters[filterType] = null;
      } else {
        // Toggle qualitative theme filters
        const currentFilter = newFilters[filterType];
        if (currentFilter && currentFilter.type === value.type && currentFilter.theme === value.theme) {
          newFilters[filterType] = null;
        } else {
          newFilters[filterType] = value;
        }
      }
    } else {
      newFilters[filterType] = value;
    }
    
    setActiveFilters(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({
      search: '',
      campus: 'all',
      stage: 'all',
      dataStatus: 'all',
      theme: null,
      qualitativeTheme: null
    });
  };

  // Apply filters whenever activeFilters change
  useEffect(() => {
    applyFilters();
  }, [activeFilters]);

  return (
    <div className="dashboard">
      <Header />
      
      <main className="dashboard-main">
        <Introduction />
        
        <MetricsGrid 
          data={filteredData}
          originalData={dashboardData}
          onDataStatusFilter={(status) => updateFilter('dataStatus', status)}
          onCampusFilter={(campus) => updateFilter('campus', campus)}
        />

        <InsightsGrid 
          data={filteredData}
          originalData={dashboardData}
          onThemeFilter={(theme) => updateFilter('theme', theme)}
          onStageFilter={(stage) => updateFilter('stage', stage)}
          activeTheme={activeFilters.theme}
          activeStage={activeFilters.stage}
          getProjectStage={getProjectStage}
          getThemeKeywords={getThemeKeywords}
          isThemeProjectExcluded={isThemeProjectExcluded}
          isThemeProjectIncluded={isThemeProjectIncluded}
          themeHasIncludeList={themeHasIncludeList}
        />

        <InsightsHub 
          data={filteredData}
          originalData={dashboardData}
          onQualitativeThemeFilter={(type, theme) => updateFilter('qualitativeTheme', type && theme ? { type, theme } : null)}
          activeQualitativeTheme={activeFilters.qualitativeTheme}
          getQualitativeKeywords={getQualitativeKeywords}
        />

        <Controls 
          data={dashboardData}
          onFilterChange={updateFilter}
          onClearFilters={clearAllFilters}
          activeFilters={activeFilters}
          resultCount={filteredData.projects.length}
        />

        <ProjectTable 
          data={filteredData}
          getProjectStage={getProjectStage}
        />
      </main>

      <footer className="footer">
        <div className="footer-brand">Northeastern University Innovation Intelligence Platform</div>
        <div>Empowering innovation through data-driven insights across the global campus network</div>
      </footer>
    </div>
  );
};

export default Dashboard;
