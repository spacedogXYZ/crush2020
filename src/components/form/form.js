import React, { useState } from "react"
import { navigate } from "gatsby"
import { GridContainer, Button, ButtonGroup } from "@trussworks/react-uswds"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { nanoid } from 'nanoid'

import {
  VoteStep,
  LocationStep,
  IssuesStep,
  SkillsStep,
  TimeStep,
  MoneyStep,
  ReachStep,
  SignupStep,
} from "./steps"
import ProgressBar from "./progress"
import { useFormState } from "./context"
import { isEmpty } from "../../utils/object"

const headers = {
  "Content-Type": "application/json",
}

function useFormProgress() {
  const [currentStep, setCurrentStep] = useState(0)

  function goForward() {
    setCurrentStep(currentStep + 1)
  }

  function goBack() {
    setCurrentStep(currentStep - 1)
  }

  return [currentStep, goForward, goBack]
}

function PlanForm() {
  const { dispatch, state } = useFormState()

  // step and validation functions
  const steps = [
    [<VoteStep />, state => !isEmpty(state.registered) && !isEmpty(state.vbm)],
    [<LocationStep />, state => !isEmpty(state.geocode) && !isEmpty(state.geocode.cd)],
    [
      <IssuesStep />,
      state => !isEmpty(state.issues) && state.issues.length <= 3,
    ],
    [
      <SkillsStep />,
      state => !isEmpty(state.skills) && state.skills.length <= 3,
    ],
    [<TimeStep />, () => true],
    [<MoneyStep />, () => true],
    [<ReachStep />, () => true],
    [
      <SignupStep />,
      state => !isEmpty(state.name) && !isEmpty(state.contact.email),
    ],
  ]

  const [currentStep, goForward] = useFormProgress()
  const isLast = currentStep === steps.length - 1
  const [validate, setValidate] = useState(false)

  function handleSubmit() {
    dispatch({ type: "SUBMIT" })

    let submit = state
    submit.uid = nanoid() // create a new key for each submission
    fetch("/.netlify/functions/create-form ", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(submit),
    }).then(response => {
      return fetch("/.netlify/functions/signup ", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(submit),
      })
    })
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText)
      } else {
        dispatch({ type: "SUBMISSION_RECEIVED", payload: submit.uid})
      }
    })
    .catch(err => {
      console.error(err)
    })
  }

  if (state.isSubmitLoading) {
    return (
      <GridContainer className="form-container">
        <p>Loading...</p>
      </GridContainer>
    )
  }

  if (state.isSubmissionReceived && state.uid) {
    navigate(`/plan/${state.uid}`, { state: state })
  }

  let [stepRender, stepValid] = steps[currentStep]
  let isValid = stepValid(state)

  return (
    <GridContainer className="form-container">
      <ProgressBar value={currentStep} max={steps.length - 1} />

      {stepRender}

      <ButtonGroup className="nav-container">
        <Button
          type="submit"
          className={[
            "icon-right",
            validate && !isValid ? "usa-button--secondary" : "",
          ].join(" ")}
          onClick={e => {
            e.preventDefault()
            setValidate(true)

            if (isValid) {
              if (isLast) {
                handleSubmit()
              } else {
                setValidate(false)
                goForward()
              }
            }
          }}
        >
          {isLast ? "Done" : "Next"}
          <FontAwesomeIcon icon={["fas", isLast ? "check" : "arrow-right"]} />
        </Button>
      </ButtonGroup>
      {validate && !isValid && (
        <div className="error-container">Please select your answers</div>
      )}
    </GridContainer>
  )
}

export default PlanForm
