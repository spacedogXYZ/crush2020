import { padCode, ordinalWords, capitalize, hasAlpha } from "./strings"


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

export function stateLegBody(state, chamber) {
  // get the name of the upper or lower legislative body for a given state
  const LOWER_ASSEMBLY = ['CA', 'NY', 'WI']

  if (chamber === 'UPPER') {
    return 'Senate'
  }
  if (chamber === 'LOWER') {
    if (LOWER_ASSEMBLY.indexOf(state) > -1) {
      return 'Assembly'
    }
    return 'House'
  }
}

export function stateLegDistrict(state, chamber, ocd) {
  // get a district name for a given state, upper or lower chamber, and OCD division number
  // to match with FollowTheMoney data

  const body = stateLegBody(state, chamber)
  
  if(state === 'AK' && chamber === 'UPPER') {
    // AK SENATE has lettered districts
    return `${body} District ${ocd}`
  } else if (state === 'MA') {
    // MA HOUSE and SENATE have named districts with wicked long ordinal codes
    // eg TWENTY-SEVENTH MIDDLESEX, which google has as 27th_middlesex
    let parts = ocd.split('_')
    let code = parts[0].replace('st', '').replace('nd', '').replace('rd', '').replace('th', '')
    let ordinal = capitalize(ordinalWords(parseInt(code)))
    let district = capitalize(parts.slice(1).join(' ').toUpperCase())
    return `${body} District ${ordinal} ${district}`
  } else if (state === 'MN') {
    // MN has 3-digit numbers and then sometimes letters
    if (hasAlpha(ocd)) {
      let letter = hasAlpha(ocd)[0].toUpperCase()
      let number = padCode(ocd.slice(0,-1), 3)
      return `${body} District ${number}${letter}`
    } else {
      return `${body} District ${ocd}`
    }
  } else if (state === 'NH' && chamber === 'LOWER') {
    // NH HOUSE has named and numbered districts
    let parts = ocd.split('_')
    let code = parts.pop()
    let district = parts.join(' ').toUpperCase()
    return `${body} District ${district} ${code}`
  } else if (state === 'VT') {
    // VT has named and sometimes numbered districts
    let district = capitalize(ocd)
    return `${body} District ${district}`
  } else {
    return `${body} District ${padCode(ocd, 3, "0")}`
  }
}