import React, { useState, useEffect } from "react";
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

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo from "./TeledentalSolutionLogo13.png";

const EvaluationApp = ({ history }) => {
  const [students, setStudents] = useState([]);
  const [imageData, setImageData] = useState();

  const [states, setState] = useState({
    untreatedDecay: false,
    treatedDecay: false,
    sealantsPresent: false,
    treatmentRecommendationCode: "No obvious problem",
  });

  console.log(states);

  useEffect(() => {
    fetchAllStudents();
  }, []);

  /* retrieve all students from DynamoDB using graphql API interace */
  async function fetchAllStudents() {
    const apiData = await API.graphql({ query: listStudents });
    const studentsFromAPI = apiData.data.listStudents.items;
    await Promise.all(
      studentsFromAPI.map(async (student) => {
        console.log(student);
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
          const image = await Storage.get(student.bottomimage);
          student.nonsmilingface = image;
        }
        if (student.frontTeeth) {
          const image = await Storage.get(student.bottomimage);
          student.frontTeeth = image;
        }
        return student;
      })
    );
    setStudents(apiData.data.listStudents.items);
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

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      await API.graphql({
        query: updateStudentMutation,
        variables: {
          input: {
            id: imageData.id,
            untreatedDecay: states.untreatedDecay.toString(),
            treatedDecay: states.treatedDecay.toString(),
            treatmentRecommendationCode: states.treatmentRecommendationCode.toString(),
            sealantsPresent: states.sealantsPresent.toString(),
          },
        },
      });

      alert("success");
    } catch (error) {
      console.error(error);
    }
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
      padding: "0 100px",
      display: "flex",
      justifyContent: "space-between",
    },
  }));

  const classes = useStyles();

  return (
    /*   if  user.group = "datacollector"
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
            <AppBar position="static" color="#fff">
              <Toolbar className={classes.flexToolbar}>
                <img src={logo} alt="..." />
              </Toolbar>
            </AppBar>
          </div>

          <div className="content-container">
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
                  <th>Name</th>
                  <th>School</th>
                  <th>Location</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, key) => (
                  <tr
                    key={key}
                    onClick={() => setImageData(student)}
                    className={
                      imageData && student.name === imageData.name
                        ? "table-row-page-active"
                        : "table-row-page"
                    }
                  >
                    <td>{student.name}</td>
                    <td>{student.school}</td>
                    <td>{student.location}</td>
                    <td>
                      {new Date(student.createdAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {imageData ? (
            <div>
              <div
                style={{
                  marginBottom: "20px",
                  marginTop: "20px",
                }}
                className="teeth-image-container"
              >
                <img src={imageData.leftimage} alt="..." />
                <img src={imageData.rightimage} alt="..." />
                <img src={imageData.topimage} alt="..." />
                <img src={imageData.bottomimage} alt="..." />
                <img src={imageData.nonsmilingface} alt="..." />
                <img src={imageData.frontTeeth} alt="..." />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="image-info-container">
                  <p>
                    <b>Name:</b> {imageData.name}
                  </p>
                  <p>
                    <b>School:</b> {imageData.school}
                  </p>
                  <p>
                    <b>Location:</b> {imageData.location}
                  </p>
                </div>

                <div className="inputs-container">
                  <label>1. Untreated Decay:</label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ margin: "2px" }}>
                      <input
                        checked={states.untreatedDecay === true}
                        onClick={() => {
                          setState({
                            ...states,
                            untreatedDecay: true,
                          });
                        }}
                        name="untreated-decay"
                        type="radio"
                      />
                      Yes
                    </div>
                    <div style={{ margin: "2px" }}>
                      <input
                        checked={states.untreatedDecay === false}
                        onClick={() => {
                          setState({
                            ...states,
                            untreatedDecay: false,
                          });
                        }}
                        name="untreated-decay"
                        type="radio"
                      />
                      No
                    </div>
                  </div>
                </div>
                <div className="inputs-container">
                  <label>2. Treated Decay:</label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ margin: "2px" }}>
                      <input
                        checked={states.treatedDecay === true}
                        onClick={() =>
                          setState({
                            ...states,
                            treatedDecay: true,
                          })
                        }
                        name="treated-decay"
                        type="radio"
                      />
                      Yes
                    </div>
                    <div style={{ margin: "2px" }}>
                      <input
                        checked={states.treatedDecay === false}
                        onClick={() =>
                          setState({
                            ...states,
                            treatedDecay: false,
                          })
                        }
                        name="treated-decay"
                        type="radio"
                      />
                      No
                    </div>
                  </div>
                </div>
                <div className="inputs-container">
                  <label>3. Sealants Present:</label>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ margin: "2px" }}>
                      <input
                        checked={states.sealantsPresent === true}
                        onClick={() =>
                          setState({
                            ...states,
                            sealantsPresent: true,
                          })
                        }
                        name="sealants"
                        type="radio"
                      />
                      Yes
                    </div>
                    <div style={{ margin: "2px" }}>
                      <input
                        checked={states.sealantsPresent === false}
                        onClick={() =>
                          setState({
                            ...states,
                            sealantsPresent: false,
                          })
                        }
                        name="sealants"
                        type="radio"
                      />
                      No
                    </div>
                  </div>
                </div>
                <div>
                  <label>4. Treatment Recomendation codes</label>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ marginRight: "10px" }}>
                      <input
                        name="treatment"
                        type="radio"
                        style={{ margin: "5px" }}
                        checked={
                          states.treatmentRecommendationCode ===
                          "No obvious problem"
                        }
                        onClick={() =>
                          setState({
                            ...states,
                            treatmentRecommendationCode: "No obvious problem",
                          })
                        }
                      />
                      No obvious problem
                    </div>

                    <div style={{ marginRight: "10px" }}>
                      <input
                        name="treatment"
                        type="radio"
                        checked={
                          states.treatmentRecommendationCode ===
                          "Evaluate for preventive sealants"
                        }
                        onClick={() =>
                          setState({
                            ...states,
                            treatmentRecommendationCode:
                              "Evaluate for preventive sealants",
                          })
                        }
                        style={{ margin: "5px" }}
                      />
                      Evaluate for preventive sealants
                    </div>

                    <div style={{ marginRight: "10px" }}>
                      <input
                        name="treatment"
                        type="radio"
                        style={{ margin: "5px" }}
                        checked={
                          states.treatmentRecommendationCode ===
                          "Evaluate for Restorative care"
                        }
                        onClick={() =>
                          setState({
                            ...states,
                            treatmentRecommendationCode:
                              "Evaluate for Restorative care",
                          })
                        }
                      />
                      Evaluate for Restorative care
                    </div>

                    <div style={{ marginRight: "10px" }}>
                      <input
                        name="treatment"
                        type="radio"
                        style={{ margin: "5px" }}
                        checked={
                          states.treatmentRecommendationCode ===
                          "Urgent care needed"
                        }
                        onClick={() =>
                          setState({
                            ...states,
                            treatmentRecommendationCode: "Urgent care needed",
                          })
                        }
                      />
                      Urgent care needed
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <button
                    style={{
                      background: "none",
                      borderRadius: "2px",
                      border: "1px solid grey",
                    }}
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
export default EvaluationApp;
