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
  const [districtList, setDistrictlist] = useState([]);
//   const schoolList = [
//     {title: 'Olathe - North'},
//     {title: 'Olathe - East' },
//     {title: 'Olathe - West'},
//     {title: 'Olathe - South' },
//     {title: 'Blue Valley - North'},
//     {title: 'Blue Valley - East' },
//     {title: 'Blue Valley - West'},
//     {title: 'Blue Valley - South' },    
//     {title: 'Blue Valley - Northwest'},
//     {title: 'Blue Valley - Southwest' },
// ]; 
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
    setUnFilteredStudentsList(sortedArr);
    setStudents(sortedArr);
  }
  let handleSchoolListFilter = (e, val) => {
    console.log("Selected School", val);
    console.log("Students", unFilteredStudentsList);
    
      var filterdStudents = unFilteredStudentsList.filter((student) => {
        if(val != null) {
          return student.school == val.title;
        } else {
          return student.school;
        }
      });
    
    setStudents(filterdStudents);
  }
  let handleDistrictFilter = (e, val) => {
    console.log("Selected District", val);
    console.log("Students", unFilteredStudentsList);
    
      var filterdStudents = unFilteredStudentsList.filter((student) => {
        if(val != null) {
          return student.district == val.title;
        } else {
          return student.district;
        }
      });
    
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
          <div className="content-container">
                <div className="leftArea">
                  <div>
                    <p>School District</p>
                    <Autocomplete
                      id="combo-box-demo"
                      options={districtList}
                      onChange={(event, newValue) => handleDistrictFilter(event, newValue)}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    />
                  </div>
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
            </div>
            <table>
              <thead>
                <tr>
                  <th>District</th>
                  <th>School</th>
                  <th>Grade</th>
                  <th>Code</th>
                  <th>Gender</th>
                  <th>Dental Insurance</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>uUtreated Decay</th>
                  <th>Treated Decay</th>
                  <th>Sealants</th>
                  <th>Treatment</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, key) => (
                  <tr
                    key={key}
                  >
                    <td>{student.district}</td>
                    <td>{student.school}</td>
                    <td>{student.grade}</td>
                    <td>{student.code}</td>
                    <td>{student.gender}</td>
                    <td>{student.haveDentalInsurance}</td>

                    <td>
                      {new Date(student.createdAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>

                    <td>{student.evalStatus}</td>
                    <td>{student.untreatedDecay}</td>
                    <td>{student.treatedDecay}</td>
                    <td>{student.sealantsPresent}</td>
                    <td>{student.treatmentRecommendationCode}</td>
                    
                  </tr>
                ))}
                <tr>
                    <td colSpan="12"> <b>{students.length}</b> Records Found!</td>
                  </tr>
              </tbody>
            </table>
          </div>
        </>
    </div>
  );
};
export default ReportsApp;