import React from "react"

import { Form, Fieldset } from "@trussworks/react-uswds"

import { useAppState } from "../../../state/context"
import FormButton from "../buttons"

export function VoteStep() {
  const {
    state: { registered, vbm },
    dispatch,
  } = useAppState()

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <Fieldset legend={"Are you registered to vote?"}>
        <FormButton
          text="Yes"
          value="yes"
          state={registered}
          action={e =>
            dispatch({ type: "VOTE_REGISTERED_CHANGE", payload: "yes" })
          }
        />
        <FormButton
          text="No"
          value="no"
          state={registered}
          action={e =>
            dispatch({ type: "VOTE_REGISTERED_CHANGE", payload: "no" })
          }
        />
        <FormButton
          text="Not Sure"
          value="not-sure"
          state={registered}
          action={e =>
            dispatch({ type: "VOTE_REGISTERED_CHANGE", payload: "not-sure" })
          }
        />
      </Fieldset>

      <Fieldset legend={"Would you like to vote by mail?"}>
        <FormButton
          text="Yes"
          value="yes"
          state={vbm}
          action={e =>
            dispatch({ type: "VOTE_BY_MAIL_CHANGE", payload: "yes" })
          }
        />
        <FormButton
          text="No"
          value="no"
          state={vbm}
          action={e => dispatch({ type: "VOTE_BY_MAIL_CHANGE", payload: "no" })}
        />
        <FormButton
          text="Not Sure"
          value="not-sure"
          state={vbm}
          action={e =>
            dispatch({ type: "VOTE_BY_MAIL_CHANGE", payload: "not-sure" })
          }
        />
      </Fieldset>
    </Form>
  )
}

export default VoteStep
