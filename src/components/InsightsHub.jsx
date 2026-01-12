import React from 'react';
import CommonChallenges from './CommonChallenges';
import ImpactThemes from './ImpactThemes';

const InsightsHub = ({ 
  data, 
  originalData, 
  onQualitativeThemeFilter, 
  activeQualitativeTheme, 
  getQualitativeKeywords 
}) => {
  return (
    <section className="insights-hub">
      <div className="hub-header">
        <h2>
          <div className="hub-icon">💡</div>
          Insights Hub
        </h2>
        <div className="hub-subtitle">Qualitative Intelligence from Innovation Leaders</div>
      </div>

      {/* Insights Grid */}
      <div className="insights-qualitative-grid">
        {/* Common Challenges Analysis */}
        <div className="insight-card qualitative-card">
          <div className="insight-header">
            <div className="insight-title">
              <div className="insight-icon">⚡</div>
              Common Challenges
              <div className="filter-hint">Click red numbers to filter • Click again to clear</div>
            </div>
          </div>
          <div className="insight-body">
            <CommonChallenges 
              data={originalData}
              onQualitativeThemeFilter={onQualitativeThemeFilter}
              activeQualitativeTheme={activeQualitativeTheme}
              getQualitativeKeywords={getQualitativeKeywords}
            />
          </div>
        </div>

        {/* Key Impact Themes */}
        <div className="insight-card qualitative-card">
          <div className="insight-header">
            <div className="insight-title">
              <div className="insight-icon">🎯</div>
              Impact Themes
              <div className="filter-hint">Click numbers to filter • Click again to clear</div>
            </div>
          </div>
          <div className="insight-body">
            <ImpactThemes 
              data={originalData}
              onQualitativeThemeFilter={onQualitativeThemeFilter}
              activeQualitativeTheme={activeQualitativeTheme}
              getQualitativeKeywords={getQualitativeKeywords}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightsHub;