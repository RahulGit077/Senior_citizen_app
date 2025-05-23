
// Import clsx and twMerge
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes with proper precedence
 * @param  {...any} inputs - Class values to be combined
 * @returns {string} - Combined class string
 */
export function cn(...inputs) {
  // This simple but powerful utility combines classes
  // It's often used throughout the codebase for dynamic classes
  return twMerge(clsx(inputs));
}

// Some developers might add extra utilities they plan to use later
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// A utility that's not fully implemented yet (human code often has these)
export function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
