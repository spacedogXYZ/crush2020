import React from "react"
import { OutboundLink } from "gatsby-plugin-google-analytics"

import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardMedia,
  CardFooter,
} from "@trussworks/react-uswds"

import { firstSentence } from "../../utils/strings"

export const DonateOrg = ({ donate_org, title, pitch, onClickNext }) => {
  if(!donate_org) {
    return (<></>)
  }

  return (
  <Card gridLayout={{ tablet: { col: 4 } }}>
    <CardHeader>
      <h3 className="usa-card__heading">{title}</h3>
    </CardHeader>
    <CardBody>
      {<p>Donate to {donate_org.name} {pitch}.</p>}
      {donate_org.logo_url && (
        <CardMedia exdent>
          <OutboundLink
            href={donate_org.website}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={donate_org.logo_url}
              alt={`${donate_org.name} logo`}
            />
          </OutboundLink>
        </CardMedia>
      )}
      <p>{firstSentence(donate_org.description)}</p>
      { donate_org.hide_mvp ? (<></>) : (
      <div className="citation">
        Movement Voter Project
      </div>
      )}
    </CardBody>
    <CardFooter>
      <ButtonGroup>
      {donate_org.donation_url && (
        <OutboundLink
          href={`${donate_org.donation_url}`}
          target="_blank"
          rel="noreferrer"
        >
          <Button type="button" className="usa-button">
            Give
          </Button>
        </OutboundLink>
      )}
      <Button type="button" className="usa-button--secondary" onClick={onClickNext}>Next</Button>
      </ButtonGroup>
    </CardFooter>
  </Card>
  )
}

export const DonateCandidate = ({ donate_candidate, title, pitch, amount }) => (
  <Card gridLayout={{ tablet: { col: 4 } }}>
  <CardHeader>
    <h3 className="usa-card__heading">{title}</h3>
  </CardHeader>
  <CardBody>
    <p>
      Donate to {donate_candidate.name} {pitch}.
    </p>
    {donate_candidate.image_url && (
        <CardMedia>
          <OutboundLink
            href={donate_candidate.website}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={donate_candidate.image_url}
              alt={donate_candidate.name}
              className="very-small"
            />
          </OutboundLink>
        </CardMedia>
      )}
  </CardBody>
  <CardFooter>
    <OutboundLink
      href={`${donate_candidate.donation_url}?amount=${amount}&recurring=true`}
      target="_blank"
      rel="noreferrer"
    >
      <Button type="button" className="usa-button">
        Give ${amount} monthly
      </Button>
    </OutboundLink>
  </CardFooter>
</Card>
)
