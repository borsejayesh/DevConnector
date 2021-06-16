import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { ALERT_KEY } from "../../../redux/alertReducer/alert.reducer";

const Alert = () => {
  let alerts = useSelector((state) => state[ALERT_KEY]);

  return (
    <Fragment>
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.color}`}>
          {alert.message}
        </div>
      ))}
    </Fragment>
  );
};
export default Alert;
