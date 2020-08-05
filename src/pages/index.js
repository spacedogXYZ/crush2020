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
              We started with the midterms
            </span>
            Now it’s time to finish the job
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
                Every vote matters, and this year it's really true.
                Even if you live in a "safe state", send a message with your ballot.
              </p>
            </div>
          </Grid>
          <Grid tablet={{ col: true }} className="usa-media-block">
             <div className="usa-media-block__img background-circle icon-center">
              <FontAwesomeIcon icon={["fas", "calendar-times"]} size="3x" />
            </div>
            <div className="usa-media-block__body">
              <h2 className="usa-graphic-list__heading">
                Time
              </h2>
              <p>
                Your skills and contributions can go a long way to help campaigns win
                and build power with local organizations for the long haul.
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
                Money matters more than ever, and under-resourced campaigns keep track of their grassroots donors.
              </p>
            </div>
          </Grid>
          <Grid tablet={{ col: true }} className="usa-media-block">
           <div className="usa-media-block__img background-circle icon-center">
              <FontAwesomeIcon icon={["fas", "users"]} size="3x" />
            </div>
            <div className="usa-media-block__body">
              <h2 className="usa-graphic-list__heading">
                Connections
              </h2>
              <p>
                There are competitive races all over the country.
                Tell your friends and family, and help them make a plan of their own.
              </p>
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </section>
  </Layout>
)

export default IndexPage
