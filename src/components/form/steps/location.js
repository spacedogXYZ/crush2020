/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useState } from "react"

import { useFormState } from "../context"
import { Form, Fieldset, TextInput } from "@trussworks/react-uswds"

import usePlacesAutocomplete from "use-places-autocomplete"
import { matchOCDID } from "../../../utils/ocdid"
import powered_by_google from "../../../images/powered_by_google.png"

const { GATSBY_GOOGLE_MAPS_KEY } = process.env
const GOOGLE_CIVIC_API_URL =
  "https://www.googleapis.com/civicinfo/v2/representatives"

let cachedVal = ""
const acceptedKeys = [38, 40, 13, 27]

export function LocationStep() {
  const { dispatch } = useFormState()

  const [currIndex, setCurrIndex] = useState(null)
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "us" }, // only in the USA
      types: ["geocode"], // restrict responses to addresses, not establishments
    },
    debounce: 300,
  })
  const hasSuggestions = status === "OK"

  const dismissSuggestions = () => {
    setCurrIndex(null)
    clearSuggestions()
  }

  const handleInput = e => {
    // Update the keyword of the input element
    setValue(e.target.value)
    cachedVal = e.target.value
  }

  const handleSelect = ({ description }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter as "false"
    setValue(description, false)
    dispatch({ type: "LOCATION_CHANGE", payload: description })
    
    // Look up districts via Google Civic
    fetch(
      GOOGLE_CIVIC_API_URL +
        `?key=${GATSBY_GOOGLE_MAPS_KEY}` +
        `&address=${encodeURIComponent(description)}&includeOffices=false`
    )
      .then(res => res.json())
      .then(data => {
        // extract city, state, zip from normalizedInput
        let { normalizedInput: result } = data
        // and cd, sldl and sldu from divisions
        const { divisions } = data
        if (!divisions) {
          console.error("unable to find google civic divisions for that address", description)
          return false
        }
        const ocdids = Object.keys(divisions)
        result["county"] = matchOCDID(ocdids, "county")
        result["cd"] = matchOCDID(ocdids, "cd")
        result["state_lower"] = matchOCDID(ocdids, "sldl")
        result["state_upper"] = matchOCDID(ocdids, "sldu")

        dispatch({ type: "GEOCODE_CHANGE", payload: result })
        clearSuggestions()
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleEnter = (idx) => () => {
    setCurrIndex(idx)
  }

  const handleLeave = () => {
    setCurrIndex(null)
  }

  const handleKeyDown = (e) => {
    if (!hasSuggestions || !acceptedKeys.includes(e.keyCode)) return;

    if (e.keyCode === 13 || e.keyCode === 27) {
      dismissSuggestions();
      return;
    }

    let nextIndex;

    if (e.keyCode === 38) {
      e.preventDefault();
      nextIndex = currIndex ?? data.length;
      nextIndex = nextIndex > 0 ? nextIndex - 1 : null;
    } else {
      nextIndex = currIndex ?? -1;
      nextIndex = nextIndex < data.length - 1 ? nextIndex + 1 : null;
    }

    setCurrIndex(nextIndex);
    setValue(data[nextIndex] ? data[nextIndex].description : cachedVal, false);
  }

  const renderSuggestions = () =>
    data.map((suggestion, idx) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion

      return (
        <li
          key={place_id}
          id={`suggestion-item-${idx}`}
          className={idx === currIndex ? 'hover' : ''}
          onKeyDown={handleKeyDown}
          onClick={handleSelect(suggestion)}
          onMouseEnter={handleEnter(idx)}
          role="option"
          aria-selected={idx === currIndex}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      )
    })

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <Fieldset legend={"Where are you registered to vote?"}>
        <div
          role="combobox"
          aria-controls="location-suggestions"
          aria-owns="location-suggestions"
          aria-haspopup="listbox"
          aria-expanded={hasSuggestions}
        >
          <TextInput
            label="Location"
            name="location"
            aria-autocomplete="list"
            aria-controls="location-suggestions"
            aria-activedescendant={
              currIndex !== null ? `suggestion-item-${currIndex}` : null
            }
            spellCheck = "off"
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onSubmit={e => e.preventDefault()}
            disabled={!ready}
            placeholder="Enter your home address. We only use this to find your voting district."

          />
          {hasSuggestions && (
            <ul
              className="location-search"
              id="location-suggestions"
              onMouseLeave={handleLeave}
              role="listbox"
            >
              {renderSuggestions()}
              <li className='citation'>
                <img src={powered_by_google} alt="Powered by Google"/>
              </li>
            </ul>
          )}
        </div>
      </Fieldset>
    </Form>
  )
}

export default LocationStep
