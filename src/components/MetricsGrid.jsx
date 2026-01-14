import React from 'react';

const MetricsGrid = ({ data, originalData, onDataStatusFilter, onCampusFilter }) => {
  // Calculate metrics from current filtered data
  const calculateMetrics = () => {
    const total = data.projects.length;
    
    const highImpact = data.projects.filter(p => 
      ['501-1000', 'More than 1,000'].includes(p.reach)
    ).length;
    
    const dataReady = data.projects.filter(p => 
      p.dataStatus.includes('Yes')
    ).length;
    
    // Use original data for campus count (campuses don't change based on filtering)
    const campuses = new Set(
      originalData.projects
        .map(p => p.campus)
        .filter(campus => campus !== 'Multi-Campus' && campus !== 'Online')
    ).size;
    
    return { total, highImpact, dataReady, campuses };
  };

  const metrics = calculateMetrics();

  // Handle metric click for filtering
  const handleMetricClick = (metricType) => {
    switch (metricType) {
      case 'highImpact':
        // Could add reach filtering functionality here
        break;
      case 'dataReady':
        onDataStatusFilter('Data Ready');
        break;
      case 'campuses':
        // Could show campus breakdown
        break;
      default:
        // Total projects - clear all filters to show all
        break;
    }
  };

  return (
    <section className="metrics-grid">
      {/* Total Projects */}
      <div 
        className="metric-card total-projects"
        onClick={() => handleMetricClick('total')}
        role="button"
        tabIndex={0}
      >
        <div className="metric-icon">📊</div>
        <div className="metric-content">
          <div className="metric-number">{metrics.total}</div>
          <div className="metric-label">Innovation Projects</div>
          <div className="metric-description">Active initiatives tracked</div>
        </div>
      </div>

      {/* High Impact Projects */}
      <div 
        className="metric-card high-impact"
        onClick={() => handleMetricClick('highImpact')}
        role="button"
        tabIndex={0}
      >
        <div className="metric-icon">🚀</div>
        <div className="metric-content">
          <div className="metric-number">{metrics.highImpact}</div>
          <div className="metric-label">Large Scale projects</div>
          <div className="metric-description">Reaching 500+ people</div>
        </div>
      </div>

      {/* Data Ready Projects */}
      <div className="metric-card">
        <div className="metric-icon">📈</div>
        <div className="metric-content">
          <div className="metric-number">{metrics.dataReady}</div>
          <div className="metric-label">Data Available Projects</div>
          <div className="metric-description">Project lead has data</div>
        </div>
      </div>

      {/* Campus Locations */}
      <div 
        className="metric-card campus-count"
        onClick={() => handleMetricClick('campuses')}
        role="button"
        tabIndex={0}
      >
        <div className="metric-icon">🌐</div>
        <div className="metric-content">
          <div className="metric-number">{metrics.campuses}</div>
          <div className="metric-label">Campus Locations</div>
          <div className="metric-description">Global network reach</div>
        </div>
      </div>
    </section>
  );
};

export default MetricsGrid;
