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
          updated
        }
      }

      allSenateCookRatingCsv {
        nodes {
          state
          rating
          updated
        }
      }

      allGovernorsCookRatingCsv {
        nodes {
          state
          rating
          updated
        }
      }

      allStateChambersCsv {
        nodes {
          state
          chamber
          seats_up
          margin
        }
      }
    }
  `)

  return (
    <Layout>
      <SEO title="Your plan" />
      <Plan form={state}
        candidates={{
          federal: planQuery.allFecCandidatesCsv.nodes
        }}
        ratings={{
          senate: planQuery.allSenateCookRatingCsv.nodes,
          house: planQuery.allHouseCookRatingCsv.nodes,
          governor: planQuery.allGovernorsCookRatingCsv.nodes,
          state_legislature: planQuery.allStateChambersCsv.nodes,
        }}
      />
    </Layout>
  )
}

export default PlanPage
