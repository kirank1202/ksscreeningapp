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


// const DemoBottomImg = "https://screeningdemoimages.s3.amazonaws.com/mandibular.PNG";
//const DemoTopImg = "https://screeningdemoimages.s3.amazonaws.com/maxillary.PNG";
// const DemoLeftImg = "https://screeningdemoimages.s3.amazonaws.com/left.PNG";
// const DemoRightImg = "https://screeningdemoimages.s3.amazonaws.com/right.PNG";
// const DemoNonsmilingImg = "https://screeningdemoimages.s3.amazonaws.com/nonsmiling.JPG";
// const DemoFrontTeethImg = "https://screeningdemoimages.s3.amazonaws.com/frontteeth.jpeg";


const DemoBottomImg = "https://screeningdemoimages.s3.amazonaws.com/BottomDemo.JPG"; 
const DemoTopImg = "https://screeningdemoimages.s3.amazonaws.com/TopDemo.jpg";
const DemoLeftImg = "https://screeningdemoimages.s3.amazonaws.com/LeftDemo.JPG";
const DemoRightImg = "https://screeningdemoimages.s3.amazonaws.com/RightDemo.JPG";
const DemoNonsmilingImg = "https://screeningdemoimages.s3.amazonaws.com/nonsmilingdemo.JPG";
const DemoFrontTeethImg = "https://screeningdemoimages.s3.amazonaws.com/FrontTeethDemo.JPG";

let selectedNonSmilingImage; 
let selectedFrontImage; 
let selectedLeftImage; 
let selectedRightImage;
let selectedTopImage; 
let selectedBottomImage;

const initialFormState = {
    code: "",
    name: "",
    gender: "Male",
    district: "Hays USD 489",
    school: "",
    grade: "1",
    leftimage: "",
    rightimage: "",
    location: "School",
    haveDentalInsurance: "Yes",
    okToReceiveMedicaidInfo: "No",
    evalStatus: "New",
    optout: "No",
    dentalPain: "No",
    optoutReason: "NA",
    screener: ""
};
/*
const initialExtraFormState = {
    optoutReason: "NA",
    dentalPain: "No"
} 
*/

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
    {title: "Wilson Elementary" },
    {title: "O'Loughlin Elementary" },
    {title: "Hays Middle School" }
 // April 4 2021 (kk) temporarily use only 3 schools for screening for Trip to Hays
   // {title: "Roosevelt Elementary"},
   // {title: "Lincoln Elementary"},
   // {title: "Westside School" }
]; 

const locationList = [
    {title: 'Home'},
    {title: 'School' },
    {title: 'Other'},
];

const gradelist = [
    { title: 'K'},
    { title: '1'},
    { title: '2'},
    { title: '3'},
    { title: '4'},
    { title: '5'},
    { title: '6'},
    { title: '7'}
  ];

const resetStudentState = {
    code: "",
    gender: "Male",
    location: "School",
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
  //  const [extraFormData, setExtraFormData] = useState(initialExtraFormState);
    const [lang, setLang] = React.useState('en');
    //Access screener name to update automatically 
    const [screener, setscreenerName] = useState("");
    const [students, setStudents] = useState([]);
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [confirmSubmitModel, setConfirmSubmitModel] = React.useState(false);
    const { t } = useTranslation();
    const [isLoaded, setIsLoaded] = useState(true);

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

    //Set the login user as the Student.screener 
    const func = async() => {
        let user = await Auth.currentAuthenticatedUser();
        setscreenerName(user.username); //all attributes exist in the attributes field 
      }
      func();

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

        // const file = e.target.files[0];
        selectedLeftImage = e.target.files[0];
        reader.readAsDataURL(selectedLeftImage);
        setFormData({
            ...formData,
            leftimage: generateImageFileName("left"),
        });
     //   await Storage.put(generateImageFileName("left"), file);
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

        // const file = e.target.files[0];
        selectedRightImage = e.target.files[0];
        reader.readAsDataURL(selectedRightImage);

        setFormData({
            ...formData,
            rightimage: generateImageFileName("right"),
        });
      //  await Storage.put(generateImageFileName("right"), file);
    }

    async function onChangetopimage(e) {
        if (!e.target.files[0]) return;
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

       // const file = e.target.files[0];

        selectedTopImage = e.target.files[0];
        reader.readAsDataURL(selectedTopImage);

        setFormData({
            ...formData,
            topimage: generateImageFileName("top"),
        });
        //await Storage.put(generateImageFileName("top"), file);
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

      //  const file = e.target.files[0];
        selectedBottomImage = e.target.files[0];
        reader.readAsDataURL(selectedBottomImage);
        setFormData({
            ...formData,
            bottomimage: generateImageFileName("bottom"),
        });
        

        //await Storage.put(generateImageFileName("bottom"), file);
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

        // const file = e.target.files[0];
        selectedNonSmilingImage = e.target.files[0];
        reader.readAsDataURL(selectedNonSmilingImage);
        setFormData({
            ...formData,
            nonsmilingface: generateImageFileName("nonsmiling"),
        });
       // await Storage.put(generateImageFileName("nonsmiling"), file);
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

       // const file = e.target.files[0];
        selectedFrontImage = e.target.files[0];
        reader.readAsDataURL(selectedFrontImage);

     
        setFormData({
            ...formData,
            frontTeeth: generateImageFileName("front"),
        });

        // await Storage.put(generateImageFileName("front"), file);
        //alert("Front-Teeth image changes");
    }

    async function handleSubmit(e) {
        setIsLoaded(false);
        /*
        let confirmToSubmit =  window.confirm(`Please verify that all images are in focus before submitting`); 
        if (confirmToSubmit) {  
            createStudent(e);
        } else {return;} */
        if(formData.optoutReason != "NA"){
            formData.optout = "Yes";
        }
       formData.screener = screener; 
        //formData.dentalPain = extraFormData.dentalPain;
        
        console.log("FormData: ",formData);
        
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
        
        if (formData.optout === "No") {
            await Storage.put(generateImageFileName("nonsmiling"), selectedNonSmilingImage);
            await Storage.put(generateImageFileName("front"), selectedFrontImage);
            await Storage.put(generateImageFileName("left"), selectedLeftImage);
            await Storage.put(generateImageFileName("right"), selectedRightImage);
            await Storage.put(generateImageFileName("top"), selectedTopImage);
            await Storage.put(generateImageFileName("bottom"), selectedBottomImage);
        }
        // handleConfirmSubmitModel();
        alert(`Student ${formData.code} Uploaded Successfully.\n\nThank You for participating in Hays (USD 489) 2021 Dental Screening Program.`);
        setIsLoaded(true);

        if(formData.okToReceiveMedicaidInfo === "Yes" ) {
            window.location.href = "https://www.kdheks.gov/hcf/Medicaid/eligibility_guidelines.html"; 
        } else {
            //setFormData(initialFormState);
            window.location.reload(); 
        }

    }

   function handleOptoutReasonChange() {
    // const el = document.getElementById("non-smiling");
    // el.style.background = `url(${e.target.result})`;
    // console.log(formData.nonsmilingface);
    }

    // Show initial welcome popup message (only once for login).
    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        console.log('SST', sessionStorage.getItem("hideInfo"));
        if(sessionStorage && sessionStorage.getItem("hideInfo")  !== "yes") {
            sessionStorage.setItem("hideInfo", "yes")
            alert(`Welcome to the Dental Screening program 2021. Your participation in these screenings allows us to potentially receive funding from the state for the health of our children. Please note that this screening does not sign your student up for any dental care. Thank you for your participation.`);
        }
    });
    
    return (
        <div className="CollectionApp" className={lang}>
            <div className={classes.root}>
                <AppBar position="fixed" color="#fff">
                    <Toolbar className={classes.flexToolbar}>
                        <img class="logo_style" src={logo} alt="..." />
                        <h5 className="logo-header" color="#fff">{t('School Dental Screening')}</h5>
                            <nav role="navigation" class="desktop">
                            <ul id="d-menu">
                                <li><a onClick={() => history.push('help-video') }>{t('Help')}</a> </li>
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
                                    <li><a onClick={() => history.push('help-video') }>{t('Help')}</a> </li>
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
                        <h4 class="heading-font">{t("Welcome to Hays (USD 489) 2021 Dental Screening Program ")} </h4>  
                    </div>
                    <div className="form">
                        <div className="formContainer">
                            <div className="leftArea">
                              
                                {/* Show Screener Name */}
                                <div>
                                    <p>{t("Screener")}<span class="required">*</span></p>
                                    <InputGroup className="mb-3">
                                        <FormCntrl
                                           // value={formData.screener}
                                           value = {screener}
                                            aria-label="screener"
                                            aria-describedby="basic-addon1"
                                            readOnly
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    screener: e.target.value,
                                                })
                                            }
                                        />
                                    </InputGroup>
                                </div>
                              
                                {/* temporarily change this to default text field 
                                <div className="mb-3">
                                    <p>{t("Screening Location")}<span class="required">*</span></p>
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
                                    */}

                                {/* Temporariliy default location to School */}
                                <div>
                                <p>{t("Screening Location")}<span class="required">*</span></p>
                                    <InputGroup className="mb-3">
                                        <FormCntrl
                                            value={formData.location}
                                            aria-label="location"
                                            aria-describedby="basic-addon1"
                                            readOnly
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    location: e.target.value,
                                                })
                                            }
                                        />
                                    </InputGroup>
                                </div>


                                <div>
                                    <p>{t("School District")}<span class="required">*</span></p>
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
                                    <p>{t("School Name")}<span class="required">*</span></p>
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
                                    <p>{t("Student ID")}<span class="required">*</span></p>
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
                                    <p>{t("First 3 Letters of Student's Legal First Name")}<span class="required">*</span></p>
                                    <InputGroup className="mb-3">
                                        <FormCntrl
                                            value={formData.firstname3letters}
                                            aria-label="firstname3letters"
                                            aria-describedby="basic-addon1"
                                            maxlength="3"
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
                                    <p>{t("Grade")}<span class="required">*</span> </p>
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
                                    <p>{t("Gender")}<span class="required">*</span></p>
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
                                    <p>{t("Does student have dental insurance?")}<span class="required">*</span></p>
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
                                    <p>{t("Would you like to receive information on Kansas Medicaid?")} &nbsp;
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
                                    <p>{t("Parent/Guardian Email")}<sup>1</sup></p>
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
                                    <sup>1</sup>{t("By providing email address you consent to receive emails with information such as screening results, Kansas Medicaid information, and other oral care education material")}
                                    </span>
                                </div>
                                <div className="mb-3">
                                    <p>{t("Are you currently experiencing any mouth pain?")}<span class="required">*</span></p>
                                    <Dropdown
                                        value={formData.dentalPain}
                                        onSelect={(e) => {
                                            setFormData({
                                                ...formData,
                                                dentalPain: e,
                                            });
                                        }}
                                    >
                                        <Dropdown.Toggle id="dropdown-basic">
                                            {formData.dentalPain}
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
                               
                            <div className="rightArea"></div>
                        </div>
                    </div>
                    { (formData.optoutReason === "NA") ? (
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
                                disabled = {!formData.code}
                            />
                            <label
                                id="front-teeth"
                                className="image-input-label"
                                htmlFor="home-file-input-frontTeeth"
                            >
                              {t("+ Click Here to Add Front Teeth Photo")}
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
                                disabled = {!formData.code}
                            />
                            <label
                                id="top"
                                className="image-input-label"
                                htmlFor="home-file-input-top"
                            >
                            {t("+ Click Here to Add Top Teeth Photo")}
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
                                disabled = {!formData.code}
                            />
                            <label
                                id="bottom"
                                className="image-input-label"
                                htmlFor="home-file-input-bottom"
                            >
                                {t("+ Click Here to Add Bottom Teeth Photo")}
                            </label>
                        </div>
                    </div>

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
                                disabled = {!formData.code}
                            />
                            <label
                                id="non-smiling"
                                className="image-input-label"
                                htmlFor="home-file-input-nonSmiling"
                            >
                                {t("+ Click Here to Add Non-Smiling Face Photo")}
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
                                disabled = {!formData.code}
                            />
                            <label
                                id="left"
                                className="image-input-label"
                                htmlFor="home-file-input-left"
                            > 
                            {t("+ Click Here to Add Left Teeth Bite Photo")}
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
                                disabled = {!formData.code}
                            />
                            <label
                                id="right"
                                className="image-input-label"
                                htmlFor="home-file-input-right"
                            >
                           {t("+ Click Here to Add Right Teeth Bite Photo")}
                            </label>
                        </div>
                    </div> 
                
                </div>
                    ): "" }
                   { (formData.optoutReason === "NA")? (
                       <h4>
                        <span class="required"> {t("*Please select all the required fields")}</span>
                      {(isLoaded) ? ( 
                        <button
                            className="SubmitButton"
                            type="submit"
                            disabled={
                                !(  formData.location &&
                                    formData.district &&
                                    formData.school &&
                                    formData.code &&
                                    formData.firstname3letters &&
                                    formData.grade &&
                                    formData.gender &&
                                    formData.haveDentalInsurance &&
                                    formData.frontTeeth &&
                                    formData.topimage &&
                                    formData.bottomimage
                                //    formData.nonsmilingface &&
                                //    formData.leftimage &&
                                //    formData.rightimage
                                )
                            }
                        >
                            {t("Submit Student*")}

                        </button>
                      ):
                      <button
                            className="SubmitButton"
                            type="button"
                            disabled
                        >
                            {t("Please wait....")}

                       </button> 
                    }                        

                    </h4>)
                    : <h4>
                        <span class="required"> {t("*Please select all the required fields")}</span>
                        <button className="SubmitButton" type="submit"
                         disabled={
                                !(  formData.location &&
                                    formData.district &&
                                    formData.school &&
                                    formData.code &&
                                    formData.firstname3letters &&
                                    formData.grade &&
                                    formData.gender &&
                                    formData.haveDentalInsurance
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
                     {/* HIDE OPT OUT OPTION */}
                                <div className="mb-3">
                                <h6 className="BasicDetails">{t("OPT OUT OPTION")}</h6>
                                   

                                   <h9>
                                    <p>{t("Select a reason from the dropdown if you would like to optout of school dental screening and then clieck on Submit Student button above")}</p>
                                    </h9>
                                    <Dropdown
                                        value={formData.optoutReason}
                                        onSelect={(e) => {
                                            setFormData({
                                                ...formData,
                                                optoutReason: e,
                                            });
                                        // handleOptoutReasonChange();
                                        }}
                                    >
                                        <Dropdown.Toggle id="dropdown-basic">
                                            {formData.optoutReason}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                eventKey="NA"
                                            >
                                                {t("NA")}
                                            </Dropdown.Item>
                                        
                                            <Dropdown.Item
                                                eventKey="Visited Dentist in last 6 months"
                                            >
                                                {t("Visited Dentist in last 6 months")}
                                            </Dropdown.Item>

                                            <Dropdown.Item
                                                eventKey="Do not have a smart phone"
                                            >
                                                {t("Do not have a smart phone")}
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey="Need technical help"
                                            >
                                                {t("Need technical help")}
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                eventKey="Concerned about student's privacy"
                                            >
                                                {t("Concerned about student's privacy")}
                                            </Dropdown.Item>

                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <h5></h5>
                                </div>
                               { /* */ }
                            </div>
                            
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
         {/*
            <div id="overlay" class="desktop-message">
              <div id="text">{t("This app can only be used using a tablet or smart phone")}</div>
            </div>
         */}
        </div>

    );
};
export default CollectionApp;
