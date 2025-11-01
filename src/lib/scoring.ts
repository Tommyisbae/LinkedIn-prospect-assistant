/**
 * This file contains utility functions related to displaying scores.
 * The main score calculation will be handled by the AI and background worker.
 */

/**
 * Converts a numerical score (0-500) to a letter grade (F-A+).
 * @param score The numerical score.
 * @returns A letter grade as a string.
 */
export function scoreToGrade(score: number): string {
  if (score >= 450) return "A+";
  if (score >= 400) return "A";
  if (score >= 350) return "B+";
  if (score >= 300) return "B";
  if (score >= 250) return "C+";
  if (score >= 200) return "C";
  if (score >= 150) return "D";
  return "F";
}

/**
 * Returns a Tailwind CSS background color class based on the grade.
 * @param grade The letter grade (e.g., 'A+', 'B').
 * @returns A string for the CSS class.
 */
export function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "bg-green-500";
  if (grade.startsWith("B")) return "bg-blue-500";
  if (grade.startsWith("C")) return "bg-yellow-500";
  if (grade.startsWith("D")) return "bg-orange-500";
  return "bg-red-500";
}
