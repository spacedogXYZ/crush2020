import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

import { Link } from "gatsby"

import { GridContainer, Grid } from "@trussworks/react-uswds"

import circleImg from "../images/circle-124.png"

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
          <Link className="usa-button" to="/start">
            Let's Go
          </Link>
        </div>
      </GridContainer>
    </section>

    <section className="usa-graphic-list usa-section usa-section--dark">
      <GridContainer>
        <Grid row gap className="usa-graphic-list__row">
          <Grid tablet={{ col: true }} className="usa-media-block">
            <img
              className="usa-media-block__img"
              src={circleImg}
              alt="Alt text"
            />
            <div className="usa-media-block__body">
              <h2 className="usa-graphic-list__heading">
                Graphic headings can vary.
              </h2>
              <p>
                Graphic headings can be used a few different ways, depending on
                what your landing page is for. Highlight your values, specific
                program areas, or results.
              </p>
            </div>
          </Grid>
          <Grid tablet={{ col: true }} className="usa-media-block">
            <img
              className="usa-media-block__img"
              src={circleImg}
              alt="Alt text"
            />
            <div className="usa-media-block__body">
              <h2 className="usa-graphic-list__heading">
                Stick to 6 or fewer words.
              </h2>
              <p>
                Keep body text to about 30 words. They can be shorter, but try
                to be somewhat balanced across all four. It creates a clean
                appearance with good spacing.
              </p>
            </div>
          </Grid>
        </Grid>
        <Grid row gap className="usa-graphic-list__row">
          <Grid tablet={{ col: true }} className="usa-media-block">
            <img
              className="usa-media-block__img"
              src={circleImg}
              alt="Alt text"
            />
            <div className="usa-media-block__body">
              <h2 className="usa-graphic-list__heading">
                Never highlight anything without a goal.
              </h2>
              <p>
                For anything you want to highlight here, understand what your
                users know now, and what activity or impression you want from
                them after they see it.
              </p>
            </div>
          </Grid>
          <Grid tablet={{ col: true }} className="usa-media-block">
            <img
              className="usa-media-block__img"
              src={circleImg}
              alt="Alt text"
            />
            <div className="usa-media-block__body">
              <h2 className="usa-graphic-list__heading">
                Could also have 2 or 6.
              </h2>
              <p>
                In addition to your goal, find out your users’ goals. What do
                they want to know or do that supports your mission? Use these
                headings to show these.
              </p>
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </section>
  </Layout>
)

export default IndexPage
