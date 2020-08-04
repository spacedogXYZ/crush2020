import React from "react";
import USAMap from "react-usa-map"

import { Form, Fieldset, RangeInput } from "@trussworks/react-uswds"
import { useFormState } from "../context"

export function CommunityStep() {
  const {
    state: { time },
    dispatch
  } = useFormState();

  return (
    <Form>
      <Fieldset legend={"Extend your impact"}>
        <h2>Adopt a battleground district</h2>
        <h3>We need to keep the House and flip the Senate. Help win one of these races!</h3>
        <USAMap width="100%"/>
      </Fieldset>
    </Form>
  );
}