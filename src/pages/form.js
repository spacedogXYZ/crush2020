import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PlanForm from "../components/form/form"

const StartPage = () => (
  <Layout>
    <SEO title="Make a plan" />
    <PlanForm />
  </Layout>
)

export default StartPage
