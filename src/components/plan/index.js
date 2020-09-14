import React, { useState } from "react"
import { OutboundLink } from "gatsby-plugin-google-analytics"

import {
  Accordion,
  GridContainer,
  Grid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@trussworks/react-uswds"
import { Button, ButtonGroup } from "@trussworks/react-uswds"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { parseName, capitalize, isCompetitive } from "../../utils/strings"
import { isEmpty } from "../../utils/object"
import { stateLegDistrict } from "../../utils/geography"

import { DonateCandidate, DonateOrg } from "./donate"

var us_states = require("us-state-codes")
var slugify = require("slugify")

const Candidate = ({ data }) => (
  <li key={data.CAND_ID}>
    {parseName(data.CAND_NAME)} ({data.CAND_PTY_AFFILIATION.slice(0, 1)})
  </li>
)
const StateCandidate = ({ data }) => (
  <li key={data.Candidate}>
    {parseName(data.Candidate)} ({data.Specific_Party.slice(0, 1)})
  </li>
)


export function Plan({ form, plan }) {
  const [donateOrgLocal, setDonateOrgLocal] = useState(0)
  const [donateOrgNational, setDonateOrgNational] = useState(0)

  if (
    !form ||
    !Object.keys(form).length ||
    !plan ||
    !Object.keys(plan).length
  ) {
    return (
      <GridContainer className="form-container">
        <p>Loading...</p>
      </GridContainer>
    )
  }

  const state = form.geocode.state
  const state_name = us_states.getStateNameByStateCode(state)
  const state_slug = slugify(state_name).toLowerCase()

  var reg_deadline, vbm_deadline
  if (plan.ballot.vote['external_tool_ovr'] !== "") {
    reg_deadline = plan.ballot.vote['2020_registration_deadline_online'].replace('received', '')
  } else {
    reg_deadline = plan.ballot.vote['2020_registration_deadline_by_mail'].replace('received', '')
  }
  vbm_deadline = plan.ballot.vote['2020_vbm_request_deadline_online'].replace('received', '').replace('N/A', '')

  function nextOrg(list, current, set) {
    let next = current + 1
    if (next >= list.length) {
      // loop around
      next = 0
    }
    set(next)
  }

  return (<>
    <GridContainer>
      <h2>Here's a personalized plan to crush the election with your Ballot, Time, Money &amp; Reach</h2>
      <p>Don't worry, we'll also email you updates as we get close to Election Day.</p>
    </GridContainer>
    <Accordion
      items={[
        {
          id: "ballot",
          title: (
            <>
              <FontAwesomeIcon icon={["fas", "vote-yea"]} />
              &nbsp;Ballot
            </>
          ),
          expanded: true,
          content: (
            <GridContainer>
              <Grid row>
                <Card gridLayout={{ tablet: { col: 12 } }}>
                  <CardHeader>
                    <h3 className="usa-card__heading">
                      Your voter registration
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <ButtonGroup>
                      {form.registered === "yes" && (<>
                        <OutboundLink
                          href={`https://www.voteamerica.com/am-i-registered-to-vote/?address1=${form.geocode.line1}&city=${form.geocode.city}&state=${state}&zipcode=${form.geocode.zip}&email=${form.contact.email}`}
                          className="usa-button"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Confirm with {state_name} {reg_deadline}
                        </OutboundLink>
                      </>)}
                      {form.registered === "not-sure" ? (
                        <OutboundLink
                          href={`https://www.voteamerica.com/am-i-registered-to-vote/?address1=${form.geocode.line1}&city=${form.geocode.city}&state=${state}&zipcode=${form.geocode.zip}&email=${form.contact.email}`}
                          className="usa-button"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Double check with {state_name} {reg_deadline}
                        </OutboundLink>
                      ) : (
                        <></>
                      )}
                      {(form.registered === "no" ||
                        isEmpty(form.registered)) && (
                        <OutboundLink
                          href={`https://www.voteamerica.com/register-to-vote/?address1=${form.geocode.line1}&city=${form.geocode.city}&state=${state}&zipcode=${form.geocode.zip}&email=${form.contact.email}`}
                          className="usa-button"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Register to Vote {reg_deadline}
                        </OutboundLink>
                      )}
                      {(form.vbm === "yes" && (
                        plan.ballot.vote['vbm_universal'] === "True" ? (
                          <OutboundLink
                            href={plan.ballot.vote['official_info_vbm']}
                            className="usa-button bg-secondary hover:bg-secondary-dark"
                            target="_blank"
                            rel="noreferrer"
                          >All registered {state_name} residents can vote by mail</OutboundLink>
                          ) : (
                          <OutboundLink
                            href={`https://www.voteamerica.com/absentee-ballot-${state_slug}/`}
                            className="usa-button bg-secondary hover:bg-secondary-dark"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Apply to Vote by Mail in {state} {vbm_deadline}
                          </OutboundLink>
                        ))
                      )}
                      {(form.vbm === "not-sure" || isEmpty(form.vbm)) && (
                        <OutboundLink
                          href={`https://www.voteamerica.com/absentee-ballot-${state_slug}/#absentee-guide`}
                          className="usa-button bg-secondary hover:bg-secondary-dark"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Learn about Vote by Mail in {state_name}
                        </OutboundLink>
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

                {!isEmpty(plan.ballot.senate_rating) && (
                  <Card gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">US Senate</h3>
                    </CardHeader>
                    <CardBody>
                      <ul>
                        {plan.ballot.senate_candidates.map(c => (
                          <Candidate key={c.CAND_ID} data={c} />
                        ))}
                      </ul>
                    </CardBody>
                    <CardFooter>
                      Current rating: {plan.ballot.senate_rating.rating}
                      <div className="citation">
                        Cook Political {plan.ballot.senate_rating.updated}
                      </div>
                    </CardFooter>
                  </Card>
                )}

                {!isEmpty(plan.ballot.house_rating) && (
                  <Card gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">US House {state}-{form.geocode.cd}</h3>
                    </CardHeader>
                    <CardBody>
                      <ul>
                        {plan.ballot.house_candidates.map(c => (
                          <Candidate key={c.CAND_ID} data={c} />
                        ))}
                      </ul>
                    </CardBody>
                    { isCompetitive(plan.ballot.house_rating.rating) && (
                    <CardFooter>
                      Current rating: {plan.ballot.house_rating.rating}
                      <div className="citation">
                        Cook Political {plan.ballot.house_rating.updated}
                      </div>
                    </CardFooter>
                    )}
                  </Card>
                )}

                {!isEmpty(plan.ballot.governor_rating) && (
                  <Card gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">{state} Governor</h3>
                    </CardHeader>
                    <CardBody>
                      <ul>
                        {plan.ballot.governor_candidates.map(c => (
                          <StateCandidate key={c.Candidate} data={c} />
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                )}

                {!isEmpty(plan.ballot.state_sos_candidates) && (
                  <Card gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">
                        {state} Secretary of State
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <ul>
                        {plan.ballot.state_sos_candidates.map(c => (
                          <StateCandidate key={c.Candidate} data={c} />
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                )}

                {!isEmpty(plan.ballot.state_ag_candidates) && (
                  <Card gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">
                        {state} Attorney General
                      </h3>
                    </CardHeader>
                    <CardBody>
                      <ul>
                        {plan.ballot.state_ag_candidates.map(c => (
                          <StateCandidate key={c.Candidate} data={c} />
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                )}

               {!isEmpty(plan.ballot.state_senate_candidates) && (
                  <Card gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">{state} State {stateLegDistrict(state, 'UPPER', form.geocode.state_upper)}</h3>
                    </CardHeader>
                    <CardBody>
                      <ul>
                        {plan.ballot.state_senate_candidates.map(c => (
                          <StateCandidate key={c.Candidate} data={c} />
                        ))}
                      </ul>
                    </CardBody>
                    {/*<CardFooter>
                      <div className="citation">
                        Ballotpedia Battleground
                      </div>
                    </CardFooter>*/}
                  </Card>
                )}

                {!isEmpty(plan.ballot.state_house_candidates) && (
                  <Card gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">{state} State {stateLegDistrict(state, 'LOWER', form.geocode.state_lower)}</h3>
                    </CardHeader>
                    <CardBody>
                      <ul>
                        {plan.ballot.state_house_candidates.map(c => (
                          <StateCandidate key={c.Candidate} data={c} />
                        ))}
                      </ul>
                    </CardBody>
                    {/*<CardFooter>
                      <div className="citation">
                        Ballotpedia Battleground
                      </div>
                    </CardFooter>*/}
                  </Card>
                )}
              </Grid>
            </GridContainer>
          ),
        },
        {
          id: "time",
          title: (
            <>
              <FontAwesomeIcon icon={["fas", "calendar-alt"]} />
              &nbsp;Time
            </>
          ),
          expanded: true,
          content: (
            <GridContainer>
              <Grid row>
                <Card gridLayout={{ tablet: { col: 4 } }}>
                  <CardHeader>
                    <h3 className="usa-card__heading">Volunteer</h3>
                  </CardHeader>
                  <CardBody>
                    <p>
                      Volunteer with {plan.time.volunteer_candidate.name}{" "}
                      {plan.time.volunteer_time}.
                    </p>
                    { plan.time.volunteer_candidate.description && (
                      <p>{plan.time.volunteer_candidate.description}</p>
                    )}
                  </CardBody>
                  <CardFooter>
                    <OutboundLink
                      href={`${plan.time.volunteer_candidate.event_feed_url}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button type="button" className="usa-button">
                        {capitalize(plan.time.volunteer_how)}
                      </Button>
                    </OutboundLink>
                  </CardFooter>
                </Card>

                <Card gridLayout={{ tablet: { col: 4 } }}>
                  <CardHeader>
                    <h3 className="usa-card__heading">Share</h3>
                  </CardHeader>
                  <CardBody>
                    {(form.skills.includes("INSTAGRAM") || form.contact.instagram) && (
                      <>
                        <p>
                          Because you are on Instagram, we'll send you shareable
                          graphics to repost.
                        </p>
                        <OutboundLink
                          href="https://www.instagram.com/crush2020election/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button type="button" className="usa-button">
                            Follow @Crush2020Election
                          </Button>
                        </OutboundLink>
                      </>
                    )}
                    {(form.skills.includes("TWITTER") || form.contact.twitter) && (
                      <>
                        <p>
                          Because you are on Twitter, we'll send you great
                          content to retweet.
                        </p>
                        <OutboundLink
                          href="https://twitter.com/intent/follow?screen_name=crush2020_"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button type="button" className="usa-button">
                            Follow @Crush2020_
                          </Button>
                        </OutboundLink>
                      </>
                    )}
                    {!form.contact.twitter && !form.contact.instagram && (
                      <p>
                        We'll send you great content via email. Share with your
                        friends!
                      </p>
                    )}
                  </CardBody>
                </Card>
              </Grid>
            </GridContainer>
          ),
        },
        {
          id: "money",
          title: (
            <>
              <FontAwesomeIcon icon={["fas", "money-bill-wave"]} />
              &nbsp;Money
            </>
          ),
          expanded: true,
          content: (
            <GridContainer>
              <Grid row>
                {plan.money.donate_candidate && (
                  <DonateCandidate
                    donate_candidate={plan.money.donate_candidate}
                    title={"Campaign"}
                    pitch={"monthly through the election"}
                    amount={form.money}
                  />
                )}

                {plan.money.donate_local && (
                  <DonateOrg
                    donate_org={plan.money.donate_local[donateOrgLocal]}
                    title={"Local Cause"}
                    pitch={`to build power in ${state_name}`}
                    showNext={(plan.money.donate_local.length > 1)}
                    onClickNext={() => nextOrg(plan.money.donate_local, donateOrgLocal, setDonateOrgLocal)}
                  />
                )}

                {plan.money.donate_national && (
                    <DonateOrg
                      donate_org={plan.money.donate_national[donateOrgNational]}
                      title={"National Cause"}
                      pitch={"for national impact in 2021"}
                      showNext={(plan.money.donate_national.length > 1)}
                      onClickNext={() => nextOrg(plan.money.donate_national, donateOrgNational, setDonateOrgNational)}
                    />
                )}
              </Grid>
            </GridContainer>
          ),
        },
        {
          id: "reach",
          title: (
            <>
              <FontAwesomeIcon icon={["fas", "users"]} />
              &nbsp;Reach
            </>
          ),
          expanded: true,
          content: (
            <GridContainer>
              <Grid row>
                {plan.reach.states.map(s => (
                  <Card key={s.name} gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">{s.name}</h3>
                    </CardHeader>
                    <CardBody>
                      <p>
                        Help win the {s.race} race in {s.name} from home.
                      </p>

                      <ButtonGroup>
                      {s.volunteer && (
                        <OutboundLink
                          href={`${s.volunteer.event_feed_url}?is_virtual=true`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button type="button" className="usa-button">
                            Volunteer remotely
                          </Button>
                        </OutboundLink>
                      )}

                      {s.donate && (
                        <OutboundLink
                          href={`${s.donate.donation_url}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button type="button" className="usa-button">
                            Donate
                          </Button>
                        </OutboundLink>
                      )}

                      {s.donate && s.donate.website && (
                        <OutboundLink
                          href={`${s.donate.website}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button type="button" className="usa-button">
                            Learn more
                          </Button>
                        </OutboundLink>
                      )}
                      </ButtonGroup>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </GridContainer>
          ),
        },
      ]}
    />
  </>)
}

export default Plan
