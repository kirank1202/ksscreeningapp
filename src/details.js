import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import logo from './TeledentalSolutionLogo13.png';
import { makeStyles } from '@material-ui/core/styles';
import AvatarImg from './avatar.png';

const Details = (props) => {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      // flexGrow: 1,
    },
    flexToolbar: {
      padding: '0 100px',
      display: 'flex',
      justifyContent: 'space-between',
    },
  }));

  const classes = useStyles();

  const data = props.location.state;

  console.log(data);

  if (!data) {
    props.history.push('/');
  }

  return (
    <div className="details-page-container">
      <div className={classes.root}>
        <AppBar position="static" color="#fff">
          <Toolbar className={classes.flexToolbar}>
            <img src={logo} alt="..." />
            {/* <div style={{ display: "flex", alignItems: "center" }}>
                            <img src={userImage} height="46px" alt="..." />
                            <span style={{ display: "inline" }}>
                                Henry labbawockie
                            </span>
                        </div> */}
          </Toolbar>
        </AppBar>
      </div>
      <div className="details-whole-container">
        <div className="details-details-container">
          <div className="details-user">
            <div className="details-user-user">
              <img src={AvatarImg} alt="..." />
              <p>{data.name}</p>
            </div>
            <p>gender: {data.gender}</p>
            <p>grade: {data.grade}</p>
            <p>school: {data.school}</p>
          </div>
        </div>
        <div className="details-image-container">
          <img src={data.topimage} alt="..." />
          <img src={data.bottomimage} alt="..." />
          <img src={data.leftimage} alt="..." />
          <img src={data.rightimage} alt="..." />
        </div>
      </div>
    </div>
  );
};

export default withRouter(Details);
