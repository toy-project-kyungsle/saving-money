/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0] ?? ''
}

/**
 * Format date as Korean style (YYYY년 MM월 DD일)
 */
export function formatDateKR(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Get current month in YYYY-MM format
 */
export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Get month from date in YYYY-MM format
 */
export function getMonth(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Format month as Korean style (YYYY년 MM월)
 */
export function formatMonthKR(month: string): string {
  const [year, m] = month.split('-')
  return `${year ?? ''}년 ${Number.parseInt(m ?? '0')}월`
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getToday(): string {
  return formatDate(new Date())
}

/**
 * Check if date is in current month
 */
export function isCurrentMonth(date: Date | string): boolean {
  return getMonth(date) === getCurrentMonth()
}
