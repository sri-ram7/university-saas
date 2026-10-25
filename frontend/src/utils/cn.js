import clsx from 'clsx'

/**
 * Merge conditional class names. Thin wrapper around clsx so every
 * component imports class-merging from one place.
 */
export function cn(...inputs) {
  return clsx(...inputs)
}
