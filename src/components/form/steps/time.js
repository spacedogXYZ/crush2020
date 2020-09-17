import React from "react"

import { Form, Fieldset, RangeInput } from "@trussworks/react-uswds"
import { useAppState } from "../../../state/context"

export const TIME_VALUES = [
  "help in other ways",
  "at least once",
  "a few hours a week",
  "one weekend a month",
  "every weekend",
  "full-time",
]

export function TimeStep() {
  const {
    state: { time },
    dispatch,
  } = useAppState()

  return (
    <Form onSubmit={e => e.preventDefault()}>
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
          {TIME_VALUES.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </Fieldset>
    </Form>
  )
}
