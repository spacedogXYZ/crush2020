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

export function padCode(number) {
  return String(number).padStart(2, "0")
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
