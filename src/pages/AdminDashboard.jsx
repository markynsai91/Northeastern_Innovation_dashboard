import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import SubmissionDetail from './SubmissionDetail';
import '../styles/Reviewer.css';

function formatDate(dateValue) {
  if (!dateValue) return 'N/A';

  return new Date(dateValue).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatSubmissionType(type) {
  if (type === 'new_project') return 'New Project';
  if (type === 'edit_existing_project') return 'Edit Request';
  return type || 'N/A';
}

function cleanText(value) {
  if (value === null || value === undefined) return '';
  return String(value).toLowerCase().trim();
}

function submissionMatchesSearch(submission, searchTerm) {
  const query = cleanText(searchTerm);

  if (!query) return true;

  const searchableValues = [
    submission.submission_id,
    submission.submission_type,
    submission.project_title,
    submission.project_id,
    submission.existing_project_id,
    submission.submitter_name,
    submission.submitter_email,
    submission.reviewer_name,
    submission.reviewer_email,
    submission.approval_status,
  ];

  return searchableValues.some((value) => cleanText(value).includes(query));
}

function StatusBadge({ status }) {
  const statusClass =
    status === 'pending_review'
      ? 'status-pending'
      : status === 'published'
        ? 'status-published'
        : status === 'rejected'
          ? 'status-rejected'
          : status === 'changes_requested'
            ? 'status-changes'
            : 'status-pending';

  const label = status ? status.replaceAll('_', ' ') : 'N/A';

  return <span className={`status-badge ${statusClass}`}>{label}</span>;
}

function PaginationControls({
  totalItems,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className="pagination-container">
      <div className="pagination-summary">
        Showing {startItem}–{endItem} of {totalItems} submissions
      </div>

      <div className="pagination-controls">
        <label className="pagination-page-size">
          Rows per page:
          <select
            value={rowsPerPage}
            onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>

        <button
          type="button"
          className="button-neutral"
          onClick={() => onPageChange(currentPage - 1)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  async function fetchAllSubmissions() {
    setLoading(true);
    setErrorMessage('');

    const { data, error } = await supabase
      .from('admin_submissions_v')
      .select('*');

    if (error) {
      console.error('Error fetching admin submissions:', error);
      setErrorMessage(error.message);
    } else {
      setSubmissions(data || []);
      setFilteredSubmissions(data || []);
      setCurrentPage(1);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchAllSubmissions();
  }, []);

  useEffect(() => {
    let filtered = submissions;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((submission) =>
        submissionMatchesSearch(submission, searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (submission) => submission.approval_status === statusFilter
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(
        (submission) => submission.submission_type === typeFilter
      );
    }

    setFilteredSubmissions(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, submissions]);

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return filteredSubmissions.slice(startIndex, endIndex);
  }, [filteredSubmissions, currentPage, rowsPerPage]);

  function handleBackToAdmin() {
    setSelectedSubmissionId(null);
    fetchAllSubmissions();
  }

  function getCountByStatus(status) {
    return submissions.filter((submission) => submission.approval_status === status)
      .length;
  }

  function clearFilters() {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  }

  function handleRowsPerPageChange(newRowsPerPage) {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  }

  function handlePageChange(newPage) {
    const nextPage = Math.min(Math.max(newPage, 1), totalPages);
    setCurrentPage(nextPage);
  }

  if (selectedSubmissionId) {
    return (
      <SubmissionDetail
        submissionId={selectedSubmissionId}
        onBack={handleBackToAdmin}
      />
    );
  }

  if (loading) {
    return (
      <div className="reviewer-page">
        <div className="reviewer-container">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="reviewer-page">
      <div className="reviewer-container">
        <header className="reviewer-header">
          <h1 className="reviewer-title">Admin Dashboard</h1>
          <p className="reviewer-subtitle">
            View and track all Innovation Dashboard submissions across review statuses.
          </p>
        </header>

        {errorMessage && <div className="message-error">{errorMessage}</div>}

        <section className="reviewer-card">
          <div className="reviewer-card-header">
            <div>
              <h2 className="reviewer-card-title">Submission Summary</h2>
              <p className="reviewer-muted">
                Overview of all project submissions received through Qualtrics.
              </p>
            </div>

            <button
              type="button"
              className="button-neutral"
              onClick={fetchAllSubmissions}
            >
              Refresh
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
            }}
          >
            <div className="reviewer-card" style={{ marginBottom: 0 }}>
              <div className="reviewer-muted">Total Submissions</div>
              <h2>{submissions.length}</h2>
            </div>

            <div className="reviewer-card" style={{ marginBottom: 0 }}>
              <div className="reviewer-muted">Pending Review</div>
              <h2>{getCountByStatus('pending_review')}</h2>
            </div>

            <div className="reviewer-card" style={{ marginBottom: 0 }}>
              <div className="reviewer-muted">Published</div>
              <h2>{getCountByStatus('published')}</h2>
            </div>

            <div className="reviewer-card" style={{ marginBottom: 0 }}>
              <div className="reviewer-muted">Rejected</div>
              <h2>{getCountByStatus('rejected')}</h2>
            </div>

            <div className="reviewer-card" style={{ marginBottom: 0 }}>
              <div className="reviewer-muted">Changes Requested</div>
              <h2>{getCountByStatus('changes_requested')}</h2>
            </div>
          </div>
        </section>

        <section className="reviewer-card">
          <div className="reviewer-card-header">
            <div>
              <h2 className="reviewer-card-title">All Submissions</h2>
              <p className="reviewer-muted">
                {filteredSubmissions.length} submission
                {filteredSubmissions.length === 1 ? '' : 's'} shown
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="admin-submission-search">
              <strong>Search submissions</strong>
            </label>

            <input
              id="admin-submission-search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by project title, project ID, submission ID, submitter, or reviewer"
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '12px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '15px',
              }}
            />

            <p className="reviewer-muted" style={{ marginTop: '8px' }}>
              Use this to quickly find all submissions/logs related to a specific project.
            </p>
          </div>

          <div className="action-row" style={{ marginBottom: '20px' }}>
            <label>
              <strong>Status: </strong>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                style={{ marginLeft: '8px', padding: '8px' }}
              >
                <option value="all">All</option>
                <option value="pending_review">Pending Review</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
                <option value="changes_requested">Changes Requested</option>
              </select>
            </label>

            <label>
              <strong>Type: </strong>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                style={{ marginLeft: '8px', padding: '8px' }}
              >
                <option value="all">All</option>
                <option value="new_project">New Project</option>
                <option value="edit_existing_project">Edit Request</option>
              </select>
            </label>

            <button
              type="button"
              className="button-neutral"
              onClick={clearFilters}
            >
              Clear Search/Filters
            </button>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="empty-state">
              <strong>No submissions match the search or selected filters.</strong>
            </div>
          ) : (
            <>
              <PaginationControls
                totalItems={filteredSubmissions.length}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />

              <div className="table-scroll-hint">
                <span>Scroll right to view more details →</span>
              </div>

              <div className="reviewer-table-wrapper scrollable-table-wrapper">
                <table className="reviewer-table admin-wide-table">
                  <thead>
                    <tr>
                      <th>Submission ID</th>
                      <th>Type</th>
                      <th>Project Title</th>
                      <th>Project ID</th>
                      <th>Submitter</th>
                      <th>Status</th>
                      <th>Reviewer</th>
                      <th>Submitted</th>
                      <th>Reviewed</th>
                      <th>Published</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedSubmissions.map((submission) => (
                      <tr key={submission.submission_id}>
                        <td>{submission.submission_id}</td>
                        <td>
                          <span className="type-pill">
                            {formatSubmissionType(submission.submission_type)}
                          </span>
                        </td>
                        <td>{submission.project_title || 'N/A'}</td>
                        <td>
                          {submission.project_id ||
                            submission.existing_project_id ||
                            'Not assigned yet'}
                        </td>
                        <td>
                          <div>{submission.submitter_name || 'N/A'}</div>
                          <div className="reviewer-muted">
                            {submission.submitter_email || 'N/A'}
                          </div>
                        </td>
                        <td>
                          <StatusBadge status={submission.approval_status} />
                        </td>
                        <td>
                          <div>{submission.reviewer_name || 'N/A'}</div>
                          <div className="reviewer-muted">
                            {submission.reviewer_email || ''}
                          </div>
                        </td>
                        <td>{formatDate(submission.submitted_at)}</td>
                        <td>{formatDate(submission.reviewed_at)}</td>
                        <td>{formatDate(submission.published_at)}</td>
                        <td>
                          <button
                            type="button"
                            className="button-secondary"
                            onClick={() =>
                              setSelectedSubmissionId(submission.submission_id)
                            }
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                totalItems={filteredSubmissions.length}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;