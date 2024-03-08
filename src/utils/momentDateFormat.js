import moment from 'moment'
import 'moment/dist/locale/id'

moment.locale('id')

export function greeting() {
  const currentTime = moment().utcOffset('+07:00')
  const currentHour = currentTime.hour()

  let greeting

  if (currentHour >= 4 && currentHour <= 10) {
    greeting = 'Selamat Pagi'
  } else if (currentHour >= 10 && currentHour <= 15) {
    greeting = 'Selamat Siang'
  } else if (currentHour >= 15 && currentHour <= 18) {
    greeting = 'Selamat Sore'
  } else {
    greeting = 'Selamat Malam'
  }

  return greeting
}

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

export function isBefore({ date1, date2 }) {
  if (typeof date1 !== 'string' || typeof date2 !== 'string') {
    return
  }

  return moment(date1).isBefore(date2)
}

export function isSameOrBefore({ date1, date2 }) {
  if (typeof date1 !== 'string' || typeof date2 !== 'string') {
    return
  }

  return moment(date1).isSameOrBefore({ date2 })
}

export function getNextDateByNumber({ value, number }) {
  if (value && typeof value === 'string') {
    return moment(value).day(number)
  }
}

export function isBetween({ date, start_date, end_date }) {
  if (typeof date !== 'string' || typeof start_date !== 'string' || typeof end_date !== 'string') {
    return
  }

  return moment(date).isBetween(start_date, end_date)
}
