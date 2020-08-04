import React from "react";

import { Form, Fieldset, RangeInput } from "@trussworks/react-uswds"
import { useFormState } from "../context"

export function TimeStep() {
  const {
    state: { time },
    dispatch
  } = useFormState();

  return (
    <Form>
      <Fieldset legend={"How much time do you have?"}>
        <RangeInput
          id="range-slider"
          name="time"
          min={0}
          max={4}
          defaultValue={2}
          list="range-list-id"
          value={time}
          onChange={e =>
            dispatch({ type: "TIME_CHANGE", payload: e.target.value })
          }
        />
        <datalist id="range-list-id">
          <option>0</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </datalist>
      </Fieldset>
    </Form>
  );
}