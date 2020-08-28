import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { GridContainer } from "@trussworks/react-uswds"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <GridContainer>
      <h1>Not Found</h1>
      <p>We can&#39;t seem to find that page. &#9785;</p>
    </GridContainer>
  </Layout>
)

export default NotFoundPage
