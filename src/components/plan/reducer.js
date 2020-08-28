import {
  padCode,
  unpadCode,
  isCompetitive,
  isLikely,
} from "../../utils/strings"
import { getRandom } from "../../utils/object"
import { TIME_VALUES } from "../form/steps/time"

var us_states = require("us-state-codes")

function matchCandidate(state, district, candidates, ratings, volunteer) {
  // given candidates and ratings, returns the volunteer opportunity for the most important race
  // priority: senate first, then house, then gov, then presidential
  // if no mobilize links available, we still return the dem name

  const volunteer_senate = volunteer.mobilize.filter(
    o => o.state === state && o.race_type === "SENATE"
  )
  const volunteer_house = volunteer.mobilize.filter(
    o =>
      o.state === state &&
      o.race_type === "CONGRESSIONAL" &&
      o.district === unpadCode(district)
  )
  const volunteer_gov = volunteer.mobilize.filter(
    o => o.state === state && o.race_type === "GOVERNOR"
  )

  if (
    ratings.senate &&
    (isCompetitive(ratings.senate.rating) || isLikely(ratings.senate.rating))
  ) {
    if (volunteer_senate) {
      return volunteer_senate[0]
    } else {
      return {
        name: candidates.senate.find(c =>
          c.CAND_PTY_AFFILIATION.startsWith("D")
        ),
      }
    }
  }
  if (
    ratings.house &&
    (isCompetitive(ratings.house.rating) || isLikely(ratings.house.rating))
  ) {
    if (volunteer_house) {
      return volunteer_house[0]
    } else {
      return {
        name: candidates.house.find(c =>
          c.CAND_PTY_AFFILIATION.startsWith("D")
        ),
      }
    }
  }
  if (
    ratings.governor &&
    (isCompetitive(ratings.governor.rating) ||
      isLikely(ratings.governor.rating))
  ) {
    if (volunteer_gov) {
      return volunteer_house[0]
    } else {
      return {
        name: candidates.governor.find(c =>
          c.CAND_PTY_AFFILIATION.startsWith("D")
        ),
      }
    }
  }

  return {
    name: "2020 Victory",
    event_feed_url: "https://www.mobilize.us/2020victory/",
  }
}

function matchOrganization(state, issues, orgs) {
  // given state, issues and organizations
  // return a list of orgs in that state which match issue areas

  return orgs.filter(o => {
    if (o.state === state) {
      let match = false
      if (issues.includes("ABORTION_RIGHTS")) {
        match = match || o.issues.includes("Reproductive Justice")
      }
      if (issues.includes("ENVIRONMENT")) {
        match = match || o.issues.includes("Climate / Environment")
      }
      if (issues.includes("LGBTQ")) {
        match = match || o.issues.includes("LGBTQ")
      }
      if (issues.includes("VOTER_SUPPRESSION")) {
        match = match || o.issues.includes("Voting Rights")
      }
      if (issues.includes("RACIAL_JUSTICE")) {
        match = match || o.issues.includes("Racial Justice")
      }
      if (issues.includes("IMMIGRATION")) {
        match = match || o.issues.includes("Immigrant Rights")
      }
      if (issues.includes("HEALTH_CARE")) {
        match = match || o.issues.includes("Healthcare")
      }
      if (issues.includes("MASS_INCARCERATION")) {
        match = match || o.issues.includes("End Mass Criminalization")
      }
      return match
    }
    return false
  })
}

export function makePlan(form, data) {
  const { candidates, ratings, volunteer, donate } = data
  if (!form || !form.geocode) {
    // can't make a plan without a location
    return {}
  }
  const state = form.geocode.state

  const senate_candidates = candidates.federal
    .filter(c => c.CAND_OFFICE_ST === state && c.CAND_OFFICE_DISTRICT === "00")
    .sort((a, b) => a.TTL_RECEIPTS < b.TTL_RECEIPTS)
    .slice(0, 2)

  const congressional_district = form.geocode.cd
  const congressional_district_code = padCode(congressional_district)
  const house_candidates = candidates.federal
    .filter(
      c =>
        c.CAND_OFFICE_ST === state &&
        c.CAND_OFFICE_DISTRICT === congressional_district_code
    )
    .sort((a, b) => a.TTL_RECEIPTS < b.TTL_RECEIPTS)
    .slice(0, 2)
  // we don't actually have primary win/loss records from FEC
  // so sort by amount raised and pick top two

  const governor_candidates = candidates.statewide
    .filter(
      c =>
        c.Election_Jurisdiction === state &&
        c.Office_Sought.startsWith("GOVERNOR")
    )
    .sort((a, b) => a.Total__ < b.Total__)
  const state_sos_candidates = candidates.statewide
    .filter(
      c =>
        c.Election_Jurisdiction === state &&
        c.Office_Sought === "SECRETARY OF STATE"
    )
    .sort((a, b) => a.Total__ < b.Total__)
  const state_ag_candidates = candidates.statewide
    .filter(
      c =>
        c.Election_Jurisdiction === state &&
        c.Office_Sought === "ATTORNEY GENERAL"
    )
    .sort((a, b) => a.Total__ < b.Total__)
  // we do have win/loss from FollowTheMoney
  // and have already filtered by it
  // keep sorted to put more likely candidates at the top

  const senate_rating = ratings.senate.find(r => r.state === state)
  const house_rating = ratings.house.find(
    r => r.district === `${state}-${congressional_district_code}`
  )
  const governor_rating = ratings.governor.find(r => r.state === state)
  const state_senate_rating = ratings.state_legislature.find(
    r => r.state === state && r.chamber === "upper"
  )
  const state_house_rating = ratings.state_legislature.find(
    r => r.state === state && r.chamber === "lower"
  )

  // volunteer links
  const state_candidates = {
    senate: senate_candidates,
    house: house_candidates,
    governor: governor_candidates,
  }
  const state_ratings = {
    senate: senate_rating,
    house: house_rating,
    governor: governor_rating,
  }
  let volunteer_candidate = matchCandidate(
    state,
    congressional_district_code,
    state_candidates,
    state_ratings,
    volunteer
  )
  let volunteer_time = form.time ? TIME_VALUES[form.time] : "in other ways"

  // volunteer methods, defaults first
  let volunteer_how = "volunteer"
  let volunteer_type = undefined
  // special cases first
  if (form.skills.includes("CODER")) {
    volunteer_how = "Use your tech skills"
    // override candidate
    volunteer_candidate = {
      name: "Tech for Campaigns",
      event_feed_url: "https://www.techforcampaigns.org/volunteers",
      description: "Tech for Campaigns provides opportunities to volunteer your skills in a meaningful and impactful way, turning political passion into hands-on involvement."
    }
    volunteer_time = "to help progressive candidates"
  } else if (form.skills.includes("LAWYER")) {
    volunteer_how = "Use your legal skills"
    // override candidate
    volunteer_candidate = {
      name: "Election Protection Hotline",
      event_feed_url: "https://wetheaction.org/projects/780-serve-as-an-election-protection-hotline-captain-remote",
      description: "The national, nonpartisan Election Protection coalition works year-round to ensure that all voters have an equal opportunity to vote and have that vote count."
    }
    volunteer_time = "to answer voter questions on Election Day"
  } else if (form.skills.includes("PHONE_CALLS")) {
    // just set how and type
    volunteer_how = "make calls"
    volunteer_type = 2
  } else if (form.skills.includes("WRITING")) {
    // override candidate
    volunteer_candidate = {
      name: "Vote Forward",
      event_feed_url: "https://votefwd.org",
      description: "Sending a Vote Forward letter is one of the easiest things you can do to increase turnout."
    }
    volunteer_how = "send postcards"
  }else if (form.skills.includes("TEXTING")) {
    volunteer_how = "text bank"
  }
  // mobilize event types:
  // 1: canvass
  // 2: phone bank
  // 9: house parties
  // 12: friend-to-friend outreach

  // donate links
  const donate_senate = donate.actblue.filter(
    e => e.state === state && e.district === "Sen"
  )
  const donate_house = donate.actblue.filter(
    e => e.state === state && e.district === congressional_district_code
  )
  const donate_gov = donate.actblue.filter(
    e => e.state === state && e.district === "Gov"
  )
  // senate first, then house, then gov, then presidential
  const donate_candidate =
    senate_rating && donate_senate
      ? donate_senate[0]
      : house_rating && donate_house
      ? donate_house[0]
      : governor_rating && donate_gov
      ? donate_gov[0]
      : {
          name: "Biden 2020",
          donation_url: "https://secure.actblue.com/donate/biden2020",
        }

  // match movement vote orgs with our issues
  // GUN_VIOLENCE, ABORTION_RIGHTS, ENVIRONMENT, LGBTQ, VOTER_SUPPRESSION, POLICE_BRUTALITY, IMMIGRATION, HEALTH_CARE, MASS_INCARCERATION,
  const org_local_match = matchOrganization(
    state,
    form.issues,
    donate.movementvote
  )
  const org_national_match = matchOrganization(
    "",
    form.issues,
    donate.movementvote
  )
  // there's usually more than one, so randomize
  const donate_local = getRandom(org_local_match)
  const donate_national = getRandom(org_national_match)

  // links for reach states, senate and presidential only
  const reach_states = form.reach.map(state => {
    const senate_rating = ratings.senate.find(r => r.state === state)
    const donate_senate = donate.actblue.filter(
      e => e.state === state && e.district === "Sen"
    )
    const volunteer_senate = volunteer.mobilize.filter(
      o => o.state === state && o.race_type === "SENATE"
    )
    return {
      name: us_states.getStateNameByStateCode(state),
      race: senate_rating ? "Senate" : "Presidential",
      volunteer:
        senate_rating && volunteer_senate
          ? volunteer_senate[0]
          : {
              name: "2020 Victory",
              event_feed_url: "https://www.mobilize.us/2020victory/",
            },
      donate:
        senate_rating && donate_senate
          ? donate_senate[0]
          : {
              name: "Biden 2020",
              donation_url: "https://secure.actblue.com/donate/biden2020",
            },
    }
  }, [])

  return {
    ballot: {
      senate_candidates: senate_candidates,
      senate_rating: senate_rating,
      house_candidates: house_candidates,
      house_rating: house_rating,
      governor_rating: governor_rating,
      governor_candidates: governor_candidates,
      state_sos_candidates: state_sos_candidates,
      state_ag_candidates: state_ag_candidates,
      state_house_rating: state_house_rating,
      state_senate_rating: state_senate_rating,
    },
    time: {
      volunteer_time: volunteer_time,
      volunteer_how: volunteer_how,
      volunteer_type: volunteer_type,
      volunteer_candidate: volunteer_candidate,
    },
    money: {
      donate_candidate: donate_candidate,
      donate_local: donate_local,
      donate_national: donate_national,
    },
    reach: {
      states: reach_states,
    },
  }
}
