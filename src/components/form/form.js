import React, { useState, useEffect } from "react"
import { Router, useLocation, navigate } from "@reach/router"
import { window, exists } from "browser-monads"

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

const STEPS = [
  [<VoteStep path="vote" />, state => !isEmpty(state.registered) && !isEmpty(state.vbm)],
  [<LocationStep path="location" />, state => !isEmpty(state.geocode) && !isEmpty(state.geocode.cd)],
  [
    <IssuesStep path="issues"  />,
    state => !isEmpty(state.issues) && state.issues.length <= 3,
  ],
  [
    <SkillsStep path="skills" />,
    state => !isEmpty(state.skills) && state.skills.length <= 3,
  ],
  [<TimeStep path="time" />, () => true],
  [<MoneyStep path="money" />, () => true],
  [<ReachStep path="reach" />, () => true],
  [
    <SignupStep path="signup" />,
    state => !isEmpty(state.name) && !isEmpty(state.contact.email),
  ],
]

function useFormProgress() {
  const [currentStep, setCurrentStep] = useState(0)

  function goForward() {
    let nextIndex = currentStep + 1
    setCurrentStep(nextIndex)
    let nextStep = STEPS[nextIndex]
    exists(window) && navigate(`/form/${nextStep[0].props.path}`)
  }

  function goBack() {
    let prevIndex = currentStep - 1
    if (prevIndex < 0) { return false }
    setCurrentStep(prevIndex)
    // don't actually navigate, because this is only called when by the popstate event
    // triggered by a real browser back button

    // let prevStep = STEPS[prevIndex]
    // exists(window) && navigate(`/form/${prevStep[0].props.path}`) 
  }

  return [currentStep, goForward, goBack]
}

function PlanForm() {
  const { dispatch, state } = useFormState()
  const location = useLocation()
  const [currentStep, goForward, goBack] = useFormProgress()
  const [validate, setValidate] = useState(false)

  // start at first step
  if(location.pathname === "/form/" || location.pathname === "/form") {
    exists(window) && navigate("/form/vote")
  }
  // if we are in the form, but not on the first step (without a current step)
  if(currentStep === 0 && 
    (location.pathname.split("/")[0] === "form" && location.pathname.split("/").pop() !== "vote")
  ) {
    exists(window) && navigate("/form/vote")
  }

  // make the back buttonw work as expected
  useEffect(() => {
    if(exists(window)) {
      window.addEventListener('popstate', goBack);
      // unfortunately there's no event for "pushstate"
      // so we can't make forward work as well
    }

    return function cleanup() {
      window.removeEventListener('popstate', goBack)
    }
  }, [goBack])

  const isLast = currentStep === STEPS.length - 1
  
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
      <GridContainer className="form-container" path="submit">
        <p>Loading...</p>
      </GridContainer>
    )
  }

  if (state.isSubmissionReceived && state.uid) {
    exists(window) && navigate("/plan", { state: state })
  }

  let [stepRender, stepValid] = STEPS[currentStep]
  let isValid = stepValid(state)

  return (
    <GridContainer className="form-container">
      <ProgressBar value={currentStep} max={STEPS.length - 1} />

      <Router basepath="/form">
        {stepRender}
      </Router>

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
