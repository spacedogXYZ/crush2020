import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { GridContainer } from "@trussworks/react-uswds"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <GridContainer>
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </GridContainer>
  </Layout>
)

export default NotFoundPage
