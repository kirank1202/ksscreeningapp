import React, { useState, useEffect } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import NativeSelect from '@material-ui/core/NativeSelect';

import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut, AmplifyAuthFields } from '@aws-amplify/ui-react';
import { listStudents } from './graphql/queries';
import { createStudent as createStudentMutation, deleteStudent as deleteStudentMutation } from './graphql/mutations';

/*
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export function SingleRowSelectionGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} />
    </div>
  );
}
*/ 
const initialFormState = { code: '', name: '', gender: '', district: '', school: '', grade: '', leftimage: '', rightimage: ''}

const resetStudentState = {code:'', gender:'', leftimageselection:'', rightimageselection:''}

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
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
  alert('left image changed ${e.target.files[0].name} now');
    if (!e.target.files[0]) return
    alert('left image changed-after empty file check');
    const file = e.target.files[0];
    setFormData({ ...formData, leftimage: generateImageFileName(file.name)});
    await Storage.put(generateImageFileName(file.name), file);
    alert('left image changed');
    fetchAllStudents();
    } 
async function onChangerightimage(e) {
  alert('right image changed');
      if (!e.target.files[0]) return
      const file = e.target.files[0];
      setFormData({ ...formData, rightimage: generateImageFileName(file.name)});
      await Storage.put(generateImageFileName(file.name), file);
      
      fetchAllStudents();
      } 
async function onChangetopimage(e) {
        if (!e.target.files[0]) return
        const file = e.target.files[0];
        setFormData({ ...formData, topimage: generateImageFileName(file.name)});
        await Storage.put(generateImageFileName(file.name), file);
        fetchAllStudents(); 
        } 
async function onChangebottomimage(e) {
          if (!e.target.files[0]) return
          const file = e.target.files[0];
          setFormData({ ...formData, bottomimage: generateImageFileName(file.name)});
          await Storage.put(generateImageFileName(file.name), file);
          fetchAllStudents();
          } 
            


/* retrieve all students from DynamoDB using graphql API interace */
  async function fetchAllStudents() {
    const apiData = await API.graphql({ query: listStudents });
    const studentsFromAPI = apiData.data.listStudents.items;
    await Promise.all(studentsFromAPI.map(async student => {
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
      return student;
    }))
    setStudents(apiData.data.listStudents.items);
  }


  async function createStudent() {
    if (!formData.code|| !formData.gender) return;
    await API.graphql({ query: createStudentMutation, variables: { input: formData } });
    if (formData.leftimage) {
      const image = await Storage.get(formData.leftimage);
      formData.leftimage = image; 
    }
    setStudents([ ...students, formData ]);
    setFormData(resetStudentState);
    alert(`Student ${formData.code} Uploaded Successfully`);
    fetchAllStudents();
  }

  async function deleteStudent( {id}) {
    const student = students.find(student => student.id === id);
    const newStudentArray = students.filter(student => student.id !== id);
    setStudents(newStudentArray);
    await API.graphql({ query: deleteStudentMutation, variables: { input: { id } }});
    await Storage.remove(student.leftimage);
    await Storage.remove(student.rightimage);
    await Storage.remove(student.topimage);
    await Storage.remove(student.bottomimage);
    setFormData(initialFormState);
    

  }

  return (
    <div className="App">
      <h2>Screening App</h2>
 
      <FormControl component="fieldset">
       <FormLabel component="legend">Data Collection Location</FormLabel>
       <RadioGroup aria-label="location" name="location" value={formData.location} onChange={e => setFormData({ ...formData, 'location': e.target.value})}>
       <FormControlLabel value="Home" control={<Radio />} label="Home" />
       <FormControlLabel value="School" control={<Radio />} label="School" />
      <FormControlLabel value="other" control={<Radio />} label="Other" />
     </RadioGroup>
    </FormControl>

      <h5>DATA COLLECTOR: <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Data Collector Name"
        value={formData.name}
      /> </h5> 
      <h5>SCHOOL DISTRICT: 
      <input
        onChange={e => setFormData({ ...formData, 'district': e.target.value})}
        placeholder="School District"
        value={formData.district}
      /> </h5>
      <h5>SCHOOL:
      <input
        onChange={e => setFormData({ ...formData, 'school': e.target.value})}
        placeholder="Student School"
        value={formData.school}
      /> </h5>
      <h5> GRADE: 
      <input
        onChange={e => setFormData({ ...formData, 'grade': e.target.value})}
        placeholder="Student Grade"
        value={formData.grade}
      /> </h5>

<FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Grade</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formData.grade}
          onChange={e => setFormData({ ...formData, 'grade': e.target.value})}
        >
          <MenuItem value={9}>Nine</MenuItem>
          <MenuItem value={10}>Tenth</MenuItem>
          <MenuItem value={11}>Eleven</MenuItem>
        </Select>
      </FormControl>

      <h5> STUDENT CODE: 
      <input
        onChange={e => setFormData({ ...formData, 'code': e.target.value})}
        placeholder="Student Code"
        value={formData.code}
      /> </h5>
     <h5> GENDER: 
      <input
        onChange={e => setFormData({ ...formData, 'gender': e.target.value})}
        placeholder="Student Gender"
        value={formData.gender}
      /> </h5>


    <FormControl className={classes.formControl}>
        <InputLabel htmlFor="gender">Gender</InputLabel>
        <Select native
          value={formData.gender}
          onChange={e => setFormData({ ...formData, 'gender': e.target.value})}
          inputProps={{ name: 'gender',id: 'gender', }}
        >
          <option aria-label="None" value="" />
          <option value={'Male'}>Male</option>
          <option value={'Female'}>Female</option>
          <option value={'Other'}>Other</option>
        </Select>
    </FormControl>



       <h4>Upload Indicated Pictures: </h4>
       <h5> Image 1: 
       <input type="file" name='leftimageselection' onChange={onChangeleftimage} /> </h5>
       <h5> Image 2: 
       <input type="file" name= 'rightimageselection' onChange={onChangerightimage} /> </h5>
       <h5> Image 3: 
       <input type="file" onChange={onChangetopimage} /> </h5>
       <h5> Image 4: 
       <input type="file" onChange={onChangebottomimage} /> </h5>

      <h4>
      <button onClick={createStudent}>Submit Student</button> 
      </h4>

      <h4>
      <button onClick={fetchAllStudents}>Fetch All Students</button> 
      </h4>
      
      <div style={{marginBottom: 30}}>
        {
          
          students.map(student => (
            <div key={student.id || student.code}>
               <h5>................................................................................................................</h5>
              <h5>{student.code} {student.gender} {student.grade}
          {student.leftimage && <img src={student.leftimage} style={{width: 100, height:100}} /> }
          {student.rightimage && <img src={student.rightimage} style={{width: 100, height:100}} /> }
          {student.topimage && <img src={student.topimage} style={{width: 100, height:100}} /> }
          {student.bottomimage && <img src={student.bottomimage} style={{width: 100, height:100}} />}
          
          <button onClick={() => deleteStudent(student)}>Delete Student</button> </h5>
            </div>
            
              /*       
            
              */
          ))
          
        }
      </div>

      
    <AmplifySignOut />
    </div>
  );
}
export default withAuthenticator(App);
