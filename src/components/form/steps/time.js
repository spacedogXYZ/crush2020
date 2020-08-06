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
          max={5}
          value={time}
          onChange={e =>
            dispatch({ type: "TIME_CHANGE", payload: e.target.value })
          }
        />
        <ul className="usa-range range-slider-label">
          <li>help in other ways</li>
          <li>at least once</li>
          <li>a few hours a week</li>
          <li>one weekend a month</li>
          <li>every weekend</li>
          <li>full-time</li>
        </ul>
      </Fieldset>
    </Form>
  );
}