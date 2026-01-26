import { format, setHours, setMinutes } from 'date-fns';

// Calendar constants
export const TIME_SLOT_HEIGHT_PX = 60; // Height in pixels for each 30-minute slot
export const HOUR_RANGE_START = 6; // 6 AM
export const HOUR_RANGE_END = 22; // 10 PM
export const TOTAL_SLOTS = (HOUR_RANGE_END - HOUR_RANGE_START) * 2; // 32 half-hour slots

/**
 * Convert a time to its slot index (0-based)
 * @param time The time to convert
 * @returns The slot index (0 = 6:00 AM, 1 = 6:30 AM, etc.)
 */
export function timeToSlotIndex(time: Date): number {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const totalMinutes = (hours * 60 + minutes) - (HOUR_RANGE_START * 60);
  return Math.floor(totalMinutes / 30);
}

/**
 * Convert a slot index to a time on a given date
 * @param date The base date
 * @param slotIndex The slot index (0 = 6:00 AM, 1 = 6:30 AM, etc.)
 * @returns The time for that slot
 */
export function slotIndexToTime(date: Date, slotIndex: number): Date {
  const totalMinutes = slotIndex * 30 + (HOUR_RANGE_START * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return setHours(setMinutes(date, minutes), hours);
}

/**
 * Calculate duration in minutes between two times
 * @param start Start time
 * @param end End time
 * @returns Duration in minutes
 */
export function calculateDuration(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

/**
 * Format a time for display in the UI
 * @param date The time to format
 * @returns Formatted string like "9:00 AM"
 */
export function formatTimeSlot(date: Date): string {
  return format(date, 'h:mm a');
}

/**
 * Calculate the visual height of a task block based on its duration
 * @param durationMinutes Duration in minutes
 * @returns Height in pixels
 */
export function getSlotHeight(durationMinutes: number): number {
  return (durationMinutes / 30) * TIME_SLOT_HEIGHT_PX;
}

/**
 * Calculate the top offset for a task block based on its start time
 * @param startTime The task's start time
 * @returns Top offset in pixels from the start of the grid
 */
export function calculateTopOffset(startTime: Date): number {
  const slotIndex = timeToSlotIndex(startTime);
  const baseOffset = slotIndex * TIME_SLOT_HEIGHT_PX;

  // Add fine-grained offset for minutes within the slot
  const minutes = startTime.getMinutes() % 30;
  const minuteOffset = (minutes / 30) * TIME_SLOT_HEIGHT_PX;

  return baseOffset + minuteOffset;
}

/**
 * Check if a time is within the displayable range
 * @param time The time to check
 * @returns True if within range (6 AM - 10 PM)
 */
export function isTimeInRange(time: Date): boolean {
  const hours = time.getHours();
  return hours >= HOUR_RANGE_START && hours < HOUR_RANGE_END;
}

/**
 * Snap a time to the nearest 30-minute slot
 * @param time The time to snap
 * @returns The snapped time
 */
export function snapToSlot(time: Date): Date {
  const minutes = time.getMinutes();
  const snappedMinutes = Math.round(minutes / 30) * 30;
  return setMinutes(time, snappedMinutes);
}
