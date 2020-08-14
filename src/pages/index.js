import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

import { Link } from "gatsby"

import { GridContainer, Grid } from "@trussworks/react-uswds"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <section className="usa-hero">
      <GridContainer>
        <div className="usa-hero__callout">
          <h1 className="usa-hero__heading">
            <span className="usa-hero__heading--alt">
              We dominated the midterms.
            </span>
            This year, let’s finish the job.
          </h1>
          <Link className="usa-button bg-secondary hover:bg-secondary-dark" to="/step">
            Let's Go <FontAwesomeIcon icon={["fas", "arrow-right"]} />
          </Link>
        </div>
      </GridContainer>
    </section>

    <section className="usa-graphic-list usa-section usa-section--dark">
      <GridContainer>
        <Grid row gap className="usa-graphic-list__row">
          <Grid tablet={{ col: true }} className="usa-media-block">
            <div className="usa-media-block__img background-circle icon-center">
              <FontAwesomeIcon icon={["fas", "vote-yea"]} size="3x" />
            </div>
            <div className="usa-media-block__body">
              <h2 className="usa-graphic-list__heading">
                Vote
              </h2>
              <p>
                Every vote counts. Yes, even in your “safe” state. It’s a privilege &mdash; so use it.
              </p>
            </div>
          </Grid>
          <Grid tablet={{ col: true }} className="usa-media-block">
             <div className="usa-media-block__img background-circle icon-center">
              <FontAwesomeIcon icon={["fas", "calendar-alt"]} size="3x" />
            </div>
            <div className="usa-media-block__body">
              <h2 className="usa-graphic-list__heading">
                Time
              </h2>
              <p>
                Lending your special skills can make the difference between a campaign win and loss.
              </p>
            </div>
          </Grid>
        </Grid>
        <Grid row gap className="usa-graphic-list__row">
          <Grid tablet={{ col: true }} className="usa-media-block">
           <div className="usa-media-block__img background-circle icon-center">
              <FontAwesomeIcon icon={["fas", "money-bill-wave"]} size="3x" />
            </div>
            <div className="usa-media-block__body">
              <h2 className="usa-graphic-list__heading">
                Donations
              </h2>
              <p>
                With so many campaigns saying no to corporate money, your dollars mean more than ever.
              </p>
            </div>
          </Grid>
          <Grid tablet={{ col: true }} className="usa-media-block">
           <div className="usa-media-block__img background-circle icon-center">
              <FontAwesomeIcon icon={["fas", "users"]} size="3x" />
            </div>
            <div className="usa-media-block__body">
              <h2 className="usa-graphic-list__heading">
                Reach
              </h2>
              <p>
                Your world is more than what’s outside your window &mdash; engage the full scope of your network for lasting change.
              </p>
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </section>
  </Layout>
)

export default IndexPage
