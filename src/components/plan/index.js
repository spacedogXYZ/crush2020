import React from "react"
import { navigate } from "gatsby"
import { Accordion, GridContainer, Grid, Card, CardHeader, CardBody, CardFooter } from "@trussworks/react-uswds"
import { Button, ButtonGroup } from "@trussworks/react-uswds"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { joinSentence, padCode, unpadCode, parseName, isCompetitive, isLikely } from "../../utils/strings"
import { isEmpty } from "../../utils/object"
import { TIME_VALUES } from "../form/steps/time"

var us_states = require('us-state-codes')
var slugify = require('slugify')

export function Plan({form, candidates, ratings, volunteer, donate}) {
  if (!form || !Object.keys(form).length) {
    // no form, redirect
    if (typeof window !== `undefined`) {
      navigate('/step/')
    }
    return null;
  }
  
  const state = form.geocode.state
  const state_name = us_states.getStateNameByStateCode(state)
  const state_slug = slugify(state_name).toLowerCase()

  const reach_states = form.reach.map(c => (
    us_states.getStateNameByStateCode(c)
  ))

  const senate_candidates = candidates.federal.filter(c => (
    c.CAND_OFFICE_ST === state &&
    c.CAND_OFFICE_DISTRICT === "00"
  )).sort((a, b) => (a.TTL_RECEIPTS < b.TTL_RECEIPTS))
  .slice(0,2)

  const congressional_district = form.geocode.cd
  const congressional_district_code = padCode(congressional_district)
  const house_candidates = candidates.federal.filter(c => (
    c.CAND_OFFICE_ST === state &&
    c.CAND_OFFICE_DISTRICT === congressional_district_code
  )).sort((a, b) => (a.TTL_RECEIPTS < b.TTL_RECEIPTS))
  .slice(0,2)
  // we don't actually have primary win/loss records from FEC
  // so sort by amount raised and pick top two

  const governor_candidates = candidates.statewide.filter(c => (
    c.Election_Jurisdiction === state &&
    c.Office_Sought.startsWith("GOVERNOR")
  )).sort((a, b) => (a.Total__ < b.Total__))
  const state_sos_candidates = candidates.statewide.filter(c => (
    c.Election_Jurisdiction === state &&
    c.Office_Sought === "SECRETARY OF STATE"
  )).sort((a, b) => (a.Total__ < b.Total__))
  const state_ag_candidates = candidates.statewide.filter(c => (
    c.Election_Jurisdiction === state &&
    c.Office_Sought === "ATTORNEY GENERAL"
  )).sort((a, b) => (a.Total__ < b.Total__))
  // we do have win/loss from FollowTheMoney
  // and have already filtered by it
  // keep sorted to put more likely candidates at the top

  const senate_rating = ratings.senate.find(r => (r.state === state))
  const house_rating = ratings.house.find(r => (r.district === `${state}-${congressional_district_code}`))
  const governor_rating = ratings.governor.find(r => (r.state === state))
  const state_senate_rating = ratings.state_legislature.find(r => (r.state === state && r.chamber === "upper"))
  const state_house_rating = ratings.state_legislature.find(r => (r.state === state && r.chamber === "lower"))

  // volunteer links
  const volunteer_senate = volunteer.mobilize.filter(o => (o.state === state && o.race_type === "SENATE"))
  const volunteer_house = volunteer.mobilize.filter(o => (
    o.state === state && o.race_type === "CONGRESSIONAL" && o.district === unpadCode(congressional_district_code))
  )
  const volunteer_gov = volunteer.mobilize.filter(o => (o.state === state && o.race_type === "GOVERNOR"))
  // senate first, then house, then gov, then presidential
  const volunteer_link =
    senate_rating && volunteer_senate ? volunteer_senate[0] :
    house_rating && volunteer_house   ? volunteer_house[0]  : 
    governor_rating && volunteer_gov   ? volunteer_gov[0]  : 
      {name: "2020 Victory", event_feed_url : 'https://www.mobilize.us/2020victory/'};
  const volunteer_time = form.time ? TIME_VALUES[form.time] : 'in other ways';

  // donate links
  const donate_senate = donate.actblue.filter(e => (e.state === state && e.district === "Sen"))
  const donate_house = donate.actblue.filter(e => (
    e.state === state && e.district === congressional_district_code)
  )
  const donate_gov = donate.actblue.filter(e => (e.state === state && e.district === "Gov"))
  // senate first, then house, then gov, then presidential
  const donate_link = 
    senate_rating && donate_senate ? donate_senate[0] :
    house_rating && donate_house   ? donate_house[0]  :
    governor_rating && donate_gov  ? donate_gov[0] :
      {name: "Biden 2020", donation_url: 'https://secure.actblue.com/donate/biden2020'};

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
                  { (form.registered === "no" || isEmpty(form.registered)) && (
                    <a href="https://www.voteamerica.com/register-to-vote/"
                      className="usa-button"
                    >Register to Vote</a>
                  )}
                  { form.vbm === "yes" && (
                    <a href={`https://www.voteamerica.com/absentee-ballot-${state_slug}/`}
                    className="usa-button bg-secondary hover:bg-secondary-dark"
                    >{state_name} Vote by Mail Application</a>
                  )}
                  { (form.vbm === "not-sure" || isEmpty(form.vbm)) && (
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

            { !isEmpty(senate_rating) && (
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

            { !isEmpty(house_rating) && (
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

            { !isEmpty(governor_rating) && (
            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">{state} Governor</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  {governor_candidates.map(c => (
                    <li key={c.Candidate}>{parseName(c.Candidate)} ({c.Specific_Party.slice(0,1)})</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
            )}

            { !isEmpty(state_sos_candidates) && (
            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">{state} Secretary of State</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  {state_sos_candidates.map(c => (
                    <li key={c.Candidate}>{parseName(c.Candidate)} ({c.Specific_Party.slice(0,1)})</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
            )}

            { !isEmpty(state_ag_candidates) && (
            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <h3 className="usa-card__heading">{state} Attorney General</h3>
              </CardHeader>
              <CardBody>
                <ul>
                  {state_ag_candidates.map(c => (
                    <li key={c.Candidate}>{parseName(c.Candidate)} ({c.Specific_Party.slice(0,1)})</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
            )}

            { !isEmpty(state_senate_rating) && (
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

            { !isEmpty(state_house_rating) && (
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
                { senate_rating && (isCompetitive(senate_rating.rating) || isLikely(senate_rating.rating)) && (
                  volunteer_senate ? (
                      <li>Volunteer with {volunteer_senate[0].name} {volunteer_time}.</li>
                  ) : (
                      <li>Volunteer with {senate_candidates.find(c => (c.CAND_PTY_AFFILIATION.startsWith("D")))}</li>
                  )
                )}

                { house_rating && (isCompetitive(house_rating.rating) || isLikely(house_rating.rating)) && (
                  volunteer_house ? (
                      <li>Volunteer with {volunteer_house[0].name} {volunteer_time}.</li>
                  ) : (
                      <li>Volunteer with {house_candidates.find(c => (c.CAND_PTY_AFFILIATION.startsWith("D")))}</li>
                  )
                )}

                { governor_rating && (isCompetitive(governor_rating.rating) || isLikely(governor_rating.rating)) && (
                  volunteer_gov ? (
                      <li>Volunteer with {volunteer_gov[0].name} {volunteer_time}.</li>
                  ) : (
                      <li>Volunteer with {governor_candidates.find(c => (c.CAND_PTY_AFFILIATION.startsWith("D")))}</li>
                  )
                )}

                { !house_rating && !senate_rating && (
                  <li>Volunteer with 2020 Victory</li>
                )}
              </ul>
            </CardBody>
            <CardFooter>
              <a href={volunteer_link.event_feed_url} target="_blank" rel="noreferrer">
                <Button type="button" className="usa-button">
                  Volunteer Virtually
                </Button>
              </a>
            </CardFooter>
          </Card>

          <Card gridLayout={{ tablet: { col: 4 } }}>
            <CardHeader>
              <h3 className="usa-card__heading">Social Media</h3>
            </CardHeader>
            <CardBody>
              { form.contact.instagram && (<>
                <p>
                    Because you are on Instagram, we'll send you shareable graphics to repost.
                </p>
                <a href="https://www.instagram.com/crush2020election/" target="_blank" rel="noreferrer">
                  <Button type="button" className="usa-button">
                    Follow @Crush2020Election
                  </Button>
                </a>
              </>)}
              { form.contact.twitter && (<>
              <p>
                  Because you are on Twitter, we'll send you great content to repost.
              </p>
              <a href="https://twitter.com/intent/follow?screen_name=crush2020_" target="_blank" rel="noreferrer">
                <Button type="button" className="usa-button">
                  Follow @Crush2020_
                </Button>
              </a>
              </>)}
              { !form.contact.twitter && !form.contact.instagram && (
                <p>
                  We'll send you great content via email. Share with your friends!
              </p>
              )}
            </CardBody>
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
                Donate to {donate_link.name} monthly through the election.
              </p>
            </CardBody>
            <CardFooter>
              <a href={`${donate_link.donation_url}?amount=${form.money}&recurring=true`} target="_blank" rel="noreferrer">
                <Button type="button" className="usa-button">
                  Give ${form.money}
                </Button>
              </a>
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
                Get your friends involved in {joinSentence(reach_states)}, and they can make their own plan to Crush 2020.
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