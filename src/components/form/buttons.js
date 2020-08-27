import React from "react"
import { Button } from "@trussworks/react-uswds"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const FormButton = ({ text, icon, iconSize, value, state, action }) => (
  <Button
    type="button"
    className="icon-left"
    onClick={action}
    {...(state === value ? { outline: false } : { outline: true })}
    value={value}
  >
    {icon && <FontAwesomeIcon icon={icon} size={iconSize || "1x"} />}
    {text}
  </Button>
)

export default FormButton
