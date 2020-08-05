import React from "react"

import { Form, Fieldset } from "@trussworks/react-uswds"

import { useFormState } from "../context"
import FormButton from "../buttons"

export function IssuesStep() {
  const {
    state: { issues },
    dispatch
  } = useFormState();

  const availableIssues = [
    "Gun Violence",
    "Abortion Rights",
    "Climate Change",
    "LGBTQ+ Issues",
    "Corruption",
    "Police Brutality",
    "Immigration",
    "Health Care",
    "Mass Incarceration"
  ];

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
      <Fieldset legend="What issues do you care most about?">
        <div className="button-grid">
        {availableIssues.map(issue => (
          <FormButton
            key={issue}
            text={issue}
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