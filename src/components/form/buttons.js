import React from "react";
import { Button } from "@trussworks/react-uswds"

const FormButton = ({ text, value, state, action }) => (
  <Button
      type="button"
      onClick={action}
      {...(state === value? {outline: false} : {outline: true})}
      value={value}
    >{text}
  </Button>
)

export default FormButton