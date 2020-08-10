import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Plan from "../components/plan"

const PlanPage = ({location}) => {
  const { state } = location

  const planQuery = useStaticQuery(graphql`
    query planQuery {
      allFecCandidatesCsv {
        nodes {
          CAND_NAME
          CAND_OFFICE_DISTRICT
          CAND_OFFICE_ST
          CAND_PTY_AFFILIATION
          TTL_RECEIPTS
          CAND_ID
          CAND_ICI
        }
      }

      allHouseCookRatingCsv {
        nodes {
          district
          rating
        }
      }
    }
  `)

  return (
    <Layout>
      <SEO title="Your plan" />
      <Plan form={state}
        candidates={planQuery.allFecCandidatesCsv.nodes}
        ratings={planQuery.allHouseCookRatingCsv.nodes}
      />
    </Layout>
  )
}

export default PlanPage
