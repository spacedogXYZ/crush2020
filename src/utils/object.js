import React from "react"

export function updateDict(object, key, update) {
    return Object.assign(object[key] || {}, update);
}

// way to get reference to useState setter, to call in other function
// https://stackoverflow.com/a/62015336/264790
export function useReferredState(initialValue) {
    const [state, setState] = React.useState(initialValue);
    const reference = React.useRef(state);

    const setReferredState = value => {
        reference.current = value;
        setState(value);
    };

    return [reference, setReferredState];
}