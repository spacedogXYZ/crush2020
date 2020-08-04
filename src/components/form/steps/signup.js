import React from "react";

import { useFormState } from "../context";
import { Form, Fieldset, TextInput } from "@trussworks/react-uswds"

export function SignupStep() {
  const {
    state: { name, email, twitter, instagram },
    dispatch
  } = useFormState();

  return (
    <Form>
      <Fieldset legend={"Almost done!"}>
        <TextInput
          label="Name"
          name="name"
          onChange={e =>
            dispatch({ type: "NAME_CHANGE", payload: e.target.value })
          }
          value={name}
        />

        <TextInput
          label="Email"
          name="email"
          onChange={e =>
            dispatch({ type: "EMAIL_CHANGE", payload: e.target.value })
          }
          value={email}
        />

        <TextInput
          label="Twitter"
          name="twitter"
          onChange={e =>
            dispatch({ type: "TWITTER_CHANGE", payload: e.target.value })
          }
          value={twitter}
        />

        <TextInput
          label="Instagram"
          name="instagram"
          onChange={e =>
            dispatch({ type: "INSTAGRAM_CHANGE", payload: e.target.value })
          }
          value={instagram}
        />
      </Fieldset>
    </Form>
  );
}

export default SignupStep;