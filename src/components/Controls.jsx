import React, { useState, useEffect } from 'react';

const Controls = ({ 
  data, 
  onFilterChange, 
  onClearFilters, 
  activeFilters, 
  resultCount
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [campusOptions, setCampusOptions] = useState([]);

  // Initialize filter options
  useEffect(() => {
    // Get unique campus options
    const campuses = [...new Set(data.projects.map(p => p.campus))].sort();
    setCampusOptions(campuses);
  }, [data]);

  // Update search value when activeFilters change (for external filter clears)
  useEffect(() => {
    setSearchValue(activeFilters.search);
  }, [activeFilters.search]);

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onFilterChange('search', value);
  };

  // Handle filter dropdown changes
  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setSearchValue('');
    onClearFilters();
  };

  // Get placeholder text for search
  const getSearchPlaceholder = () => {
    if (activeFilters.theme) {
      return `🔍 Filtered by ${activeFilters.theme} theme...`;
    }
    if (activeFilters.stage !== 'all') {
      return `🔍 Filtered by ${activeFilters.stage} stage...`;
    }
    if (activeFilters.campus !== 'all') {
      return `🔍 Filtered by ${activeFilters.campus}...`;
    }
    if (activeFilters.qualitativeTheme) {
      return `🔍 Filtered by ${activeFilters.qualitativeTheme.theme}...`;
    }
    return '🔍 Search projects, colleges, or campuses...';
  };

  return (
    <section className="controls-section">
      <div className="controls-header">Search & Filter Portfolio</div>
      <div className="controls">
        {/* Search Input */}
        <input 
          type="text" 
          className="search-input" 
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={getSearchPlaceholder()}
        />

        {/* Campus Filter */}
        <select 
          className="filter-select" 
          value={activeFilters.campus}
          onChange={(e) => handleFilterChange('campus', e.target.value)}
        >
          <option value="all">All Campuses</option>
          {campusOptions.map(campus => (
            <option key={campus} value={campus}>{campus}</option>
          ))}
        </select>

        {/* Stage Filter */}
        <select 
          className="filter-select" 
          value={activeFilters.stage}
          onChange={(e) => handleFilterChange('stage', e.target.value)}
        >
          <option value="all">All Maturity Stages</option>
          <option value="Emerging">Emerging</option>
          <option value="Growing">Growing</option>
          <option value="Mature">Mature</option>
        </select>

        {/* Data Status Filter */}
        <select 
          className="filter-select" 
          value={activeFilters.dataStatus}
          onChange={(e) => handleFilterChange('dataStatus', e.target.value)}
        >
          <option value="all">All Data Status</option>
          <option value="Data Ready">Data Ready</option>
          <option value="Collection Planned">Collection Planned</option>
          <option value="No Data">No Data</option>
        </select>

        {/* Results Count */}
        <div className="results-count">
          <span className="result-number">
            {typeof resultCount === 'number' ? resultCount : data.projects.length}
          </span> projects found
        </div>

        {/* Clear Filters Button */}
        {(activeFilters.search || 
          activeFilters.campus !== 'all' || 
          activeFilters.stage !== 'all' || 
          activeFilters.dataStatus !== 'all' ||
          activeFilters.theme ||
          activeFilters.qualitativeTheme) && (
          <button 
            className="clear-filters-btn"
            onClick={handleClearFilters}
            title="Clear all active filters"
          >
            ✕ Clear Filters
          </button>
        )}
      </div>
    </section>
  );
};

export default Controls;
