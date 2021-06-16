import { v4 } from "uuid";
import { REMOVE_ALERT, SET_ALERT } from "./alert.actions.types";

let setAlert = (message, color, timeOut = 5000) => {
  return (dispatch) => {
    let id = v4();

    dispatch({ type: SET_ALERT, payload: { message, color, id } });

    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT,
        payload: { message, color, id, timeOut },
      });
    }, 3000);
  };
};

export { setAlert };
