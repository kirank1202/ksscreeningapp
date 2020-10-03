import React, { useState, useEffect } from "react";
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
import Details from "./details";
import { Route, BrowserRouter, Switch } from "react-router-dom";

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
  const [userType, setUserType] = useState("");

  let currentUserGroup = ``;

  useEffect(() => {
    async function fetchCurrentUserGroup() {
      Auth.currentAuthenticatedUser().then((authuser) => {
        currentUserGroup =
          authuser.signInUserSession.idToken.payload["cognito:groups"][0];
        setUserType(currentUserGroup);
      });
    }

    fetchCurrentUserGroup();
  }, []);

  const HomePage = () => {
    console.log(userType, "userType");
    return (
      <div>
        {userType !== "DataCollection" ? <CollectionApp /> : <EvaluationApp />}
        <AmplifySignOut />
      </div>
    );
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/details" component={Details} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default withAuthenticator(App);
