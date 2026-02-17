const CAMPUS_ALIASES = {
  'silicon valley': 'Silicon Valley, California',
  'silicon valley, california': 'Silicon Valley, California'
};

export const normalizeCampus = (campus = '') => {
  const trimmedCampus = campus.trim();
  if (!trimmedCampus) return '';

  const normalizedKey = trimmedCampus.toLowerCase();
  return CAMPUS_ALIASES[normalizedKey] || trimmedCampus;
};
