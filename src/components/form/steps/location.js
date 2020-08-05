import React from "react";

import { useFormState } from "../context";
import { Form, Fieldset, TextInput } from "@trussworks/react-uswds"

const Geocodio = require('geocodio-library-node');
const { GATSBY_GEOCODIO_KEY } = process.env;

export function LocationStep() {
  const {
    state: { location, geocode },
    dispatch
  } = useFormState();

  const geocoder = new Geocodio(GATSBY_GEOCODIO_KEY);
  geocoder.HTTP_HEADERS = null;
  // unset headers which cause access-control issues in browser

  return (
    <Form>
      <Fieldset legend={"Where are you registered to vote?"}>
        <TextInput
          label="Location"
          name="location"
          onChange={e =>
            dispatch({ type: "LOCATION_CHANGE", payload: e.target.value })
          }
          onBlur={e=>{
            geocoder.geocode(location,
              ['cd', 'stateleg']
            )
            .then(response => {
              if (response && response.results && response.results[0]) {
                dispatch({ type: "GEOCODE_CHANGE", payload: response.results[0] })
              } else {
                // display error to user
                console.error('no results for'+location)
              }
            })
            .catch(response => {
              // display error to user
              // send to sentry?
              console.error(response)
            })
          }}
          value={location}
        />
      </Fieldset>
    </Form>
  );
}

export default LocationStep;