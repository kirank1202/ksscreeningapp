import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import logo from "./TeledentalSolutionLogo13.png";


import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import FormCntrl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import "./App.css";
import { API, Storage, Auth } from "aws-amplify";

import { createStudent as createStudentMutation } from "./graphql/mutations";
import { Button } from "@material-ui/core";

const DemoBottomImg = "https://screeningdemoimages.s3.amazonaws.com/mandibular.PNG";
const DemoTopImg = "https://screeningdemoimages.s3.amazonaws.com/maxillary.PNG";
const DemoLeftImg = "https://screeningdemoimages.s3.amazonaws.com/left.PNG";
const DemoRightImg = "https://screeningdemoimages.s3.amazonaws.com/right.PNG";
const DemoNonsmilingImg = "https://screeningdemoimages.s3.amazonaws.com/nonsmiling.JPG";
const DemoFrontTeethImg = "https://screeningdemoimages.s3.amazonaws.com/frontteeth.jpeg";

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
    haveDentalInsurance: "Yes",
};

const resetStudentState = {
    code: "",
    gender: "Male",
    leftimageselection: "",
    rightimageselection: "",
};

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const CollectionApp = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [students, setStudents] = useState([]);
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [thankYouModel, setThankYouModel] = React.useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleThankYouModel = () => {
        setThankYouModel(!thankYouModel);
    };

    const handleThankModelClose = () => {
        setFormData(initialFormState);
        const labels = document.getElementsByClassName("image-input-label");
        for (let i = 0; i < labels.length; i++) {
            const element = labels[i];
            element.style.background = "none";
            element.innerHTML = "+";
        }
        setThankYouModel(!thankYouModel);
    };

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
            leftimage: generateImageFileName("left"),
        });
        await Storage.put(generateImageFileName("left"), file);
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
            rightimage: generateImageFileName("right"),
        });
        await Storage.put(generateImageFileName("right"), file);
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
            topimage: generateImageFileName("top"),
        });
        await Storage.put(generateImageFileName("top"), file);
        // alert("top image changes");
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
            bottomimage: generateImageFileName("bottom"),
        });
        await Storage.put(generateImageFileName("bottom"), file);
        // alert("left image changes");
        // alert("bottom image changes");
    }

    async function onChangeNonSmilingimage(e) {
        if (!e.target.files[0]) return;
        var reader = new FileReader();

        reader.onload = function (e) {
            const el = document.getElementById("non-smiling");
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
            nonsmilingface: generateImageFileName("nonsmiling"),
        });
        await Storage.put(generateImageFileName("nonsmiling"), file);
       //  alert("nonsmiling-face image changes");
    }

    async function onChangeFrontTeethimage(e) {
        if (!e.target.files[0]) return;
        var reader = new FileReader();

        reader.onload = function (e) {
            const el = document.getElementById("front-teeth");
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
            frontTeeth: generateImageFileName("front"),
        });
        await Storage.put(generateImageFileName("front"), file);
        //alert("Front-Teeth image changes");
    }

    async function createStudent(e) {
        e.preventDefault();
        if (!formData.code || !formData.gender) return;
        await API.graphql({
            query: createStudentMutation,
            variables: { input: formData },
        });
        if (formData.leftimage) {
            const image = await Storage.get(formData.leftimage);
            formData.leftimage = image;
        }
        handleThankYouModel();
        alert(`Student ${formData.code} Uploaded Successfully`);
    }

    return (
        <div className="CollectionApp">
            <div className={classes.root}>
                <AppBar position="static" color="#fff">
                    <Toolbar className={classes.flexToolbar}>
                        <img src={logo} alt="..." />
                        <h5 className="logo-header" color="#fff">School Dental Screening</h5>
                    </Toolbar>
                </AppBar>
            </div>
            <form onSubmit={createStudent}>
                <div className="mainContainer">
                    <div className="welcome-msg">
                        <h4>Welcome to 2020 Student Screening Program </h4>  
                    </div>
                    <div className="form">
                        <div className="formContainer">
                            <div className="leftArea">
                                <div className="mb-3">
                                    <p>Screening Location</p>
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
                                            <Dropdown.Item eventKey="Home">
                                                Home
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="School">
                                                School
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="other">
                                                Other
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                <div>
                                    <p>School District</p>
                                    <InputGroup className="mb-3">
                                        <FormCntrl
                                            value={formData.district}
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
                                    <p>School Name/ID</p>
                                    <InputGroup className="mb-3">
                                        <FormCntrl
                                            value={formData.school}
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
                                <div>
                                    <p>Parent/Guardian Email (Required only if you consent to receive screening results via email)</p>
                                    <InputGroup className="mb-3">
                                        <FormCntrl
                                            placeholder="Email"
                                            aria-label="Username"
                                            aria-describedby="basic-addon1"
                                            type="email"
                                            value={formData.name}
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
                                    <p>Student ID</p>
                                    <InputGroup className="mb-3">
                                        <FormCntrl
                                            value={formData.code}
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
                                    <p>First 3 Letters of Student's first Name</p>
                                    <InputGroup className="mb-3">
                                        <FormCntrl
                                            value={formData.firstname3letters}
                                            aria-label="firstname3letters"
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
                                <div className="mb-3">
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
                                            <Dropdown.Item
                                                eventKey={"EK"}
                                                href="#/action-1"
                                            >
                                                EK
                                            </Dropdown.Item>                                            
                                            <Dropdown.Item
                                                eventKey={"KG"}
                                                href="#/action-1"
                                            >
                                                KG
                                            </Dropdown.Item>                                            <Dropdown.Item
                                                eventKey={1}
                                                href="#/action-1"
                                            >
                                                1
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey={2}
                                                href="#/action-1"
                                            >
                                                2
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey={3}
                                                href="#/action-1"
                                            >
                                                3
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey={4}
                                                href="#/action-1"
                                            >
                                                4
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey={5}
                                                href="#/action-1"
                                            >
                                                5
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey={6}
                                                href="#/action-1"
                                            >
                                                6
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey={7}
                                                href="#/action-1"
                                            >
                                                7
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey={8}
                                                href="#/action-1"
                                            >
                                                8
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey={9}
                                                href="#/action-1"
                                            >
                                                9
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey={10}
                                                href="#/action-2"
                                            >
                                                10
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey={11}
                                                href="#/action-3"
                                            >
                                                11
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey={12}
                                                href="#/action-1"
                                            >
                                                12
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="mb-3">
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
                                            <Dropdown.Item
                                                eventKey="Male"
                                                href="#/action-1"
                                            >
                                                Male
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey="Female"
                                                href="#/action-2"
                                            >
                                                Female
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="mb-3">
                                    <p>Does student have dental insurance?</p>
                                    <Dropdown
                                        value={formData.haveDentalInsurance}
                                        onSelect={(e) => {
                                            setFormData({
                                                ...formData,
                                                haveDentalInsurance: e,
                                            });
                                            if (e === "No") {
                                                handleOpen();
                                            }
                                        }}
                                    >
                                        <Dropdown.Toggle id="dropdown-basic">
                                            {formData.haveDentalInsurance}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                eventKey="Yes"
                                                href="#/action-1"
                                            >
                                                Yes
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey="No"
                                                href="#/action-2"
                                            >
                                                No
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            
                            <div className="rightArea"></div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: "20px 100px"}}>
                    <h1 className="BasicDetails">Photos</h1>
                    <h5 align="left">
                        Please have your student in good lighting and take the
                        pictures as shown. You can refer to this {" "}
                        <a href="https://www.youtube.com/watch?v=ZRb-4HpAE9Y" target= "_blank">
                            Video
                        </a>{" "} on how to take the best photos for screening.
                    </h5>
                    <div className="uploadPictures">
                                <div>Non Smiling Demo Image {" "}
                                <img
                                    width="60 px"
                                    height="60 px"
                                    className="image-placeholder"
                                    src={DemoNonsmilingImg}
                                    alt="..."
                                />
                                </div> 
                    </div>
                    <div>
                        <input
                            id="home-file-input-nonSmiling"
                            type="file"
                            class="input-file"
                            onChange={onChangeNonSmilingimage}
                        />
                        <label
                            id="non-smiling"
                            className="image-input-label"
                            htmlFor="home-file-input-nonSmiling"
                        >
                            + Non-smile
                        </label>
                    </div> 

             

                     <div className="uploadPictures">
                            <div>Front Teeth Demo Image{" "}
                                <img
                                    className="image-placeholder"
                                    src={DemoFrontTeethImg}
                                    alt="..."
                                />
                            </div> </div>
                            
                      
                            <div>
                                <input
                                    id="home-file-input-frontTeeth"
                                    type="file"
                                    className="input-file"
                                    onChange={onChangeFrontTeethimage}
                                />
                                <label
                                    id="front-teeth"
                                    className="image-input-label"
                                    htmlFor="home-file-input-frontTeeth"
                                >
                                    + Front
                                </label>
                            </div>
                        
                    <div className="uploadPictures">
                                <div>Left Bite Demo Image{" "}
                                    <img
                                        className="image-placeholder"
                                        src={DemoLeftImg}
                                        alt="..."
                                    />
                                </div> 
                    </div>
                       
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
                                    + Left
                                </label>
                            </div>
                
                    <div className="uploadPictures">
                                <div>Right Bite Demo Image{" "}
                                    <img
                                        className="image-placeholder"
                                        src={DemoRightImg}
                                        alt="..."
                                    />
                                </div>
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
                                    + Right
                                </label>
                            </div>
                        
                    <div className="uploadPictures">
                                <div>Top Teeth Demo Image{" "}
                                    <img
                                        className="image-placeholder"
                                        src={DemoTopImg}
                                        alt="..."
                                    />
                                </div>
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
                                    + Top
                                </label>
                            </div>
                       
                    <div className="uploadPictures">
                                <div>Bottom Teeth Demo Image {"  "}
                                    <img
                                        className="image-placeholder"
                                        src={DemoBottomImg}
                                        alt="..."
                                    />
                                </div>
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
                                    + Bottom
                                </label>
                            </div>
                
                    <div className="uploadPictures">
                        {/* New - KK moved to front*/}
                        {/*non smiling code*/}
                        
                    </div>
                    <h4>
                        <button
                            className="SubmitButton"
                            type="submit"
                            style={{
                                padding: "20px",
                                color: "#2a8bf2",
                                background: "none",
                                border: "1px solide grey",
                            }}
                            disabled={
                                !(
                                    formData.nonsmilingface &&
                                    formData.frontTeeth &&
                                    formData.topimage &&
                                    formData.bottomimage &&
                                    formData.leftimage &&
                                    formData.rightimage
                                )
                            }
                        >
                            Submit Student
                        </button>
                    </h4>
                </div>
            </form>
            <Modal
                open={open}
                onClose={handleOpen}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <p>
                        Would you like to receive additional information on
                        Kansas Medicaid:
                    </p>
                    <div>
                        <input
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    okToReceiveMedicaidInfo: "Yes",
                                });
                                handleOpen();
                            }}
                            type="radio"
                            name="question"
                            id=""
                            style={{ marginRight: "5px" }}
                        />
                        Yes
                    </div>
                    <div>
                        <input
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    okToReceiveMedicaidInfo: "No",
                                });
                                handleOpen();
                            }}
                            type="radio"
                            name="question"
                            style={{ marginRight: "5px" }}
                        />
                        No
                    </div>
                </div>
            </Modal>
            <Modal
                open={thankYouModel}
                onClose={handleThankModelClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <p>Thank you for your response.</p>
                    {formData.haveDentalInsurance === "Yes" && (
                        <a href="https://www.kdheks.gov/hcf/Medicaid/eligibility_guidelines.html" target="_blank" alt="...">
                            Link to Kansas Medicaid
                        </a>
                    )}
                    <br />
                    <Button
                        onClick={handleThankModelClose}
                        style={{ display: "block", margin: "10px auto" }}
                    >
                        OK
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
export default CollectionApp;
