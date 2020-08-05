import React from "react"

import { Form, Fieldset } from "@trussworks/react-uswds"

import { useFormState } from "../context"
import FormButton from "../buttons"

export function VoteStep() {
  const {
    state: { registered, vbm },
    dispatch
  } = useFormState();

  return (
    <Form>
      <Fieldset legend={"Are you registered to vote?"}>
        <FormButton
          text="Yes"
          value="yes"
          state={registered}
          action={e =>
            dispatch({ type: "VOTE_REGISTERED_CHANGE", payload: e.target.value })
          }
        />
        <FormButton
          text="No"
          value="no"
          state={registered}
          action={e =>
            dispatch({ type: "VOTE_REGISTERED_CHANGE", payload: e.target.value })
          }
        />
        <FormButton
          text="Not Sure"
          value="not-sure"
          state={registered}
          action={e =>
            dispatch({ type: "VOTE_REGISTERED_CHANGE", payload: e.target.value })
          }
        />
      </Fieldset>

      <Fieldset legend={"Would you like to vote by mail?"}>
        <FormButton
          text="Yes"
          value="yes"
          state={vbm}
          action={e =>
            dispatch({ type: "VOTE_BY_MAIL_CHANGE", payload: e.target.value })
          }
        />
        <FormButton
          text="No"
          value="no"
          state={vbm}
          action={e =>
            dispatch({ type: "VOTE_BY_MAIL_CHANGE", payload: e.target.value })
          }
        />
        <FormButton
          text="Not Sure"
          value="not-sure"
          state={vbm}
          action={e =>
            dispatch({ type: "VOTE_BY_MAIL_CHANGE", payload: e.target.value })
          }
        />
      </Fieldset>
    </Form>
  );
}

export default VoteStep;