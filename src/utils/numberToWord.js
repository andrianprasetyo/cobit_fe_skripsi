function numberToWord(a) {
  let bilangan = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas'
  ]

  let kalimat
  let utama
  let depan
  let belakang

  // 1 - 11
  if (a < 12) {
    kalimat = bilangan[a]
  }
  // 12 - 19
  else if (a < 20) {
    kalimat = bilangan[a - 10] + ' Belas'
  }
  // 20 - 99
  else if (a < 100) {
    utama = a / 10
    depan = parseInt(String(utama).substr(0, 1))
    belakang = a % 10
    kalimat = bilangan[depan] + ' Puluh ' + bilangan[belakang]
  }
  // 100 - 199
  else if (a < 200) {
    kalimat = 'Seratus ' + numberToWord(a - 100)
  }
  // 200 - 999
  else if (a < 1000) {
    utama = a / 100
    depan = parseInt(String(utama).substr(0, 1))
    belakang = a % 100
    kalimat = bilangan[depan] + ' Ratus ' + numberToWord(belakang)
  }
  // 1,000 - 1,999
  else if (a < 2000) {
    kalimat = 'Seribu ' + numberToWord(a - 1000)
  }
  // 2,000 - 9,999
  else if (a < 10000) {
    utama = a / 1000
    depan = parseInt(String(utama).substr(0, 1))
    belakang = a % 1000
    kalimat = bilangan[depan] + ' Ribu ' + numberToWord(belakang)
  }
  // 10,000 - 99,999
  else if (a < 100000) {
    utama = a / 100
    depan = parseInt(String(utama).substr(0, 2))
    belakang = a % 1000
    kalimat = numberToWord(depan) + ' Ribu ' + numberToWord(belakang)
  }
  // 100,000 - 999,999
  else if (a < 1000000) {
    utama = a / 1000
    depan = parseInt(String(utama).substr(0, 3))
    belakang = a % 1000
    kalimat = numberToWord(depan) + ' Ribu ' + numberToWord(belakang)
  }
  // 1,000,000 - 	99,999,999
  else if (a < 100000000) {
    utama = a / 1000000
    depan = parseInt(String(utama).substr(0, 4))
    belakang = a % 1000000
    kalimat = numberToWord(depan) + ' Juta ' + numberToWord(belakang)
  } else if (a < 1000000000) {
    utama = a / 1000000
    depan = parseInt(String(utama).substr(0, 4))
    belakang = a % 1000000
    kalimat = numberToWord(depan) + ' Juta ' + numberToWord(belakang)
  } else if (a < 10000000000) {
    utama = a / 1000000000
    depan = parseInt(String(utama).substr(0, 1))
    belakang = a % 1000000000
    kalimat = numberToWord(depan) + ' Milyar ' + numberToWord(belakang)
  } else if (a < 100000000000) {
    utama = a / 1000000000
    depan = parseInt(String(utama).substr(0, 2))
    belakang = a % 1000000000
    kalimat = numberToWord(depan) + ' Milyar ' + numberToWord(belakang)
  } else if (a < 1000000000000) {
    utama = a / 1000000000
    depan = parseInt(String(utama).substr(0, 3))
    belakang = a % 1000000000
    kalimat = numberToWord(depan) + ' Milyar ' + numberToWord(belakang)
  } else if (a < 10000000000000) {
    utama = a / 10000000000
    depan = parseInt(String(utama).substr(0, 1))
    belakang = a % 10000000000
    kalimat = numberToWord(depan) + ' Triliun ' + numberToWord(belakang)
  } else if (a < 100000000000000) {
    utama = a / 1000000000000
    depan = parseInt(String(utama).substr(0, 2))
    belakang = a % 1000000000000
    kalimat = numberToWord(depan) + ' Triliun ' + numberToWord(belakang)
  } else if (a < 1000000000000000) {
    utama = a / 1000000000000
    depan = parseInt(String(utama).substr(0, 3))
    belakang = a % 1000000000000
    kalimat = numberToWord(depan) + ' Triliun ' + numberToWord(belakang)
  } else if (a < 10000000000000000) {
    utama = a / 1000000000000000
    depan = parseInt(String(utama).substr(0, 1))
    belakang = a % 1000000000000000
    kalimat = numberToWord(depan) + ' Kuadriliun ' + numberToWord(belakang)
  }

  let pisah = kalimat.split(' ')
  let full = []
  for (var i = 0; i < pisah.length; i++) {
    if (pisah[i] != '') {
      full.push(pisah[i])
    }
  }
  return full.join(' ')
}

export default numberToWord
