import React from "react"

import { Form, Fieldset } from "@trussworks/react-uswds"


import { useFormState } from "../context"
import FormButton from "../buttons"

export function IssuesStep() {
  const {
    state: { issues },
    dispatch
  } = useFormState();

  const allIssues = {
    GUN_VIOLENCE: {t: "Gun Violence", i: "exclamation-triangle"},
    ABORTION_RIGHTS: {t: "Abortion Rights", i: "hand-holding-heart"},
    ENVIRONMENT: {t: "Environment/Climate", i: "globe-americas"},
    LGBTQ: {t: "LGBTQ+", i: "plus-square"},
    VOTER_SUPPRESSION: {t: "Voter Suppression", i: "vote-yea"},
    POLICE_BRUTALITY: {t: "Police Brutality", i: "shield-alt"},
    IMMIGRATION: {t: "Immigration", i: "passport"},
    HEALTH_CARE: {t: "Health Care", i: "user-md"},
    MASS_INCARCERATION: {t: "Mass Incarceration", i: "building"},
  };

  const handleChange = issue => {
    const isSelected = issues.includes(issue);
    let payload = issues;

    if (isSelected) {
      payload = issues.filter(c => c !== issue);
    } else {
      payload = [...issues, issue];
    }

    dispatch({
      type: "ISSUES_CHANGE",
      payload
    });
  };

  return (
    <Form>
      <Fieldset legend="What issues matter most to you?">
        <div className="button-grid">
        {Object.keys(allIssues).map(issue => (
          <FormButton
            key={issue}
            text={allIssues[issue].t}
            icon={allIssues[issue].i}
            value={true}
            state={issues.includes(issue)}
            action={e => handleChange(issue)}
          />
        ))}
        </div>
      </Fieldset>
    </Form>
  );
}