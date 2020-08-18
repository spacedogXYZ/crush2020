import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import USAMap from "@jlev/react-usa-map"
import ReactTooltip from "react-tooltip"

import { Form, Fieldset } from "@trussworks/react-uswds"
import { useFormState } from "../context"

import { updateDict, useReferredState } from "../../../utils/object"
import { capitalize, isCompetitive } from "../../../utils/strings"

export function ReachStep() {
  const {
    state: { reach },
    dispatch
  } = useFormState();

  const [ hoverState, setHoverState ] = useReferredState({current: null})
  
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
  `);

  // re-sort results to hash by state and district
  const competitiveStates = {}
  // competitiveRaces.allStateElectoralCollegeCsv.nodes.forEach(r => {
  //   if (isCompetitive(r.rating)) {
  //     competitiveStates[r.state] = updateDict(competitiveStates, r.state, {
  //       presidential: r.rating
  //     })
  //   }
  // })
  competitiveRaces.allSenateCookRatingCsv.nodes.forEach(r => {
    if (isCompetitive(r.rating)) {
      competitiveStates[r.state] = updateDict(competitiveStates, r.state, {
        senate: r.rating
      })
    }
  })
  competitiveRaces.allGovernorsCookRatingCsv.nodes.forEach(r => {
    if (isCompetitive(r.rating)) {
      competitiveStates[r.state] = updateDict(competitiveStates, r.state, {
        governor: r.rating
      })
    }
  })
  // TODO, figure out how to wrap these in an array
  // competitiveRaces.allHouseCookRatingCsv.nodes.forEach(r => {
  //   if (isCompetitive(r.rating)) {
  //     let state = r.district.split('-')[0]
  //     let houseRace = {}
  //     houseRace[r] = r.rating
  //     competitiveStates[state] = updateDict(competitiveStates, state, {
  //       house: [...competitiveStates[state].house, [houseRace]]
  //     })
  //   }
  // })

  const statesDisplay = () => {
    let config = {}

    // outline competitive states like other selectable buttons 
    Object.keys(competitiveStates).forEach(state => {
      config[state] = updateDict(config, state, {
        stroke: "#005ea2"
      });
    });

    // fill in selected states in ReachStep
    reach.forEach(region => {
      if (region === "DC") {
        // workaround for library weirdness with DC circle
        region = "DC2"
      }
      config[region] = updateDict(config, region, {
        fill: "#005ea2",
        stroke: "#1a4480"
      });
    })

    return config;
  };


  const handleChange = event => {
    let region = event.target.dataset.name;
    const isSelected = reach.includes(region);
    let payload = reach;

    if (isSelected) {
      payload = reach.filter(c => c !== region);
    } else {
      payload = [...reach, region];
    }

    dispatch({
      type: "REACH_CHANGE",
      payload
    });
  };

  const handleHover = event => {
    setHoverState(event.target.dataset.name)
  }

  return (
    <Form className="margin-top-5pct">
      <Fieldset legend={"Extend your impact!"}>
        <h2>Pick a tight race outside your area and help win big</h2>
        <div data-tip data-for='map-tooltip'>
          <USAMap width="100%"
            customize={statesDisplay()}
            onClick={handleChange}
            onMouseOver={handleHover}
          />
        </div>
        { competitiveStates[hoverState.current] &&
          <ReactTooltip id='map-tooltip' aria-haspopup='true'>
            <h3>Competitive Races in {hoverState.current}</h3>
            <ul>
              { Object.keys(competitiveStates[hoverState.current]).map(k => (
                <li key={k}>{capitalize(k)}: {competitiveStates[hoverState.current][k]}</li>
              ))}
            </ul>
          </ReactTooltip>
        }
      </Fieldset>
    </Form>
  );
}