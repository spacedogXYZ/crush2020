import React from "react"
import { OutboundLink } from "gatsby-plugin-google-analytics"

import {
  Accordion,
  GridContainer,
  Grid,
  Card,
  CardHeader,
  CardBody,
  CardMedia,
  CardFooter,
} from "@trussworks/react-uswds"
import { Button, ButtonGroup } from "@trussworks/react-uswds"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { parseName, capitalize, firstSentence, isCompetitive } from "../../utils/strings"
import { isEmpty } from "../../utils/object"

var us_states = require("us-state-codes")
var slugify = require("slugify")

const Candidate = ({ data }) => (
  <li key={data.CAND_ID}>
    {parseName(data.CAND_NAME)} ({data.CAND_PTY_AFFILIATION.slice(0, 1)})
  </li>
)

export function Plan({ form, plan }) {
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

  return (
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
                      {form.registered === "yes" && (
                        <OutboundLink
                          href="https://www.voteamerica.com/am-i-registered-to-vote/"
                          className="usa-button"
                        >
                          Confirm with {state_name}
                        </OutboundLink>
                      )}
                      {form.registered === "not-sure" ? (
                        <OutboundLink
                          href="https://www.voteamerica.com/am-i-registered-to-vote/"
                          className="usa-button"
                        >
                          Double check with {state_name}
                        </OutboundLink>
                      ) : (
                        <></>
                      )}
                      {(form.registered === "no" ||
                        isEmpty(form.registered)) && (
                        <OutboundLink
                          href="https://www.voteamerica.com/register-to-vote/"
                          className="usa-button"
                        >
                          Register to Vote
                        </OutboundLink>
                      )}
                      {form.vbm === "yes" && (
                        <OutboundLink
                          href={`https://www.voteamerica.com/absentee-ballot-${state_slug}/`}
                          className="usa-button bg-secondary hover:bg-secondary-dark"
                        >
                          {state_name} Vote by Mail Application
                        </OutboundLink>
                      )}
                      {(form.vbm === "not-sure" || isEmpty(form.vbm)) && (
                        <OutboundLink
                          href={`https://www.voteamerica.com/absentee-ballot-${state_slug}/#absentee-guide`}
                          className="usa-button bg-secondary hover:bg-secondary-dark"
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
                      Current rating: {plan.senate_rating.rating}
                      <div className="citation">
                        Cook Political {plan.senate_rating.updated}
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
                          <Candidate key={c.CAND_ID} data={c} />
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
                          <Candidate key={c.CAND_ID} data={c} />
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
                          <Candidate key={c.CAND_ID} data={c} />
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                )}

               {/* {!isEmpty(plan.ballot.state_senate_rating) && (
                  <Card gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">{state} State Senate</h3>
                    </CardHeader>
                    <CardBody>
                      <ul>
                        <li>
                          {plan.ballot.state_senate_rating.seats_up} seats are
                          up
                        </li>
                        <li>
                          Current margin:{" "}
                          {plan.ballot.state_senate_rating.margin}
                        </li>
                      </ul>
                    </CardBody>
                    <CardFooter>
                      <div className="citation">
                        Ballotpedia Battleground
                      </div>
                    </CardFooter>
                  </Card>
                )}

                {!isEmpty(plan.ballot.state_house_rating) && (
                  <Card gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">{state} State House</h3>
                    </CardHeader>
                    <CardBody>
                      <ul>
                        <li>
                          {plan.ballot.state_house_rating.seats_up} seats are up
                        </li>
                        <li>
                          Current margin:{" "}
                          {plan.ballot.state_house_rating.margin}
                        </li>
                      </ul>
                    </CardBody>
                    <CardFooter>
                      <div className="citation">
                        Ballotpedia Battleground
                      </div>
                    </CardFooter>
                  </Card>
                )}*/}
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
                <Card gridLayout={{ tablet: { col: 4 } }}>
                  <CardHeader>
                    <h3 className="usa-card__heading">Candidate</h3>
                  </CardHeader>
                  <CardBody>
                    <p>
                      Donate to {plan.money.donate_candidate.name} monthly
                      through the election.
                    </p>
                    {plan.money.donate_candidate.image_url && (
                        <CardMedia>
                          <OutboundLink
                            href={plan.money.donate_candidate.website}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={plan.money.donate_candidate.image_url}
                              alt={plan.money.donate_candidate.name}
                              className="very-small"
                            />
                          </OutboundLink>
                        </CardMedia>
                      )}
                  </CardBody>
                  <CardFooter>
                    <OutboundLink
                      href={`${plan.money.donate_candidate.donation_url}?amount=${form.money}&recurring=true`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button type="button" className="usa-button">
                        Give ${form.money}
                      </Button>
                    </OutboundLink>
                  </CardFooter>
                </Card>

                {plan.money.donate_local && (
                  <Card gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">Local Cause</h3>
                    </CardHeader>
                    <CardBody>
                      {<p>Donate to {plan.money.donate_local.name} to build power in {state_name}.</p>}
                      {plan.money.donate_local.logo_url && (
                        <CardMedia exdent>
                          <OutboundLink
                            href={plan.money.donate_local.website}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={plan.money.donate_local.logo_url}
                              alt={`${plan.money.donate_local.name} logo`}
                            />
                          </OutboundLink>
                        </CardMedia>
                      )}
                      <p>{firstSentence(plan.money.donate_local.description)}</p>
                      <div className="citation">
                        Movement Voter Project
                      </div>
                    </CardBody>
                    <CardFooter>
                      {plan.money.donate_local.donation_url && (
                        <OutboundLink
                          href={`${plan.money.donate_local.donation_url}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button type="button" className="usa-button">
                            Give
                          </Button>
                        </OutboundLink>
                      )}
                    </CardFooter>
                  </Card>
                )}

                {plan.money.donate_national && (
                  <Card gridLayout={{ tablet: { col: 4 } }}>
                    <CardHeader>
                      <h3 className="usa-card__heading">National Cause</h3>
                    </CardHeader>
                    <CardBody>
                      <p>Donate to {plan.money.donate_national.name} for national impact in 2021.</p>
                      {plan.money.donate_national.logo_url && (
                        <CardMedia exdent>
                          <OutboundLink
                              href={plan.money.donate_national.website}
                              target="_blank"
                              rel="noreferrer"
                            >
                            <img
                              src={plan.money.donate_national.logo_url}
                              alt={`${plan.money.donate_national.name} logo`}
                            />
                          </OutboundLink>
                        </CardMedia>
                      )}
                      <p>{firstSentence(plan.money.donate_national.description)}</p>
                      <div className="citation">
                        Movement Voter Project
                      </div>
                    </CardBody>
                    <CardFooter>
                      {plan.money.donate_national.donation_url && (
                        <OutboundLink
                          href={`${plan.money.donate_national.donation_url}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button type="button" className="usa-button">
                            Give
                          </Button>
                        </OutboundLink>
                      )}
                      <OutboundLink
                        href={plan.money.donate_national.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                      </OutboundLink>
                    </CardFooter>
                  </Card>
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
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </GridContainer>
          ),
        },
      ]}
    />
  )
}

export default Plan
