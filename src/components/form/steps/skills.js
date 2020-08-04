import React from "react"

import { Form, Fieldset, Button } from "@trussworks/react-uswds"
import { useFormState } from "../context"

export function SkillsStep() {
  const {
    state: { skills },
    dispatch
  } = useFormState();

  const availableSkills = [
    "Writing",
    "Texting",
    "Chatting on the phone",
    "Tweeting",
    "Making videos",
    "Instagram",
    "I'm a lawyer",
    "I can code",
    "I'm bilingual"
  ];

  const handleChange = skill => {
    const isSelected = skills.includes(skill);
    let payload = skill;

    if (isSelected) {
      payload = skills.filter(c => c !== skill);
    } else {
      payload = [...skills, skill];
    }

    dispatch({
      type: "SKILLS_CHANGE",
      payload
    });
  };

  return (
    <Form>
      <Fieldset legend="What are your skills?">
      {availableSkills.map(skill => (
        <Button outline key={skill} label={skill} name={skill}>
          <input
            name={skill}
            id={skill}
            value={skill}
            onChange={() => handleChange(skill)}
            checked={skills.includes(skill)}
          />
        </Button>
      ))}
      </Fieldset>
    </Form>
  );
}