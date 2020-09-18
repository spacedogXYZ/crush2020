import React, { createContext, useReducer, useContext } from "react"

function reducer(state, action) {
  switch (action.type) {
    case "STEP_CHANGE":
      return { ...state, step: action.payload }
    case "SOURCE_CHANGE":
      return { ...state, source: action.payload }
    case "VOTE_REGISTERED_CHANGE":
      return { ...state, registered: action.payload }
    case "VOTE_BY_MAIL_CHANGE":
      return { ...state, vbm: action.payload }
    case "LOCATION_CHANGE":
      return { ...state, location: action.payload }
    case "GEOCODE_CHANGE":
      return { ...state, geocode: action.payload }
    case "TIME_CHANGE":
      return { ...state, time: action.payload }
    case "MONEY_CHANGE":
      return { ...state, money: action.payload }
    case "ISSUES_CHANGE":
      return { ...state, issues: action.payload }
    case "SKILLS_CHANGE":
      return { ...state, skills: action.payload }
    case "REACH_CHANGE":
      return { ...state, reach: action.payload }
    case "NAME_CHANGE":
      return { ...state, name: action.payload }
    case "EMAIL_CHANGE":
      return { ...state, contact: { ...state.contact, email: action.payload } }
    case "INSTAGRAM_CHANGE":
      return {
        ...state,
        contact: { ...state.contact, instagram: action.payload },
      }
    case "TWITTER_CHANGE":
      return {
        ...state,
        contact: { ...state.contact, twitter: action.payload },
      }
    case "SUBMIT":
      return { ...state, isSubmitLoading: true }
    case "SUBMISSION_RECEIVED":
      return { ...state, isSubmitLoading: false, isSubmissionReceived: true, uid: action.payload }
    case "LOAD_FORM":
      return action.payload
    default:
      throw new Error('invalid action.type in formReducer')
  }
}

export const Context = createContext()

const initialState = {
  step: 0,
  uid: false,
  source: '',
  registered: false,
  vbm: false,

  location: "",
  geocode: {},
  issues: [],
  skills: [],
  time: 1,
  money: 20,
  reach: [],

  name: false,
  contact: {
    email: false,
    twitter: false,
    instagram: false,
  },

  isSubmitLoading: false,
  isSubmissionReceived: false,
}

export const Store = function ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  )
}

export function useAppState() {
  return useContext(Context)
}
