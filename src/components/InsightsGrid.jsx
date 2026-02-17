import React from 'react';
import StrategyFocus from './StrategyFocus';
import MaturityPipeline from './MaturityPipeline';
import CampusChart from './CampusChart';
import DataChart from './DataChart';

const InsightsGrid = ({ 
  data, 
  originalData, 
  onThemeFilter, 
  onStageFilter, 
  activeTheme, 
  activeStage, 
  getProjectStage, 
  getThemeKeywords,
  isThemeProjectExcluded,
  isThemeProjectIncluded,
  themeHasIncludeList
}) => {
  return (
    <section className="insights-grid">
      {/* Strategic Focus Areas */}
      <div className="insight-card focus-areas-card">
        <div className="insight-header">
          <div className="insight-title">
            <div className="insight-icon">★</div>
            Strategic Focus Areas
            <div className="filter-hint">
              Click themes to filter • Click again to clear
              <br />
              View filtered results in the Innovation Project Database below
            </div>
          </div>
        </div>
        <div className="insight-body">
          <StrategyFocus 
            data={originalData}
            onThemeFilter={onThemeFilter}
            activeTheme={activeTheme}
            getThemeKeywords={getThemeKeywords}
            isThemeProjectExcluded={isThemeProjectExcluded}
            isThemeProjectIncluded={isThemeProjectIncluded}
            themeHasIncludeList={themeHasIncludeList}
          />
        </div>
      </div>

      {/* Innovation Maturity Pipeline */}
      <div className="insight-card pipeline-card">
        <div className="insight-header">
          <div className="insight-title">
            <div className="insight-icon">→</div>
            Innovation Maturity Pipeline
            <div className="filter-hint">
              Click bars to filter • Click again to clear
              <br />
              View filtered results in the Innovation Project Database below
            </div>
          </div>
        </div>
        <div className="insight-body">
          <MaturityPipeline 
            data={originalData}
            onStageFilter={onStageFilter}
            activeStage={activeStage}
            getProjectStage={getProjectStage}
          />
        </div>
      </div>

      {/* Campus Network Distribution */}
      <div className="insight-card">
        <div className="insight-header">
          <div className="insight-title">
            <div className="insight-icon">🌐</div>
            Campus Network Distribution
            <div className="filter-hint">
              Legend filters remove locations from this pie chart only, not from the Innovation Project Database below.
            </div>
          </div>
        </div>
        <div className="insight-body">
          <div className="chart-container">
            <CampusChart data={originalData} />
          </div>
        </div>
      </div>

      {/* Data Availability */}
      <div className="insight-card">
        <div className="insight-header">
          <div className="insight-title">
            <div className="insight-icon">📈</div>
            Data Availability
          </div>
        </div>
        <div className="insight-body">
          <div className="chart-container">
            <DataChart data={originalData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightsGrid;
