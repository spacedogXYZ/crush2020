import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { GridContainer } from "@trussworks/react-uswds"

const NotFoundPage = () => (
  <Layout>
    <SEO title="Make a plan to defeat Trump" />
    <GridContainer>
      <h1>Hold up</h1>
      <p>We're looking for that now...</p>
    </GridContainer>
  </Layout>
)

export default NotFoundPage
