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
        const themeKeywords = getThemeKeywords();
        if (themeKeywords[theme]) {
          const text = (project.title + ' ' + project.college).toLowerCase();
          matchesTheme = themeKeywords[theme].some(keyword => 
            text.includes(keyword.toLowerCase())
          );
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
      'BioDesign', 'Valorization', 'Sea Farm'
    ],
    
    'Cross-Campus Initiatives': [
      'Global', 'International', 'London', 'Toronto', 'Vancouver', 'Miami',
      'Oakland', 'Seattle', 'Arlington', 'UK Higher Education', 'CUNEF',
      'EDHEC', 'UCL', 'University College-London', 'Multi-Campus', 'Network',
      'Regional', 'Campus Network', 'Maine'
    ],
    
    'Partnerships': [
      'Partner', 'Collaboration', 'Industry', 'Embedded', 'Hub', 'Ecosystem',
      'Alliance', 'Corporate', 'Employer', 'Community', 'Nonprofit',
      'Government', 'Entrepreneurship', 'Innovation Nexus', 'TREK', 'NextLevel',
      'Value Creation', 'Impact Project', 'Intrapreneurship', 'Academia-Industry',
      'Knox', 'cPort', 'IDEXX', 'Focus Groups', 'Connects to Innovation'
    ],
    
    'Career Development': [
      'Career', 'Job', 'Professional', 'Workforce', 'Employment', 'Job-Shadow',
      'Pre-Arrival', 'Co-op', 'Competency', 'College-to-Career', 'Transition',
      'Federal Employees', 'Veterans', 'Military', 'Apprenticeship'
    ],
    
    'Student Services': [
      'Student', 'Mentorship', 'Mentor', 'Advising', 'Advisor', 'Support',
      'Orientation', 'Mixer', 'Connections', 'Peer', 'Counseling',
      'Scholars', 'F1RST', 'Neurodiversity', 'SafeTALK', 'Belonging',
      'Leadership Development', 'Leadership Institute', 'Experience Expo', 
      'Campfire Chats', 'CAMD10'
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
      'Immersion', 'Center'
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
