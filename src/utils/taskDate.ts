import type { RecurrenceData } from '../types/recurrence'

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7)
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

function getNthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const firstDay = new Date(year, month, 1)
  const firstWeekday = new Date(year, month, 1 + (weekday - firstDay.getDay() + 7) % 7)
  const result = new Date(firstWeekday)
  result.setDate(firstWeekday.getDate() + (n - 1) * 7)
  return result
}

function getLastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const lastDay = new Date(year, month + 1, 0)
  const lastWeekday = new Date(lastDay)
  while (lastWeekday.getDay() !== weekday) {
    lastWeekday.setDate(lastWeekday.getDate() - 1)
  }
  return lastWeekday
}

export function getNextDueDate(recurrence: RecurrenceData): string | null {
  if (!recurrence) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDate = recurrence.startDate ? new Date(recurrence.startDate) : today
  startDate.setHours(0, 0, 0, 0)
  let nextDate = new Date(startDate)

  // For tasks starting today without a specific start date, we want them to be due today
  const shouldStartToday = !recurrence.startDate && startDate.getTime() === today.getTime()

  switch (recurrence.type) {
    case 'daily':
      // If it's a new daily task starting today, make it due today
      if (shouldStartToday) {
        nextDate = today
      } else {
        nextDate = addDays(startDate, recurrence.interval)
      }
      break

    case 'weekly':
      nextDate = addWeeks(startDate, recurrence.interval)
      break

    case 'monthly-date':
      if (!recurrence.monthDay) return null
      nextDate = addMonths(startDate, recurrence.interval)
      nextDate.setDate(recurrence.monthDay)
      break

    case 'monthly-day':
      if (recurrence.weekday === undefined || !recurrence.weekOrdinal) return null
      nextDate = addMonths(startDate, recurrence.interval)
      const year = nextDate.getFullYear()
      const month = nextDate.getMonth()

      if (recurrence.weekOrdinal === 'last') {
        nextDate = getLastWeekdayOfMonth(year, month, recurrence.weekday)
      } else {
        const weekNumber = {
          first: 1,
          second: 2,
          third: 3,
          fourth: 4
        }[recurrence.weekOrdinal]
        nextDate = getNthWeekdayOfMonth(year, month, recurrence.weekday, weekNumber)
      }
      break

    case 'yearly':
      if (!recurrence.month || !recurrence.monthDayYearly) return null
      nextDate = addYears(startDate, recurrence.interval)
      nextDate.setMonth(recurrence.month - 1)
      nextDate.setDate(recurrence.monthDayYearly)
      break
  }

  // If the calculated date is in the past, increment until we find the next occurrence
  while (nextDate < today) {
    const incrementedDate = getNextDueDate({ ...recurrence, startDate: nextDate.toISOString() })
    if (!incrementedDate) break
    nextDate = new Date(incrementedDate)
  }

  console.log('Calculated next due date:', {
    recurrence,
    startDate,
    nextDate,
    shouldStartToday
  })

  return nextDate.toISOString()
} 