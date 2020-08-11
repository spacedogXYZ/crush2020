import React, { useState } from "react"
import { navigate } from "gatsby"
import { GridContainer, Button, ButtonGroup } from "@trussworks/react-uswds"
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
      <GridContainer className="form-container">
        <p>Loading...</p>
      </GridContainer>
    );
  }

  if (state.isSubmissionReceived) {
    navigate('/plan/', { state: state });
  }

  return (
    <GridContainer className="form-container">
      {steps[currentStep]}

      <ButtonGroup className="nav-container">
        {!isFirst && (
          <Button className="icon-left" outline onClick={() => goBack()}>
            <FontAwesomeIcon icon={["fas", "arrow-left"]} />
            Back
          </Button>
        )}

        <Button
          type="submit"
          className="icon-right"
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
          <FontAwesomeIcon icon={["fas", isLast ? "check" :"arrow-right"]} />
        </Button>
      </ButtonGroup>
      <div className="progress-container">
        Step {currentStep + 1} of {steps.length}
      </div>
      
    </GridContainer>
  );
}

export default PlanForm;