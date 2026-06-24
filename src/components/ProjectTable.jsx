import React, { useEffect, useMemo, useState } from 'react';

const ProjectTable = ({ data, getProjectStage }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const projects = data?.projects || [];
  const totalProjects = projects.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / rowsPerPage));

  useEffect(() => {
    setCurrentPage(1);
    setExpandedRows(new Set());
  }, [totalProjects]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
      setExpandedRows(new Set());
    }
  }, [currentPage, totalPages]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return projects.slice(startIndex, endIndex);
  }, [projects, currentPage, rowsPerPage]);

  const startItem = totalProjects === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalProjects);

  function handleRowsPerPageChange(event) {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
    setExpandedRows(new Set());
  }

  function handlePageChange(newPage) {
    const nextPage = Math.min(Math.max(newPage, 1), totalPages);
    setCurrentPage(nextPage);
    setExpandedRows(new Set());
  }

  function getProjectKey(project, index) {
    return project.id || project.project_id || `${project.title}-${index}`;
  }

  function toggleRowExpansion(projectKey) {
    const newExpanded = new Set(expandedRows);

    if (newExpanded.has(projectKey)) {
      newExpanded.delete(projectKey);
    } else {
      newExpanded.add(projectKey);
    }

    setExpandedRows(newExpanded);
  }

  function formatContact(name, email) {
    if (!name && !email) return '-';
    if (name && email) return `${name} (${email})`;
    if (email) return email;
    return name;
  }

  function formatArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean).join(', ');
    if (!value) return '-';
    return String(value);
  }

  function getDataStatusClass(status = '') {
    const normalizedStatus = String(status).toLowerCase();

    if (normalizedStatus.includes('both')) return 'status-both';
    if (normalizedStatus.includes('quantitative')) return 'status-quantitative';
    if (normalizedStatus.includes('qualitative')) return 'status-qualitative';
    if (normalizedStatus.includes('planned')) return 'status-planned';

    return 'status-none';
  }

  function getStageClass(stage = '') {
    return `stage-${String(stage).toLowerCase()}`;
  }

  function PaginationControls() {
    return (
      <div className="pagination-container">
        <div className="pagination-summary">
          Showing {startItem}–{endItem} of {totalProjects} projects
        </div>

        <div className="pagination-controls">
          <label className="pagination-page-size">
            Rows per page:
            <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>

          <button
            type="button"
            className="button-neutral"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>

          <span className="pagination-page-count">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            className="button-neutral"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="table-section">
      <div className="table-header">
        <h3>Innovation Project Database</h3>
        <div className="table-subtitle">
          Comprehensive portfolio view with detailed project information
        </div>
      </div>

      {totalProjects > 0 && <PaginationControls />}

      <div className="table-container">
        <table className="project-table">
          <thead>
            <tr>
              <th className="expand-col"></th>
              <th className="project-id-col">Project ID</th>
              <th className="title-col">Project Title</th>
              <th className="college-col">College/Department</th>
              <th className="campus-col">Campus</th>
              <th className="stage-col">Stage</th>
              <th className="reach-col">Reach</th>
              <th className="data-col">Data Status</th>
            </tr>
          </thead>

          <tbody>
            {totalProjects === 0 ? (
              <tr>
                <td colSpan="8" className="no-results">
                  No projects match current filters
                </td>
              </tr>
            ) : (
              paginatedProjects.map((project, index) => {
                const projectKey = getProjectKey(project, index);
                const isExpanded = expandedRows.has(projectKey);
                const stage = getProjectStage(project);

                return (
                  <React.Fragment key={projectKey}>
                    <tr
                      className={`project-row ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleRowExpansion(projectKey)}
                    >
                      <td className="expand-col">
                        <button
                          className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleRowExpansion(projectKey);
                          }}
                          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        >
                          {isExpanded ? '−' : '+'}
                        </button>
                      </td>

                      <td className="project-id-col">
                        <div className="project-id-value">
                          {project.project_id || '-'}
                        </div>
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
                          {' '}
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

                    {isExpanded && (
                      <tr className="details-row">
                        <td colSpan="8">
                          <div className="project-details">
                            <div className="details-section">
                              <h4 className="details-title">Project Overview</h4>

                              <div className="details-grid">
                                <div className="detail-item">
                                  <span className="detail-label">Project ID:</span>
                                  <span className="detail-value">{project.project_id || '-'}</span>
                                </div>

                                <div className="detail-item">
                                  <span className="detail-label">Duration:</span>
                                  <span className="detail-value">{project.duration || '-'}</span>
                                </div>

                                <div className="detail-item">
                                  <span className="detail-label">Current Reach:</span>
                                  <span className="detail-value">{project.reach || '-'} people</span>
                                </div>

                                <div className="detail-item">
                                  <span className="detail-label">Data Collection:</span>
                                  <span className="detail-value">{project.dataStatus || '-'}</span>
                                </div>

                               

                                

                                
                              </div>

                              {project.qualitative?.description && (
                                <div className="description-section">
                                  <span className="detail-label">Description:</span>
                                  <p className="project-description">
                                    {project.qualitative.description}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="details-section">
                              <h4 className="details-title">Innovation Insights</h4>

                              {project.qualitative?.challenges && (
                                <div className="insight-item">
                                  <span className="insight-label">Key Challenges:</span>
                                  <p className="insight-text">{project.qualitative.challenges}</p>
                                </div>
                              )}

                              {project.qualitative?.impact && (
                                <div className="insight-item">
                                  <span className="insight-label">Impact Achieved:</span>
                                  <p className="insight-text">{project.qualitative.impact}</p>
                                </div>
                              )}

                              {project.qualitative?.lessons_learned && (
                                <div className="insight-item">
                                  <span className="insight-label">Lessons Learned:</span>
                                  <p className="insight-text">
                                    {project.qualitative.lessons_learned}
                                  </p>
                                </div>
                              )}

                              {project.qualitative?.recognition &&
                                project.qualitative.recognition !== 'No' &&
                                project.qualitative.recognition !== 'Not yet' && (
                                  <div className="insight-item">
                                    <span className="insight-label">
                                      Recognition & Awards:
                                    </span>
                                    <p className="insight-text">
                                      {project.qualitative.recognition}
                                    </p>
                                  </div>
                                )}
                            </div>

                            {project.qualitative?.partners && (
                              <div className="details-section">
                                <div className="insight-item">
                                  <span className="insight-label">
                                    Partners and Stakeholders:
                                  </span>
                                  <p className="insight-text">
                                    {project.qualitative.partners}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="details-section contacts-section">
                              <h4 className="details-title">Project Contacts</h4>

                              <div className="contacts-grid">
                                <div className="contact-item">
                                  <span className="contact-label">Primary Contact:</span>
                                  <span className="contact-info">
                                    {formatContact(
                                      project.qualitative?.primary_contact_name,
                                      project.qualitative?.primary_contact_email
                                    )}
                                  </span>
                                </div>

                                {(project.qualitative?.secondary_contact_name ||
                                  project.qualitative?.secondary_contact_email) && (
                                  <div className="contact-item">
                                    <span className="contact-label">
                                      Secondary Contact:
                                    </span>
                                    <span className="contact-info">
                                      {formatContact(
                                        project.qualitative?.secondary_contact_name,
                                        project.qualitative?.secondary_contact_email
                                      )}
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

      {totalProjects > 0 && <PaginationControls />}

      <div className="table-footer">
        <div className="table-stats">
          Displaying {startItem}–{endItem} of {totalProjects} innovation projects
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