function cleanValue(value, fallback = '') {
  if (value === null || value === undefined) return fallback;

  const text = String(value).trim();

  if (text === '') return fallback;

  // Hide old broken Qualtrics piped-text test values
  if (text.includes('${q://')) return fallback;
  if (text.includes('${e://')) return fallback;

  return text;
}

function mapDataStatus(project) {
  const dataStatus = cleanValue(project.data_status);
  const dataCollectionType = cleanValue(project.data_collection_type).toLowerCase();

  if (dataCollectionType.includes('both')) {
    return 'Yes - both quantitative and qualitative';
  }

  if (dataCollectionType.includes('quantitative')) {
    return 'Yes - quantitative data';
  }

  if (dataCollectionType.includes('qualitative')) {
    return 'Yes - qualitative data';
  }

  if (
    dataStatus.toLowerCase().includes('planned') ||
    dataCollectionType.includes('planned')
  ) {
    return 'No, but data collection is planned';
  }

  if (
    dataStatus.toLowerCase().includes('not') ||
    dataCollectionType.includes('not')
  ) {
    return 'No';
  }

  return dataStatus || 'No';
}

function mapDuration(project) {
  const duration = cleanValue(project.duration);

  if (!duration) {
    const maturityStage = cleanValue(project.maturity_stage);

    if (maturityStage === 'Emerging') return '6 months - 1 year';
    if (maturityStage === 'Growing') return '1-2 years';
    if (maturityStage === 'Mature') return 'More than 3 years';
  }

  return duration;
}

export function mapSupabaseProjectToDashboardProject(project) {
  return {
    id: cleanValue(project.project_id),
    project_id: cleanValue(project.project_id),
    is_test: project.is_test === true,

    title: cleanValue(project.project_title, 'Untitled Project'),
    college: cleanValue(project.college_department, 'Not specified'),
    campus: cleanValue(project.campus, 'Not specified'),
    duration: mapDuration(project),
    reach: cleanValue(project.reach, 'Not specified'),
    dataStatus: mapDataStatus(project),

    qualitative: {
      primary_contact_name: cleanValue(project.primary_contact_name),
      primary_contact_email: cleanValue(project.primary_contact_email),
      secondary_contact_name: cleanValue(project.secondary_contact_name),
      secondary_contact_email: cleanValue(project.secondary_contact_email),

      description: cleanValue(project.description),
      problem_opportunity: cleanValue(project.problem_opportunity),
      challenges: cleanValue(project.challenges),
      impact: cleanValue(project.impact),
      lessons_learned: cleanValue(project.lessons_learned),

      recognition: cleanValue(project.awards_recognition),
      innovation_type: cleanValue(project.innovation_type),
      target_audience: cleanValue(project.target_audience),
      partners: cleanValue(project.partners_and_stakeholders),

      evaluation_methods: cleanValue(project.evaluation_methods),
      data_results: cleanValue(project.data_results),
      success_metrics: cleanValue(project.success_metrics),
      additional_info: cleanValue(project.additional_information),
    },

    raw_supabase_project: project,
  };
}

export function mapSupabaseProjectsToDashboardData(projects) {
  return {
    projects: projects.map(mapSupabaseProjectToDashboardProject),
  };
}