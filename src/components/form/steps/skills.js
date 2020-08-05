import React from "react"

import { Form, Fieldset } from "@trussworks/react-uswds"

import { useFormState } from "../context"
import FormButton from "../buttons"

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
        <div className="button-grid">
        {availableSkills.map(skill => (
          <FormButton
            key={skill}
            text={skill}
            value={true}
            state={skills.includes(skill)}
            action={e => handleChange(skill)}
          />
        ))}
        </div>
      </Fieldset>
    </Form>
  );
}