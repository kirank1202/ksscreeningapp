import React from "react";
import { useHistory } from "react-router-dom";

const ReportsApp = () => {
    let history = useHistory();

    return (
      <div className="ReportsApp">
        This is Reports App!!
        <br/>
        <button
          className="SubmitButton"
          onClick={() => {
            history.push("/collection");
          }}
        >
          Go To Collection App
        </button>
        <br/>
        <button
          className="SubmitButton"
          onClick={() => {
            history.push("/evaluation");
          }}
        >
          Go To Evaluation App
        </button>
      </div>
    );
}

export default ReportsApp;