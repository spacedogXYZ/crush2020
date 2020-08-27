import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Plan from "../components/plan"

import { makePlan } from "../components/form/reducer"

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

      allStatewideCandidatesCsv {
        nodes {
          Candidate
          Election_Jurisdiction
          Office_Sought
          Specific_Party
          Total__
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

      allMobilizeUsCsv(filter: {
        org_type: {eq: "CAMPAIGN"},
        race_type: {in: ["GOVERNOR","CONGRESSIONAL","SENATE"]}
      }) {
        nodes {
          name
          race_type
          state
          event_feed_url
          district
          candidate_name
        }
      }

      allActblueCsv {
        nodes {
          id
          name
          state
          district
          donation_url
        }
      }

    allMovementvoteCsv {
        nodes {
          name
          state
          issues
          description
          donation_url
          logo_url
          website
        }
      }
    }
  `)

  const plan = makePlan(state, {
    candidates:{
        federal: planQuery.allFecCandidatesCsv.nodes,
        statewide: planQuery.allStatewideCandidatesCsv.nodes,
      },
    ratings:{
      senate: planQuery.allSenateCookRatingCsv.nodes,
      house: planQuery.allHouseCookRatingCsv.nodes,
      governor: planQuery.allGovernorsCookRatingCsv.nodes,
      state_legislature: planQuery.allStateChambersCsv.nodes,
    },
    volunteer:{
      mobilize: planQuery.allMobilizeUsCsv.nodes
    },
    donate:{
      actblue: planQuery.allActblueCsv.nodes,
      movementvote: planQuery.allMovementvoteCsv.nodes,
    }
  });

  return (
    <Layout>
      <SEO title="Your plan" />
      <Plan form={state}
        plan={plan}
      />
    </Layout>
  )
}

export default PlanPage
