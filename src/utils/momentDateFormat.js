import moment from 'moment'
import 'moment/dist/locale/id'

moment.locale('id')

export function dateToNow({ date }) {
  if (typeof date == 'string') {
    let d = moment(date, "YYYY-MM-DD'T'HH:mm:ss.SSS'Z'").startOf('minute').fromNow()
    return d
  }
}

export function dateToNowDay({ date, format = "YYYY-MM-DD'T'HH:mm:ss.SSS'Z'" }) {
  if (typeof date == 'string') {
    let d = moment(date, format).endOf('day').fromNow()
    return d
  }
}

export function differenceBetweenTwoDate({ date1, date2, unitType = 'day' }) {
  if (typeof date1 !== 'string' || typeof date2 !== 'string') {
    return
  }

  let a = moment(date1)
  let b = moment(date2)

  return a.diff(b, unitType)
}

export function formatDateMoments({ value, format = 'D MMMM YYYY' }) {
  if (value && typeof value === 'string') {
    return moment(value).format(format)
  }
}

export function isSameOrAfter({ date1, date2 }) {
  if (typeof date1 !== 'string' || typeof date2 !== 'string') {
    return
  }

  return moment(date1).isSameOrAfter({ date2 })
}

export function isAfter({ date1, date2 }) {
  if (typeof date1 !== 'string' || typeof date2 !== 'string') {
    return
  }

  return moment(date1).isAfter(date2)
}

export function getNextDateByNumber({ value, number }) {
  if (value && typeof value === 'string') {
    return moment(value).day(number)
  }
}
