export function join_sentence(array) {
  return array.reduce((text, value, i, array) => (
    text + (i < array.length - 1 ? ', ' : ' and ') + value)
  );

export function capitalize(s) {
  if (typeof s !== 'string') { return '' }
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function isCompetitive(rating) {
    return (rating === "TOSS-UP" ||
        rating.startsWith("LEAN")
    )
}