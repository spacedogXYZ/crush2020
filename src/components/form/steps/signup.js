import React from "react"

import { useAppState } from "../../../state/context"
import {
  Form,
  Fieldset,
  FormGroup,
  TextInput,
  Label,
} from "@trussworks/react-uswds"
import { GridContainer, Grid } from "@trussworks/react-uswds"

export function SignupStep() {
  const {
    state: { name, contact },
    dispatch,
  } = useAppState()

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <Fieldset legend={"Almost done!"}>
        <GridContainer>
          <FormGroup>
            <Grid row mobileLg={{ col: 8, offset: 2 }}>
              <Label htmlFor="name">Name</Label>
              <TextInput
                name="name"
                onChange={e =>
                  dispatch({ type: "NAME_CHANGE", payload: e.target.value })
                }
                value={name ? name : ""}
              />
            </Grid>
          </FormGroup>

          <FormGroup>
            <Grid row mobileLg={{ col: 8, offset: 2 }}>
              <Label htmlFor="email">Email</Label>
              <TextInput
                name="email"
                onChange={e =>
                  dispatch({ type: "EMAIL_CHANGE", payload: e.target.value })
                }
                value={contact.email ? contact.email : ""}
              />
            </Grid>
          </FormGroup>

          <FormGroup>
            <Grid row gap>
              <Grid row mobileLg={{ col: 4, offset: 2 }}>
                <Label htmlFor="twitter">Twitter (optional)</Label>
                <TextInput
                  name="twitter"
                  onChange={e =>
                    dispatch({
                      type: "TWITTER_CHANGE",
                      payload: e.target.value,
                    })
                  }
                  value={contact.twitter ? contact.twitter : ""}
                />
              </Grid>

              <Grid row mobileLg={{ col: 4 }}>
                <Label htmlFor="instagram">Instagram (optional)</Label>
                <TextInput
                  name="instagram"
                  onChange={e =>
                    dispatch({
                      type: "INSTAGRAM_CHANGE",
                      payload: e.target.value,
                    })
                  }
                  value={contact.instagram ? contact.instagram : ""}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </GridContainer>
      </Fieldset>
    </Form>
  )
}

export default SignupStep
