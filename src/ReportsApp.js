import React, { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { listStudents } from "./graphql/queries";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo from "./TeledentalSolutionLogo13.png";
import { useHistory } from "react-router-dom";
import FormCntrl from "react-bootstrap/FormControl";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const ReportsApp = () => {
  const [students, setStudents] = useState([]);
  const [unFilteredStudentsList, setUnFilteredStudentsList] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [districtList, setDistrictlist] = useState([]);
  const [reportSummary, setReportSummary] = useState([]);
  const [reportSummaryBySchool, setReportSummaryBySchool] = useState([]);
  const [reRunState, setReRunState] = useState("");
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [studentCode, setStudentCode] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  window.$stateChanged = false;
  let history = useHistory();
  useEffect(() => {
    fetchAllStudents();
  }, []); 
          
  /* retrieve all students from DynamoDB using graphql API interace */
  async function fetchAllStudents() {
   // const apiData = await API.graphql({ query: listStudents });
    setIsLoaded(false);
    const apiData = await API.graphql({
      query: listStudents,
      variables: { input: { grade: 8 } },
    });

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
    });
    setSchoolList(schoolList);
    //generateSummary(sortedArr);
    handleGradeFilter(sortedArr, "school");
    setUnFilteredStudentsList(sortedArr);
    setStudents(sortedArr);
  //  handleGradeFilter();
  }
  let handleSchoolListFilter = (e, val) => {
    let schoolName = val != null ? val.title : null;
    setSelectedSchool(schoolName);
    console.log("School name:", val);
    var filterdStudents = unFilteredStudentsList.filter((student) => {
      if(val !== null) {
        return student.school == val.title;
      } else {
        return student.school;
      }
    });
    //generateSummary(filterdStudents);
    handleGradeFilter(filterdStudents);
    setStudents(filterdStudents);
  }
  let showStudentInfo = (code) => {
    setShowStudentDetails(true);
    setStudentCode(code);
  }
  let handleGradeFilter = (unFiltStudents, filteredBy) => {
    var wholeSummary = [];
    var gradeCodesList = ['K','1', '2', '3', '4', '5', '6', '7', 'Total'];
    let gradesSummary = [];

    for (let i = 0; i < gradeCodesList.length; i++) {
      if(gradeCodesList[i] !== "Total") {
        let studentDataCode1List = [];
        let studentDataCode2List = [];
        let studentDataCode3List = [];
        let studentDataCode4List = [];
        let filterByGrade = unFiltStudents.filter((student) => {
          return student.grade == gradeCodesList[i] && student.optout == "No";
        });
        console.log("All Student", unFiltStudents);
        console.log("By Grade Student", filterByGrade);
        gradesSummary = filterByGrade.reduce((std, obj) => {
          // console.log("Student Info", std);
          // console.log("Student obj", obj);
          std["grade"] = gradeCodesList[i];
          std["untreatedDecay_"+ obj.untreatedDecay] = (std["untreatedDecay_"+ obj.untreatedDecay] || 0) + 1;
          std["treatedDecay_"+ obj.treatedDecay] = (std["treatedDecay_"+ obj.treatedDecay] || 0) + 1;
          std["sealantsPresent_"+ obj.sealantsPresent] = (std["sealantsPresent_"+ obj.sealantsPresent] || 0) + 1;
          std["treatmentRecommendationCode_"+ obj.treatmentRecommendationCode] = (std["treatmentRecommendationCode_"+ obj.treatmentRecommendationCode] || 0) + 1;
          //  Details Object
          if(obj.treatmentRecommendationCode == "Code 1") {
            let studentData = {
              name: obj.name,
              code: obj.code,
              gender: obj.gender,
              grade: obj.grade,
              threeLetterList: obj.firstname3letters
            }
            studentDataCode1List.push(studentData);
            std["studentDataCode1List"] = studentDataCode1List;
          }
          if(obj.treatmentRecommendationCode == "Code 2") {
            let studentData = {
              name: obj.name,
              code: obj.code,
              gender: obj.gender,
              grade: obj.grade,
              threeLetterList: obj.firstname3letters
            }
            studentDataCode2List.push(studentData);
            std["studentDataCode2List"] = studentDataCode2List;
          }
          if(obj.treatmentRecommendationCode == "Code 3") {
            let studentData = {
              name: obj.name,
              code: obj.code,
              gender: obj.gender,
              grade: obj.grade,
              threeLetterList: obj.firstname3letters
            }
            studentDataCode3List.push(studentData);
            std["studentDataCode3List"] = studentDataCode3List;
          }
          if(obj.treatmentRecommendationCode == "Code 4") {
            let studentData = {
              name: obj.name,
              code: obj.code,
              gender: obj.gender,
              grade: obj.grade,
              threeLetterList: obj.firstname3letters
            }
            studentDataCode4List.push(studentData);
            std["studentDataCode4List"] = studentDataCode4List;
          }
          return std;
          }, {});
          wholeSummary.push(gradesSummary);
      }      
    }
    // console.log("TEST", wholeSummary);
    let grade= {};
    let code1TotalSummary = [];
    let code2TotalSummary = [];
    let code3TotalSummary = [];
    let code4TotalSummary = [];
    for(var item in wholeSummary) {
      grade["grade"] = 'Total';
      grade['untreatedDecay_Yes'] = (grade['untreatedDecay_Yes'] ? grade['untreatedDecay_Yes'] : 0) + (wholeSummary[item]['untreatedDecay_Yes'] ? wholeSummary[item]['untreatedDecay_Yes'] : 0 );
      grade['untreatedDecay_No'] = (grade['untreatedDecay_No'] ? grade['untreatedDecay_No'] : 0) + (wholeSummary[item]['untreatedDecay_No'] ? wholeSummary[item]['untreatedDecay_No'] : 0 );
      
      grade['treatedDecay_Yes'] = (grade['treatedDecay_Yes'] ? grade['treatedDecay_Yes'] : 0) + (wholeSummary[item]['treatedDecay_Yes'] ? wholeSummary[item]['treatedDecay_Yes'] : 0 );
      grade['treatedDecay_No'] = (grade['treatedDecay_No'] ? grade['treatedDecay_No'] : 0) + (wholeSummary[item]['treatedDecay_No'] ? wholeSummary[item]['treatedDecay_No'] : 0 );
      
      grade['sealantsPresent_Yes'] = (grade['sealantsPresent_Yes'] ? grade['sealantsPresent_Yes'] : 0) + (wholeSummary[item]['sealantsPresent_Yes'] ? wholeSummary[item]['sealantsPresent_Yes'] : 0 );
      grade['sealantsPresent_No'] = (grade['sealantsPresent_No'] ? grade['sealantsPresent_No'] : 0) + (wholeSummary[item]['sealantsPresent_No'] ? wholeSummary[item]['sealantsPresent_No'] : 0 );
      grade['treatmentRecommendationCode_Code 1'] = (grade['treatmentRecommendationCode_Code 1'] ? grade['treatmentRecommendationCode_Code 1'] : 0) + (wholeSummary[item]['treatmentRecommendationCode_Code 1'] ? wholeSummary[item]['treatmentRecommendationCode_Code 1'] : 0 );
      grade['treatmentRecommendationCode_Code 2'] = (grade['treatmentRecommendationCode_Code 2'] ? grade['treatmentRecommendationCode_Code 2'] : 0) + (wholeSummary[item]['treatmentRecommendationCode_Code 2'] ? wholeSummary[item]['treatmentRecommendationCode_Code 2'] : 0 );
      grade['treatmentRecommendationCode_Code 3'] = (grade['treatmentRecommendationCode_Code 3'] ? grade['treatmentRecommendationCode_Code 3'] : 0) + (wholeSummary[item]['treatmentRecommendationCode_Code 3'] ? wholeSummary[item]['treatmentRecommendationCode_Code 3'] : 0 );
      grade['treatmentRecommendationCode_Code 4'] = (grade['treatmentRecommendationCode_Code 4'] ? grade['treatmentRecommendationCode_Code 4'] : 0) + (wholeSummary[item]['treatmentRecommendationCode_Code 4'] ? wholeSummary[item]['treatmentRecommendationCode_Code 4'] : 0 );
      if(wholeSummary[item]['studentDataCode1List']) {
        code1TotalSummary.push(wholeSummary[item]['studentDataCode1List']);
        grade["code1TotalSummary"] = code1TotalSummary;
      }
      if(wholeSummary[item]['studentDataCode2List']) {
        code2TotalSummary.push(wholeSummary[item]['studentDataCode2List']);
        grade["code2TotalSummary"] = code2TotalSummary;
      }
      if(wholeSummary[item]['studentDataCode3List']) {
        code3TotalSummary.push(wholeSummary[item]['studentDataCode3List']);
        grade["code3TotalSummary"] = code3TotalSummary;
      }
      if(wholeSummary[item]['studentDataCode4List']) {
        code4TotalSummary.push(wholeSummary[item]['studentDataCode4List']);
        grade["code4TotalSummary"] = code4TotalSummary;
      }
    }
    wholeSummary.push(grade);
    console.log("Whole Summary", wholeSummary);
    setReportSummary(wholeSummary);
    setReportSummaryBySchool([]);
    if(filteredBy === "school") {
      setReportSummaryBySchool(wholeSummary);
    }
    setIsLoaded(true);
    setReRunState("return"); // This is just to reset the state value
  }
  const generateSummary = (stdnts, grade) => {
    var gradeCode = grade;
    console.log('students',stdnts);
    let summary = stdnts.reduce((std, obj) => {
      std["untreatedDecay_"+ obj.untreatedDecay] = (std["untreatedDecay_"+ obj.untreatedDecay] || 0) + 1;
      std["treatedDecay_"+ obj.treatedDecay] = (std["treatedDecay_"+ obj.treatedDecay] || 0) + 1;
      std["sealantsPresent_"+ obj.sealantsPresent] = (std["sealantsPresent_"+ obj.sealantsPresent] || 0) + 1;
      std["treatmentRecommendationCode_"+ obj.treatmentRecommendationCode] = (std["treatmentRecommendationCode_"+ obj.treatmentRecommendationCode] || 0) + 1;
      return std;
      }, {});
      console.log(gradeCode, summary);
      setReportSummary({
        ...reportSummary,
        [gradeCode] : summary,
    })
    setReRunState("return"); // This is just to reset the state value
    console.log("Summary By Grade: ", reportSummary);
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
      width: "70%",
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
                <img className="logo_style" src={logo} alt="..." />
                <h5 className="logo-header" color="#fff">School Dental Screening - Reports</h5>
                <nav role="navigation" class="desktop">
                  <ul id="d-menu">
                      <li> <a onClick={() => history.push('evaluation') }><h5> Evaluation</h5> </a> </li>
                  </ul>
                </nav>
                <nav role="navigation" class="mobile">
                  <div id="menuToggle">
                      <input type="checkbox" />
                      <span></span>
                      <span></span>
                      <span></span>
                      <ul id="menu">
                        <li> <a onClick={() => history.push('evaluation') }>Evaluation</a> </li>
                      </ul>
                  </div>
                </nav>
              </Toolbar>
            </AppBar>
          </div>
          <div className="content-container summary">
            <div className="leftArea">
              <div className="mb-3">
                <p>School Name</p>
                <Autocomplete
                  id="combo-box-demo"
                  options={schoolList}
                  onChange={(event, newValue) => handleSchoolListFilter(event, newValue)}
                  getOptionLabel={(option) => option.title}
                  renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                />
              </div>
             {(selectedSchool) ? (
              <div className="mb-3">
                <p>Results by School Name: {selectedSchool}</p>
              </div>
             ) : ""}
            </div>
            <table>
              <thead>
                <tr>
                  <th class="main-th" colSpan="11">Hays Unified School District 489</th>
                </tr>
                <tr>
                  <th>Grade</th>

                  <th>UnTreated Decay <br/> Yes</th>
                  <th>UnTreated Decay <br/> No</th>

                  <th>Treated Decay <br/> Yes</th>
                  <th>Treated Decay <br/> No</th>

                  <th>Sealants Present <br/> Yes</th>
                  <th>Sealants Present <br/> No</th>

                  <th>Treatment Needs <br/> Code 1 <br/> No decay/ problems</th>
                  <th>Treatment Needs <br/> Code 2 <br/> Sealants needed</th>
                  <th>Treatment Needs <br/> Code 3 <br/> DDS exam suggested</th>
                  <th>Treatment Needs <br/> Code 4 <br/> Urgent care needs</th>
                </tr>
              </thead>

              <tbody>
                {reportSummary.map((studentGrade, key) => (
                  (studentGrade.grade)? (
                  <tr class={studentGrade.grade && studentGrade.grade.toLowerCase()}
                    key={key}
                  >
                    <td>{studentGrade.grade}</td>
                   
                    <td>{studentGrade.untreatedDecay_Yes ? studentGrade.untreatedDecay_Yes : "0"}</td>
                    <td>{studentGrade.untreatedDecay_No ? studentGrade.untreatedDecay_No : "0"}</td>
                    
                    <td>{studentGrade.treatedDecay_Yes ? studentGrade.treatedDecay_Yes : "0"}</td>
                    <td>{studentGrade.treatedDecay_No ? studentGrade.treatedDecay_No : "0"}</td>
                    
                    <td>{studentGrade.sealantsPresent_Yes ? studentGrade.sealantsPresent_Yes : "0"}</td>
                    <td>{studentGrade.sealantsPresent_No ? studentGrade.sealantsPresent_No: "0"}</td>
                    <td>
                      <a class="td-link" onClick={() => showStudentInfo(["code1TotalSummary"])}>
                        {studentGrade['treatmentRecommendationCode_Code 1'] ? studentGrade['treatmentRecommendationCode_Code 1'] : "0"}
                      </a>
                    </td>
                    <td>
                      <a class="td-link" onClick={() => showStudentInfo(["code2TotalSummary"])}>
                        {studentGrade['treatmentRecommendationCode_Code 2'] ? studentGrade['treatmentRecommendationCode_Code 2'] : "0"}
                      </a>
                    </td>
                    <td>
                      <a class="td-link" onClick={() => showStudentInfo(["code3TotalSummary"])}>
                        {studentGrade['treatmentRecommendationCode_Code 3'] ? studentGrade['treatmentRecommendationCode_Code 3'] : "0"}
                      </a>
                    </td>
                    <td>
                      <a class="td-link" onClick={() => showStudentInfo(["code4TotalSummary"])}>
                        {studentGrade['treatmentRecommendationCode_Code 4'] ? studentGrade['treatmentRecommendationCode_Code 4'] : "0"}
                      </a>
                    </td>
                  </tr>
                  ): ""
                ))}
                {(!isLoaded)?(<tr><td colSpan="11"> Loading... </td></tr>) : ""}
              </tbody>
            </table>
          </div>
          {(showStudentDetails)? (
            <div className="content-container detailed-summary">
            <table>
              <thead>
                <tr>
                  <th class="main-th" colSpan="5">
                    Urget Care Needed Students
                  </th>
                </tr>
              </thead>
              <tr>
                <th>Student Id</th>
                <th>First 3 Letters</th>
                <th>Grade</th>
                <th>Gender</th>
                <th>Email Id</th>
              </tr>
            {reportSummary[8][studentCode] && reportSummary[8][studentCode].map((item, key) => (
              item.map((innerItem, key) => (
                <tr>
                  <td>{innerItem.code}</td>
                  <td>{innerItem.threeLetterList}</td>
                  <td>{innerItem.grade}</td>
                  <td>{innerItem.gender}</td>
                  <td>{innerItem.name}</td>
                </tr>
              ))
            ))
            }
            {(!reportSummary[8][studentCode]) ? (
              <tr>
                  <td colspan="5">No records found.</td>
              </tr>
            ) : ""}
            </table>
            </div>
          ) : ""}
        </>
    </div>
  );
};
export default ReportsApp;