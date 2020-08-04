import React from "react"

import { Form, Fieldset, Button } from "@trussworks/react-uswds"
import { useFormState } from "../context"

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
      {availableIssues.map(issue => (
        <Button outline key={issue} label={issue} name={issue}>
          <input
            name={issue}
            id={issue}
            value={issue}
            onChange={() => handleChange(issue)}
            checked={issues.includes(issue)}
          />
        </Button>
      ))}
      </Fieldset>
    </Form>
  );
}