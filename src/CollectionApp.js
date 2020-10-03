import React, { useState, useEffect } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo from "./TeledentalSolutionLogo13.png";

import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import FormCntrl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeStyles } from "@material-ui/core/styles";

import EvaluationApp from "./EvaluationApp";

import "./App.css";
import { API, Storage, Auth } from "aws-amplify";

import {
  createStudent as createStudentMutation,
  deleteStudent as deleteStudentMutation,
} from "./graphql/mutations";
import { Button } from "@material-ui/core";

const initialFormState = {
  code: "",
  name: "",
  gender: "Male",
  district: "",
  school: "",
  grade: "2nd",
  leftimage: "",
  rightimage: "",
  location: "Home",
};

const resetStudentState = {
  code: "",
  gender: "",
  leftimageselection: "",
  rightimageselection: "",
};

const CollectionApp = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [students, setStudents] = useState([]);
  console.log(formData);

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

  useEffect(() => {
    /*fetchAllStudents(); */
  }, []);
  const generateImageFileName = (fileName) => {
    return `${formData.code}-${fileName}`;
  };

  /* Store leftimage if a file is selected */
  async function onChangeleftimage(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({
      ...formData,
      leftimage: generateImageFileName(file.name),
    });
    await Storage.put(generateImageFileName(file.name), file);
    alert("left image changed");
  }
  async function onChangerightimage(e) {
    alert("right image changed");
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({
      ...formData,
      rightimage: generateImageFileName(file.name),
    });
    await Storage.put(generateImageFileName(file.name), file);
  }
  async function onChangetopimage(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({
      ...formData,
      topimage: generateImageFileName(file.name),
    });
    await Storage.put(generateImageFileName(file.name), file);
  }
  async function onChangebottomimage(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({
      ...formData,
      bottomimage: generateImageFileName(file.name),
    });
    await Storage.put(generateImageFileName(file.name), file);
  }

  async function createStudent() {
    if (!formData.code || !formData.gender) return;
    await API.graphql({
      query: createStudentMutation,
      variables: { input: formData },
    });
    if (formData.leftimage) {
      const image = await Storage.get(formData.leftimage);
      formData.leftimage = image;
    }

    setFormData(resetStudentState);
    alert(`Student ${formData.code} Uploaded Successfully`);
  }

  return (
    <div className="CollectionApp">
      <div className={classes.root}>
        <AppBar position="static" color="#fff">
          <Toolbar className={classes.flexToolbar}>
            <img src={logo} alt="..." />
          </Toolbar>
        </AppBar>
      </div>

      <div className="mainContainer">
        <h1 className="BasicDetails">Basic Details</h1>
        <div className="form">
          <form>
            <div className="formContainer">
              <div className="leftArea">
                <div>
                  <p>Data Collection Location</p>
                  <Dropdown
                    aria-label="location"
                    name="location"
                    value={formData.location}
                    onSelect={(e) => {
                      setFormData({
                        ...formData,
                        location: e,
                      });
                    }}
                  >
                    <Dropdown.Toggle id="dropdown-basic">
                      {formData.location}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Home" href="#/action-1">
                        Home
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="School" href="#/action-2">
                        School
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="other" href="#/action-3">
                        Other
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div>
                  <p>School District</p>
                  <InputGroup className="mb-3">
                    <FormCntrl
                      aria-label="district"
                      aria-describedby="basic-addon1"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          district: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </div>
                <div>
                  <p>Student ID</p>
                  <InputGroup className="mb-3">
                    <FormCntrl
                      aria-label="code"
                      aria-describedby="basic-addon1"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </div>
              </div>
              <div className="rightArea">
                <div>
                  <p>
                    Data Collector (Only Required if you would like your student
                    Screening test)
                  </p>
                  <InputGroup>
                    <FormCntrl
                      placeholder="Data collector Name"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </div>
                <div>
                  <p>Grade</p>
                  <Dropdown
                    value={formData.grade}
                    onSelect={(e) => {
                      setFormData({
                        ...formData,
                        grade: e,
                      });
                    }}
                  >
                    <Dropdown.Toggle id="dropdown-basic">
                      {formData.grade}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item eventKey={9} href="#/action-1">
                        Nine
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={10} href="#/action-2">
                        Ten
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={11} href="#/action-3">
                        Eleven
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div>
                  <p>Gender</p>
                  <Dropdown
                    value={formData.gender}
                    onSelect={(e) =>
                      setFormData({
                        ...formData,
                        gender: e,
                      })
                    }
                  >
                    <Dropdown.Toggle id="dropdown-basic">
                      {formData.gender}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Male" href="#/action-1">
                        Male
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Female" href="#/action-2">
                        Female
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Other" href="#/action-3">
                        Other
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div style={{ padding: "20px 150px" }}>
        <h1 className="BasicDetails">Demo Pictures</h1>
        <div className="uploadPictures">
          <div>
            <input
              id="home-file-input"
              type="file"
              class="input-file"
              onChange={onChangeleftimage}
            />
            <label className="image-input-label" htmlFor="home-file-input">
              +
            </label>
          </div>
          <div>
            <input
              id="home-file-input"
              type="file"
              class="input-file"
              onChange={onChangerightimage}
            />
            <label className="image-input-label" htmlFor="home-file-input">
              +
            </label>
          </div>
          <div>
            <input
              id="home-file-input"
              type="file"
              class="input-file"
              onChange={onChangetopimage}
            />
            <label className="image-input-label" htmlFor="home-file-input">
              +
            </label>
          </div>
          <div>
            <input
              id="home-file-input"
              type="file"
              class="input-file"
              onChange={onChangebottomimage}
            />
            <label className="image-input-label" htmlFor="home-file-input">
              +
            </label>
          </div>
          <div>
            <input
              id="home-file-input"
              type="file"
              class="input-file"
              onChange={onChangebottomimage}
            />
            <label className="image-input-label" htmlFor="home-file-input">
              +
            </label>
          </div>
          <div>
            <input
              id="home-file-input"
              type="file"
              class="input-file"
              onChange={onChangebottomimage}
            />
            <label className="image-input-label" htmlFor="home-file-input">
              +
            </label>
          </div>
        </div>
        <Button type="submit">Sumit</Button>
      </div>
    </div>
  );
};
export default CollectionApp;
