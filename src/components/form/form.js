import React, { useState, useEffect } from "react"
import { Router, useLocation, navigate } from "@reach/router"
import { window, exists } from "browser-monads"
import "url-search-params-polyfill"

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
import { useAppState } from "../../state/context"
import { isEmpty } from "../../utils/object"

const headers = {
  "Content-Type": "application/json",
}

const STEPS = [
  [<VoteStep path="vote" key="vote" />, state => !isEmpty(state.registered) && !isEmpty(state.vbm)],
  [<LocationStep path="location" key="location" />, state => !isEmpty(state.geocode),
    "Please select a location from the drop-down. Be specific, so we can find your voting district."
  ],
  [
    <IssuesStep path="issues" key="issues" />,
    state => !isEmpty(state.issues) && state.issues.length <= 3,
    "Please select between one and three issues."
  ],
  [
    <SkillsStep path="skills" key="skills" />,
    state => !isEmpty(state.skills) && state.skills.length <= 3,
    "Please select between one and three skills."
  ],
  [<TimeStep path="time" key="time" />, () => true],
  [<MoneyStep path="money" key="money" />, () => true],
  [<ReachStep path="reach" key="reach" />, () => true],
  [
    <SignupStep path="signup" key="signup" />,
    state => !isEmpty(state.name) && !isEmpty(state.contact.email) && state.contact.email.includes("@"),
    "Please enter your name and email, so we can contact you about your plan."
  ],
]

function useFormProgress() {
  function goForward(currentStep, dispatch) {
    let nextIndex = currentStep + 1
    dispatch({ type: "STEP_CHANGE", payload: nextIndex})
    let nextStep = STEPS[nextIndex]
    exists(window) && navigate(`/form/${nextStep[0].props.path}`)
  }

  function goBack(currentStep, dispatch) {
    let prevIndex = currentStep - 1
    if (prevIndex < 0) { return false }
    dispatch({ type: "STEP_CHANGE", payload: prevIndex})
    // don't actually navigate, because this is only called when by the popstate event
    // triggered by a real browser back button

    // let prevStep = STEPS[prevIndex]
    // exists(window) && navigate(`/form/${prevStep[0].props.path}`) 
  }

  return [goForward, goBack]
}

function PlanForm() {
  const {state, dispatch} = useAppState()
  const location = useLocation()
  const [goForward, goBack] = useFormProgress()
  const [validate, setValidate] = useState(false)

  const currentStep = state.step
  const isLast = currentStep === STEPS.length - 1

  // start at first step
  if(location.pathname === "/form/" || location.pathname === "/form") {
    exists(window) && navigate("/form/vote")
  }
  // if we are in the form, but the url doesn't match
  if(currentStep !== 0) {
    let stepPath = STEPS[currentStep][0].props.path
    if (state.uid) {
      // we already have a plan
      exists(window) && navigate('/plan/')
    }
    if (location.pathname !== `/form/${stepPath}`) {
      exists(window) && navigate(`/form/${stepPath}`)
      // redirect to correct path
    }
  }

  // make the back button work as expected
  useEffect(() => {
    let triggerBack = () => goBack(currentStep, dispatch)

    if(exists(window)) {
      window.addEventListener('popstate', triggerBack)
      // unfortunately there's no event for "pushstate"
      // so we can't make forward work as well
    }

    return function cleanup() {
      window.removeEventListener('popstate', triggerBack)
    }
  }, [currentStep, dispatch, goBack])

  useEffect(() => {
    // capture source from url param
    if (location.search && !state.source) {
      let urlParams = new URLSearchParams(location.search)
      dispatch({ type: "SOURCE_CHANGE", payload: urlParams.get('source')})
    }
  })
  
  function handleSubmit() {
    dispatch({ type: "SUBMIT" })

    let submit = state
    submit.uid = nanoid() // create a new key for each submission
    fetch("/.netlify/functions/create-form ", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(submit),
    }).then(response => {
      if (!response.ok) {
        dispatch({ type: "SUBMISSION_RECEIVED", payload: false})
        throw Error(response.statusText)
      } else {
        dispatch({ type: "SUBMISSION_RECEIVED", payload: submit.uid})
      }
    }).then(response => {
      return fetch("/.netlify/functions/signup ", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(submit),
      })
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

  if (state.isSubmissionReceived) {
    exists(window) && navigate("/plan")
  }

  // eslint-disable-next-line no-unused-vars
  let [stepRender, stepValid, stepError] = STEPS[currentStep]
  let isValid = stepValid(state)

  return (
    <GridContainer className="form-container">
      <ProgressBar value={currentStep} max={STEPS.length - 1} />

      <Router basepath="/form">
        { STEPS.map(([stepRender]) => stepRender) }
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
                goForward(currentStep, dispatch)
              }
            }
          }}
        >
          {isLast ? "Done" : "Next"}
          <FontAwesomeIcon icon={["fas", isLast ? "check" : "arrow-right"]} />
        </Button>
      </ButtonGroup>
      {validate && !isValid && (
        <div className="error-container">
          {stepError ? stepError : "Please select your answers"}
        </div>
      )}
    </GridContainer>
  )
}

export default PlanForm
