import styles from './DatePicker.module.scss'

interface DatePickerProps {
  value: string
  onChange: (date: Date) => void
  'aria-label'?: string
}

export default function DatePicker({ value, onChange, 'aria-label': ariaLabel }: DatePickerProps) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(new Date(e.target.value))}
      className={styles.datePicker}
      aria-label={ariaLabel}
    />
  )
} 