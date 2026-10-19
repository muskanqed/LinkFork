/**
 * Shared utility functions for formatting and validation
 */

/**
 * Format a date string into a localized short format (e.g., "Oct 19, 2026")
 */
export function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format a date string into a relative human-readable time (e.g., "5 min ago", "2 hours ago")
 */
export function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate destination URL (must be non-empty and start with http:// or https://)
 */
export function validateUrl(
  url: string,
  requiredMessage = "Destination URL is required."
): UrlValidationResult {
  const trimmed = url.trim();
  if (!trimmed) {
    return { isValid: false, error: requiredMessage };
  }

  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return {
        isValid: false,
        error: "URL must start with http:// or https://",
      };
    }
  } catch {
    return {
      isValid: false,
      error: "Please enter a valid URL including https://",
    };
  }

  return { isValid: true };
}
