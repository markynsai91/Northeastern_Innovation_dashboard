const COLLEGE_GROUPS = [
  {
    label: 'College of Arts Media and Design',
    matches: (value) =>
      value.includes('college of arts media and design') ||
      value.includes('college of arts, media and design') ||
      value.includes('college of arts, media & design') ||
      value.includes('(camd)')
  },
  {
    label: 'College of Engineering (COE)',
    matches: (value) =>
      value.includes('college of engineering (coe)') ||
      value.includes(' coe')
  },
  {
    label: 'College of Professional Studies (CPS)',
    matches: (value) =>
      value.includes('college of professional studies (cps)') ||
      value.includes(' cps')
  },
  {
    label: 'College of Science',
    matches: (value) =>
      value.includes('college of science') ||
      /\bcos\b/.test(value)
  },
  {
    label: 'College of Social Sciences and Humanities (CSSH)',
    matches: (value) =>
      value.includes('college of social sciences and humanities (cssh)') ||
      value.includes(' cssh')
  },
  {
    label: 'DMSB',
    matches: (value) => value.includes('dmsb')
  },
  {
    label: 'Bouvé College of Health Sciences',
    matches: (value) =>
      value.includes('bouvé college of health sciences') ||
      value.includes('bouve college of health sciences') ||
      value.includes('bouvé') ||
      value.includes('bouve')
  },
  {
    label: 'Mills College',
    matches: (value) => value.includes('mills college')
  },
  {
    label: 'Mills Institute',
    matches: (value) =>
      value.includes('mills institute') ||
      value.includes('the mills institute')
  },
  {
    label: 'Roux Institute',
    matches: (value) =>
      value.includes('roux institute') ||
      value.includes('the roux institute') ||
      value.includes('roux')
  }
];

export const normalizeCollege = (college = '') => {
  const normalizedValue = college.trim().toLowerCase();

  for (const group of COLLEGE_GROUPS) {
    if (group.matches(normalizedValue)) {
      return group.label;
    }
  }

  return college.trim();
};
