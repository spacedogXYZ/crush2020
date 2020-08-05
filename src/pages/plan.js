import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Plan from "../components/plan"

const PlanPage = ({location}) => {
  const { state } = location

  return (
    <Layout>
      <SEO title="Your plan" />
      <Plan form={state}/>
    </Layout>
  )
}

export default PlanPage
