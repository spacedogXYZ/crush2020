export function joinSentence(array) {
  return array.reduce(
    (text, value, i, array) =>
      text + (i < array.length - 1 ? ", " : " and ") + value
  )
}

export function capitalize(s) {
  if (typeof s !== "string") {
    return ""
  }
  s = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  if (s.startsWith("Mc")) {
    s = "Mc" + s.charAt(2).toUpperCase() + s.slice(3)
  }
  return s
}

export function isCompetitive(rating) {
  if (typeof rating !== "string") {
    return false
  }
  return rating === "TOSS-UP" || rating.startsWith("LEAN")
}

export function isLikely(rating) {
  if (typeof rating !== "string") {
    return false
  }
  return rating.startsWith("LIKELY")
}

export function padCode(number, length=2, fill="0") {
  return String(number).padStart(length, fill)
}

export function unpadCode(code) {
  return String(parseInt(code))
}

export function parseName(name) {
  // tries to naively convert LAST, FIRST MIDDLE
  // to First M Last

  let parts = name.split(",")
  let last = parts[0].trim()
  let [first, middle = ""] = parts[1].trim().split(" ")
  return `${capitalize(first)} ${middle.slice(0, 1)} ${capitalize(last)}`
}

export function firstSentence(string) {
  return string.split('.')[0]+'.'
}

export function hasAlpha(string) {
  return string.match(/[a-z]/i);
}

export function ordinalWords(cardinal) {
  // takes an integer and returns the ordinal description, works up to 100
  // eg: 13 -> 'thirteenth'
  // modified from https://stackoverflow.com/a/15998146/264790
  var ordinals = [ 'zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
      'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'
  ];
  var tens = {
      20: 'twenty',
      30: 'thirty',
      40: 'forty',
      50: 'fifty',
      60: 'sixty',
      70: 'seventy',
      80: 'eighty',
      90: 'ninety'
  };
  var ordinalTens = {
      30: 'thirtieth',
      40: 'fortieth',
      50: 'fiftieth',
      60: 'sixtieth',
      70: 'seventieth',
      80: 'eightieth',
      90: 'ninetieth'
  };

  if( cardinal <= 20 ) {                    
      return ordinals[ cardinal ];
  }
  
  if( cardinal % 10 === 0 ) {
      return ordinalTens[ cardinal ];
  }
  
  return tens[ cardinal - ( cardinal % 10 ) ] + '-' + ordinals[ cardinal % 10 ];
}
