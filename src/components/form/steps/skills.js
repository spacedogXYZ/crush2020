import React from "react"

import { Form, Fieldset } from "@trussworks/react-uswds"

import { useAppState } from "../../../state/context"
import FormButton from "../buttons"

export const SKILLS_VALUES = {
  WRITING: { t: "Writing", i: "edit" },
  TEXTING: { t: "Texting", i: "comment-dots" },
  PHONE_CALLS: { t: "Chatting on the phone", i: "mobile-alt" },
  TWEETING: { t: "Tweeting", i: ["fab", "twitter-square"] },
  INSTAGRAM: { t: "Instagram", i: ["fab", "instagram"] },
  MAKING_VIDEOS: { t: "Making videos", i: "film" },
  LAWYER: { t: "I'm a lawyer", i: "balance-scale" },
  CODER: { t: "I can code", i: "code" },
  ELECTION_DAY: { t: "I can work on Election Day", i: "person-booth" },
}

export function SkillsStep() {
  const {
    state: { skills },
    dispatch,
  } = useAppState()

  const handleChange = skill => {
    const isSelected = skills.includes(skill)
    let payload = skills

    if (isSelected) {
      payload = skills.filter(c => c !== skill)
    } else {
      if (skills.length < 3) {
        payload = [...skills, skill]
      }
    }

    dispatch({
      type: "SKILLS_CHANGE",
      payload,
    })
  }

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <Fieldset legend="What are your skills?">
        <div className="button-grid">
          {Object.keys(SKILLS_VALUES).map(skill => (
            <FormButton
              key={skill}
              text={SKILLS_VALUES[skill].t}
              icon={SKILLS_VALUES[skill].i}
              value={true}
              state={skills.includes(skill)}
              action={e => handleChange(skill)}
            />
          ))}
        </div>
        <label htmlFor="button-grid">Choose up to 3</label>
      </Fieldset>
    </Form>
  )
}
