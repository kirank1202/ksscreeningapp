import React from "react";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo from "./TeledentalSolutionLogo13.png";
import { makeStyles } from "@material-ui/core/styles";

const ReportsApp = () => {
    let history = useHistory();

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
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
      },
      paper: {
          position: "absolute",
          width: 400,
          backgroundColor: theme.palette.background.paper,
          border: "2px solid #000",
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
      },
  }));
  const classes = useStyles();

    return (
      <div className="HelpVideoApp">
        Welcome to Screening Help Videos 
        <br/>
        <AppBar position="fixed" color="#fff">
                    <Toolbar className={classes.flexToolbar}>
                        <img class="logo_style" src={logo} alt="..." />
                        <h5 className="logo-header" color="#fff">School Dental Screening Help </h5>
                            <nav role="navigation" class="desktop">
                            <ul id="d-menu">
                                <li><a onClick={() => history.push('collection')}>Screening App</a> </li>
                            </ul>
                            </nav>
                            <nav role="navigation" class="mobile">
                            <div id="menuToggle">
                                <input type="checkbox" />
                                <span></span>
                                <span></span>
                                <span></span>
                                <ul id="menu">
                                    <li><a onClick={() => history.push('collection') }>Screening App</a> </li>
                                </ul>
                            </div>
                        </nav>
                    </Toolbar>
                </AppBar>
                <br></br> 
                <br></br>
        <h3 class="helpSupport-heading"> Help Videos</h3>

        <h5 class="help-items" align="left">
        <a href="https://youtu.be/oWImHHcAhi4" target= "_blank">
            1. Demo of taking screening pictures using mobile phone
        </a>
        <br></br> <p></p>
        <a href="https://www.youtube.com/watch?v=ZRb-4HpAE9Y" target= "_blank">
            2. How to prepare for taking screening pictures
        </a>
        <br></br> <p></p>
        <a href="https://vimeo.com/477795755" target= "_blank">
            3. Demo of Completing student information and uploading dental images
        </a>
        </h5>
        <br></br> <p></p>
        <h3 class="helpSupport-heading"> Support </h3>
        <h5 class="help-items" align="left"> 
        <p></p> If you encounter any technical issues please email {" "}
        <a href = "mailto:support@Teledentalsolutions.com">Support@TeledentalSolutions.com </a>
       <p></p>
       </h5>
        <br/>
      </div>
    );
}

export default ReportsApp;