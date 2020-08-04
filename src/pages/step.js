import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import PlanForm from "../components/form/form"
import { FormProvider } from "../components/form/context"

const StartPage = () => (
  <Layout>
    <SEO title="Make a plan" />
    <FormProvider>
        <PlanForm />
    </FormProvider>
  </Layout>
)

export default StartPage
