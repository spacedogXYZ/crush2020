import React, { createContext, useReducer, useContext } from "react";

function formReducer(state, action) {
  switch (action.type) {
    case "VOTE_REGISTERED_CHANGE":
      return { ...state, registered: action.payload };
    case "VOTE_BY_MAIL_CHANGE":
      return { ...state, vbm: action.payload };
    case "LOCATION_CHANGE":
      return { ...state, location: action.payload };
    case "TIME_CHANGE":
      return { ...state, time: action.payload };
    case "MONEY_CHANGE":
      return { ...state, money: action.payload };
    case "ISSUES_CHANGE":
      return { ...state, issues: action.payload };
    case "SKILLS_CHANGE":
      return { ...state, issues: action.payload };
    case "NAME_CHANGE":
      return { ...state, name: action.payload };
    case "EMAIL_CHANGE":
      return { ...state, email: action.payload };
    case "SUBMIT":
      return { ...state, isSubmitLoading: true };
    case "SUBMISSION_RECEIVED":
      return { ...state, isSubmitLoading: false, isSubmissionReceived: true };
    default:
      throw new Error();
  }
}

const FormContext = createContext();

const initialState = {
  registered: false,
  vbm: false,

  location: "",
  issues: [],
  skills: [],
  time: 0,
  money: 0,
  community: [],

  name: "",
  email: "",
  twitter: "",
  instagram: "",

  isSubmitLoading: false,
  isSubmissionReceived: false
};

export const FormProvider = function({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

export function useFormState() {
  const context = useContext(FormContext);

  if (context === undefined) {
    throw new Error(
      "useFormState must be used within a FormContext"
    );
  }

  return context;
}