import React from "react"

import { Form, Fieldset, RangeInput } from "@trussworks/react-uswds"
import { useAppState } from "../../../state/context"

export function MoneyStep() {
  const {
    state: { money },
    dispatch,
  } = useAppState()

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <Fieldset legend={"How much can you contribute each month?"}>
        <RangeInput
          id="range-slider"
          name="money"
          min={0}
          max={100}
          value={money}
          onChange={e =>
            dispatch({ type: "MONEY_CHANGE", payload: e.target.value })
          }
        />
        <ul className="usa-range range-slider-label">
          <li>help in other ways</li>
          <li>$20</li>
          <li>$40</li>
          <li>$60</li>
          <li>$80</li>
          <li>$100 or more</li>
        </ul>
      </Fieldset>
    </Form>
  )
}
