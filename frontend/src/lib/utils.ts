import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines classNames with proper Tailwind CSS merging
 * 
 * Merges multiple class values and intelligently handles Tailwind CSS
 * conflicting utilities by using twMerge. This ensures that later
 * classes properly override earlier ones.
 * 
 * @param inputs - Variable number of class values to merge
 * @returns Merged and deduplicated class string
 * 
 * @example
 * ```tsx
 * cn("px-2 py-1", "px-4") // Returns: "py-1 px-4"
 * cn("text-red-500", condition && "text-blue-500") // Conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency with proper localization
 * 
 * @param value - Number to format
 * @param currency - Currency code (default: 'USD')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'USD', decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Truncates an address or string to a readable format
 * 
 * @param str - String to truncate
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Truncated string with ellipsis
 * 
 * @example
 * ```tsx
 * truncateAddress("0x1234567890abcdef") // Returns: "0x1234...cdef"
 * ```
 */
export function truncateAddress(str: string, startChars: number = 6, endChars: number = 4): string {
  if (str.length <= startChars + endChars) return str;
  return `${str.slice(0, startChars)}...${str.slice(-endChars)}`;
}
