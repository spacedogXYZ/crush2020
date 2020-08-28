import React from "react"

import { useFormState } from "../context"
import { Form, Fieldset, TextInput } from "@trussworks/react-uswds"

import usePlacesAutocomplete from "use-places-autocomplete"
import { matchOCDID } from "../../../utils/ocdid"

const { GATSBY_GOOGLE_MAPS_KEY } = process.env
const GOOGLE_CIVIC_API_URL =
  "https://www.googleapis.com/civicinfo/v2/representatives"

export function LocationStep() {
  const { dispatch } = useFormState()

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

  const handleInput = e => {
    // Update the keyword of the input element
    setValue(e.target.value)
  }

  const handleSelect = ({ description }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter as "false"
    setValue(description, false)
    dispatch({ type: "LOCATION_CHANGE", payload: description })
    clearSuggestions()

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
        const ocdids = Object.keys(divisions)
        result["county"] = matchOCDID(ocdids, "county")
        result["cd"] = matchOCDID(ocdids, "cd")
        result["state_lower"] = matchOCDID(ocdids, "sldl")
        result["state_upper"] = matchOCDID(ocdids, "sldu")

        dispatch({ type: "GEOCODE_CHANGE", payload: result })
      })
      .catch(error => {
        console.error(error)
      })
  }

  const renderSuggestions = () =>
    data.map(suggestion => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      )
    })

  return (
    <Form>
      <Fieldset legend={"Where are you registered to vote?"}>
        <div
          role="combobox"
          aria-haspopup="listbox"
          aria-controls="location-suggestions"
          aria-expanded={status === "OK" ? true : false}
        >
          <TextInput
            label="Location"
            name="location"
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Enter your home address. We only use this to find your voting district."
            aria-autocomplete="list"
          />
          {status === "OK" && (
            <ul
              className="location-search"
              role="listbox"
              id="location-suggestions"
            >
              {renderSuggestions()}
            </ul>
          )}
        </div>
      </Fieldset>
    </Form>
  )
}

export default LocationStep
