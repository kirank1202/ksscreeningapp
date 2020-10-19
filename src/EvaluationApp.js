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
import Modal from "@material-ui/core/Modal";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo from "./TeledentalSolutionLogo13.png";

const EvaluationApp = ({ history }) => {
    const [students, setStudents] = useState([]);
    const [imageData, setImageData] = useState();

    const initialState = {
        untreatedDecay: false,
        treatedDecay: false,
        sealantsPresent: false,
        treatmentRecommendationCode: "No obvious problem",

    };

    const [states, setState] = useState(initialState);
    // const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [imageLink, setImageLink] = React.useState("");
    const handleOpen = () => {
        setOpen(!open);
    };
    console.log(states)

    // function getModalStyle() {
    //     const top = 15;
    //     const left = 15;

    //     return {
    //         top: `${top}%`,
    //         left: `${left}%`,
    //         transform: `translate(-${top}%, -${left}%)`,
    //     };
    // }

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
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
        // setStudents(apiData.data.listStudents.items);
        setStudents(sortedArr);
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
            if (imageData < students.length) {
                setImageData(imageData + 1);
            }
            await API.graphql({
                query: updateStudentMutation,
                variables: {
                    input: {
                        id: students[imageData].id,
                        untreatedDecay: states.untreatedDecay.toString(),
                        treatedDecay: states.treatedDecay.toString(),
                        treatmentRecommendationCode: states.treatmentRecommendationCode.toString(),
                        sealantsPresent: states.sealantsPresent.toString(),
                        evalStatus: "Completed",
                    },
                },
            });
            // setState(initialState);

            console.log("students after submit:", students);
            console.log("states after submit:", states);
            alert("Evaluation Recorded Successfully");
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
        paper: {
            position: "absolute",
            width: "70%",
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));

    const handleFormState = () => {

        console.log("students in handleformState:", students);

        if (students[imageData] && students[imageData].untreatedDecay) {
            setState({
                ...states, untreatedDecay:students[imageData].untreatedDecay,
            });
        }
        if (students[imageData] && students[imageData].treatedDecay) {
            setState({
                ...states,
                treatedDecay: students[imageData].treatedDecay,
            });
        }
        if (students[imageData] && students[imageData].sealantsPresent) {
            setState({
                ...states,
                sealantsPresent: students[imageData].sealantsPresent,
            });
        }
        if (students[imageData] && students[imageData].untreatedDecay) {
            setState({
                ...states,
                treatmentRecommendationCode:
                    students[imageData].treatmentRecommendationCode,
            });
        }
        console.log("students end of handleformState:", students);
    };

    const handleImageLink = (link) => {
        setImageLink(link)
        setOpen(!open)
        // console.log(imageLink)
    }


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
                                    <th>District</th>
                                    <th>School</th>
                                    <th>Grade</th>
                                    <th>Code</th>
                                    <th>Gender</th>
                                    <th>Dental Insurance</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, key) => (
                                    <tr
                                        key={key}
                                        onClick={() => {
                                            setImageData(key);
                                      //      setEvalData(key);
                                            handleFormState();
                                        }}
                                        className={
                                            key === imageData
                                                ? "table-row-page-active"
                                                : "table-row-page"
                                        }
                                    >
                                        
                                        <td>{student.district}</td>
                                        <td>{student.school}</td>
                                        <td>{student.grade}</td>
                                        <td>{student.code}</td>
                                        <td>{student.gender}</td>
                                        <td>{student.haveDentalInsurance}</td>
                                        <td>
                                            {new Date(
                                                student.createdAt
                                            ).toLocaleString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>

                                        <td>{student.evalStatus}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {students[imageData] ? (
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className="image-info-container">
                                    <p>
                                        <b
                                            style={{
                                                fontSize: "18px",
                                            }}
                                        >
                                            ID:{" "}
                                        </b>
                                        {students[imageData].code}

                                    </p>
                                    <p>
                                        <b
                                            style={{
                                                fontSize: "18px",
                                            }}
                                        >
                                            School:{" "}
                                        </b>{" "}
                                        {students[imageData].school}
                                    </p>
                                    <p>
                                        <b
                                            style={{
                                                fontSize: "18px",
                                            }}
                                        >
                                            Grade: {" "}
                                        </b>
                                        {students[imageData].grade}
                                    </p>
                                </div>

                                <div
                                    style={{
                                        marginBottom: "20px",
                                        marginTop: "20px",
                                    }}
                                    className="teeth-image-container"
                                >Nonsmiling 
                                    <img
                                        src={students[imageData].nonsmilingface}
                                        onClick={() => handleImageLink(students[imageData].nonsmilingface)}
                                        alt="..."
                                    />Front
                                    <img
                                        src={students[imageData].frontTeeth}
                                        onClick={() => handleImageLink(students[imageData].frontTeeth)}
                                        alt="..."
                                    />Left
                                    <img
                                        src={students[imageData].leftimage}
                                        onClick={() => handleImageLink(students[imageData].leftimage)}
                                        alt="..."
                                    />Right
                                    <img
                                        src={students[imageData].rightimage}
                                        onClick={() => handleImageLink(students[imageData].rightimage)}
                                        alt="..."
                                    />Top
                                    <img
                                        src={students[imageData].topimage}
                                        onClick={() => handleImageLink(students[imageData].topimage)}
                                        alt="..."
                                    />Bottom
                                    <img
                                        src={students[imageData].bottomimage}
                                        onClick={() => handleImageLink(students[imageData].bottomimage)}
                                        alt="..."
                                    />

                                </div>

                                <div className="inputs-container">
                                        {students[imageData].untreatedDecay}
                                        {students[imageData].treatedDecay}
                                    <label>1. Untreated Decay:</label>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <div style={{ marginRight: "10px" }}>
                                            {students[imageData].untreatedDecay}
                                             {students[imageData].treatedDecay}
                                                {students[imageData].untreatedDecay == "true" ? (
                                                    <input
                                                        checked = {true}
                                                        onChange={() => {
                                                            setState({...states,untreatedDecay: true, }
                                                                );
                                                            students[imageData].untreatedDecay="true";
                                                            } }
                                                        
                                                        name="untreated-decay"
                                                        type="radio"
                                                        style={{marginRight: "10px"}}
                                                    />) : (
                                                    <input
                                                        onChange={() => {setState({...states,untreatedDecay: true,});}}
                                                        name="untreated-decay"
                                                        type="radio"
                                                        style={{marginRight: "10px"}}
                                                    />
                                                )}
                                                Yes
                                        </div>
                                        <div style={{ marginRight: "10px" }}>
                                            {students[imageData].untreatedDecay}
                                             {students[imageData].treatedDecay}
                                                {students[imageData].untreatedDecay == "false" ? (
                                                    <input
                                                        checked = {true}
                                                        onChange={() => {setState({...states,untreatedDecay: false, }); 
                                                        students[imageData].untreatedDecay="true"; 
                                                        }}

                                                        name="untreated-decay"
                                                        type="radio"
                                                        style={{marginRight: "10px"}}
                                                    />) : (
                                                    <input
                                                        onChange={() => {setState({...states,untreatedDecay: false,});}}
                                                        name="untreated-decay"
                                                        type="radio"
                                                        style={{marginRight: "10px"}}
                                                    />
                                                )}
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
                                        <div style={{ marginRight: "10px" }}>
                
                                            <input
                                                // defaultChecked={students[imageData].treatedDecay}
                                                onChange={() =>
                                                    setState({
                                                        ...states,
                                                        treatedDecay: true,
                                                    })
                                                }
                                                name="treated-decay"
                                                type="radio"
                                                checked={students[imageData].treatedDecay == "true"}
                                                style={{marginRight: "10px"}}
                                            />
                                            Yes
                                        </div>
                                        <div style={{ marginRight: "10px" }}>
                                            <input
                                                onChange={() =>
                                                    setState({
                                                        ...states,
                                                        treatedDecay: false,
                                                    })
                                                }
                                                name="treated-decay"
                                                type="radio"
                                                checked={students[imageData].treatedDecay == "false" || students[imageData].treatedDecay === null}
                                                style={{marginRight: "10px"}}
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
                                        <div style={{ marginRight: "10px" }}>
                                            <input
                                                onChange={() =>
                                                    setState({
                                                        ...states,
                                                        sealantsPresent: true,
                                                    })
                                                }
                                                name="sealants"
                                                type="radio"
                                                checked={students[imageData].sealantsPresent == "true"}
                                                style={{marginRight: "10px"}}
                                            />
                                            Yes
                                        </div>
                                        <div style={{ marginRight: "10px" }}>
                                            <input
                                                onChange={() =>
                                                    setState({
                                                        ...states,
                                                        sealantsPresent: false,
                                                    })
                                                }
                                                name="sealants"
                                                type="radio"
                                                checked={students[imageData].sealantsPresent == "false" || students[imageData].sealantsPresent === null}
                                                style={{marginRight: "10px"}}
                                            />
                                            No
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label>
                                        4. Treatment Recomendation codes:
                                    </label>

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
                                                checked ={students[imageData].treatmentRecommendationCode == "No obvious problem" ||
                                                    students[imageData].treatmentRecommendationCode ===null}
                                                style={{ marginRight: "10px" }}
                                                onChange={() =>
                                                    setState({
                                                        ...states,
                                                        treatmentRecommendationCode:
                                                            "No obvious problem",
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
                                                    students[imageData].treatmentRecommendationCode == "Evaluate for preventive sealants"
                                                }
                                                onChange={() =>
                                                    setState({
                                                        ...states,
                                                        treatmentRecommendationCode:
                                                            "Evaluate for preventive sealants",
                                                    })
                                                }
                                                style={{ marginRight: "10px" }}
                                            />
                                            Evaluate for preventive sealants
                                        </div>

                                        <div style={{ marginRight: "10px" }}>
                                            <input
                                                name="treatment"
                                                type="radio"
                                                style={{ marginRight: "10px" }}
                                                checked={
                                                    students[imageData]
                                                        .treatmentRecommendationCode ==
                                                    "Evaluate for Restorative care"
                                                }
                                                onChange={() =>
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
                                                style={{ marginRight: "10px" }}
                                                checked={
                                                    students[imageData]
                                                        .treatmentRecommendationCode ==
                                                    "Urgent care needed"
                                                }
                                                onChange={() =>
                                                    setState({
                                                        ...states,
                                                        treatmentRecommendationCode:
                                                            "Urgent care needed",
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
                            <Modal
                                open={open}
                                onClose={handleOpen}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                                style={{display:'flex',alignItems:'center',justifyContent:'center'}}
                            >
                                <div style={{margin: "0 auto", width: "60%", height: "50%"}} className={classes.paper}>
                                    <img height="100%" width="100%" src={imageLink} alt="..."/>
                                </div>
                            </Modal>
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
};
export default EvaluationApp;
