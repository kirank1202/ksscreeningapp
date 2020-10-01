import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { Auth } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut, AmplifyAuthFields } from '@aws-amplify/ui-react';
import EvaluationApp from "./EvaluationApp";
import CollectionApp from "./CollectionApp"; 

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

  
  let currentUserGroup =``; 

  useEffect(() => {
   async function fetchCurrentUserGroup() { 
    Auth.currentAuthenticatedUser().then((authuser) =>  {
      currentUserGroup =   authuser.signInUserSession.idToken.payload["cognito:groups"][0];
      console.log(currentUserGroup,'this is the currentuser in useEffect',currentUserGroup.length);
    })
   }

  fetchCurrentUserGroup();
  console.log(currentUserGroup,'this is the currentuser after fetchuserGroup method', {fetchCurrentUserGroup}.length);
  
}, []);


async function fetchCurrentUserGroup() { 
    
  Auth.currentAuthenticatedUser().then((authuser) =>  {
    currentUserGroup =   authuser.signInUserSession.idToken.payload["cognito:groups"][0];
    console.log(currentUserGroup,'this is the currentuser in fetchFunction',currentUserGroup.length);
    return currentUserGroup;
  })
 
 }
  
 Auth.currentAuthenticatedUser().then((authuser) =>  {
  currentUserGroup =   authuser.signInUserSession.idToken.payload["cognito:groups"][0];
  console.log(currentUserGroup,'this is the currentuser rightafter fetching it',currentUserGroup.length);
 });

 console.log(currentUserGroup,'this is the currentuser before return',currentUserGroup.length);

  return (
    <div className="App">
      <h2>Screening App</h2>  
      {fetchCurrentUserGroup}
      {currentUserGroup != "DataCollection" ?<CollectionApp /> :<EvaluationApp />}
        <AmplifySignOut />
    </div>
  );
  
}
export default withAuthenticator(App);