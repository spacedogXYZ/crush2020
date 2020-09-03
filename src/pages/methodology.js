import React from "react"
import { OutboundLink } from "gatsby-plugin-google-analytics"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { GridContainer } from "@trussworks/react-uswds"

const AboutPage = () => (
  <Layout>
    <SEO title="Crush2020 Methodology" />
    <GridContainer>
      <h1>Our Methodology</h1>
      <p>
        At Crush2020, we aim to provide you with a personalized plan to make the
        most of your vote, time, donations and reach this election.
      </p>
      <p>
        We built a similar tool in 2018, and helped over 30,000 people make a
        plan to Crush the Midterms. This year the stakes are even higher, and
        the COVID-19 pandemic makes it even harder to organize in the most
        impactful ways. We are providing exclusively virtual volunteer
        opportunties, and encouraging everyone to learn more about the
        vote-by-mail process in their state.
      </p>
      <p>
        We show you information from various sources, and endeavor to ensure
        that it is as accurate as possible. However, if you see something
        incorrect, please contact us at{" "}
        <a href="mailto:info@crush2020.org?Subject=Incorrect%20Data">info@crush2020.org</a>
        {" "}and we will work to make it right.
      </p>
      <p>Data provided from the following sources:</p>
      <ul>
        <li>
          <OutboundLink href="https://www.fec.gov/data/browse-data/?tab=bulk-data">
            Federal Election Commission
          </OutboundLink>
          : House and Senate candidate names and funds raised
        </li>
        <li>
          <OutboundLink href="https://www.followthemoney.org">
            FollowTheMoney.org
          </OutboundLink>
          : Statewide candidate names and funds raised
        </li>
        <li>
          <OutboundLink href="https://cookpolitical.com">
            CookPolitical
          </OutboundLink>
          : House, Senate, Governor and Electoral College ratings
        </li>
        <li>
          <OutboundLink href="https://ballotpedia.org/">
            BallotPedia
          </OutboundLink>
          : State legislature seats up and current party margin
        </li>
        <li>
          <OutboundLink href="https://www.mobilize.us">
            Mobilize.us
          </OutboundLink>
          : Volunteer links
        </li>
        <li>
          <OutboundLink href="https://secure.actblue.com/directory/all/candidate/">
            ActBlue
          </OutboundLink>
          : Candidate donation links
        </li>
        <li>
          <OutboundLink href="https://movement.vote">
            Movement Voter Project
          </OutboundLink>
          : Local and national power-building organizations
        </li>
        <li>
          <OutboundLink href="https://voteamerica.com">
            VoteAmerica
          </OutboundLink>
          : Voter registration forms, deadlines, and vote-by-mail information
        </li>
      </ul>
    </GridContainer>
  </Layout>
)

export default AboutPage
