/**
 * Formats a date string into "DD Mon Year" format.
 * Example: "2024-02-19" -> "19 Feb 2024"
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '—';

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};
