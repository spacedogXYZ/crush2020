import {
  padCode,
  unpadCode,
  isCompetitive,
  isLikely,
} from "../../utils/strings"
import { shuffle, groupBy, sortDescending } from "../../utils/object"
import { stateLegDistrict } from "../../utils/geography"
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
      return volunteer_gov[0]
    } else {
      return {
        name: candidates.governor.find(c =>
          c.CAND_PTY_AFFILIATION.startsWith("D")
        ),
      }
    }
  }

  return {
    name: "Biden/Harris 2020",
    event_feed_url: "https://go.joebiden.com/page/s/Distributed-volunteers",
  }
}

function matchOrganization(state, issues, orgs) {
  // given state, issues and organizations
  // return a list of orgs in that state which match issue areas
  // and have donation links

  let matches = orgs.filter(o => {
    if (!o.donation_url) {
      return false
    }
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

  if(state === "") {
    // national additions that aren't from MVP
    if(issues.includes("GUN_VIOLENCE")) {
      matches.push({
        name: "March For Our Lives",
        description: "March For Our Lives has hundreds of chapters around the country led by students who enact change on the local level.",
        website: "https://marchforourlives.com/our-power-in-the-states/",
        donation_url: "https://secure.everyaction.com/45zW1UMUqUycXs7bfGH8gA2",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/March_For_Our_Lives.svg/320px-March_For_Our_Lives.svg.png",
        hide_mvp: true,
      })
    }

    if(issues.includes("VOTER_SUPPRESSION")) {
      matches.push({
        name: "Spread the Vote",
        description: "Spread the Vote helps members of our communities empower themselves to be heard at the polls: with IDs, registration, education, and turnout.",
        website: "https://www.spreadthevote.org/volunteer",
        donation_url: "https://www.kindest.com/donate/spread-the-vote",
        logo_url: "https://images.squarespace-cdn.com/content/5bf888c70dbda3e7f01335b3/1544655556721-2QL3RFZ2OG1CZGAR6W27/STV_logo_red.png?format=300w&content-type=image%2Fpng",
        hide_mvp: true,
      })

      matches.push({
        name: "We Got the Vote",
        description: "WeGotTheVote helps returning citizens pay fines & fees to fully participate in the democratic process.",
        website: "https://wegotthevote.org/",
        donation_url: "https://wegotthevote.org/finesandfees/",
        logo_url: "https://assets.wegotthevote.org/2019/04/WeGotTheVote-4C.svg",
        hide_mvp: true,
      })
    }
  }

  return matches
}

function sortCandidates(candidates, state, district, type) {
  // take a national list of candidates and returns just those relevant to state, district, type
  // type should be in [FEDERAL, STATEWIDE, STATELEG]
  if (type === "FEDERAL") {
    // we don't actually have primary win/loss records from FEC
    // use amount raised as a proxy (NB, this is not perfect)
    if (["CA", "WA"].includes(state)) {
      // jungle primaries, sort by amount raised and pick top two overall
      return candidates.filter(c => c.CAND_OFFICE_ST === state && c.CAND_OFFICE_DISTRICT === district)
        .sort((a, b) => sortDescending(a.TTL_RECEIPTS, b.TTL_RECEIPTS))
        .slice(0, 2)
    } else {
      // simulate a primary by sorting within party by amount raised
      // and then pick the top from each party
      const filtered_candidates = candidates.filter(c => c.CAND_OFFICE_ST === state && c.CAND_OFFICE_DISTRICT === district)
      const parties = groupBy(filtered_candidates, "CAND_PTY_AFFILIATION")
      const assumed_winners = Object.keys(parties).map((p) => {
        let winner = parties[p].sort((a, b) => sortDescending(a.TTL_RECEIPTS,b.TTL_RECEIPTS))[0]
        return winner
      })

      // GA has two senate races
      if (state === "GA" && district === "00") {
        return [{
          'CAND_NAME': 'OSSOF, JON',
          'CAND_PTY_AFFILIATION': 'D'
        },{
          'CAND_NAME': 'PERDUE, DAVID',
          'CAND_PTY_AFFILIATION': 'R'
        }]
      }

      if (state === "GA" && district === "SP") {
        return [{
          'CAND_NAME': 'WARNOCK, RAPHAEL',
          'CAND_PTY_AFFILIATION': 'D'
        },{
          'CAND_NAME': 'LOEFFLER, KELLEY',
          'CAND_PTY_AFFILIATION': 'R'
        },{
          'CAND_NAME': 'COLLINS, DOUG',
          'CAND_PTY_AFFILIATION': 'R'
        },{
          'CAND_NAME': 'LIEBERMAN, MATT',
          'CAND_PTY_AFFILIATION': 'D'
        }]
      }

      // check known list of primary upsets
      if (state === "CO" && district === "03") {
        // Lauren Boebert defeated incumbent Scott Tipton in Rep primary
        return [{
          'CAND_NAME': 'BUSH, DIANE MITSCH',
          'CAND_PTY_AFFILIATION': 'D'
        },{
          'CAND_NAME': 'BOEBERT, LAUREN',
          'CAND_PTY_AFFILIATION': 'R'
        }]
      }
      if (state === "IA" && district === "04") {
        // Steve King lost to Randy Feenstra in Rep primary
        return [{
          'CAND_NAME': "SCHOLTEN, JAMES D.",
          'CAND_PTY_AFFILIATION': 'D'
        }, {
          'CAND_NAME': "FEENSTRA, RANDALL",
          'CAND_PTY_AFFILIATION': 'R'
        }]
      }
      if (state === "IL" && district === "03") {
        // Steve King lost to Randy Feenstra
        return [{
          'CAND_NAME': "NEWMAN, MARIE",
          'CAND_PTY_AFFILIATION': 'D'
        }, {
          'CAND_NAME': "FRICILONE, MIKE",
          'CAND_PTY_AFFILIATION': 'R'
        }]
      }
      if (state === "NC" && district === "11") {
        // Mark Meadows resigned to go to White House
        // Madison Cawthorne won GOP nom
        return [{
          'CAND_NAME': "DAVIS, MORRIS",
          'CAND_PTY_AFFILIATION': 'D'
        }, {
          'CAND_NAME': "CAWTHORN, DAVID MADISON",
          'CAND_PTY_AFFILIATION': 'R'
        }]
      }
      if (state === "NY" && district === "07") {
        // Avery Periera dropped out, leaving Brian Kelley (who isn't in FEC data)
        return [{
          'CAND_NAME': "VELAZQUEZ, NYDIA M.",
          'CAND_PTY_AFFILIATION': 'D'
        }, {
          'CAND_NAME': "KELLEY, BRIAN",
          'CAND_PTY_AFFILIATION': 'R'
        }]
      }
      if (state === "NY" && district === "17") {
        // Open dem primary for this seat, Mondaire defeated Schliefer et al
        return [{
          'CAND_NAME': "JONES, MONDAIRE",
          'CAND_PTY_AFFILIATION': 'D'
        }, {
          'CAND_NAME': "MCARDLE SCHULMAN, MAUREEN B",
          'CAND_PTY_AFFILIATION': 'R'
        }]
      }
      if (state === "MO" && district === "01") {
        // Cori Bush defeated incumbent Lacy Clay in Dem primary
        return [{
          'CAND_NAME': "BUSH, CORI",
          'CAND_PTY_AFFILIATION': 'D'
        }]
      }
      if (state === "TN" && district === "00") {
        // Marquita Bradshaw defeated Hayes and Mackler in Dem primary
        return [{
          'CAND_NAME': 'BRADSHAW, MARQUITA',
          'CAND_PTY_AFFILIATION': 'D'
        },{
          'CAND_NAME': 'HAGERTY, BILL',
          'CAND_PTY_AFFILIATION': 'R'
        }]
      }
      if (state === "VA" && district === "05") {
        // Robert Good defeated Denver Riggleman in Rep primary
        return [{
          'CAND_NAME': "WEBB, BRYANT CAMERON",
          'CAND_PTY_AFFILIATION': 'D'
        }, {
          'CAND_NAME': "GOOD, ROBERT",
          'CAND_PTY_AFFILIATION': 'R'
        }]
      }

      return assumed_winners
        .sort((a, b) => sortDescending(a.TTL_RECEIPTS, b.TTL_RECEIPTS))
        .slice(0, 2)
      }
  } else if (type === "STATEWIDE" || type === "STATELEG") {
    // we do have win/loss from FollowTheMoney
    // and have already filtered by it
    // keep sorted to put more likely candidates at the top
    // TODO, if candidates are "Pending Primary", simulate as above

    return candidates.filter(
      c =>
        c.Election_Jurisdiction === state &&
        c.Office_Sought === district
    ).sort((a, b) => sortDescending(a.Total__, b.Total__))
    // but don't limit to top-two
  }  
}

export function makePlan(form, data) {
  const { candidates, ratings, volunteer, donate } = data
  if (!form || !form.geocode) {
    // can't make a plan without a location
    return {}
  }

  const state = form.geocode.state

  const senate_candidates = sortCandidates(candidates.federal, state, "00", "FEDERAL")
  const senate_candidates_special = sortCandidates(candidates.federal, state, "SP", "FEDERAL")

  const congressional_district = form.geocode.cd
  const congressional_district_code = padCode(congressional_district, 2, "0")
  const state_house_district = stateLegDistrict(form.geocode.state, 'LOWER', form.geocode.state_lower).toUpperCase()
  const state_senate_district = stateLegDistrict(form.geocode.state, 'UPPER', form.geocode.state_upper).toUpperCase()

  // 
  const house_candidates = sortCandidates(candidates.federal, state, congressional_district_code, "FEDERAL")
  const governor_candidates = sortCandidates(candidates.statewide, state, "GOVERNOR", "STATEWIDE")    
  const state_sos_candidates = sortCandidates(candidates.statewide, state, "SECRETARY OF STATE", "STATEWIDE")
  const state_ag_candidates = sortCandidates(candidates.statewide, state, "ATTORNEY GENERAL", "STATEWIDE")
  const state_house_candidates = sortCandidates(candidates.stateleg, state, state_house_district, "STATELEG")
  const state_senate_candidates = sortCandidates(candidates.stateleg, state, state_senate_district, "STATELEG")

  const senate_rating = ratings.senate.find(r => r.state === state)
  const senate_rating_special = ratings.senate.find(r => r.state === `${state}-SP`)
  const house_rating = ratings.house.find(
    r => r.district === `${state}-${congressional_district_code}`
  )
  const governor_rating = ratings.governor.find(r => r.state === state)
  // const state_senate_rating = ratings.state_legislature.find(
  //   r => r.state === state && r.chamber.toUpperCase() === "UPPER"
  // )
  // const state_house_rating = ratings.state_legislature.find(
  //   r => r.state === state && r.chamber.toUpperCase() === "LOWER"
  // )

  // volunteer links
  const state_candidates = {
    senate: senate_candidates,
    house: house_candidates,
    governor: governor_candidates,
    stateleg_lower: state_house_candidates,
    stateleg_upper: state_senate_candidates
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
  } else if (form.skills.includes("ELECTION_DAY")) {
    volunteer_how = "Sign up to work the polls"
    // override candidate
    volunteer_candidate = {
      name: "Power the Polls",
      event_feed_url: "https://www.powerthepolls.org",
      description: "You can help make sure we have a safe, fair, efficient election for all voters, and potentially get paid to do it."
    }
    volunteer_time = "to be a poll worker on Election Day"
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
  } else if (form.skills.includes("TEXTING")) {
    volunteer_how = "text bank"
  }

  if (!volunteer_candidate) {
    // fall back to presidential
    volunteer_candidate = {
      name: "Biden/Harris 2020",
      event_feed_url: "https://go.joebiden.com/page/s/Distributed-volunteers",
    }
  }

  // mobilize event types:
  // 1: canvass
  // 2: phone bank
  // 9: house parties
  // 12: friend-to-friend outreach
  if (volunteer_candidate.event_feed_url &&
    volunteer_candidate.event_feed_url.includes('mobilize.us')
    && !!volunteer_type) {
      volunteer_candidate.event_feed_url += `?event_type=${volunteer_type}`
  }

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
    senate_rating && isCompetitive(senate_rating.rating) && donate_senate
      ? donate_senate[0]
    : house_rating && (isCompetitive(house_rating.rating) || isLikely(house_rating.rating)) && donate_house
      ? donate_house[0]
    : governor_rating && isCompetitive(governor_rating.rating) && donate_gov
      ? donate_gov[0]
    : {
        name: "Biden 2020",
        donation_url: "https://secure.actblue.com/donate/biden2020",
      }

  // match movement vote orgs with our issues
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
  // there's usually more than one, so shuffle and return entire list
  const donate_local = shuffle(org_local_match)
  const donate_national = shuffle(org_national_match)

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
              name: "DNC 2020 Victory",
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
      vote: data.vote[state],
      senate_candidates: senate_candidates,
      senate_candidates_special : senate_candidates_special || [],
      senate_rating: senate_rating,
      senate_rating_special: senate_rating_special,
      house_candidates: house_candidates,
      house_rating: house_rating,
      governor_rating: governor_rating,
      governor_candidates: governor_candidates,
      state_sos_candidates: state_sos_candidates,
      state_ag_candidates: state_ag_candidates,
      state_house_candidates: state_house_candidates,
      state_senate_candidates: state_senate_candidates,
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
