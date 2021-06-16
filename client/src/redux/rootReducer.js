import { combineReducers } from "redux";

import { alertReducer, ALERT_KEY } from "./alertReducer/alert.reducer";

let rootReducer = combineReducers({
  [ALERT_KEY]: alertReducer,
});

export default rootReducer;
