import React from "react";
import USAMap from "react-usa-map"

import { Form, Fieldset } from "@trussworks/react-uswds"
import { useFormState } from "../context"

export function CommunityStep() {
  const {
    state: { community },
    dispatch
  } = useFormState();

  const handleChange = event => {
    let region = event.target.dataset.name;
    const isSelected = community.includes(region);
    let payload = community;

    if (isSelected) {
      payload = community.filter(c => c !== region);
    } else {
      payload = [...community, region];
    }

    dispatch({
      type: "COMMUNITY_CHANGE",
      payload
    });
  };

  const statesCustomConfig = () => {
    // todo, get battleground states from data api
    // and outline them like other selectable buttons 
    let config = {}
    community.map(region => {
      if (region === "DC") {
        // workaround for library weirdness with DC circle
        region = "DC2"
      }
      config[region] = {
        fill: "#005ea2"
      }
    })

    return config;
  };

  return (
    <Form className="margin-top-5pct">
      <Fieldset legend={"Extend your impact"}>
        <h2>Adopt a battleground district</h2>
        <h3>We need to keep the House and flip the Senate. Help win one of these races!</h3>
        <USAMap width="100%"
          customize={statesCustomConfig()}
          onClick={handleChange}
          />
      </Fieldset>
    </Form>
  );
}