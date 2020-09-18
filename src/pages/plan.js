import React, { useState, useEffect } from "react"
import { Router, useLocation } from "@reach/router"
import { useStaticQuery, graphql, navigate } from "gatsby"
import { window, exists } from 'browser-monads'
import { useCookies } from 'react-cookie'

import Layout from "../components/layout"
import SEO from "../components/seo"
import Plan from "../components/plan"

import { useAppState } from "../state/context"
import { makePlan } from "../components/plan/reducer"

const PlanPage = ({ location }) => {
  const {state, dispatch} = useAppState()
  const [loaded, setLoaded] = useState(false)
  const [cookies, setCookie] = useCookies(['crush2020_uid'])
  const pathParts = useLocation().pathname.split('/')
  var uid
  // check for uid in URL, or cookie
  if(pathParts.length >= 2 && pathParts[1] === "plan") {
    uid = pathParts[2]
  } else if (cookies && cookies['crush2020_uid'] ) {
    uid = cookies['crush2020_uid']
  }

  useEffect(() => {
    if(uid && !loaded) {
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
        dispatch({ type: "LOAD_FORM", payload: parsed.data})
        setLoaded(true)
        setCookie('crush2020_uid', parsed.data.uid)
        // redirect to capture uid
        exists(window) && navigate("/plan")
        return false
      })
      .catch(err => {
        // unable to load
        console.error(err)
        exists(window) && navigate("/form")
      })
    } else if (state.uid) {
      setCookie('crush2020_uid', state.uid)
      setLoaded(true)
    } else {
      console.error('unable to load')
      exists(window) && navigate("/form")
    }
  }, [uid, state, loaded, dispatch, setCookie])

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

      allStateLegCandidatesCsv {
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

      allVoteAmericaStateInformation {
        nodes {
          code
          state_information {
            text
            field_type
          }
        }
      }
    }
  `)

  // convert voteamerica state_information from list to hash
  let voteAmericaObject = {}
  planQuery.allVoteAmericaStateInformation.nodes.map(state => {
    let state_info = {}
    state.state_information.map(info => (
      state_info[info.field_type] = info.text
    ))
    voteAmericaObject[state.code] = state_info
    return true
  })

  const plan = makePlan(state, {
    vote: voteAmericaObject,
    candidates: {
      federal: planQuery.allFecCandidatesCsv.nodes,
      statewide: planQuery.allStatewideCandidatesCsv.nodes,
      stateleg: planQuery.allStateLegCandidatesCsv.nodes,
    },
    ratings: {
      senate: planQuery.allSenateCookRatingCsv.nodes,
      house: planQuery.allHouseCookRatingCsv.nodes,
      governor: planQuery.allGovernorsCookRatingCsv.nodes,
      stateleg: planQuery.allStateChambersCsv.nodes,
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
        <Plan default path="/" form={state} plan={plan} />
      </Router>
    </Layout>
  )
}

export default PlanPage
