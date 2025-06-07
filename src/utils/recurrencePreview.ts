import type { RecurrenceData } from '../types/recurrence'

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function getDayWithSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return `${day}th`
  }

  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

export function getRecurrencePreview(recurrence: RecurrenceData): string {
  if (!recurrence) return 'No recurrence set'

  const { type, interval } = recurrence
  const intervalText = interval === 1 ? '' : `${interval} `

  switch (type) {
    case 'daily':
      return `Every ${intervalText}day${interval > 1 ? 's' : ''}`

    case 'weekly':
      return `Every ${intervalText}week${interval > 1 ? 's' : ''}`

    case 'monthly-date': {
      if (!recurrence.monthDay) return 'Invalid monthly recurrence'
      const monthlyDateSuffix = getDayWithSuffix(recurrence.monthDay)
      return `Every ${intervalText}month${interval > 1 ? 's' : ''} on the ${monthlyDateSuffix}`
    }

    case 'monthly-day': {
      if (recurrence.weekday === undefined || !recurrence.weekOrdinal) {
        return 'Invalid monthly recurrence'
      }
      const weekday = weekdays[recurrence.weekday]
      return `Every ${intervalText}month${interval > 1 ? 's' : ''} on the ${recurrence.weekOrdinal} ${weekday}`
    }

    case 'yearly': {
      if (!recurrence.month || !recurrence.monthDayYearly) {
        return 'Invalid yearly recurrence'
      }
      const month = months[recurrence.month - 1]
      const yearlyDateSuffix = getDayWithSuffix(recurrence.monthDayYearly)
      return `Every ${intervalText}year${interval > 1 ? 's' : ''} on ${month} ${yearlyDateSuffix}`
    }

    default:
      return 'Invalid recurrence type'
  }
} 