import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
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

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  return value;
}

function formatSubmissionType(type) {
  if (type === 'new_project') return 'New Project';
  if (type === 'edit_existing_project') return 'Edit Request';
  return type || 'N/A';
}

function hasProposedValue(value) {
  return value !== null && value !== undefined && value !== '';
}

function getDecisionLabel(decisionType) {
  if (decisionType === 'Approved') return 'Approved';
  if (decisionType === 'Rejected') return 'Rejected';
  if (decisionType === 'Changes Requested') return 'Changes Requested';
  return decisionType || 'Decision';
}

function buildEmailSubject(decisionType, projectTitle) {
  const title = projectTitle || 'Innovation Dashboard Submission';

  if (decisionType === 'Approved') {
    return `Innovation Dashboard Submission Approved: ${title}`;
  }

  if (decisionType === 'Rejected') {
    return `Innovation Dashboard Submission Rejected: ${title}`;
  }

  if (decisionType === 'Changes Requested') {
    return `Changes Requested for Innovation Dashboard Submission: ${title}`;
  }

  return `Innovation Dashboard Submission Update: ${title}`;
}

function buildSubmittedProjectDetails(submission) {
  return `

Submitted Project Details:
Project Title: ${formatValue(submission.project_title)}
College / Department: ${formatValue(submission.college_department)}
Campus: ${formatValue(submission.campus)}
Duration: ${formatValue(submission.duration)}
Reach: ${formatValue(submission.reach)}
Data Status: ${formatValue(submission.data_status)}
Data Collection Type: ${formatValue(submission.data_collection_type)}
Maturity Stage: ${formatValue(submission.maturity_stage)}

Submitter Information:
Submitter Name: ${formatValue(submission.submitter_name)}
Submitter Email: ${formatValue(submission.submitter_email)}
Reason for Submission: ${formatValue(submission.reason_for_submission)}

Contacts:
Primary Contact Name: ${formatValue(submission.primary_contact_name)}
Primary Contact Email: ${formatValue(submission.primary_contact_email)}
Secondary Contact Name: ${formatValue(submission.secondary_contact_name)}
Secondary Contact Email: ${formatValue(submission.secondary_contact_email)}

Narrative Details:
Description: ${formatValue(submission.description)}
Problem / Opportunity: ${formatValue(submission.problem_opportunity)}
Challenges: ${formatValue(submission.challenges)}
Impact: ${formatValue(submission.impact)}
Lessons Learned: ${formatValue(submission.lessons_learned)}
Awards / Recognition: ${formatValue(submission.awards_recognition)}
Partners and Stakeholders: ${formatValue(submission.partners_and_stakeholders)}
Target Audience: ${formatValue(submission.target_audience)}
`;
}

function buildEmailBody({
  decisionType,
  submitterName,
  projectTitle,
  projectId,
  reviewerComment,
  submission,
}) {
  const name = submitterName || 'Submitter';
  const title = projectTitle || 'your project submission';
  const projectIdText = projectId || 'Not assigned';
  const submittedProjectDetails = submission
    ? buildSubmittedProjectDetails(submission)
    : '';

  if (decisionType === 'Approved') {
    return `Hi ${name},

Your Innovation Dashboard submission has been approved.

Project Title: ${title}
Project ID: ${projectIdText}

Your project will be included in the Innovation Dashboard.

Best,
Innovation Dashboard Team`;
  }

  if (decisionType === 'Rejected') {
    return `Hi ${name},

Thank you for submitting your project to the Innovation Dashboard.

After review, the submission has not been approved at this time.

Project Title: ${title}
Project ID: ${projectIdText}

Reviewer Comment:
${reviewerComment || 'No additional comment provided.'}

For your reference, below are the project details that were submitted and reviewed:
${submittedProjectDetails}

Best,
Innovation Dashboard Team`;
  }

  if (decisionType === 'Changes Requested') {
    return `Hi ${name},

Thank you for submitting your project to the Innovation Dashboard.

The reviewer has requested changes or additional information before the submission can move forward.

Project Title: ${title}
Project ID: ${projectIdText}

Requested Changes:
${reviewerComment || 'No additional comment provided.'}

For your reference, below are the project details that were submitted and reviewed:
${submittedProjectDetails}

Please review the requested changes and update your submission.

Best,
Innovation Dashboard Team`;
  }

  return `Hi ${name},

There has been an update to your Innovation Dashboard submission.

Project Title: ${title}
Project ID: ${projectIdText}

Best,
Innovation Dashboard Team`;
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

function DetailRow({ label, value }) {
  return (
    <>
      <div className="detail-label">{label}</div>
      <div className="detail-value">{formatValue(value)}</div>
    </>
  );
}

function EmailQueueDetails({ emailQueueDetails, onCopy, copyMessage }) {
  if (!emailQueueDetails) return null;

  return (
    <section className="reviewer-card">
      <div className="reviewer-card-header">
        <div>
          <h2 className="reviewer-card-title">SharePoint Email Queue Details</h2>
          <p className="reviewer-muted">
            Copy these details into the SharePoint Email Queue while Power Automate Premium access is pending.
          </p>
        </div>

        <button type="button" className="button-primary" onClick={onCopy}>
          Copy Details
        </button>
      </div>

      {copyMessage && <div className="message-success">{copyMessage}</div>}

      <div className="detail-grid" style={{ marginTop: '16px' }}>
        <DetailRow label="Title" value={emailQueueDetails.title} />
        <DetailRow label="Submission ID" value={emailQueueDetails.submission_id} />
        <DetailRow label="Project ID" value={emailQueueDetails.project_id} />
        <DetailRow label="Project Title" value={emailQueueDetails.project_title} />
        <DetailRow label="Submitter Name" value={emailQueueDetails.submitter_name} />
        <DetailRow label="Submitter Email" value={emailQueueDetails.submitter_email} />
        <DetailRow label="Decision Type" value={emailQueueDetails.decision_type} />
        <DetailRow label="Reviewer Comment" value={emailQueueDetails.reviewer_comment} />
        <DetailRow label="Email Subject" value={emailQueueDetails.email_subject} />
        <DetailRow label="Email Status" value={emailQueueDetails.email_status} />
      </div>

      <div style={{ marginTop: '18px' }}>
        <div className="detail-label" style={{ marginBottom: '8px' }}>
          Email Body
        </div>

        <pre className="json-box" style={{ whiteSpace: 'pre-wrap' }}>
          {emailQueueDetails.email_body}
        </pre>
      </div>
    </section>
  );
}

function ReviewerActions({
  isPending,
  actionLoading,
  handleApprove,
  handleReject,
  handleRequestChanges,
}) {
  return (
    <section className="reviewer-card">
      <h2 className="reviewer-card-title">Reviewer Actions</h2>
      <p className="reviewer-muted">
        Review the submission details below, then choose one action. Actions are only available while the submission is pending review.
      </p>

      <div className="action-row">
        <button
          type="button"
          className="button-primary"
          onClick={handleApprove}
          disabled={actionLoading || !isPending}
        >
          {actionLoading ? 'Processing...' : 'Approve'}
        </button>

        <button
          type="button"
          className="button-danger"
          onClick={handleReject}
          disabled={actionLoading || !isPending}
        >
          {actionLoading ? 'Processing...' : 'Reject'}
        </button>

        <button
          type="button"
          className="button-warning"
          onClick={handleRequestChanges}
          disabled={actionLoading || !isPending}
        >
          {actionLoading ? 'Processing...' : 'Request Changes'}
        </button>
      </div>
    </section>
  );
}

function SubmissionDetail({ submissionId, onBack }) {
  const [submission, setSubmission] = useState(null);
  const [editComparison, setEditComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailQueueDetails, setEmailQueueDetails] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    async function fetchSubmissionDetail() {
      setLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('reviewer_submission_detail_v')
        .select('*')
        .eq('submission_id', submissionId)
        .single();

      if (error) {
        console.error('Error fetching submission detail:', error);
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setSubmission(data);

      if (data?.submission_type === 'edit_existing_project') {
        const { data: comparisonData, error: comparisonError } = await supabase
          .from('reviewer_edit_comparison_v')
          .select('*')
          .eq('submission_id', submissionId)
          .single();

        if (comparisonError) {
          console.error('Error fetching edit comparison:', comparisonError);
          setErrorMessage(comparisonError.message);
        } else {
          setEditComparison(comparisonData);
        }
      }

      setLoading(false);
    }

    if (submissionId) {
      fetchSubmissionDetail();
    }
  }, [submissionId]);

  function createEmailQueueDetails({
    databaseResult,
    decisionType,
    reviewerComment = '',
  }) {
    const finalProjectId =
      databaseResult?.project_id ||
      submission.project_id ||
      submission.existing_project_id ||
      'Not assigned';

    const finalProjectTitle =
      databaseResult?.project_title ||
      submission.project_title ||
      'Untitled Submission';

    const finalSubmitterName =
      databaseResult?.submitter_name ||
      submission.submitter_name ||
      'Submitter';

    const finalSubmitterEmail =
      databaseResult?.submitter_email ||
      submission.submitter_email ||
      '';

    const finalReviewerComment =
      databaseResult?.reviewer_comment ||
      reviewerComment ||
      '';

    const emailSubject = buildEmailSubject(decisionType, finalProjectTitle);

    const emailBody = buildEmailBody({
      decisionType,
      submitterName: finalSubmitterName,
      projectTitle: finalProjectTitle,
      projectId: finalProjectId,
      reviewerComment: finalReviewerComment,
      submission,
    });

    return {
      title: `${getDecisionLabel(decisionType)} - ${finalProjectTitle}`,
      submission_id: submission.submission_id,
      project_id: finalProjectId,
      project_title: finalProjectTitle,
      submitter_name: finalSubmitterName,
      submitter_email: finalSubmitterEmail,
      decision_type: decisionType,
      reviewer_comment: finalReviewerComment || 'N/A',
      email_subject: emailSubject,
      email_body: emailBody,
      email_status: 'Pending',
    };
  }

  function formatEmailQueueDetailsForCopy(details) {
    return `Title: ${details.title}
Submission ID: ${details.submission_id}
Project ID: ${details.project_id}
Project Title: ${details.project_title}
Submitter Name: ${details.submitter_name}
Submitter Email: ${details.submitter_email}
Decision Type: ${details.decision_type}
Reviewer Comment: ${details.reviewer_comment}
Email Subject: ${details.email_subject}
Email Status: ${details.email_status}

Email Body:
${details.email_body}`;
  }

  async function handleCopyEmailQueueDetails() {
    if (!emailQueueDetails) return;

    const copyText = formatEmailQueueDetailsForCopy(emailQueueDetails);

    try {
      await navigator.clipboard.writeText(copyText);
      setCopyMessage('Email queue details copied successfully.');
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      setCopyMessage('Unable to copy automatically. Please copy the details manually.');
    }
  }

  async function handleApprove() {
    if (!submission) return;

    setActionLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setEmailQueueDetails(null);
    setCopyMessage('');

    const reviewerName = 'Test Reviewer';
    const reviewerEmail = 'reviewer@northeastern.edu';

    let functionName = '';

    if (submission.submission_type === 'new_project') {
      functionName = 'publish_new_project';
    } else if (submission.submission_type === 'edit_existing_project') {
      functionName = 'publish_project_edit';
    } else {
      setErrorMessage(`Unsupported submission type: ${submission.submission_type}`);
      setActionLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc(functionName, {
      input_submission_id: submission.submission_id,
      input_reviewer_name: reviewerName,
      input_reviewer_email: reviewerEmail,
    });

    if (error) {
      console.error('Approval error:', error);
      setErrorMessage(error.message);
    } else {
      const queueDetails = createEmailQueueDetails({
        databaseResult: data,
        decisionType: 'Approved',
      });

      setEmailQueueDetails(queueDetails);

      setSuccessMessage(
        `${data?.message || 'Submission approved successfully.'} Email queue details are ready to copy into SharePoint.`
      );

      setSubmission((prev) => ({
        ...prev,
        approval_status: data?.approval_status || 'published',
        project_id: data?.project_id || prev.project_id,
        reviewer_name: data?.reviewer_name || reviewerName,
        reviewer_email: data?.reviewer_email || reviewerEmail,
        published_at: new Date().toISOString(),
      }));
    }

    setActionLoading(false);
  }

  async function handleReject() {
    if (!submission) return;

    const reviewerComment = window.prompt(
      'Enter the reason for rejecting this submission:'
    );

    if (!reviewerComment || reviewerComment.trim() === '') {
      setErrorMessage('A rejection reason is required.');
      return;
    }

    const confirmReject = window.confirm(
      'Are you sure you want to reject this submission?'
    );

    if (!confirmReject) return;

    setActionLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setEmailQueueDetails(null);
    setCopyMessage('');

    const reviewerName = 'Test Reviewer';
    const reviewerEmail = 'reviewer@northeastern.edu';

    const { data, error } = await supabase.rpc('reject_project_submission', {
      input_submission_id: submission.submission_id,
      input_reviewer_name: reviewerName,
      input_reviewer_email: reviewerEmail,
      input_comment: reviewerComment.trim(),
    });

    if (error) {
      console.error('Reject error:', error);
      setErrorMessage(error.message);
    } else if (data?.success === false) {
      setErrorMessage(data?.message || 'Submission could not be rejected.');
    } else {
      const queueDetails = createEmailQueueDetails({
        databaseResult: data,
        decisionType: 'Rejected',
        reviewerComment: reviewerComment.trim(),
      });

      setEmailQueueDetails(queueDetails);

      setSuccessMessage(
        `${data?.message || 'Submission rejected successfully.'} Email queue details are ready to copy into SharePoint.`
      );

      setSubmission((prev) => ({
        ...prev,
        approval_status: data?.approval_status || 'rejected',
        reviewer_name: data?.reviewer_name || reviewerName,
        reviewer_email: data?.reviewer_email || reviewerEmail,
        reviewer_comments: data?.reviewer_comment || reviewerComment.trim(),
        reviewed_at: new Date().toISOString(),
      }));
    }

    setActionLoading(false);
  }

  async function handleRequestChanges() {
    if (!submission) return;

    const reviewerComment = window.prompt(
      'Enter the changes or additional information needed from the submitter:'
    );

    if (!reviewerComment || reviewerComment.trim() === '') {
      setErrorMessage('A comment is required when requesting changes.');
      return;
    }

    const confirmRequestChanges = window.confirm(
      'Are you sure you want to request changes for this submission?'
    );

    if (!confirmRequestChanges) return;

    setActionLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setEmailQueueDetails(null);
    setCopyMessage('');

    const reviewerName = 'Test Reviewer';
    const reviewerEmail = 'reviewer@northeastern.edu';

    const { data, error } = await supabase.rpc(
      'request_project_submission_changes',
      {
        input_submission_id: submission.submission_id,
        input_reviewer_name: reviewerName,
        input_reviewer_email: reviewerEmail,
        input_comment: reviewerComment.trim(),
      }
    );

    if (error) {
      console.error('Request changes error:', error);
      setErrorMessage(error.message);
    } else if (data?.success === false) {
      setErrorMessage(data?.message || 'Changes could not be requested.');
    } else {
      const queueDetails = createEmailQueueDetails({
        databaseResult: data,
        decisionType: 'Changes Requested',
        reviewerComment: reviewerComment.trim(),
      });

      setEmailQueueDetails(queueDetails);

      setSuccessMessage(
        `${data?.message || 'Changes requested successfully.'} Email queue details are ready to copy into SharePoint.`
      );

      setSubmission((prev) => ({
        ...prev,
        approval_status: data?.approval_status || 'changes_requested',
        project_id: data?.project_id || prev.project_id,
        reviewer_name: data?.reviewer_name || reviewerName,
        reviewer_email: data?.reviewer_email || reviewerEmail,
        reviewer_comments: data?.reviewer_comment || reviewerComment.trim(),
        reviewed_at: new Date().toISOString(),
      }));
    }

    setActionLoading(false);
  }

  const editFields = editComparison
    ? [
        {
          label: 'Project Title',
          current: editComparison.current_project_title,
          proposed: editComparison.proposed_project_title,
        },
        {
          label: 'College / Department',
          current: editComparison.current_college_department,
          proposed: editComparison.proposed_college_department,
        },
        {
          label: 'Campus',
          current: editComparison.current_campus,
          proposed: editComparison.proposed_campus,
        },
        {
          label: 'Duration',
          current: editComparison.current_duration,
          proposed: editComparison.proposed_duration,
        },
        {
          label: 'Reach',
          current: editComparison.current_reach,
          proposed: editComparison.proposed_reach,
        },
        {
          label: 'Data Status',
          current: editComparison.current_data_status,
          proposed: editComparison.proposed_data_status,
        },
        {
          label: 'Data Collection Type',
          current: editComparison.current_data_collection_type,
          proposed: editComparison.proposed_data_collection_type,
        },
        {
          label: 'Primary Contact Name',
          current: editComparison.current_primary_contact_name,
          proposed: editComparison.proposed_primary_contact_name,
        },
        {
          label: 'Primary Contact Email',
          current: editComparison.current_primary_contact_email,
          proposed: editComparison.proposed_primary_contact_email,
        },
        {
          label: 'Secondary Contact Name',
          current: editComparison.current_secondary_contact_name,
          proposed: editComparison.proposed_secondary_contact_name,
        },
        {
          label: 'Secondary Contact Email',
          current: editComparison.current_secondary_contact_email,
          proposed: editComparison.proposed_secondary_contact_email,
        },
        {
          label: 'Description',
          current: editComparison.current_description,
          proposed: editComparison.proposed_description,
        },
        {
          label: 'Problem / Opportunity',
          current: editComparison.current_problem_opportunity,
          proposed: editComparison.proposed_problem_opportunity,
        },
        {
          label: 'Challenges',
          current: editComparison.current_challenges,
          proposed: editComparison.proposed_challenges,
        },
        {
          label: 'Impact',
          current: editComparison.current_impact,
          proposed: editComparison.proposed_impact,
        },
        {
          label: 'Lessons Learned',
          current: editComparison.current_lessons_learned,
          proposed: editComparison.proposed_lessons_learned,
        },
        {
          label: 'Awards / Recognition',
          current: editComparison.current_awards_recognition,
          proposed: editComparison.proposed_awards_recognition,
        },
        {
          label: 'Partners and Stakeholders',
          current: editComparison.current_partners_and_stakeholders,
          proposed: editComparison.proposed_partners_and_stakeholders,
        },
        {
          label: 'Target Audience',
          current: editComparison.current_target_audience,
          proposed: editComparison.proposed_target_audience,
        },
      ].filter((field) => hasProposedValue(field.proposed))
    : [];

  if (loading) {
    return (
      <div className="reviewer-page">
        <div className="reviewer-container">Loading submission details...</div>
      </div>
    );
  }

  if (errorMessage && !submission) {
    return (
      <div className="reviewer-page">
        <div className="reviewer-container">
          <div className="message-error">
            Error loading submission detail: {errorMessage}
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="reviewer-page">
        <div className="reviewer-container">
          <button type="button" className="back-button" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <div className="empty-state">No submission found.</div>
        </div>
      </div>
    );
  }

  const isPending = submission.approval_status === 'pending_review';

  return (
    <div className="reviewer-page">
      <div className="reviewer-container">
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <header className="reviewer-header">
          <h1 className="reviewer-title">Submission Detail</h1>
          <p className="reviewer-subtitle">
            Review the submitted project information before taking action.
          </p>
        </header>

        {successMessage && <div className="message-success">{successMessage}</div>}
        {errorMessage && <div className="message-error">{errorMessage}</div>}

        <EmailQueueDetails
          emailQueueDetails={emailQueueDetails}
          onCopy={handleCopyEmailQueueDetails}
          copyMessage={copyMessage}
        />

        <ReviewerActions
          isPending={isPending}
          actionLoading={actionLoading}
          handleApprove={handleApprove}
          handleReject={handleReject}
          handleRequestChanges={handleRequestChanges}
        />

        <section className="reviewer-card">
          <div className="reviewer-card-header">
            <div>
              <h2 className="reviewer-card-title">
                {submission.project_title || 'Untitled Submission'}
              </h2>
              <p className="reviewer-muted">
                {formatSubmissionType(submission.submission_type)} •{' '}
                {submission.submission_id}
              </p>
            </div>
            <StatusBadge status={submission.approval_status} />
          </div>

          <div className="detail-grid">
            <DetailRow label="Submission ID" value={submission.submission_id} />
            <DetailRow
              label="Submission Type"
              value={formatSubmissionType(submission.submission_type)}
            />
            <DetailRow
              label="Project ID"
              value={
                submission.project_id ||
                submission.existing_project_id ||
                'Not assigned yet'
              }
            />
            <DetailRow label="Validation Status" value={submission.validation_status} />
            <DetailRow label="Approval Status" value={submission.approval_status} />
            <DetailRow label="Submitted At" value={formatDate(submission.submitted_at)} />
            <DetailRow label="Reviewed At" value={formatDate(submission.reviewed_at)} />
            <DetailRow label="Published At" value={formatDate(submission.published_at)} />
            <DetailRow label="Reviewer Comments" value={submission.reviewer_comments} />
          </div>
        </section>

        {submission.submission_type === 'edit_existing_project' && (
          <section className="reviewer-card">
            <div className="reviewer-card-header">
              <div>
                <h2 className="reviewer-card-title">Edit Request Comparison</h2>
                <p className="reviewer-muted">
                  Only fields with proposed changes are shown.
                </p>
              </div>
            </div>

            {editFields.length === 0 ? (
              <div className="empty-state">
                No proposed field updates found for this edit request.
              </div>
            ) : (
              <div className="reviewer-table-wrapper">
                <table className="reviewer-table comparison-table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Current Value</th>
                      <th>Proposed Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editFields.map((field) => (
                      <tr key={field.label}>
                        <td>{field.label}</td>
                        <td>{formatValue(field.current)}</td>
                        <td>{formatValue(field.proposed)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        <section className="reviewer-card">
          <h2 className="reviewer-card-title">Submitter Information</h2>
          <div className="detail-grid" style={{ marginTop: '16px' }}>
            <DetailRow label="Submitter Name" value={submission.submitter_name} />
            <DetailRow label="Submitter Email" value={submission.submitter_email} />
            <DetailRow label="Reason for Submission" value={submission.reason_for_submission} />
          </div>
        </section>

        <section className="reviewer-card">
          <h2 className="reviewer-card-title">Project Information</h2>
          <div className="detail-grid" style={{ marginTop: '16px' }}>
            <DetailRow label="Project Title" value={submission.project_title} />
            <DetailRow label="College / Department" value={submission.college_department} />
            <DetailRow label="Campus" value={submission.campus} />
            <DetailRow label="Duration" value={submission.duration} />
            <DetailRow label="Reach" value={submission.reach} />
            <DetailRow label="Data Status" value={submission.data_status} />
            <DetailRow label="Data Collection Type" value={submission.data_collection_type} />
            <DetailRow label="Maturity Stage" value={submission.maturity_stage} />
          </div>
        </section>

        <section className="reviewer-card">
          <h2 className="reviewer-card-title">Contacts</h2>
          <div className="detail-grid" style={{ marginTop: '16px' }}>
            <DetailRow label="Primary Contact Name" value={submission.primary_contact_name} />
            <DetailRow label="Primary Contact Email" value={submission.primary_contact_email} />
            <DetailRow label="Secondary Contact Name" value={submission.secondary_contact_name} />
            <DetailRow label="Secondary Contact Email" value={submission.secondary_contact_email} />
          </div>
        </section>

        <section className="reviewer-card">
          <h2 className="reviewer-card-title">Narrative Details</h2>
          <div className="detail-grid" style={{ marginTop: '16px' }}>
            <DetailRow label="Description" value={submission.description} />
            <DetailRow label="Problem / Opportunity" value={submission.problem_opportunity} />
            <DetailRow label="Challenges" value={submission.challenges} />
            <DetailRow label="Impact" value={submission.impact} />
            <DetailRow label="Lessons Learned" value={submission.lessons_learned} />
            <DetailRow label="Awards / Recognition" value={submission.awards_recognition} />
            <DetailRow
              label="Partners and Stakeholders"
              value={submission.partners_and_stakeholders}
            />
            <DetailRow label="Target Audience" value={submission.target_audience} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default SubmissionDetail;