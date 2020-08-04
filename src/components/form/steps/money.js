import React from "react";

import { Form, Fieldset, RangeInput } from "@trussworks/react-uswds"
import { useFormState } from "../context"

export function MoneyStep() {
  const {
    state: { money },
    dispatch
  } = useFormState();

  return (
    <Form>
      <Fieldset legend={"How much can you contribute each month?"}>
        <RangeInput
          id="range-slider"
          name="money"
          min={0}
          max={100}
          defaultValue={20}
          value={money}
          onChange={e =>
            dispatch({ type: "MONEY_CHANGE", payload: e.target.value })
          }
        />
      </Fieldset>
    </Form>
  );
}