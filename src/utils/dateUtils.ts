/**
 * Utility functions for date and time operations
 */

/**
 * Calculates and formats the duration between two dates
 * @param start - Start date/time string
 * @param end - End date/time string
 * @param abbreviated - Whether to return abbreviated format (e.g., "2h" vs "2 hours")
 * @returns Formatted duration string
 */
export function getDuration(
  start: string,
  end: string,
  abbreviated = false
): string {
  const duration = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60)
  );

  if (duration >= 1440) {
    // 24 hours
    const days = Math.floor(duration / 1440);
    return abbreviated ? `${days}d` : `${days} day${days > 1 ? "s" : ""}`;
  }
  if (duration >= 60) {
    const hours = Math.floor(duration / 60);
    return abbreviated ? `${hours}h` : `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return abbreviated ? `${duration}m` : `${duration} minutes`;
}
