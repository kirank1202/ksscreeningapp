import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { listStudents } from "./graphql/queries";
import {
  createStudent as createStudentMutation,
  deleteStudent as deleteStudentMutation,
  updateStudent as updateStudentMutation,
} from "./graphql/mutations";
import "./App.css";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputGroup from "react-bootstrap/InputGroup";
import FormCntrl from "react-bootstrap/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo from "./TeledentalSolutionLogo13.png";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";

const FullDataExtractionApp = () => {
  const [students, setStudents] = useState([]);
  const [imageData, setImageData] = useState();
  const [schoolList, setSchoolList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
 // const [screenerName, setscreenerName] = useState("");
  const [unFilteredStudentsList, setUnFilteredStudentsList] = useState([]);
  const initialState = {
    untreatedDecay: "No",
    treatedDecay: "No",
    sealantsPresent: "No",
    treatmentRecommendationCode: "Code 1",
    cannotEvaluate: "NA",
  };
  const initialGenderList = [
    { title : "Female"},
    { title : "Male"}
  ]
  const initialYesNoList = [
    { title : "Yes"},
    { title : "No"}
  ]
  const initialevalStatusList = [
    { title : "Completed"},
    { title : "New"}
  ]
  const initialTreatmentcodeList = [
    { title : "Code 1"},
    { title : "Code 2"},
    { title : "Code 3"},
    { title : "Code 4"}
  ]
  
  const [genderList, setGenderList] = useState(initialGenderList);
  const [haveDentalInsuranceList, setHaveDentalInsuranceList] = useState(initialYesNoList);
  const [optoutList, setOptoutList] = useState(initialYesNoList);
  const [optoutReasonList, setOptoutReasonList] = useState([]); 
  const [evalStatusList, setevalStatusList] = useState(initialevalStatusList); 

  const [sealantsPresentList, setsealantsPresentList] = useState(initialYesNoList); 
  const [untreatedDecayList,setuntreatedDecayList] = useState(initialYesNoList); 
  const [treatedDecayList, settreatedDecayList] = useState(initialYesNoList); 
  const [treatmentcodeList, setTreatmentcodeList] = useState(initialTreatmentcodeList); 


  const [states, setState] = React.useState(initialState); // const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const evaluationSection = useRef(null);
  const [imageLink, setImageLink] = React.useState("");
  let [filters, setfilters] = useState([]);
  let history = useHistory();
  window.$stateChanged = false;

 /* This needs to be changed to Evaluator later
  const func = async() => {
    let user = await Auth.currentAuthenticatedUser();
    setscreenerName(user.username); //all attributes exist in the attributes field 
  }
  func();
  */

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
    studentsFromAPI.forEach(student => {
      if(!schoolList.some( e => e.title == student.school)) {
        schoolList.push({title: student.school});
      }
      if(!gradeList.some(e => e.title == student.grade)) {
        gradeList.push({title: student.grade});
      }
      if(!optoutReasonList.some(e => e.title == student.optoutReason)) {
        if (student.optoutReason !== null) {
          optoutReasonList.push({title: student.optoutReason});
        }
      }
    });
    setSchoolList(schoolList);
    setGradeList(gradeList);
    setOptoutReasonList(optoutReasonList);
    setUnFilteredStudentsList(sortedArr);
    setStudents(sortedArr);
  }
  function upsert(item) {
    const i = filters.findIndex(_item => _item.name === item.name);
    if (i > -1) filters[i] = item;
    else filters.push(item);
    setfilters(filters);
  }

  let handleFilter = (e, val, selectedFilter) => {
    upsert({name: selectedFilter, value: val && val.title});
    console.log("Before null: ",filters);
    // filter all null and empty values items from filter array.
    filters = filters.filter(ele  => ele.value !== null && ele.value !== "");
    var filterdStudents = unFilteredStudentsList.filter((student) => {
      return filters.every(filter  => { 
        // console.log(`${student[filter.name]} == ${filter.value}`, student[filter.name].toUpperCase().indexOf(filter.value.toUpperCase()));
        return student[filter.name] && student[filter.name].toString().toUpperCase().startsWith(filter.value.toString().toUpperCase())
      })
    });
    // console.log("Filtered students: ",filterdStudents);
    setStudents(filterdStudents);
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
  


  const classes = useStyles();
  return (
    <div className="App">
        <>
          <div className={classes.root}>
            <AppBar position="fixed" color="#fff">
              <Toolbar className={classes.flexToolbar}>
                <img class="logo_style" src={logo} alt="..." />
                <h5 className="extract-logo-header" color="#fff">School Dental Screening - Full Data Extraction</h5>
                <nav role="navigation" class="desktop">
                  <ul id="d-menu">
                      <li> <a onClick={() => history.push('reports') }>Back-To-Reports</a> </li>
                  </ul>
                </nav>
                <nav role="navigation" class="mobile">
                  <div id="menuToggle">
                      <input type="checkbox" />
                      <span></span>
                      <span></span>
                      <span></span>
                      <ul id="menu">
                        <li> <a onClick={() => history.push('reports') }>Back-To-Reports</a> </li>
                      </ul>
                  </div>
                </nav>
              </Toolbar>
            </AppBar>
          </div>

          <div className="content-container extracttable-scroll">
            <table>
              <thead>
              <tr>
                  <th class="td-xsmall-common"></th>
                  <th class="main-th" colSpan="14">Hays Unified School District 489</th>
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
                  <th>Sealants</th>
                  <th>Untreated Decay</th>
                  <th>Treated Decay</th>
                  <th>Treatment Code</th>
                </tr>
                <tr class="tr-filter">
                  <th class="td-xsmall"></th>
                  <th>
                    <Autocomplete
                    id="school"
                    options={schoolList}
                    onChange={(event, newValue) => handleFilter(event, newValue, 'school')}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                  />
                </th>
                  <th>
                    <Autocomplete
                      id="grade"
                      options={gradeList}
                      onChange={(event, newValue) => handleFilter(event, newValue, 'grade')}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    />
                  </th>
                  <th> 
                    <FormCntrl
                      type="text"
                      aria-label="code"
                      aria-describedby="Student Name"
                      onChange={(event) => handleFilter(event, {title: event.target.value}, 'code')}
                    />
                  </th>
                  <th>
                    <FormCntrl
                      type="text"
                      aria-label="firstname3letters"
                      aria-describedby="Student firstname3letters"
                      onChange={(event) => handleFilter(event, {title: event.target.value}, 'firstname3letters')}
                    />
                  </th>
                  <th>
                    <Autocomplete
                      id="gender"
                      options={genderList}
                      onChange={(event, newValue) => handleFilter(event, newValue, 'gender')}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    />
                  </th>
                  <th><Autocomplete
                      id="haveDentalInsurance"
                      options={haveDentalInsuranceList}
                      onChange={(event, newValue) => handleFilter(event, newValue, 'haveDentalInsurance')}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    /></th>
                  <th>
                  <th>
                    <FormCntrl
                      type="text"
                      aria-label="createdAt"
                      aria-describedby="Student createdAt"
                      onChange={(event) => handleFilter(event, {title: event.target.value}, 'createdAt')}
                      disabled
                    />
                  </th>
                  </th>
                  <th>
                    <Autocomplete
                      id="optout"
                      options={optoutList}
                      onChange={(event, newValue) => handleFilter(event, newValue, 'optout')}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    />
                    </th>
                  <th>
                    <Autocomplete
                      id="optoutReason"
                      options={optoutReasonList}
                      onChange={(event, newValue) => handleFilter(event, newValue, 'optoutReason')}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    />
                    </th>
                  <th>
                    <Autocomplete
                      id="evalStatus"
                      options={evalStatusList}
                      onChange={(event, newValue) => handleFilter(event, newValue, 'evalStatus')}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    />
                  </th>

                {/* Treatment Codes */}
                  <th>
                    <Autocomplete
                      id="sealantsPresent"
                      options={sealantsPresentList}
                      onChange={(event, newValue) => handleFilter(event, newValue, 'sealantsPresent')}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    />
                  </th>

                  <th>
                    <Autocomplete
                      id="untreatedDecay"
                      options={untreatedDecayList}
                      onChange={(event, newValue) => handleFilter(event, newValue, 'untreatedDecay')}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    />
                  </th>
                  <th>
                    <Autocomplete
                      id="treatedDecay"
                      options={treatedDecayList}
                      onChange={(event, newValue) => handleFilter(event, newValue, 'treatedDecay')}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    />
                  </th>
                  <th>
                    <Autocomplete
                      id="treatmentRecommendationCode"
                      options={treatmentcodeList}
                      onChange={(event, newValue) => handleFilter(event, newValue, 'treatmentRecommendationCode')}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    />
                  </th>
                 
                </tr>
              </thead>

              <tbody>
                {students.map((student, key) => (
                  <tr
                    key={key}
                    onClick={() => {
                     // setImageData(key); // setEvalData(key);
                     // handleFormState(key);
                     // focusOnEvaluate();
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
                    <td>{student.sealantsPresent}</td>  
                    <td>{student.untreatedDecay}</td>
                    <td>{student.treatedDecay}</td>
                    <td>{student.treatmentRecommendationCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        </>
    </div>
  );
};
export default FullDataExtractionApp;
