import React from "react"

export function updateDict(object, key, update) {
  return Object.assign(object[key] || {}, update)
}

export function groupBy(objectArray, property) {
   return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
         acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
   }, {});
}

// way to get reference to useState setter, to call in other function
// https://stackoverflow.com/a/62015336/264790
export function useReferredState(initialValue) {
  const [state, setState] = React.useState(initialValue)
  const reference = React.useRef(state)

  const setReferredState = value => {
    reference.current = value
    setState(value)
  }

  return [reference, setReferredState]
}

/**
 * Checks if value is empty. Deep-checks arrays and objects, and zero-length strings
 * Note: isEmpty([]) == true, isEmpty({}) == true, isEmpty([{0:false},"",0]) == true, isEmpty({0:1}) == false
 * @param value
 * @returns {boolean}
 */
// https://stackoverflow.com/a/32728075/264790
export function isEmpty(value) {
  var isEmptyObject = function (a) {
    if (typeof a.length === "undefined") {
      // it's an Object, not an Array
      var hasNonempty = Object.keys(a).some(function nonEmpty(element) {
        return !isEmpty(a[element])
      })
      return hasNonempty ? false : isEmptyObject(Object.keys(a))
    }

    return !a.some(function nonEmpty(element) {
      // check if array is really not empty as JS thinks
      return !isEmpty(element) // at least one element should be non-empty
    })
  }
  return (
    value === false ||
    typeof value === "undefined" ||
    value == null ||
    (typeof value === "object" && isEmptyObject(value)) ||
    (typeof value === "string" && value.length === 0)
  )
}

export function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

// https://stackoverflow.com/a/6274381/264790
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function sortDescending(aString, bString) {
  // js sorts by strings, so convert first to float then compare
  let a = parseFloat(aString).valueOf()
  let b = parseFloat(bString).valueOf()
  return ((a > b) ? -1 : (a < b) ? 1 : 0)
}
