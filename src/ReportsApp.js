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
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [reportSummary, setReportSummary] = useState([]);
  const [reRunState, setReRunState] = useState("");

  window.$stateChanged = false;
  let history = useHistory();
  useEffect(() => {
    fetchAllStudents();
  }, []); 
          
  /* retrieve all students from DynamoDB using graphql API interace */
  async function fetchAllStudents() {
   // const apiData = await API.graphql({ query: listStudents });
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
      if(!districtList.some(e => e.title == student.district)) {
        districtList.push({title: student.district});
      }
    });
    setSchoolList(schoolList);
    setDistrictlist(districtList);
    //generateSummary(sortedArr);
    handleGradeFilter(sortedArr);
    setUnFilteredStudentsList(sortedArr);
    setStudents(sortedArr);
  //  handleGradeFilter();
  }
  let handleSchoolListFilter = (e, val) => {
    let schoolName = val != null ? val.title : null;
    setSelectedSchool(schoolName);
    console.log("School name:", val);
    console.log("Disctrict name:", selectedDistrict);
      var filterdStudents = unFilteredStudentsList.filter((student) => {
        if(val !== null && selectedDistrict !== null) {
          return student.school == val.title && student.district == selectedDistrict;
        } else if(val !== null && selectedDistrict == null) {
          return student.school == val.title;
        } else if(val === null && selectedDistrict !== null) {
          return student.district == selectedDistrict;
        } else {
          return student.school;
        }
      });
    generateSummary(filterdStudents);
    setStudents(filterdStudents);
   
  }
  let handleDistrictFilter = (e, val) => {
    let districtName = val != null ? val.title : null;
    setSelectedDistrict(districtName);
    console.log("District name:", val);
    console.log("School name:", selectedSchool);
    
      var filterdStudents = unFilteredStudentsList.filter((student) => {
        if(val != null && selectedSchool !== null) {
          return student.district == val.title && student.school == selectedSchool;
        } else if(val != null && selectedSchool == null) {
          return student.district == val.title;
        } else if(val == null && selectedSchool !== null) {
          return student.school == selectedSchool;
        } else {
          return student.district;
        }
      });
    generateSummary(filterdStudents);
    setStudents(filterdStudents);
  }
  let handleGradeFilter = (unFiltStudents) => {
    var wholeSummary = [];
    var gradeCodesList = ['K','1', '2', '3', '4', '5', '6', '7', 'Total'];
    let gradesSummary = [];

    for (let i = 0; i < gradeCodesList.length; i++) {
      if(gradeCodesList[i] !== "Total") {

        let filterByGrade = unFiltStudents.filter((student) => {
          return student.grade == gradeCodesList[i];
        });
        gradesSummary = filterByGrade.reduce((std, obj) => {
          std["grade"] = gradeCodesList[i];
          std["untreatedDecay_"+ obj.untreatedDecay] = (std["untreatedDecay_"+ obj.untreatedDecay] || 0) + 1;
          std["treatedDecay_"+ obj.treatedDecay] = (std["treatedDecay_"+ obj.treatedDecay] || 0) + 1;
          std["sealantsPresent_"+ obj.sealantsPresent] = (std["sealantsPresent_"+ obj.sealantsPresent] || 0) + 1;
          std["treatmentRecommendationCode_"+ obj.treatmentRecommendationCode] = (std["treatmentRecommendationCode_"+ obj.treatmentRecommendationCode] || 0) + 1;
          return std;
          }, {});
          wholeSummary.push(gradesSummary);
      }      
    }
    let grade= {};
    for(var item in wholeSummary) {
      grade["grade"] = 'Total';
      grade['untreatedDecay_Yes'] = (grade['untreatedDecay_Yes'] ? grade['untreatedDecay_Yes'] : 0) + (wholeSummary[item]['untreatedDecay_Yes'] ? wholeSummary[item]['untreatedDecay_Yes'] : 0 );
      grade['untreatedDecay_No'] = (grade['untreatedDecay_No'] ? grade['untreatedDecay_No'] : 0) + (wholeSummary[item]['untreatedDecay_No'] ? wholeSummary[item]['untreatedDecay_No'] : 0 );
      
      grade['treatedDecay_Yes'] = (grade['treatedDecay_Yes'] ? grade['treatedDecay_Yes'] : 0) + (wholeSummary[item]['treatedDecay_Yes'] ? wholeSummary[item]['treatedDecay_Yes'] : 0 );
      grade['treatedDecay_No'] = (grade['treatedDecay_No'] ? grade['treatedDecay_No'] : 0) + (wholeSummary[item]['treatedDecay_No'] ? wholeSummary[item]['treatedDecay_No'] : 0 );
      
      grade['sealantsPresent_Yes'] = (grade['sealantsPresent_Yes'] ? grade['sealantsPresent_Yes'] : 0) + (wholeSummary[item]['sealantsPresent_Yes'] ? wholeSummary[item]['sealantsPresent_Yes'] : 0 );
      grade['sealantsPresent_No'] = (grade['sealantsPresent_No'] ? grade['sealantsPresent_No'] : 0) + (wholeSummary[item]['sealantsPresent_No'] ? wholeSummary[item]['sealantsPresent_No'] : 0 );

      grade['treatmentRecommendationCode_No obvious problem'] = (grade['treatmentRecommendationCode_No obvious problem'] ? grade['treatmentRecommendationCode_No obvious problem'] : 0) + (wholeSummary[item]['treatmentRecommendationCode_No obvious problem'] ? wholeSummary[item]['treatmentRecommendationCode_No obvious problem'] : 0 );
      grade['treatmentRecommendationCode_Evaluate for preventive sealants'] = (grade['treatmentRecommendationCode_Evaluate for preventive sealants'] ? grade['treatmentRecommendationCode_Evaluate for preventive sealants'] : 0) + (wholeSummary[item]['treatmentRecommendationCode_Evaluate for preventive sealants'] ? wholeSummary[item]['treatmentRecommendationCode_Evaluate for preventive sealants'] : 0 );
      grade['treatmentRecommendationCode_Evaluate for Restorative care'] = (grade['treatmentRecommendationCode_Evaluate for Restorative care'] ? grade['treatmentRecommendationCode_Evaluate for Restorative care'] : 0) + (wholeSummary[item]['treatmentRecommendationCode_Evaluate for Restorative care'] ? wholeSummary[item]['treatmentRecommendationCode_Evaluate for Restorative care'] : 0 );
      grade['treatmentRecommendationCode_Urgent care needed'] = (grade['treatmentRecommendationCode_Urgent care needed'] ? grade['treatmentRecommendationCode_Urgent care needed'] : 0) + (wholeSummary[item]['treatmentRecommendationCode_Urgent care needed'] ? wholeSummary[item]['treatmentRecommendationCode_Urgent care needed'] : 0 );
  
    }
    wholeSummary.push(grade);
   // console.log("Whole Summary", wholeSummary);
    setReportSummary(wholeSummary);
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
                <img class="logo_style" src={logo} alt="..." />
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
            <table>
              <thead>
                <tr>
                  <th>Grade</th>

                  <th>UnTreated Decay <br/> Yes</th>
                  <th>UnTreated Decay <br/> No</th>

                  <th>Treated Decay <br/> Yes</th>
                  <th>Treated Decay <br/> No</th>

                  <th>Sealants Present <br/> Yes</th>
                  <th>Sealants Present <br/> No</th>

                  <th>Treatment Code <br/> No obvious problem</th>
                  <th>Treatment Code <br/> Evaluate for Preventive Sealants</th>
                  <th>Treatment Code <br/> Evaluate for Restorative Care</th>
                  <th>Treatment Code <br/> Urgent care neede</th>
                </tr>
              </thead>

              <tbody >
                {reportSummary.map((studentGrade, key) => (
                  <tr class={studentGrade.grade.toLowerCase()}
                    key={key}
                  >
                    <td>{studentGrade.grade}</td>
                   
                    <td>{studentGrade.untreatedDecay_Yes ? studentGrade.untreatedDecay_Yes : "0"}</td>
                    <td>{studentGrade.untreatedDecay_No ? studentGrade.untreatedDecay_No : "0"}</td>
                    
                    <td>{studentGrade.treatedDecay_Yes ? studentGrade.treatedDecay_Yes : "0"}</td>
                    <td>{studentGrade.treatedDecay_No ? studentGrade.treatedDecay_No : "0"}</td>
                    
                    <td>{studentGrade.sealantsPresent_Yes ? studentGrade.sealantsPresent_Yes : "0"}</td>
                    <td>{studentGrade.sealantsPresent_No ? studentGrade.sealantsPresent_No: "0"}</td>
                    
                    <td>{studentGrade['treatmentRecommendationCode_No obvious problem'] ? studentGrade['treatmentRecommendationCode_No obvious problem']: "0"}</td>
                    <td>{studentGrade['treatmentRecommendationCode_Evaluate for preventive sealants'] ? studentGrade['treatmentRecommendationCode_Evaluate for preventive sealants'] : "0"}</td>
                    <td>{studentGrade['treatmentRecommendationCode_Evaluate for Restorative care'] ? studentGrade['treatmentRecommendationCode_Evaluate for Restorative care'] : "0"}</td>
                    <td>{studentGrade['treatmentRecommendationCode_Urgent care needed'] ? studentGrade['treatmentRecommendationCode_Urgent care needed'] : "0"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
    </div>
  );
};
export default ReportsApp;