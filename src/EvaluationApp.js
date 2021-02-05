import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { listStudents } from "./graphql/queries";
import {
  createStudent as createStudentMutation,
  deleteStudent as deleteStudentMutation,
  updateStudent as updateStudentMutation,
} from "./graphql/mutations";
import "./App.css";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo from "./TeledentalSolutionLogo13.png";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";

const EvaluationApp = () => {
  const [students, setStudents] = useState([]);
  const [imageData, setImageData] = useState();
  const [screenerName, setscreenerName] = useState("");
  const initialState = {
    untreatedDecay: "No",
    treatedDecay: "No",
    sealantsPresent: "Sealants Not Present",
    treatmentRecommendationCode: "No obvious problem",
    cannotEvaluate: "NA",
  };
  const [states, setState] = React.useState(initialState); // const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const imageSection = useRef(null);
  const [imageLink, setImageLink] = React.useState("");
  let history = useHistory();
  window.$stateChanged = false;

  const func = async() => {
    let user = await Auth.currentAuthenticatedUser();
    setscreenerName(user.username); //all attributes exist in the attributes field 
  }
  func();

  const handleOpen = () => {
    setOpen(!open);
  };
  //console.log("ABC", states); // function getModalStyle() { // const top = 15; // const left = 15; // return { // top: `${top}%`, // left: `${left}%`, // transform: `translate(-${top}%, -${left}%)`, // }; // }
  useEffect(() => {
    fetchAllStudents();
  }, []); /* retrieve all students from DynamoDB using graphql API interace */

  async function fetchAllStudents() {
    const apiData = await API.graphql({ query: listStudents });
    const studentsFromAPI = apiData.data.listStudents.items;
    await Promise.all(
      studentsFromAPI.map(async (student) => {
        if (student.leftimage) {
          const image = await Storage.get(student.leftimage);
          student.leftimage = image;
        }
        if (student.rightimage) {
          const image = await Storage.get(student.rightimage);
          student.rightimage = image;
        }
        if (student.topimage) {
          const image = await Storage.get(student.topimage);
          student.topimage = image;
        }
        if (student.bottomimage) {
          const image = await Storage.get(student.bottomimage);
          student.bottomimage = image;
        }
        if (student.nonsmilingface) {
          const image = await Storage.get(student.nonsmilingface);
          student.nonsmilingface = image;
        }
        if (student.frontTeeth) {
          const image = await Storage.get(student.frontTeeth);
          student.frontTeeth = image;
        }
        return student;
      })
    );
    let sortedArr = apiData.data.listStudents.items.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ); // setStudents(apiData.data.listStudents.items);
    setStudents(sortedArr);
  }
  async function deleteStudent({ id }) {
    const student = students.find((student) => student.id === id);
    const newStudentArray = students.filter((student) => student.id !== id);
    setStudents(newStudentArray);
    await API.graphql({
      query: deleteStudentMutation,
      variables: { input: { id: id } },
    });
    await Storage.remove(student.leftimage);
    await Storage.remove(student.rightimage);
    await Storage.remove(student.topimage);
    await Storage.remove(student.bottomimage);
  }

  function handleCannotEvaluate(event){

    // Do nothing for now. In future we may activate this alert.
   // alert("Please make sure you are not able to evaluated based on the images before you select this reason");
  }

  // set evaluation fields for new student selected i.e. new row. Initialize if null
  async function setNewStateForEvalFields(newStudent){
    if (newStudent == null) {
      return;
    } else {
      //assign values of new student to temp variables
      let newUntreatedDecay = newStudent.untreatedDecay;
      let newTreatedDecay = newStudent.treatedDecay ;
      let newTreatmentRecommendationCode = newStudent.treatmentRecommendationCode;
      let newSealantsPresent = newStudent.sealantsPresent;
      let newCannotEvaluate = newStudent.cannotEvaluate;
      let newEvalStatus = newStudent.evalStatus;
      

      // set initial values if new student fields are not valid values
      if (newUntreatedDecay == null | newUntreatedDecay == "") { newUntreatedDecay= "No"; } 
      if (newTreatedDecay == null | newTreatedDecay == "") { newTreatedDecay = "No"; }
      if (newSealantsPresent == null | newSealantsPresent == "") { newSealantsPresent = "No"; } 
      if (newTreatmentRecommendationCode == null | newTreatmentRecommendationCode == "") { newTreatmentRecommendationCode = "No obvious problem"; } 
      if (newCannotEvaluate == null | newCannotEvaluate == "") { newCannotEvaluate = "NA"; } 
      
      //set new state with initiated or valid values
      states.untreatedDecay = newUntreatedDecay;
      states.treatedDecay = newTreatedDecay;
      states.sealantsPresent = newSealantsPresent;
      states.treatmentRecommendationCode = newTreatmentRecommendationCode;
      states.cannotEvaluate = newCannotEvaluate;
      states.evalStatus = newEvalStatus;
    }
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (imageData < students.length) {
        setImageData(imageData + 1);
      }
      
     if(states.cannotEvaluate == "NotClear") {
      states.evalStatus = "Incomplete";
     } else { 
       states.evalStatus = "Completed";
     }
      // to be submitted info.
      const toSubmitStudentId = students[imageData].id;
      const toSubmitStateUD = states.untreatedDecay.toString();
      const toSubmitStateTD = states.treatedDecay.toString();
      const toSubmitStateTRC = states.treatmentRecommendationCode.toString();
      const toSubmitStateSP= states.sealantsPresent.toString();
      const toSubmitStateCE= states.cannotEvaluate.toString();
      const toSubmitStateES=states.evalStatus;
      // Next Student data setting.
      students[imageData].untreatedDecay = states.untreatedDecay;
      students[imageData].treatedDecay = states.treatedDecay;
      students[imageData].treatmentRecommendationCode = states.treatmentRecommendationCode;
      students[imageData].sealantsPresent = states.sealantsPresent;
      students[imageData].evalStatus = states.evalStatus;
      //console.log("1", imageData);

      // Next state data setting.
      setNewStateForEvalFields(students[imageData+1]);
 
      setState(states);
      setStudents(students);

      //console.log("1", imageData);
      await API.graphql({
        query: updateStudentMutation,
        variables: {
          input: {
            id: toSubmitStudentId,
            untreatedDecay: toSubmitStateUD,
            treatedDecay: toSubmitStateTD,
            treatmentRecommendationCode: toSubmitStateTRC,
            sealantsPresent: toSubmitStateSP,
            evalStatus: toSubmitStateES,
            cannotEvaluate: toSubmitStateCE
          },
        },
      }); // setState(initialState);
      // //setImageData(imageData);

      alert("Evaluation Recorded Successfully for student " + students[imageData].code);
    } catch (error) {
      console.error(error);
    }
  }
  
  function selectDDValue(imgIndex, stateProperty) {
      console.log("Student on DD Change", imgIndex, stateProperty, students[imgIndex][stateProperty]);
      console.log("State on DD Change", states[stateProperty]);
      return states[stateProperty];
  }
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
      width: "550px !important",
      height: "auto !important",
      backgroundColor: theme.palette.background.paper,
      border: "5px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  
  function focusOnImages() {
    if (imageSection.current) {
      imageSection.current.focus();
    }
  }
  const handleFormState = (key) => {
    console.log("students in handleformState:", students[key]);
    // if (students[key] && students[key].untreatedDecay) {
    //   setState({
    //     ...states,
    //     untreatedDecay: students[key].untreatedDecay,
    //    });
    //   // console.log("untreated decay", students[key].untreatedDecay); // useEffect(() => {console.log('1', states.untreatedDecay); }, [states]);
    //   // console.log("1", states.untreatedDecay);
    // } 
    console.log("*******: ",students[key].untreatedDecay);

    if (students[key]) {
      setNewStateForEvalFields (students[key]);
      setState(states); 
    }
      /*
      if (students[key].cannotEvaluate){
        states.cannotEvaluate = students[key].cannotEvaluate;
        setState(states);
      } else {
        states.cannotEvaluate = "NA";
        setState(states);
      }
      
    }
    if (students[key] && students[key].untreatedDecay) {
      states.untreatedDecay = students[key].untreatedDecay;
      setState(states);
      console.log("Immediate states 2:", states); 
      // setState({
      //   ...states,
      //   untreatedDecay: students[key].untreatedDecay,
      // });
    }
    if (students[key] && students[key].treatedDecay) {
      states.treatedDecay = students[key].treatedDecay;
      setState(states);
      //setState({ ...states, treatedDecay: students[key].treatedDecay });
    }
    if (students[key] && students[key].sealantsPresent) {
      states.sealantsPresent = students[key].sealantsPresent;
      setState(states);
      // setState({
      //   ...states,
      //   sealantsPresent: students[key].sealantsPresent,
      // });
      //console.log("Students sealantsPresent inside form state", students[key].sealantsPresent); // useEffect(() => {console.log('1', states.untreatedDecay); }, [states]);
     // console.log("States sealantsPresent inside form state", states.sealantsPresent);
    }
    if (students[key] && students[key].treatmentRecommendationCode) {
      states.treatmentRecommendationCode = students[key].treatmentRecommendationCode;
      setState(states);
      // setState({
      //   ...states,
      //   treatmentRecommendationCode: students[key].treatmentRecommendationCode,
      // });
    }
    */
    console.log("states end of handleformState:", states, key); 
  };
  const handleImageLink = (link) => {
    setImageLink(link);
    setOpen(!open); // console.log(imageLink)
  };


  const classes = useStyles();
  return (
    /* if user.group = "datacollector"
 {
 } */
    <div className="App">
      {/* {students.length === 0 && (
 <>
 <h2>Screening Evaluation App</h2>
 <h4>
 <button onClick={fetchAllStudents}>Fetch All Students</button>
 </h4>
 </>
 )} */}

      {students.length > 1 && (
        <>
          <div className={classes.root}>
            <AppBar position="fixed" color="#fff">
              <Toolbar className={classes.flexToolbar}>
                <img class="logo_style" src={logo} alt="..." />
                <h5 className="logo-header" color="#fff">School Dental Screening - Evaluation</h5>
                <nav role="navigation" class="desktop">
                  <ul id="d-menu">
                      <li> <a onClick={() => history.push('reports') }><h5> Reports</h5> </a> </li>
                      {/* <li>  <a onClick={() => history.push('collection') }>collection</a> </li>
                      <li> <a onClick={() => history.push('reports') }>Communication</a> </li>          
                      <li> <a href="https://www.teledentalsolutions.com/" target="_blank">Other</a></li> */}
                  </ul>
                </nav>
                <nav role="navigation" class="mobile">
                  <div id="menuToggle">
                      <input type="checkbox" />
                      <span></span>
                      <span></span>
                      <span></span>
                      <ul id="menu">
                        <li> <a onClick={() => history.push('reports') }>Reports</a> </li>
                      </ul>
                  </div>
                </nav>
              </Toolbar>
            </AppBar>
          </div>

          <div className="content-container table-scroll">
            {/* <InputGroup className="mb-3">
 <FormControl
 placeholder="Search Student ID # Or School ID #"
 aria-label="Username"
 aria-describedby="basic-addon1"
 />
 </InputGroup> */}

            <table>
              <thead>
              <tr>
                  <th class="main-th" colSpan="11">Hays Unified School District 489</th>
                </tr>
                <tr>
                  <th class="td-xsmall">#</th>
                  <th>School</th>
                  <th>Grade</th>
                  <th>Student Id</th>
                  <th>First Name</th>
                  <th>Gender</th>
                  <th>Dental Insurance</th>
                  <th>Date</th>
                  <th>Opt Out</th>
                  <th>Opt Out Reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, key) => (
                  <tr
                    key={key}
                    onClick={() => {
                      setImageData(key); // setEvalData(key);
                      handleFormState(key);
                      focusOnImages();
                    }}
                    className={
                      key === imageData
                        ? "table-row-page-active"
                        : "table-row-page"
                    }
                  >
                    <td class="td-xsmall">{key+1}</td>
                    <td>{student.school}</td>
                    <td>{student.grade}</td>
                    <td>{student.code}</td>
                    <td>{student.firstname3letters}</td>
                    <td>{student.gender}</td>
                    <td>{student.haveDentalInsurance}</td>

                    <td>
                      {new Date(student.createdAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td>{student.optout}</td>  
                    <td>{student.optoutReason}</td>
                    <td>{student.evalStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {students[imageData] ? (
            <div ref={imageSection}>
              <form onSubmit={handleSubmit}>
                <div className="image-info-container">
                  <p>
                    <b
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      ID:{" "}
                    </b>

                    {students[imageData].code}
                  </p>

                  <p>
                    <b
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      School:{" "}
                    </b>{" "}
                    {students[imageData].school}
                  </p>

                  <p>
                    <b
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      Grade:{" "}
                    </b>

                    {students[imageData].grade}
                  </p>
                  {/* <p>
                    <b
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      Screener Name:{" "}
                    </b>
                    {screenerName}
                  </p> */}
                  <p>
                    <b
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      Opt out Reason:{" "}
                    </b>
                    {students[imageData].optoutReason}
                  </p>
                </div>

                {(students[imageData].optout == "No") ? (
                  <div
                  style={{
                    marginBottom: "20px",
                    marginTop: "20px",
                  }}
                  className="teeth-image-container"
                > 
                  <div class="image-container">               
                    <label>Nonsmiling</label>
                    <img
                      src={students[imageData].nonsmilingface}
                      onClick={() =>
                        handleImageLink(students[imageData].nonsmilingface)
                      }
                      alt="..."
                    />
                  </div> 
                  <div class="image-container"> 
                    <label>Front</label>
                    <img
                      src={students[imageData].frontTeeth}
                      onClick={() =>
                        handleImageLink(students[imageData].frontTeeth)
                      }
                      alt="..."
                    />
                  </div>
                  <div class="image-container"> 
                    <label>Left</label>
                    <img
                      src={students[imageData].leftimage}
                      onClick={() =>
                        handleImageLink(students[imageData].leftimage)
                      }
                      alt="..."
                    />
                  </div>
                  <div class="image-container"> 
                    <label>Right</label>
                    <img
                      src={students[imageData].rightimage}
                      onClick={() =>
                        handleImageLink(students[imageData].rightimage)
                      }
                      alt="..."
                    />
                  </div>
                  <div class="image-container"> 
                    <label>Top</label>
                    <img
                      src={students[imageData].topimage}
                      onClick={() =>
                        handleImageLink(students[imageData].topimage)
                      }
                      alt="..."
                    />
                  </div>
                  <div class="image-container"> 
                    <label>Bottom</label>
                    <img
                      src={students[imageData].bottomimage}
                      onClick={() =>
                        handleImageLink(students[imageData].bottomimage)
                      }
                      alt="..."
                    />
                  </div>
                </div>
                ) : ""}
                <div className="inputs-container">
                <table className = "evaltable">
                    <tr className="evaltr"> 
                        <td>
                            <div className="inputs-container">
                            <label>1. Untreated Decay:</label>
                         
                            <div>
                                <select
                                name="untreated-decay" // onChange={handleDropdownChange()}
                                onChange={(event) => {
                                    event.preventDefault();
                                    setState({
                                    ...states,
                                    untreatedDecay: event.target.value,
                                    });
                                }}
                                //value={students[imageData].untreatedDecay}
                                value={selectDDValue(imageData, "untreatedDecay")}
                                
                                >
                                <option
                                    value="Yes"
                                >
                                    Yes
                                </option>

                                <option
                                    value="No" 
                                >
                                    No
                                </option>
                                </select>
                            </div>
                            </div>
                        </td>

                        <td>
                            <div className="inputs-container">
                            <label>2. Treated Decay:</label>
                         
                            <select
                                name="treated-decay" // onChange={handleDropdownChange()}
                                onChange={(event) => {
                                    event.preventDefault();
                                    setState({
                                    ...states,
                                    treatedDecay: event.target.value,
                                    });
                                    // console.log("selected event", event.target.value);
                                    // students[imageData].treatedDecay = event.target.value;
                                    // setStudents(students);
                                    // console.log("selected state", states.treatedDecay);
                                    // console.log(
                                    // "selected student",
                                    // students[imageData].treatedDecay
                                    // );
                                }}
                                value={selectDDValue(imageData, "treatedDecay")}
                                >
                                <option
                                    value="Yes"
                                >
                                    Yes
                                </option>

                                <option
                                    value="No" 
                                >
                                    No
                                </option>
                                </select>
                            </div>
                        </td>
                    </tr>
                    <tr className = "evaltr"> 
                        <td>
                            <div className="inputs-container">
                            <label>3. Sealants Present:</label>
                        
                            <select
                                name="sealants-present" // onChange={handleDropdownChange()}
                                onChange={(event) => {
                                    event.preventDefault();
                                    setState({
                                    ...states,
                                    sealantsPresent: event.target.value,
                                    });
                                }}
                                //value={students[imageData].sealantsPresent}
                                value={selectDDValue(imageData, "sealantsPresent")}
                                >
                                <option
                                    value="Yes"
                                >
                                    Yes
                                </option>

                                <option
                                    value="No" 
                                >
                                    No
                                </option>
                                </select>
                            </div>

                        </td>
                        <td>
                            <div>
                            <label>4. Treatment Recomendation codes: </label>
                            <select
                                name="treatment-recommendation-code" // onChange={handleDropdownChange()}
                                onChange={(event) => {
                                    event.preventDefault();
                                    setState({
                                    ...states,
                                    treatmentRecommendationCode: event.target.value,
                                    });
                                    //window.$stateChanged = true;
                                    //console.log("selected event", event.target.value);
                                    //students[imageData].treatmentRecommendationCode = event.target.value;
                                    //setStudents(students);
                                   // console.log("selected state", states.treatmentRecommendationCode);
                                    //console.log("selected student",students[imageData].treatmentRecommendationCode);
                                }}
                                value={selectDDValue(imageData, "treatmentRecommendationCode")} 
                                //value={students[imageData].treatmentRecommendationCode}
                                >
                                <option
                                    //value="No obvious problem"
                                    value = "Code 1"
                                >
                                    Code 1
                                </option>

                                <option
                                    // value="Evaluate for preventive sealants" 
                                    value = "Code 2"
                                >
                                    Code 2
                                </option>
                                <option
                                    // value="Evaluate for Restorative care" 
                                    value = "Code 3"
                                >
                                    Code 3
                                </option>
                                <option
                                   // value="Urgent care needed" 
                                    value = "Code 4"
                                >
                                    Code 4
                                </option>
                                </select>
                            </div>
                        </td>
                    </tr>
     
                <tr>
                  <td align="right"> 
                      <h5>  <b>Please select a reason only if you cannot evaluate the images: </b> </h5>
                  </td>
                  <td align="left">
                    <div>
                        <select
                            name="cannot-evaluate"  // onChange={handleCannotEvaluate()}
                            onChange={(event) => {
                                event.preventDefault();
                                  setState({
                                    ...states,
                                    cannotEvaluate: event.target.value,
                                   // evalStatus: "Incomplete"
                                    });
                                handleCannotEvaluate(event)
                            }}
                            //value={students[imageData].sealantsPresent}
                            value={selectDDValue(imageData, "cannotEvaluate")} 
                            >
                            <option
                                value="NA"
                            >
                                NA
                            </option>

                            <option
                                value="One or More Images Not Clear" 
                            >
                                One or More Images Not Clear
                            </option>

                            <option
                                value="Student Opted Out of Screening" 
                            >
                                Student Opted Out of Screening
                            </option>
                            
                        </select>
                      </div>
                  </td>
                </tr>
                </table>
                </div>
                <p></p>
      

                <div
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <button
                    style={{
                      background: "none",
                      borderRadius: "2px",
                      border: "2px solid grey",
                    }}
                    type="submit"
                  >
                    Submit Screening Results
                  </button>
                </div>
              </form>

              <Modal
                open={open}
                onClose={handleOpen}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{ margin: "0 auto", width: "60%", height: "50%" }}
                  className={classes.paper}
                >
                  <img height="100%" width="100%" src={imageLink} alt="..." />
                </div>
              </Modal>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
export default EvaluationApp;
