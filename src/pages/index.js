import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

import {
  GridContainer,
} from '@trussworks/react-uswds'
import "@trussworks/react-uswds/lib/index.css"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
      <section className="usa-section">
        <GridContainer>
          
        </GridContainer>
      </section>
  </Layout>
)

export default IndexPage
