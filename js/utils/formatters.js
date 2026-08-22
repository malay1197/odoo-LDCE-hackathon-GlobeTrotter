// Indian Currency & Date Formatting Utilities for GlobeTrotter

export function formatINR(amount) {
  const num = Number(amount || 0);
  // Indian numbering system formatting (e.g. 1,25,000)
  return '₹' + num.toLocaleString('en-IN');
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
}

export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startStr = start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} - ${endStr}`;
}

export function getDaysDifference(startDate, endDate) {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
}
