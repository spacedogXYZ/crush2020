import React from "react"
import { navigate } from "gatsby"
import { Accordion, GridContainer, Grid, Card, CardHeader, CardBody, CardFooter } from "@trussworks/react-uswds"
import { Button, ButtonGroup } from "@trussworks/react-uswds"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { joinSentence, padCode, unpadCode, parseName, isCompetitive } from "../../utils/strings"

var us_states = require('us-state-codes')
var slugify = require('slugify')

export function Plan({form, candidates, ratings, volunteer}) {
  if (!form || !Object.keys(form).length) {
    // no form, redirect
    if (typeof window !== `undefined`) {
      navigate('/step/')
    }
    return null;
  }
  
  const state = form.geocode.address_components.state
  const state_name = us_states.getStateNameByStateCode(state)
  const state_slug = slugify(state_name).toLowerCase()

  const community_states = form.community.map(c => (
    us_states.getStateNameByStateCode(c)
  ))

  const senate_candidates = candidates.federal.filter(c => (
    c.CAND_OFFICE_ST === state &&
    c.CAND_OFFICE_DISTRICT === "00"
  )).sort((a, b) => (a.TTL_RECEIPTS < b.TTL_RECEIPTS))
  .slice(0,2)

  const congressional_district = form.geocode.fields.congressional_districts[0]
  const congressional_district_code = padCode(congressional_district.district_number)
  let house_candidates = candidates.federal.filter(c => (
    c.CAND_OFFICE_ST === state &&
    c.CAND_OFFICE_DISTRICT === congressional_district_code
  )).sort((a, b) => (a.TTL_RECEIPTS < b.TTL_RECEIPTS))
  .slice(0,2)
  // we don't actually have primary win/loss records
  // so sort by amount raised and pick top two

  const senate_rating = ratings.senate.find(r => (r.state === state))
  const house_rating = ratings.house.find(r => (r.district === `${state}-${congressional_district_code}`))
  const governor_rating = ratings.governor.find(r => (r.state === state))
  const state_senate_rating = ratings.state_legislature.find(r => (r.state === state && r.chamber === "upper"))
  const state_house_rating = ratings.state_legislature.find(r => (r.state === state && r.chamber === "lower"))

  const volunteer_senate = volunteer.mobilize.filter(o => (o.state === state && o.race_type === "SENATE"))
  const volunteer_house = volunteer.mobilize.filter(o => (
    o.state === state && o.race_type === "CONGRESSIONAL" && o.district === unpadCode(congressional_district_code))
  )

  // highest priority volunteer link
  // senate first, then house, then org
  const volunteer_link =
    senate_rating && volunteer_senate ? volunteer_senate[0].event_feed_url :
    house_rating && volunteer_house   ? volunteer_house[0].event_feed_url  : 
                      'https://matched-organization.link';

  return (
    <Accordion items={[
    {
      id: 'ballot',
      title: (<><FontAwesomeIcon icon={["fas", "vote-yea"]} />&nbsp;Ballot</>),
      expanded: true,
      content: (
        <GridContainer>
          <Grid row>
            <Card gridLayout={{ tablet: { col: 12 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">Your voter registration</h3>
              </CardHeader>
              <CardBody>
                <ButtonGroup>
                  { form.registered === "yes" && (
                    <a href="https://www.voteamerica.com/am-i-registered-to-vote/"
                      className="usa-button"
                    >Confirm with {state_name}</a>
                  )}
                  { form.registered === "not-sure" ? (
                    <a href="https://www.voteamerica.com/am-i-registered-to-vote/"
                      className="usa-button"
                    >Double check with {state_name}</a>
                  ):(<></>)}
                  { form.registered === "no" && (
                    <a href="https://www.voteamerica.com/register-to-vote/"
                      className="usa-button"
                    >Register to Vote</a>
                  )}
                  { form.vbm === "yes" && (
                    <a href={`https://www.voteamerica.com/absentee-ballot-${state_slug}/`}
                    className="usa-button bg-secondary hover:bg-secondary-dark"
                    >{state_name} Vote by Mail Application</a>
                  )}
                  { form.vbm === "not-sure" && (
                    <a href={`https://www.voteamerica.com/absentee-ballot-${state_slug}/#absentee-guide`}
                    className="usa-button bg-secondary hover:bg-secondary-dark"
                    >Learn about Vote by Mail in {state_name}</a>
                  )}
                </ButtonGroup>
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
                  <li>Joe Biden &amp; Kamala Harris (D)</li>
                  <li>Donald Trump &amp; Mike Pence (R)</li>
                </ul>
              </CardBody>
            </Card>

            { senate_rating && (
            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">US Senate</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  {senate_candidates.map(c => (
                    <li key={c.CAND_ID}>{parseName(c.CAND_NAME)} ({c.CAND_PTY_AFFILIATION.slice(0,1)})</li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter>
                  Current rating: {senate_rating.rating}
                  <div className="rating-source">
                    Cook Political: {senate_rating.updated}
                  </div>
                </CardFooter>
            </Card>
            )}

            { house_rating && (
            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">US House</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  {house_candidates.map(c => (
                    <li key={c.CAND_ID}>{parseName(c.CAND_NAME)} ({c.CAND_PTY_AFFILIATION.slice(0,1)})</li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter>
                Current rating: {house_rating.rating}
                <div className="rating-source">
                  Cook Political: {house_rating.updated}
                </div>
              </CardFooter>
            </Card>
            )}

            { governor_rating && (
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
            )}

            { state_senate_rating && (
            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">{state} Senate</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  <li>{state_senate_rating.seats_up} seats are up</li>
                  <li>Current margin: {state_senate_rating.margin}</li>
                </ul>
              </CardBody>
            </Card>
            )}

            { state_house_rating && (
            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">{state} House</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  <li>{state_house_rating.seats_up} seats are up</li>
                  <li>Current margin: {state_house_rating.margin}</li>
                </ul>
              </CardBody>
            </Card>
            )}
          </Grid>
      </GridContainer>)
    },{
      id: 'time',
      title: (<><FontAwesomeIcon icon={["fas", "calendar-alt"]}/>&nbsp;Time</>),
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
                { senate_rating && isCompetitive(senate_rating.rating) && (
                  volunteer_senate ? (
                      <li>Volunteer with {volunteer_senate[0].name}</li>
                  ) : (
                      <li>Volunteer with {senate_candidates.find(c => (c.CAND_PTY_AFFILIATION.startsWith("D")))}</li>
                  )
                )}

                { house_rating && isCompetitive(house_rating.rating) && (
                  volunteer_house ? (
                      <li>Volunteer with {volunteer_house[0].name}</li>
                  ) : (
                      <li>Volunteer with {house_candidates.find(c => (c.CAND_PTY_AFFILIATION.startsWith("D")))}</li>
                  )
                )}
              </ul>
            </CardBody>
            <CardFooter>
              <a href={volunteer_link}>
                <Button type="button" className="usa-button">
                  Sign up to canvass
                </Button>
              </a>
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
      title: (<><FontAwesomeIcon icon={["fas", "money-bill-wave"]} />&nbsp;Money</>),
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
      id: 'reach',
      title: <><FontAwesomeIcon icon={["fas", "users"]}/>&nbsp;Reach</>,
      expanded: true,
      content: (
        <GridContainer>
        <Grid row>
          <Card gridLayout={{ tablet: { col: 4 } }}>
            <CardHeader>
              <h3 className="usa-card__heading">Reach</h3>
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