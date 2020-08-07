import React from "react"
import { navigate } from "gatsby"
import { Accordion, GridContainer, Grid, Card, CardHeader, CardBody, CardFooter } from "@trussworks/react-uswds"
import { Button } from "@trussworks/react-uswds"

import { joinSentence } from "../../utils/strings"

var us_states = require('us-state-codes')
var slugify = require('slugify')

export function Plan({form}) {
  console.log(form)

  if (!form || !Object.keys(form).length) {
    // no form, redirect
    if (typeof window !== `undefined`) {
      navigate('/step/')
    }
    return null;
  }
  
  let state = form.geocode.address_components.state
  let state_name = us_states.getStateNameByStateCode(state)
  let state_slug = slugify(state_name)

  let community_states = form.community.map(c => (
    us_states.getStateNameByStateCode(c)
  ))

  return (
    <Accordion items={[
    {
      id: 'ballot',
      title: 'Ballot',
      expanded: true,
      content: (
        <GridContainer>
          <Grid row>
            <Card gridLayout={{ tablet: { col: 12 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">Your voter registration</h3>
              </CardHeader>
              <CardBody>
                <p>
                  { form.registered === "yes" && (
                    <a href="https://www.voteamerica.com/am-i-registered-to-vote/"
                      className="usa-button"
                    >Confirm with {state_name}</a>
                  )}
                  { form.registered === "not-sure" ? (
                    <a href="https://www.voteamerica.com/am-i-registered-to-vote/"
                      className="usa-button"
                    >Double check with State</a>
                  ):(<></>)}
                  { form.registered === "no" && (
                    <a href="https://www.voteamerica.com/am-i-registered-to-vote/"
                      className="usa-button"
                    >Register to Vote</a>
                  )}
                  { form.vbm === "yes" && (
                    <a href={`https://www.voteamerica.com/absentee-ballot-${state_slug}/`}
                    className="usa-button bg-secondary hover:bg-secondary-dark"
                    >Sign up to Vote by Mail</a>
                  )}
                  { form.vbm === "not-sure" && (
                    <a href={`https://www.voteamerica.com/absentee-ballot-${state_slug}/#absentee-guide`}
                    className="usa-button bg-secondary hover:bg-secondary-dark"
                    >Learn more about Vote by Mail</a>
                  )}
                </p>
              </CardBody>
            </Card>
          </Grid>     

          <Grid row>
            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">US President</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  <li>Joe Biden</li>
                  <li>Donald Trump</li>
                </ul>
              </CardBody>
            </Card>

            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">US Senate</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  <li>candidates</li>
                </ul>
              </CardBody>
            </Card>

            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">US House</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  <li>candidates</li>
                </ul>
              </CardBody>
            </Card>
          </Grid>

          <Grid row>
            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">{state} Governor</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  <li>candidates</li>
                </ul>
              </CardBody>
            </Card>

            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">{state} Senate</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  <li>candidates</li>
                </ul>
              </CardBody>
            </Card>

            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">{state} House</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  <li>candidates</li>
                </ul>
              </CardBody>
            </Card>
          </Grid>
      </GridContainer>)
    },{
      id: 'time',
      title: 'Time',
      expanded: true,
      content: (
        <GridContainer>
        <Grid row>
          <Card gridLayout={{ tablet: { col: 4 } }}>
            <CardHeader>
              <h3 className="usa-card__heading">Volunteer</h3>
            </CardHeader>
            <CardBody>
              <ul>
                <li>competitive campaigns</li>
              </ul>
            </CardBody>
            <CardFooter>
              <Button type="button" className="usa-button">
                Sign up to canvass
              </Button>
            </CardFooter>
          </Card>

          <Card gridLayout={{ tablet: { col: 4 } }}>
            <CardHeader>
              <h3 className="usa-card__heading">Social Media</h3>
            </CardHeader>
            <CardBody>
              <p>
                Because you are on Instagram, we'll send you shareable graphics to repost.
              </p>
            </CardBody>
            <CardFooter>
              <Button type="button" className="usa-button">
                Follow @Crush2020
              </Button>
            </CardFooter>
          </Card>
        </Grid>
      </GridContainer>)
    },{
      id: 'money',
      title: 'Money',
      expanded: true,
      content: (
        <GridContainer>
        <Grid row>
          <Card gridLayout={{ tablet: { col: 4 } }}>
            <CardHeader>
              <h3 className="usa-card__heading">Donate</h3>
            </CardHeader>
            <CardBody>
              <p>
                Early money goes a long way. Donate to your local candidate and causes with this customized form.
              </p>
            </CardBody>
            <CardFooter>
              <Button type="button" className="usa-button">
                Give ${form.money}
              </Button>
            </CardFooter>
          </Card>
        </Grid>
        </GridContainer>
      )
    },{
      id: 'community',
      title: 'Community',
      expanded: true,
      content: (
        <GridContainer>
        <Grid row>
          <Card gridLayout={{ tablet: { col: 4 } }}>
            <CardHeader>
              <h3 className="usa-card__heading">Community</h3>
            </CardHeader>
            <CardBody>
              <p>
                Get your friends involved in {joinSentence(community_states)}, and they can make their own plan to Crush 2020.
              </p>
            </CardBody>
            <CardFooter>
              <Button type="button" className="usa-button">
                Share
              </Button>
            </CardFooter>
          </Card>
        </Grid>
        </GridContainer>
      )
    }]
  }/>)
}

export default Plan