import React from "react";

import { useFormState } from "../context";
import { Form, Fieldset, Button } from "@trussworks/react-uswds"

export function VoteStep() {
  const {
    state: { registered, vbm },
    dispatch
  } = useFormState();

  return (
    <Form>
      <Fieldset legend={"Are you registered to vote?"}>
        <Button outline
          onChange={e =>
            dispatch({ type: "VOTE_REGISTERED_CHANGE", payload: e.target.value })
          }
          value={"yes"}
        >Yes</Button>
        <Button outline
          onChange={e =>
            dispatch({ type: "VOTE_REGISTERED_CHANGE", payload: e.target.value })
          }
          value={"no"}
        >No</Button>
        <Button outline
          name="not-sure"
          onChange={e =>
            dispatch({ type: "VOTE_REGISTERED_CHANGE", payload: e.target.value })
          }
          value={"not-sure"}
        >Not Sure</Button>
      </Fieldset>

      <Fieldset legend={"Are you signed up to vote by mail?"}>
        <Button outline
          onChange={e =>
            dispatch({ type: "VOTE_BY_MAIL_CHANGE", payload: e.target.value })
          }
          value={"yes"}
        >Yes</Button>
        <Button outline
          onChange={e =>
            dispatch({ type: "VOTE_BY_MAIL_CHANGE", payload: e.target.value })
          }
          value={"no"}
        >No</Button>
        <Button outline
          name="not-sure"
          onChange={e =>
            dispatch({ type: "VOTE_BY_MAIL_CHANGE", payload: e.target.value })
          }
          value={"not-sure"}
        >Not Sure</Button>
      </Fieldset>
    </Form>
  );
}

export default VoteStep;