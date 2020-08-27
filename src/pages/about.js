import React from "react"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import Layout from "../components/layout"
import SEO from "../components/seo"

import { GridContainer, Grid } from "@trussworks/react-uswds"

import josh from "../images/josh.jpg"
import marisa from "../images/marisa.jpg"

const AboutPage = () => (
  <Layout>
    <SEO title="About Crush2020" />
    <GridContainer>
      <h1>Our Team</h1>
      <Grid gap className="usa-graphic-list__row">
        <Grid tablet={{ col: true }} className="usa-media-block">
          <img className="usa-media-block__img background-circle" src={marisa} alt="Marisa Kabas"/>
          <div className="usa-media-block__body">
            <h2 className="usa-graphic-list__heading">
              Marisa Kabas, Editorial Director 
            </h2>
            <p>
              Marisa was previously a staff writer at Fusion and the Daily Dot, and continues to publish freelance writing about feminism, activism, and politics.
              She is a graduate of George Washington University&apos;s School of Media and Public Affairs and lives in Brooklyn.
              Find her on Twitter <OutboundLink href="https://twitter.com/marisakabas">@marisakabas</OutboundLink>.
            </p>
          </div>
        </Grid>
        <Grid tablet={{ col: true }} className="usa-media-block">
          <img className="usa-media-block__img background-circle" src={josh} alt="Josh Levinger"/>
          <div className="usa-media-block__body">
            <h2 className="usa-graphic-list__heading">
              Josh Levinger, Technology Director
            </h2>
            <p>Josh is the Commander of <OutboundLink href="https://spacedog.xyz">Spacedog XYZ</OutboundLink>. He has worked for twelve years at the intersection of technology and activism and specializes in building online organizing tools with offline impact.
              He is a graduate of the Massachusetts Institute of Technology and MIT Media Lab and lives in Truckee CA.
              Find him on Twitter <OutboundLink href="https://twitter.com/jlev">@jlev</OutboundLink>.
            </p>
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  </Layout>
)

export default AboutPage
