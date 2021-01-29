import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import logo from "./TeledentalSolutionLogo13.png";
import EvaluationApp from "./EvaluationApp";

import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import FormCntrl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import "./App.css";
import { API, Storage, Auth } from "aws-amplify";

import { createStudent as createStudentMutation } from "./graphql/mutations";
import { listSchools } from "./graphql/queries";
import { useHistory } from "react-router-dom";
// Language translation imports.
import { useTranslation } from "react-i18next";
import i18next from "i18next";


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
    district: "Hays USD 489",
    school: "",
    grade: "1",
    leftimage: "",
    rightimage: "",
    location: "Home",
    haveDentalInsurance: "Yes",
    okToReceiveMedicaidInfo: "No",
    evalStatus: "New",
};
const initialExtraFormState = {
    dentalScreening: "No",
    dentalPain:  "No Pain"
}

// const schoolList = [
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

const schoolList = [
    {title: "Lincoln Elementary"},
    {title: "O'Loughlin Elementary" },
    {title: "Roosevelt Elementary"},
    {title: "Wilson Elementary" },
]; 

const locationList = [
    {title: 'Home'},
    {title: 'School' },
    {title: 'Other'},
];

const gradelist = [
    { title: 'EK'},
    { title: 'KG'},
    { title: '1'},
    { title: '2'},
    { title: '3'},
    { title: '4'},
    { title: '5'},
    { title: '6'},
    { title: '7'},
    { title: '8'},
    { title: '9'},
    { title: '10'},
    { title: '11'},
    { title: '12'}
  ];

const resetStudentState = {
    code: "",
    gender: "Male",
    leftimageselection: "",
    rightimageselection: "",
};

async function fetchAllSchools() {
    const apiData = await API.graphql({ query: listSchools });
    const schoolsFromAPI = apiData.data.listSchools.items;
    schoolList = schoolsFromAPI; 
    
    //school end
  
    //   let sortedArr = apiData.data.listSchools.items.sort(
    //     (a, b) =>
    //       new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    //   ); // setStudents(apiData.data.listStudents.items);
    //   setSchools(sortedArr);
    }

// fetchAllSchools(); 

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
    const [extraFormData, setExtraFormData] = useState(initialExtraFormState);
    const [lang, setLang] = React.useState('en');
    const [students, setStudents] = useState([]);
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [confirmSubmitModel, setConfirmSubmitModel] = React.useState(false);
    const { t } = useTranslation();
    let history = useHistory();

    const handleLanguage = (lang) => {
        i18next.changeLanguage(lang);
        setLang(lang);
    }

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleConfirmSubmitModel = () => {
        setConfirmSubmitModel(!confirmSubmitModel);
    };

    const handleConfirmSubmitModelClose = () => {
        setFormData(initialFormState);
        const labels = document.getElementsByClassName("image-input-label");
        for (let i = 0; i < labels.length; i++) {
            const element = labels[i];
            element.style.background = "none";
            element.innerHTML = "+";
        }
        setConfirmSubmitModel(!confirmSubmitModel);
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

    async function handleSubmit(e) {
        /*
        let confirmToSubmit =  window.confirm(`Please verify that all images are in focus before submitting`); 
        if (confirmToSubmit) {  
            createStudent(e);
        } else {return;} */
        createStudent(e);
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
        // handleConfirmSubmitModel();
        alert(`Student ${formData.code} Uploaded Successfully.\n\nThank You for participating in Dental Screening 2020 Program.`);
        if(formData.okToReceiveMedicaidInfo === "Yes" ) {
            window.location.href = "https://www.kdheks.gov/hcf/Medicaid/eligibility_guidelines.html"; 
        } else {
            //setFormData(initialFormState);
            window.location.reload(); 
        }

    }

    
    return (
        <div className="CollectionApp" className={lang}>
            <div className={classes.root}>
                <AppBar position="fixed" color="#fff">
                    <Toolbar className={classes.flexToolbar}>
                        <img class="logo_style" src={logo} alt="..." />
                        <h5 className="logo-header" color="#fff">{t('School Dental Screening')}</h5>
                            <nav role="navigation" class="desktop">
                            <ul id="d-menu">
                                <li><a onClick={() => history.push('help-video') }>{t('Help Video')}</a> </li>
                                <li className="es"><a onClick={() => handleLanguage("es")}>{t('Spanish')}</a> </li>
                                <li className="en"><a onClick={() => handleLanguage("en")}>{t('English')}</a> </li>
                                {/* <li>  <a onClick={() => history.push('collection') }>collection</a> </li>
                                <li> <a onClick={() => history.push('reports') }>Reports</a> </li>
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
                                    <li><a onClick={() => history.push('help-video') }>{t('Help Video')}</a> </li>
                                    <li className="es"><a onClick={() => handleLanguage("es")}>{t('Spanish')}</a> </li>
                                    <li className="en"><a onClick={() => handleLanguage("en")}>{t('English')}</a> </li>
                                </ul>
                            </div>
                        </nav>
                    </Toolbar>
                </AppBar>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mainContainer">
                    <div className="welcome-msg">
                        <h4>{t("Welcome to 2020 Student Screening Program")} </h4>  
                    </div>
                    <div className="form">
                        <div className="formContainer">
                            <div className="leftArea">
                                <div className="mb-3">
                                    <p>{t("Screening Location")}</p>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={locationList}
                                        getOptionLabel={(option) => option.title}
                                        //style={{ height: 5 }}
                                        onChange={(event, newValue) => {
                                            setFormData({
                                                ...formData,
                                                location: newValue.title,
                                            });
                                        }}
                                        renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                                    />
                                </div>
                                
                                <div>
                                    <p>{t("School District")}</p>
                                    <InputGroup className="mb-3">
                                        <FormCntrl
                                            value={formData.district}
                                            aria-label="district"
                                            aria-describedby="basic-addon1"
                                            readOnly
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    district: e.target.value,
                                                })
                                            }
                                        />
                                    </InputGroup>
                                </div>
                            
                                
                                <div className="mb-3">
                                    <p>{t("School Name")}</p>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={schoolList}
                                        getOptionLabel={(option) => option.title}
                                        //style={{ height: 5 }}
                                        onChange={(event, newValue) => {
                                            setFormData({
                                                ...formData,
                                                school: newValue.title,
                                            });
                                        }}
                                        renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                                    />
                                </div>
                                <div>
                                    <p>{t("Student ID")}</p>
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
                                    <p>{t("First 3 Letters of Student's first Name")}</p>
                                    <InputGroup className="mb-3">
                                        <FormCntrl
                                            value={formData.firstname3letters}
                                            aria-label="firstname3letters"
                                            aria-describedby="basic-addon1"
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    firstname3letters: e.target.value,
                                                })
                                            }
                                        />
                                    </InputGroup>
                                </div>
                                <div className="mb-3">
                                    <p>{t("Grade")} </p>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={gradelist}
                                        getOptionLabel={(option) => option.title}
                                        //style={{ height: 5 }}
                                        onChange={(event, newValue) => {
                                            setFormData({
                                                ...formData,
                                                grade: newValue.title,
                                            });
                                        }}
                                        renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                                    />
                                </div>
                                <div className="mb-3">
                                    <p>{t("Gender")}</p>
                                    <Dropdown
                                        value={formData.gender}
                                        onSelect={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    gender: e,
                                                })
                                                console.log("FormData: ",formData);
                                            }
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
                                                {t("Male")}
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey="Female"
                                                href="#/action-2"
                                            >
                                                {t("Female")}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="mb-3">
                                    <p>{t("Does student have dental insurance?")}</p>
                                    <Dropdown
                                        value={formData.haveDentalInsurance}
                                        onSelect={(e) => {
                                            setFormData({
                                                ...formData,
                                                haveDentalInsurance: e,
                                            });
                                            if (e === "No") {
                                                // handleOpen();
                                                
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
                                                {t("Yes")}
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey="No"
                                                href="#/action-2"
                                            >
                                                {t("No")}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            {(formData.haveDentalInsurance == "No") ? (
                                <div className="mb-3">
                                    <p> {t("Would you like to receive information on Kansas Medicaid: ")} 
                                    <input
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                okToReceiveMedicaidInfo: "Yes",
                                            });
                                          //  handleOpen();
                                        }}
                                        type="Radio"
                                        name="question"
                                        id=""
                                        style={{ marginRight: "5px" }}

                                        disabled={
                                            !(
                                                formData.haveDentalInsurance == "No"
                                            )
                                        }
                                    />
                                    {t(`Yes`)} {"   "}
                                    <input
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                okToReceiveMedicaidInfo: "No",
                                            });
                                           // handleOpen();
                                        }}
                                        type="radio"
                                        name="question"
                                        style={{ marginRight: "5px" }}
                                        
                                        disabled={
                                            !(
                                                formData.haveDentalInsurance == "No"
                                            )
                                        }    
                                    />
                                    {t("No")}
                                    </p>
                                </div>  
                            ): "" }
                                <div>
                                    <p>{t("Parent/Guardian Email* ")}</p>
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
                                <div className="econsentmsg"> 
                                    <span align="left">
                                    {t("* By providing email address you consent to receive emails with information such as screening results, Kansas Medicaid information, and other oral care education material")}
                                    </span>
                                </div>
                                <div className="mb-3">
                                    <p>{t("Are you currently experiencing any dental pain?")}</p>
                                    <Dropdown
                                        value={extraFormData.dentalPain}
                                        onSelect={(e) => {
                                            setExtraFormData({
                                                ...extraFormData,
                                                dentalPain: e,
                                            });
                                        }}
                                    >
                                        <Dropdown.Toggle id="dropdown-basic">
                                            {extraFormData.dentalPain}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                eventKey="No Pain"
                                            >
                                                {t("No Pain")}
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey="Minor Pain"
                                            >
                                                {t("Minor Pain")}
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey="significant pain"
                                            >
                                                {t("significant pain")}
                                            </Dropdown.Item>
                                            
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="mb-3">
                                <h6 className="BasicDetails">{t("OPT OUT")}</h6>
                                    <p>{t("I would like to opt out for dental screening.")}</p>
                                    <Dropdown
                                        value={extraFormData.dentalScreening}
                                        onSelect={(e) => {
                                            setExtraFormData({
                                                ...extraFormData,
                                                dentalScreening: e,
                                            });
                                        }}
                                    >
                                        <Dropdown.Toggle id="dropdown-basic">
                                            {extraFormData.dentalScreening}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                eventKey="Yes"
                                            >
                                                {t("Yes")}
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey="No"
                                            >
                                                {t("No")}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            
                            <div className="rightArea"></div>
                        </div>
                    </div>
                    { (extraFormData.dentalScreening == "No") ? (
                    <div className="photos-section">
                    <h6 className="BasicDetails">{t("PHOTOS")}</h6>
                    <h6 align="left" className="PhotosHeading">
                    {t("Please have your student in good lighting and take the pictures as shown. You can refer to this")}
                        <a href="https://www.youtube.com/watch?v=ZRb-4HpAE9Y" target= "_blank">
                        {t(" Video")}
                        </a>{" "} {t("on how to take the best photos for screening.")}
                    </h6> <p></p>
                    <div className="uploadPictures">
                        <div class= "up-title"> 
                        {t("Non Smiling Demo Image")} {" "}
                        </div>
                        <div class="up-image">
                        <img
                            className="image-placeholder"
                            src={DemoNonsmilingImg}
                            alt="..."
                        />
                        </div> 
                        <div class="up-info">
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
                                {t("+ No-Smile")}
                            </label>
                        </div> 
                    </div>
                     <div className="uploadPictures">
                        <div class= "up-title"> 
                            {t("Front Teeth Demo Image")} {" "}
                        </div>
                        <div class="up-image">
                            <img
                                className="image-placeholder"
                                src={DemoFrontTeethImg}
                                alt="..."
                            />
                        </div> 
                        
                        <div class="up-info">
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
                            >{t("+ Front")}
                            </label>
                        </div>
                    </div>
                    <div className="uploadPictures">
                        <div class= "up-title"> 
                        {t("Left Bite Demo Image")}{"    "}
                        </div>
                        <div class="up-image">
                            <img
                                className="image-placeholder"
                                src={DemoLeftImg}
                                alt="..."
                            />
                        </div> 
                        <div class="up-info">
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
                            > {t("+ Left")}
                            </label>
                        </div>
                    </div>
                    <div className="uploadPictures">
                        <div class= "up-title"> 
                        {t("Right Bite Demo Image")}{" "}
                        </div>
                        <div class="up-image">
                            <img
                                className="image-placeholder"
                                src={DemoRightImg}
                                alt="..."
                            />
                        </div>
                        <div class="up-info">
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
                            >{t("+ Right")}
                            </label>
                        </div>
                    </div> 
                        
                    <div className="uploadPictures">
                        <div class= "up-title"> 
                        {t("Top Teeth Demo Image")}{" "}
                        </div>
                        <div class="up-image">
                            <img
                                className="image-placeholder"
                                src={DemoTopImg}
                                alt="..."
                            />
                        </div>
                        <div class="up-info">
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
                            >{t("+ Top")}
                            </label>
                        </div>
                    </div>
                       
                    <div className="uploadPictures">
                        <div class= "up-title"> 
                        {t("Bottom Teeth Demo Image")} {"  "}
                        </div>
                        <div class="up-image">
                            <img
                                className="image-placeholder"
                                src={DemoBottomImg}
                                alt="..."
                            />
                        </div>
                        <div class="up-info">
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
                            >{t("+ Bottom")}
                            </label>
                        </div>
                    </div>
                </div>
                    ): "" }
                   { (extraFormData.dentalScreening === "No")? (
                       <h4>
                        <button
                            className="SubmitButton"
                            type="submit"
                            disabled={
                                !(  formData.code &&
                                    formData.gender &&
                                    formData.name &&
                                    formData.nonsmilingface &&
                                    formData.frontTeeth &&
                                    formData.topimage &&
                                    formData.bottomimage &&
                                    formData.leftimage &&
                                    formData.rightimage
                                )
                            }
                        >
                            {t("Submit Student*")}
                        </button>
                    </h4>)
                    : <h4>
                        <button className="SubmitButton" type="submit"
                         disabled={
                                !(  formData.code &&
                                    formData.gender &&
                                    formData.name
                                )
                                }
                            >
                                {t("Submit Student*")}
                        </button>
                    </h4>
                    }
                    <h6 align="left">
                        {t("* By submiting, you authorize dental professionals to review the submitted data for screening purposes.")}
                    </h6>
                    <br/>
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
                    {t(`Would you like to receive additional information on Kansas Medicaid:`)}  {"  "}
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
                        {t("Yes")}  {"   "}
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
                        {t("No")}
                    </div>
                </div>
            </Modal>
            <Modal
                open={confirmSubmitModel}
                onClose={handleConfirmSubmitModelClose}
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
                   
                </div>
            </Modal>
            
        </div>

    );
};
export default CollectionApp;
