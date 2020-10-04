import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import logo from "./TeledentalSolutionLogo13.png";

import LeftImg from "./Susan101-mandibular.PNG";
import RightImg from "./Susan101-maxillary.PNG";
import TopImg from "./Susan101-left.PNG";
import BottomImg from "./Susan101-right.PNG";

import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import FormCntrl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeStyles } from "@material-ui/core/styles";

import "./App.css";
import { API, Storage, Auth } from "aws-amplify";

import {
  createStudent as createStudentMutation,
  deleteStudent as deleteStudentMutation,
} from "./graphql/mutations";

const initialFormState = {
  code: "",
  name: "",
  gender: "Male",
  district: "",
  school: "",
  grade: "1",
  leftimage: "",
  rightimage: "",
  location: "Home",
  haveDentalInsurance: "No",
};

const resetStudentState = {
  code: "",
  gender: "Male",
  leftimageselection: "",
  rightimageselection: "",
};

const CollectionApp = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [students, setStudents] = useState([]);

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

  const generateImageFileName = (fileName) => {
    return `${formData.code}-${fileName}`;
  };

  /* Store leftimage if a file is selected */
  async function onChangeleftimage(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      const el = document.getElementById("left");
      el.style.display = "block";
      el.style.background = `url(${e.target.result})`;
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundSize = "cover";
      el.style.width = "149.7px";
      el.style.height = "142px";
      el.innerHTML = "";
    };

    reader.readAsDataURL(file);
    setFormData({
      ...formData,
      leftimage: generateImageFileName(file.name),
    });
    await Storage.put(generateImageFileName(file.name), file);
  }
  async function onChangerightimage(e) {
    if (!e.target.files[0]) return;
    var reader = new FileReader();

    reader.onload = function (e) {
      const el = document.getElementById("right");
      el.style.display = "block";
      el.style.background = `url(${e.target.result})`;
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundSize = "cover";
      el.style.width = "149.7px";
      el.style.height = "142px";
      el.innerHTML = "";
    };

    const file = e.target.files[0];
    reader.readAsDataURL(file);

    setFormData({
      ...formData,
      rightimage: generateImageFileName(file.name),
    });
    await Storage.put(generateImageFileName(file.name), file);
  }

  async function onChangetopimage(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      const el = document.getElementById("top");
      el.style.display = "block";
      el.style.background = `url(${e.target.result})`;
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundSize = "cover";
      el.style.width = "149.7px";
      el.style.height = "142px";
      el.innerHTML = "";
    };

    reader.readAsDataURL(file);

    setFormData({
      ...formData,
      topimage: generateImageFileName(file.name),
    });
    await Storage.put(generateImageFileName(file.name), file);
  }

  async function onChangebottomimage(e) {
    if (!e.target.files[0]) return;
    var reader = new FileReader();

    reader.onload = function (e) {
      const el = document.getElementById("bottom");
      el.style.display = "block";
      el.style.background = `url(${e.target.result})`;
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundSize = "cover";
      el.style.width = "149.7px";
      el.style.height = "142px";
      el.innerHTML = "";
    };

    const file = e.target.files[0];
    reader.readAsDataURL(file);
    setFormData({
      ...formData,
      bottomimage: generateImageFileName(file.name),
    });
    await Storage.put(generateImageFileName(file.name), file);
    alert("left image changes");
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
                      <Dropdown.Item eventKey="Home">Home</Dropdown.Item>
                      <Dropdown.Item eventKey="School">School</Dropdown.Item>
                      <Dropdown.Item eventKey="other">Other</Dropdown.Item>
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
                <div>
                  <p>School Name/ID</p>
                  <InputGroup className="mb-3">
                    <FormCntrl
                      aria-label="code"
                      aria-describedby="basic-addon1"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school: e.target.value,
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
                      placeholder="Data collector Email"
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
                      <Dropdown.Item eventKey={1} href="#/action-1">
                        One
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={2} href="#/action-1">
                        Two
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={3} href="#/action-1">
                        Three
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={4} href="#/action-1">
                        Four
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={5} href="#/action-1">
                        Five
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={6} href="#/action-1">
                        Six
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={7} href="#/action-1">
                        Seven
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={8} href="#/action-1">
                        Eight
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={9} href="#/action-1">
                        Nine
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={10} href="#/action-2">
                        Ten
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={11} href="#/action-3">
                        Eleven
                      </Dropdown.Item>
                      <Dropdown.Item eventKey={12} href="#/action-1">
                        Twelve
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
                <div>
                  <p>Does student have dental insurance?</p>
                  <Dropdown
                    value={formData.haveDentalInsurance}
                    onSelect={(e) =>
                      setFormData({
                        ...formData,
                        haveDentalInsurance: e,
                      })
                    }
                  >
                    <Dropdown.Toggle id="dropdown-basic">
                      {formData.haveDentalInsurance}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Yes" href="#/action-1">
                        Yes
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="No" href="#/action-2">
                        No
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
            <img className="image-placeholder" src={LeftImg} alt="..." />
          </div>
          <div>
            <img className="image-placeholder" src={RightImg} alt="..." />
          </div>
          <div>
            <img className="image-placeholder" src={TopImg} alt="..." />
          </div>
          <div>
            <img className="image-placeholder" src={BottomImg} alt="..." />
          </div>
        </div>

        <div className="uploadPictures">
          <div>
            <input
              id="home-file-input-left"
              type="file"
              class="input-file"
              onChange={onChangeleftimage}
            />
            <label
              id="left"
              className="image-input-label"
              htmlFor="home-file-input-left"
            >
              +
            </label>
          </div>
          <div>
            <input
              id="home-file-input-right"
              type="file"
              class="input-file"
              onChange={onChangerightimage}
            />
            <label
              id="right"
              className="image-input-label"
              htmlFor="home-file-input-right"
            >
              +
            </label>
          </div>
          <div>
            <input
              id="home-file-input-top"
              type="file"
              class="input-file"
              onChange={onChangetopimage}
            />
            <label
              id="top"
              className="image-input-label"
              htmlFor="home-file-input-top"
            >
              +
            </label>
          </div>
          <div>
            <input
              id="home-file-input-bottom"
              type="file"
              class="input-file"
              onChange={onChangebottomimage}
            />
            <label
              id="bottom"
              className="image-input-label"
              htmlFor="home-file-input-bottom"
            >
              +
            </label>
          </div>
        </div>
        <h4>
          <button
            style={{
              padding: "20px",
              color: "#2a8bf2",
              background: "none",
              border: "1px solide grey",
            }}
            onClick={createStudent}
          >
            Submit Student
          </button>
        </h4>
      </div>
    </div>
  );
};
export default CollectionApp;
