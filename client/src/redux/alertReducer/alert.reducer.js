import { SET_ALERT, REMOVE_ALERT } from "./alert.actions.types";

export const ALERT_KEY = "alert";

let initialState = [];

let alertReducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return [...state.filter((alert) => alert.id !== payload.id)];
    default:
      return state;
  }
};

export { alertReducer };
