import React, { useState, useEffect } from "react"
import { Router, useLocation } from "@reach/router"

import { useStaticQuery, graphql, navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Plan from "../components/plan"

import { isEmpty } from "../utils/object"
import { makePlan } from "../components/plan/reducer"

const PlanPage = ({ location }) => {
  const [form, setForm] = useState({})
  const [loaded, setLoaded] = useState(false)
  const pathParts = useLocation().pathname.split('/')
  var uid
  if(pathParts.length > 2) {
    uid = pathParts[2]
  }

  // try to pull state from location in redirect
  let { state } = location
  if (!isEmpty(state) && !loaded) {
    console.log("setForm by redirect")
    setForm(state)
    setLoaded(true)
  }

  useEffect(() => {
    if(uid) {
      // get state from database
      fetch(`/.netlify/functions/get-form?uid=${uid}`, {
        method: "GET",
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText)
        }
        return response.json()
      }).then(parsed => {
        setForm(parsed.data)
        setLoaded(true)
        // redirect to capture uid
        navigate("/plan", { state: form })
      })
      .catch(err => {
        // unable to load
        console.error(err)
        navigate("/form")
      })
    }
  }, [uid])

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

      allMobilizeUsCsv(
        filter: {
          org_type: { eq: "CAMPAIGN" }
          race_type: { in: ["GOVERNOR", "CONGRESSIONAL", "SENATE"] }
        }
      ) {
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
          website
          donation_url
          image_url
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

  const plan = makePlan(form, {
    candidates: {
      federal: planQuery.allFecCandidatesCsv.nodes,
      statewide: planQuery.allStatewideCandidatesCsv.nodes,
    },
    ratings: {
      senate: planQuery.allSenateCookRatingCsv.nodes,
      house: planQuery.allHouseCookRatingCsv.nodes,
      governor: planQuery.allGovernorsCookRatingCsv.nodes,
      state_legislature: planQuery.allStateChambersCsv.nodes,
    },
    volunteer: {
      mobilize: planQuery.allMobilizeUsCsv.nodes,
    },
    donate: {
      actblue: planQuery.allActblueCsv.nodes,
      movementvote: planQuery.allMovementvoteCsv.nodes,
    },
  })

  return (
    <Layout>
      <SEO title="Your plan" />
      <Router basepath="/plan">
        <Plan default path="/" form={form} plan={plan} />
      </Router>
    </Layout>
  )
}

export default PlanPage
