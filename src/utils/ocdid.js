function parseOCDID(ocdid) {
  // gets the value of the last division
  let last = ocdid.split("/").pop()
  let value = last.split(":").pop()
  return value
}

function findOCDID(list, type) {
  // given a list of ocdids, find one that matches the given type
  return list.find(ocd => ocd.split("/").pop().startsWith(type))
}

export function matchOCDID(list, type) {
  // given a list of ocdids and a type to match, return that value
  let match = findOCDID(list, type)
  return match ? parseOCDID(match) : ""
}
