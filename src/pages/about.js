import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { GridContainer } from "@trussworks/react-uswds"

const AboutPage = () => (
  <Layout>
    <SEO title="About Crush2020" />
    <GridContainer>
      <h1>Our Team</h1>
      <ul>
        <li>
            <h2>Marisa Kabas</h2>
            <p>is Editorial Director of Crush2020. She was previously a staff writer at Fusion and the Daily Dot, and continues to publish freelance writing about feminism, activism, and politics.</p>
            <p>She is a graduate of George Washington University&apos;s School of Media and Public Affairs and lives in Brooklyn. Find her on Twitter <a href="https://twitter.com/marisakabas">@marisakabas</a>.</p>
        </li>
        <li>
          <h2>Josh Levinger</h2>
          <p>is the Commander of <a href="https://spacedog.xyz">Spacedog XYZ</a>, a multi-dimensional digital agency for organizations on a mission. He has worked for twelve years at the intersection of technology and activism with groups like CREDO Action, the Electronic Frontier Foundation, Fight for the Future, the Libyan High National Elections Commission, and VoteAmerica. He specializes in designing and building online organizing tools with offline impact.</p>
          <p>He is a graduate of the Massachusetts Institute of Technology and MIT Media Lab, and lives in Truckee CA. Find him on Twitter <a href="https://twitter.com/jlev">@jlev</a>.</p>
        </li>
      </ul>
    </GridContainer>
  </Layout>
)

export default AboutPage
