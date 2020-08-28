import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import USAMap from "@jlev/react-usa-map"
import ReactTooltip from "react-tooltip"

import { Form, Fieldset } from "@trussworks/react-uswds"
import { useFormState } from "../context"

import { updateDict, useReferredState } from "../../../utils/object"
import { capitalize, isCompetitive, isLikely } from "../../../utils/strings"

export function ReachStep() {
  const {
    state: { reach },
    dispatch,
  } = useFormState()

  const [hoverState, setHoverState] = useReferredState({ current: null })

  const competitiveRaces = useStaticQuery(graphql`
    query competitiveStatesQuery {
      allStateElectoralCollegeCsv {
        nodes {
          state
          rating
        }
      }
      allGovernorsCookRatingCsv {
        nodes {
          state
          rating
        }
      }
      allHouseCookRatingCsv {
        nodes {
          district
          rating
        }
      }
      allSenateCookRatingCsv {
        nodes {
          state
          rating
        }
      }
      allStateChambersCsv {
        nodes {
          state
          seats_up
        }
      }
    }
  `)

  // re-sort results to hash by state and district
  const competitiveStates = {}
  competitiveRaces.allStateElectoralCollegeCsv.nodes.forEach(r => {
    if (isCompetitive(r.rating)) {
      competitiveStates[r.state] = updateDict(competitiveStates, r.state, {
        presidential: r.rating,
      })
    }
  })
  competitiveRaces.allSenateCookRatingCsv.nodes.forEach(r => {
    if (isCompetitive(r.rating)) {
      competitiveStates[r.state] = updateDict(competitiveStates, r.state, {
        senate: r.rating,
      })
    }
  })
  competitiveRaces.allGovernorsCookRatingCsv.nodes.forEach(r => {
    if (isCompetitive(r.rating)) {
      competitiveStates[r.state] = updateDict(competitiveStates, r.state, {
        governor: r.rating,
      })
    }
  })
  competitiveRaces.allHouseCookRatingCsv.nodes.forEach(r => {
    if (isCompetitive(r.rating) || isLikely(r.rating)) {
      let state = r.district.split("-")[0]
      let houseRace = {}
      houseRace[r.district] = r.rating
      competitiveStates[state] = updateDict(competitiveStates, state, houseRace)
    }
  })

  // use the overlap of presidential and senate to show outlines
  const overlapStates = Object.entries(competitiveStates)
    .map(o => {
      let s = o[1]
      if (s.presidential || s.senate === "TOSS-UP") {
        return o[0]
      }
      return false
    }, [])
    .filter(x => x)

  const statesDisplay = () => {
    let config = {}

    // outline overlap states like other selectable buttons
    overlapStates.forEach(state => {
      config[state] = updateDict(config, state, {
        stroke: "#005ea2",
      })
    })

    // fill in selected states in ReachStep
    reach.forEach(region => {
      if (region === "DC") {
        // workaround for library weirdness with DC circle
        region = "DC2"
      }
      config[region] = updateDict(config, region, {
        fill: "#005ea2",
        stroke: "#1a4480",
      })
    })

    return config
  }

  const handleChange = event => {
    let region = event.target.dataset.name
    const isSelected = reach.includes(region)
    let payload = reach

    if (isSelected) {
      payload = reach.filter(c => c !== region)
    } else {
      payload = [...reach, region]
    }

    dispatch({
      type: "REACH_CHANGE",
      payload,
    })
  }

  const handleHover = event => {
    setHoverState(event.target.dataset.name)
  }

  return (
    <Form className="margin-top-5pct">
      <Fieldset legend={"Where else can you help?"}>
        <h2>Pick a competitive state and help win big nationally</h2>
        <div data-tip data-for="map-tooltip">
          <USAMap
            width="100%"
            customize={statesDisplay()}
            onClick={handleChange}
            onMouseOver={handleHover}
          />
        </div>
        {competitiveStates[hoverState.current] && (
          <ReactTooltip id="map-tooltip" aria-haspopup="true">
            <h3>Competitive Races in {hoverState.current}</h3>
            <ul>
              {Object.keys(competitiveStates[hoverState.current]).map(k => {
                let name = k.indexOf("-") > 0 ? k : capitalize(k)
                let status = competitiveStates[hoverState.current][k]
                return (
                  <li key={k.toUpperCase()}>
                    {name}: {status}
                  </li>
                )
              })}
            </ul>
          </ReactTooltip>
        )}
      </Fieldset>
    </Form>
  )
}
