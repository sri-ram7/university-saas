import dayjs from 'dayjs'

export function formatDate(value, pattern = 'MMM D, YYYY') {
  if (!value) return '—'
  return dayjs(value).format(pattern)
}

export function formatDateTime(value) {
  return formatDate(value, 'MMM D, YYYY h:mm A')
}

export function toInputDate(value) {
  return value ? dayjs(value).format('YYYY-MM-DD') : ''
}
