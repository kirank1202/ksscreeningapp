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


const initialFormState = {
    code: "",
    name: "",
    gender: "Male",
    district: "Hays USD 489",
    school: "",
    grade: "1",
    location: "School",
    haveDentalInsurance: "Yes",
    okToReceiveMedicaidInfo: "No",
    evalStatus: "New",
    optout: "No",
    dentalPain: "No",
    optoutReason: "NA",
    screener: "",
    untreatedDecay: "No",
    treatedDecay: "No",
    sealantsPresent: "No",
    treatmentRecommendationCode: "Code 1",
    cannotEvaluate: "NA"
};

const resetFormState = {
    code: "",
    name: "",
    gender: "Male",
    firstname3letters: "",
    
    haveDentalInsurance: "Yes",
    okToReceiveMedicaidInfo: "No",
    evalStatus: "New",
    optout: "No",
    dentalPain: "No",
    optoutReason: "NA",
    untreatedDecay: "No",
    treatedDecay: "No",
    sealantsPresent: "No",
    treatmentRecommendationCode: "Code 1",
    cannotEvaluate: "NA"
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
    location: "School"
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

const ManualScreeningApp = () => {
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

    
    async function handleSubmit(e) {
        setIsLoaded(false);

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
        
        // handleConfirmSubmitModel();
        alert(`Student ${formData.code} Uploaded Successfully.\n\nThank You for participating in Hays (USD 489) 2021 Dental Screening Program.`);
        setIsLoaded(true);

        if(formData.okToReceiveMedicaidInfo === "Yes" ) {
            window.location.href = "https://www.kdheks.gov/hcf/Medicaid/eligibility_guidelines.html"; 
        } else {
            setFormData(resetFormState);
           // window.location.reload(); 
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
        <div className="ManaulScreeningApp" className={lang}>
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
                                <li> <a onClick={() => history.push('evaluation') }>Evaluation </a> </li>
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
                                    <li> <a onClick={() => history.push('evaluation') }> Evaluation </a> </li>
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
                        <div className="manualFormContainer">
                            <div className="leftArea">
                              
                              <table> 
                              <tr> 
                              <td>   
                                {/* Show Screener Name */}
                                <div align="left">
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
                                <div align="left">
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
                                

                                <div align="left">
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
                            
                            
                                <div align="left" className="mb-3">
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
                                </td>
                                <td> 

                                <div align="left" className="mb-3">
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
                               
                                <div align="left" className="mb-3">
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
                              
                                <div align="left" className="mb-3">
                                    <p>{t("First 3 Letters of Legal First Name")}<span class="required">*</span></p>
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
                               
                                <div align="left" className="mb-3">
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
                                </td>
                                <td> 
                                <div align="left" className="mb-3">
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
                                
                         {/*}   {(formData.haveDentalInsurance == "No") ? ( */ }
                                <div align="left" className="mb-3">
                                    <p>{t("Would you like to receive information on Kansas Medicaid?")} &nbsp; 
                                   <p> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
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
                                   
                                    {t("No")}   </p>
                                    </p><p> </p><p></p>
                                </div>  
                          
                          {/*}  ): "" } */} 
                          
                          <div align="left" className="mb-3">
                                
                                    <p>{t("Parent/Guardian Email")}</p>
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
                                
                                
                                <div align="left" className="mb-3">
                                    <p>{t("Are you currently experiencing any mouth pain?")}<span class="required">*</span></p>
                                    <p></p>
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
                                </td> 
                                </tr> </table>
                              {/* }  <table>
                                <tr align="left"> <td>
                                <div className="econsentmsg"> 
                                    <span align="left">
                                    <sup>1</sup> {t("By providing email address you consent to receive emails with information such as screening results, Kansas Medicaid information, and other oral care education material")} 
                                    </span>
                                </div>
                                </td>
                                    </tr></table> */}
                                
                                <table><tr> <td> 
                               
                                {/* HIDE OPT OUT OPTION */}
                                <div className="mb-3">
                                    <h6 className="BasicDetails">{t("OPT OUT OPTION")}</h6>
                                    <h9 align="left">
                                        <p>{t("Select a reason from the dropdown if the student has optout of school dental screening")}</p>
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
                                </td><td>
                               { /*  end of optout field */ }

                            {/* If not opted out enter screening evaluation results */}
                                    <div align="left" className="mb-3">
                                        <p>{t("Untreated Decay?")} &nbsp;
                                        <input
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    untreatedDecay: "Yes",
                                                });
                                            //  handleOpen();
                                            }}
                                            type="Radio"
                                            name="untreatedDecay"
                                            id=""
                                            style={{ marginRight: "5px" }}

                                            disabled={
                                                !(
                                                    formData.optoutReason == "NA"
                                                )
                                            }
                                        />
                                        {t(`Yes`)} {"   "}
                                        <input
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    untreatedDecay: "No",
                                                });
                                            // handleOpen();
                                            }}
                                            type="radio"
                                            defaultChecked
                                            name="untreatedDecay"
                                            style={{ marginRight: "5px" }}
                                            
                                            disabled={
                                                !(
                                                    formData.optoutReason == "NA"
                                                )
                                            }    
                                        />
                                        {t("No")}
                                        </p>
                                    </div>  
                               
                                    <div align="left" className="mb-3">
                                        <p>{t("Treated Decay?")} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <input
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    treatedDecay: "Yes",
                                                });
                                            //  handleOpen();
                                            }}
                                            type="Radio"
                                            name="treatedDecay"
                                            id=""
                                            style={{ marginRight: "5px" }}

                                            disabled={
                                                !(
                                                    formData.optoutReason == "NA"
                                                )
                                            }
                                        />
                                        {t(`Yes`)} {"   "}
                                        <input
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    treatedDecay: "No",
                                                });
                                            // handleOpen();
                                            }}
                                            type="radio"
                                            defaultChecked
                                            name="treatedDecay"
                                            style={{ marginRight: "5px" }}
                                            
                                            disabled={
                                                !(
                                                    formData.optoutReason == "NA"
                                                )
                                            }    
                                        />
                                        {t("No")}
                                        </p>
                                    </div>  
                                    
                                    <div align="left" className="mb-3">
                                        <p>{t("Sealants Present?")} &nbsp;
                                        <input
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    sealantsPresent: "Yes",
                                                });
                                            //  handleOpen();
                                            }}
                                            type="Radio"
                                            name="sealants"
                                            id=""
                                            style={{ marginRight: "5px" }}

                                            disabled={
                                                !(
                                                    formData.optoutReason == "NA"
                                                )
                                            }
                                        />
                                        {t(`Yes`)} {"   "}
                                        <input
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    sealantsPresent: "No",
                                                });
                                            // handleOpen();
                                            }}
                                            type="radio"
                                            defaultChecked
                                            name="sealants"
                                            style={{ marginRight: "5px" }}
                                            
                                            disabled={
                                                !(
                                                    formData.optoutReason == "NA"
                                                )
                                            }    
                                        />
                                        {t("No")}
                                        </p>
                                    </div>  

                                    <div align="left" className="mb-3">
                                        <p>{t("Treatment Option")} &nbsp;&nbsp;
                                        <input
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    treatmentRecommendationCode: "Code 1",
                                                });
                                            //  handleOpen();
                                            }}
                                            type="Radio"
                                            defaultChecked
                                            name="treatmentoption"
                                            id=""
                                            style={{ marginRight: "5px" }}

                                            disabled={
                                                !(
                                                    formData.optoutReason == "NA"
                                                )
                                            }
                                        />
                                        {t(`Code 1`)} &nbsp;&nbsp;&nbsp;&nbsp;
                                        <input
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    treatmentRecommendationCode: "Code 2",
                                                });
                                            // handleOpen();
                                            }}
                                            type="radio"
                                            name="treatmentoption"
                                            style={{ marginRight: "5px" }}
                                            
                                            disabled={
                                                !(
                                                    formData.optoutReason == "NA"
                                                )
                                            }    
                                        />
                                        {t("Code 2")} &nbsp;&nbsp;&nbsp;&nbsp;

                                        <input
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    treatmentRecommendationCode: "Code 3",
                                                });
                                            // handleOpen();
                                            }}
                                            type="radio"
                                            name="treatmentoption"
                                            style={{ marginRight: "5px" }}
                                            
                                            disabled={
                                                !(
                                                    formData.optoutReason == "NA"
                                                )
                                            }    
                                        />
                                        {t("Code 3")} &nbsp;&nbsp;&nbsp;&nbsp;

                                        <input
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    treatmentRecommendationCode: "Code 4",
                                                });
                                            // handleOpen();
                                            }}
                                            type="radio"
                                            name="treatmentoption"
                                            style={{ marginRight: "5px" }}
                                            
                                            disabled={
                                                !(
                                                    formData.optoutReason == "NA"
                                                )
                                            }    
                                        />
                                        {t("Code 4")} 
                                        </p>
                                    </div>  
                                </td>
                                </tr>
                                </table>

                            {/* End of Screening Evaluation Results */}

                            <div className="rightArea"></div>
                        </div>
                    </div>

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
                                    formData.haveDentalInsurance
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
                    <h6 align="center">
                        {t("* By submiting, you authorize dental professionals to review the submitted data for screening purposes.")}
                    </h6>
                    <br/>
                    

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
                    </p> <p></p>
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
export default ManualScreeningApp;
