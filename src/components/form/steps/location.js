import React from "react";

import { useFormState } from "../context";
import { Form, Fieldset, TextInput } from "@trussworks/react-uswds"

export function LocationStep() {
  const {
    state: { location },
    dispatch
  } = useFormState();

  return (
    <Form>
      <Fieldset legend={"Where are you registered to vote?"}>
        <TextInput
          label="Location"
          name="location"
          onChange={e =>
            dispatch({ type: "LOCATION_CHANGE", payload: e.target.value })
          }
          value={location}
        />
      </Fieldset>
    </Form>
  );
}

export default LocationStep;