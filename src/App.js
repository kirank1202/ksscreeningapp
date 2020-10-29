import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import { Auth } from "aws-amplify";
import {
  withAuthenticator,
  AmplifySignOut,
  AmplifyAuthFields,
} from "@aws-amplify/ui-react";
import EvaluationApp from "./EvaluationApp";
import CollectionApp from "./CollectionApp";
import ReportsApp from './ReportsApp';

/*
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export function SingleRowSelectionGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} />
    </div>
  );
}
*/

function App() {
  const DATA_COLLECTION_GROUP = "DataCollection";
  const DATA_EVALUATOR_GROUP = "DataEvaluator";
  const [userType, setUserType] = useState("");

  let currentUserGroup = ``;

  useEffect(() => {
    async function fetchCurrentUserGroup() {
      Auth.currentAuthenticatedUser().then((authuser) => {
        // console.log(authuser);
        currentUserGroup =
          authuser.signInUserSession.idToken.payload["cognito:groups"][0];
        setUserType(currentUserGroup);
        console.log(
          currentUserGroup,
          "this is the currentuser in useEffect",
          currentUserGroup.length
        );
      });
    }

    fetchCurrentUserGroup();
    console.log(
      currentUserGroup,
      "this is the currentuser after fetchuserGroup method",
      { fetchCurrentUserGroup }.length
    );
  }, []);

  async function fetchCurrentUserGroup() {
    Auth.currentAuthenticatedUser().then((authuser) => {
      currentUserGroup =
        authuser.signInUserSession.idToken.payload["cognito:groups"][0];
      console.log(
        currentUserGroup,
        "this is the currentuser in fetchFunction",
        currentUserGroup.length
      );
      return currentUserGroup;
    });
  }

  Auth.currentAuthenticatedUser().then((authuser) => {
    currentUserGroup =
      authuser.signInUserSession.idToken.payload["cognito:groups"][0];
    console.log(
      currentUserGroup,
      "this is the currentuser rightafter fetching it",
      currentUserGroup.length
    );
  });

  console.log(
    currentUserGroup,
    "this is the currentuser before return",
    currentUserGroup.length
  );

  return (
    <div className="App">
      <Router>
          <Route path="/collection" component={CollectionApp} />
          <Route path="/evaluation" component={EvaluationApp} />
          <Route path="/reports" component={ReportsApp} />
          {fetchCurrentUserGroup}
          {
            userType === "DataCollection" ? (
              <Redirect to="/collection" />
            ) : (
              <Redirect to="/evaluation" />
            )
          }
          <AmplifySignOut />
      </Router>
    </div>
  );
}
export default withAuthenticator(App);
//export default App;
