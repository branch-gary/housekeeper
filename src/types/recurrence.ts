export type RecurrenceType = 'daily' | 'weekly' | 'monthly-date' | 'monthly-day' | 'yearly'

export type WeekOrdinal = 'first' | 'second' | 'third' | 'fourth' | 'last'

export interface RecurrenceData {
  type: RecurrenceType
  interval: number
  monthDay?: number // for monthly-date
  weekOrdinal?: WeekOrdinal // for monthly-day
  weekday?: number // 0-6 for monthly-day
  month?: number // 1-12 for yearly
  monthDayYearly?: number // 1-31 for yearly
  startDate: Date | null
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const WEEK_ORDINALS: { value: WeekOrdinal; label: string }[] = [
  { value: 'first', label: 'First' },
  { value: 'second', label: 'Second' },
  { value: 'third', label: 'Third' },
  { value: 'fourth', label: 'Fourth' },
  { value: 'last', label: 'Last' }
]

export const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
] 