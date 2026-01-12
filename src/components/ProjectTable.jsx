import React, { useState } from 'react';

const ProjectTable = ({ data, getProjectStage }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Toggle row expansion
  const toggleRowExpansion = (projectIndex) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(projectIndex)) {
      newExpanded.delete(projectIndex);
    } else {
      newExpanded.add(projectIndex);
    }
    setExpandedRows(newExpanded);
  };

  // Format contact information
  const formatContact = (name, email) => {
    if (!name && !email) return '-';
    if (name && email) return `${name} (${email})`;
    if (email) return email;
    return name;
  };

  // Get data status display class
  const getDataStatusClass = (status) => {
    if (status.includes('both')) return 'status-both';
    if (status.includes('quantitative')) return 'status-quantitative';
    if (status.includes('qualitative')) return 'status-qualitative';
    if (status.includes('planned')) return 'status-planned';
    return 'status-none';
  };

  // Get stage display class
  const getStageClass = (stage) => {
    return `stage-${stage.toLowerCase()}`;
  };

  return (
    <section className="table-section">
      <div className="table-header">
        <h3>Innovation Project Database</h3>
        <div className="table-subtitle">
          Comprehensive portfolio view with detailed project information
        </div>
      </div>

      <div className="table-container">
        <table className="project-table">
          <thead>
            <tr>
              <th className="expand-col"></th>
              <th className="title-col">Project Title</th>
              <th className="college-col">College/Department</th>
              <th className="campus-col">Campus</th>
              <th className="stage-col">Stage</th>
              <th className="reach-col">Reach</th>
              <th className="data-col">Data Status</th>
            </tr>
          </thead>
          <tbody>
            {data.projects.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-results">
                  No projects match current filters
                </td>
              </tr>
            ) : (
              data.projects.map((project, index) => {
                const isExpanded = expandedRows.has(index);
                const stage = getProjectStage(project);
                
                return (
                  <React.Fragment key={index}>
                    {/* Main project row */}
                    <tr 
                      className={`project-row ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleRowExpansion(index)}
                    >
                      <td className="expand-col">
                        <button 
                          className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(index);
                          }}
                          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        >
                          {isExpanded ? '−' : '+'}
                        </button>
                      </td>
                      
                      <td className="title-col">
                        <div className="project-title">{project.title}</div>
                      </td>
                      
                      <td className="college-col">
                        <div className="college-name">{project.college}</div>
                      </td>
                      
                      <td className="campus-col">
                        <div className="campus-name">{project.campus}</div>
                      </td>
                      
                      <td className="stage-col">
                        <span className={`stage-badge ${getStageClass(stage)}`}>
                          {stage === 'Emerging' && '🌱'} 
                          {stage === 'Growing' && '📈'} 
                          {stage === 'Mature' && '🏛️'} 
                          {stage}
                        </span>
                      </td>
                      
                      <td className="reach-col">
                        <div className="reach-value">{project.reach}</div>
                      </td>
                      
                      <td className="data-col">
                        <span className={`data-status ${getDataStatusClass(project.dataStatus)}`}>
                          {project.dataStatus}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded details row */}
                    {isExpanded && (
                      <tr className="details-row">
                        <td colSpan="7">
                          <div className="project-details">
                            
                            {/* Basic Information */}
                            <div className="details-section">
                              <h4 className="details-title">Project Overview</h4>
                              <div className="details-grid">
                                <div className="detail-item">
                                  <span className="detail-label">Duration:</span>
                                  <span className="detail-value">{project.duration}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Current Reach:</span>
                                  <span className="detail-value">{project.reach} people</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Data Collection:</span>
                                  <span className="detail-value">{project.dataStatus}</span>
                                </div>
                              </div>
                              
                              {project.qualitative.description && (
                                <div className="description-section">
                                  <span className="detail-label">Description:</span>
                                  <p className="project-description">{project.qualitative.description}</p>
                                </div>
                              )}
                            </div>

                            {/* Qualitative Insights */}
                            <div className="details-section">
                              <h4 className="details-title">Innovation Insights</h4>
                              
                              {project.qualitative.challenges && (
                                <div className="insight-item">
                                  <span className="insight-label">Key Challenges:</span>
                                  <p className="insight-text">{project.qualitative.challenges}</p>
                                </div>
                              )}
                              
                              {project.qualitative.impact && (
                                <div className="insight-item">
                                  <span className="insight-label">Impact Achieved:</span>
                                  <p className="insight-text">{project.qualitative.impact}</p>
                                </div>
                              )}
                              
                              {project.qualitative.lessons_learned && (
                                <div className="insight-item">
                                  <span className="insight-label">Lessons Learned:</span>
                                  <p className="insight-text">{project.qualitative.lessons_learned}</p>
                                </div>
                              )}
                              
                              {project.qualitative.recognition && project.qualitative.recognition !== 'No' && project.qualitative.recognition !== 'Not yet' && (
                                <div className="insight-item">
                                  <span className="insight-label">Recognition & Awards:</span>
                                  <p className="insight-text">{project.qualitative.recognition}</p>
                                </div>
                              )}
                            </div>

                            {/* Contact Information */}
                            <div className="details-section contacts-section">
                              <h4 className="details-title">Project Contacts</h4>
                              <div className="contacts-grid">
                                <div className="contact-item">
                                  <span className="contact-label">Primary Contact:</span>
                                  <span className="contact-info">
                                    {formatContact(project.qualitative.primary_contact_name, project.qualitative.primary_contact_email)}
                                  </span>
                                </div>
                                
                                {(project.qualitative.secondary_contact_name || project.qualitative.secondary_contact_email) && (
                                  <div className="contact-item">
                                    <span className="contact-label">Secondary Contact:</span>
                                    <span className="contact-info">
                                      {formatContact(project.qualitative.secondary_contact_name, project.qualitative.secondary_contact_email)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="table-footer">
        <div className="table-stats">
          Displaying {data.projects.length} innovation projects
        </div>
        <div className="table-legend">
          <span className="legend-item">
            <span className="stage-badge stage-emerging">🌱 Emerging</span>
            <span className="stage-badge stage-growing">📈 Growing</span>
            <span className="stage-badge stage-mature">🏛️ Mature</span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default ProjectTable;