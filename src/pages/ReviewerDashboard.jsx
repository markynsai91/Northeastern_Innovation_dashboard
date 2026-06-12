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

function ReviewerDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  async function fetchPendingSubmissions() {
    setLoading(true);
    setErrorMessage('');

    const { data, error } = await supabase
      .from('reviewer_pending_submissions_v')
      .select('*');

    if (error) {
      console.error('Error fetching pending submissions:', error);
      setErrorMessage(error.message);
    } else {
      setSubmissions(data || []);
      setCurrentPage(1);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const totalPages = Math.max(1, Math.ceil(submissions.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return submissions.slice(startIndex, endIndex);
  }, [submissions, currentPage, rowsPerPage]);

  function handleRowsPerPageChange(newRowsPerPage) {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  }

  function handlePageChange(newPage) {
    const nextPage = Math.min(Math.max(newPage, 1), totalPages);
    setCurrentPage(nextPage);
  }

  function handleBackToDashboard() {
    setSelectedSubmissionId(null);
    fetchPendingSubmissions();
  }

  if (selectedSubmissionId) {
    return (
      <SubmissionDetail
        submissionId={selectedSubmissionId}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (loading) {
    return (
      <div className="reviewer-page">
        <div className="reviewer-container">Loading pending submissions...</div>
      </div>
    );
  }

  return (
    <div className="reviewer-page">
      <div className="reviewer-container">
        <header className="reviewer-header">
          <h1 className="reviewer-title">Reviewer Dashboard</h1>
          <p className="reviewer-subtitle">
            Review pending Innovation Dashboard submissions before they are published.
          </p>
        </header>

        {errorMessage && <div className="message-error">{errorMessage}</div>}

        <section className="reviewer-card">
          <div className="reviewer-card-header">
            <div>
              <h2 className="reviewer-card-title">Pending Review</h2>
              <p className="reviewer-muted">
                {submissions.length} submission{submissions.length === 1 ? '' : 's'} waiting for review
              </p>
            </div>

            <button
              type="button"
              className="button-neutral"
              onClick={fetchPendingSubmissions}
            >
              Refresh
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="empty-state">
              <strong>No pending submissions at this time.</strong>
              <p>New submissions will appear here after they pass validation.</p>
            </div>
          ) : (
            <>
              <PaginationControls
                totalItems={submissions.length}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />

              <div className="reviewer-table-wrapper">
                <table className="reviewer-table">
                  <thead>
                    <tr>
                      <th>Submission ID</th>
                      <th>Type</th>
                      <th>Project Title</th>
                      <th>Project ID</th>
                      <th>Submitter</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Submitted</th>
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
                        <td>{submission.submitter_name || 'N/A'}</td>
                        <td>{submission.submitter_email || 'N/A'}</td>
                        <td>
                          <StatusBadge status={submission.approval_status} />
                        </td>
                        <td>{formatDate(submission.submitted_at)}</td>
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
                totalItems={submissions.length}
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

export default ReviewerDashboard;