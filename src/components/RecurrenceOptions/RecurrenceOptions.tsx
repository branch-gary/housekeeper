import { useState } from 'react'
import type { RecurrenceData, RecurrenceType, WeekOrdinal } from '../../types/recurrence'
import { MONTHS, WEEK_ORDINALS, WEEKDAYS } from '../../types/recurrence'
import styles from './RecurrenceOptions.module.scss'

interface RecurrenceOptionsProps {
  value: RecurrenceData
  onChange: (data: RecurrenceData) => void
}

const RecurrenceOptions = ({ value, onChange }: RecurrenceOptionsProps) => {
  const [showStartDate, setShowStartDate] = useState(Boolean(value.startDate))

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as RecurrenceType
    const newData: RecurrenceData = {
      ...value,
      type: newType,
      interval: 1,
      // Reset type-specific fields
      monthDay: newType === 'monthly-date' ? 1 : undefined,
      weekOrdinal: newType === 'monthly-day' ? 'first' : undefined,
      weekday: newType === 'monthly-day' ? 0 : undefined,
      month: newType === 'yearly' ? 1 : undefined,
      monthDayYearly: newType === 'yearly' ? 1 : undefined,
    }
    onChange(newData)
  }

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interval = Math.max(1, parseInt(e.target.value) || 1)
    onChange({ ...value, interval })
  }

  const handleStartDateToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowStartDate(e.target.checked)
    if (!e.target.checked) {
      onChange({ ...value, startDate: null })
    }
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, startDate: e.target.value || null })
  }

  return (
    <div className={styles.container}>
      <div className={styles.typeSelect}>
        <select value={value.type} onChange={handleTypeChange} className={styles.select}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly-date">Monthly (by date)</option>
          <option value="monthly-day">Monthly (by day)</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className={styles.options}>
        {/* Daily */}
        {value.type === 'daily' && (
          <div className={styles.optionGroup}>
            <span>Repeat every</span>
            <input
              type="number"
              min="1"
              value={value.interval}
              onChange={handleIntervalChange}
              className={styles.numberInput}
            />
            <span>day(s)</span>
          </div>
        )}

        {/* Weekly */}
        {value.type === 'weekly' && (
          <div className={styles.optionGroup}>
            <span>Repeat every</span>
            <input
              type="number"
              min="1"
              value={value.interval}
              onChange={handleIntervalChange}
              className={styles.numberInput}
            />
            <span>week(s)</span>
          </div>
        )}

        {/* Monthly by date */}
        {value.type === 'monthly-date' && (
          <div className={styles.optionGroup}>
            <span>Repeat every</span>
            <input
              type="number"
              min="1"
              value={value.interval}
              onChange={handleIntervalChange}
              className={styles.numberInput}
            />
            <span>month(s) on day</span>
            <input
              type="number"
              min="1"
              max="31"
              value={value.monthDay}
              onChange={(e) => onChange({ ...value, monthDay: parseInt(e.target.value) || 1 })}
              className={styles.numberInput}
            />
          </div>
        )}

        {/* Monthly by day */}
        {value.type === 'monthly-day' && (
          <div className={styles.optionGroup}>
            <span>Repeat every</span>
            <input
              type="number"
              min="1"
              value={value.interval}
              onChange={handleIntervalChange}
              className={styles.numberInput}
            />
            <span>month(s) on the</span>
            <select
              value={value.weekOrdinal}
              onChange={(e) => onChange({ ...value, weekOrdinal: e.target.value as WeekOrdinal })}
              className={styles.select}
            >
              {WEEK_ORDINALS.map(({ value: val, label }) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <select
              value={value.weekday}
              onChange={(e) => onChange({ ...value, weekday: parseInt(e.target.value) })}
              className={styles.select}
            >
              {WEEKDAYS.map((day, index) => (
                <option key={day} value={index}>{day}</option>
              ))}
            </select>
          </div>
        )}

        {/* Yearly */}
        {value.type === 'yearly' && (
          <div className={styles.optionGroup}>
            <span>Repeat every</span>
            <input
              type="number"
              min="1"
              value={value.interval}
              onChange={handleIntervalChange}
              className={styles.numberInput}
            />
            <span>year(s) on</span>
            <select
              value={value.month}
              onChange={(e) => onChange({ ...value, month: parseInt(e.target.value) })}
              className={styles.select}
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              max="31"
              value={value.monthDayYearly}
              onChange={(e) => onChange({ ...value, monthDayYearly: parseInt(e.target.value) || 1 })}
              className={styles.numberInput}
            />
          </div>
        )}
      </div>

      <div className={styles.startDateSection}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showStartDate}
            onChange={handleStartDateToggle}
            className={styles.checkbox}
          />
          Set start date
        </label>

        {showStartDate && (
          <div className={styles.datePickerWrapper}>
            <input
              type="date"
              value={value.startDate || ''}
              onChange={handleStartDateChange}
              className={styles.datePicker}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default RecurrenceOptions 