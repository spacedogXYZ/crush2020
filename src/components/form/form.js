import React, { useState } from "react"
import { GridContainer, Button } from "@trussworks/react-uswds"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { VoteStep, LocationStep, IssuesStep, SkillsStep, TimeStep, MoneyStep, CommunityStep, SignupStep } from "./steps"
import { useFormState } from "./context"

function useFormProgress() {
  const [currentStep, setCurrentStep] = useState(0);

  function goForward() {
    setCurrentStep(currentStep + 1);
  }

  function goBack() {
    setCurrentStep(currentStep - 1);
  }

  return [currentStep, goForward, goBack];
}

function PlanForm() {
  const { dispatch, state } = useFormState();
  const steps = [
    <VoteStep />,
    <LocationStep />,
    <IssuesStep />,
    <SkillsStep />,
    <TimeStep />,
    <MoneyStep />,
    <CommunityStep />,
    <SignupStep />
  ];

  const [currentStep, goForward, goBack] = useFormProgress();
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  function handleSubmit() {
    dispatch({ type: "SUBMIT" });

    // Simulated network request :)
    setTimeout(() => {
      dispatch({ type: "SUBMISSION_RECEIVED" });
    }, 1500);
  }

  if (state.isSubmitLoading) {
    return (
      <div className="App">
        <p>Loading...</p>
      </div>
    );
  }

  if (state.isSubmissionReceived) {
    return (
      <div className="App">
        <h1>Thanks for your submission!</h1>
        <pre style={{ textAlign: "left" }}>
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <GridContainer className="form-container">
      {steps[currentStep]}

      <div className="nav-container">
        {!isFirst && <Button outline onClick={() => goBack()}>
          <FontAwesomeIcon icon={["fas", "arrow-left"]} />
          &nbsp;
          Back
        </Button>}

        <Button
          type="submit"
          onClick={e => {
            e.preventDefault();

            if (isLast) {
              handleSubmit();
            } else {
              goForward();
            }
          }}
        >
          {isLast ? "Done" : "Next"}
          &nbsp;
          <FontAwesomeIcon icon={["fas", isLast ? "check" :"arrow-right"]} />
        </Button>
        <div className="progress-container">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
      
    </GridContainer>
  );
}

export default PlanForm;