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

import EvaluationApp from "./EvaluationApp";

import './App.css';
import { API, Storage, Auth } from 'aws-amplify';

import { createStudent as createStudentMutation, deleteStudent as deleteStudentMutation } from './graphql/mutations';

const initialFormState = { code: '', name: '', gender: '', district: '', school: '', grade: '', leftimage: '', rightimage: ''}

const resetStudentState = {code:'', gender:'', leftimageselection:'', rightimageselection:''}

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
      if (!e.target.files[0]) return
      const file = e.target.files[0];
      setFormData({ ...formData, leftimage: generateImageFileName(file.name)});
      await Storage.put(generateImageFileName(file.name), file);
      alert('left image changed');
    
      } 
  async function onChangerightimage(e) {
    alert('right image changed');
        if (!e.target.files[0]) return
        const file = e.target.files[0];
        setFormData({ ...formData, rightimage: generateImageFileName(file.name)});
        await Storage.put(generateImageFileName(file.name), file);
    
        } 
  async function onChangetopimage(e) {
          if (!e.target.files[0]) return
          const file = e.target.files[0];
          setFormData({ ...formData, topimage: generateImageFileName(file.name)});
          await Storage.put(generateImageFileName(file.name), file);
  
          } 
  async function onChangebottomimage(e) {
            if (!e.target.files[0]) return
            const file = e.target.files[0];
            setFormData({ ...formData, bottomimage: generateImageFileName(file.name)});
            await Storage.put(generateImageFileName(file.name), file);
        
            } 
              
    async function createStudent() {
      if (!formData.code|| !formData.gender) return;
      await API.graphql({ query: createStudentMutation, variables: { input: formData } });
      if (formData.leftimage) {
        const image = await Storage.get(formData.leftimage);
        formData.leftimage = image; 
      }
    
      setFormData(resetStudentState);
      alert(`Student ${formData.code} Uploaded Successfully`);
    
    }
  
  return (

    <div className="CollectionApp">
      <h2>Screening Data Collection App</h2>

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
      /> only required if you would like your student’s screening results </h5> 

      <h5>SCHOOL DISTRICT: 
      <input
        onChange={e => setFormData({ ...formData, 'district': e.target.value})}
        placeholder="School District"
        value={formData.district}
      /> </h5>

    <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">School District</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formData.school}
          onChange={e => setFormData({ ...formData, 'grade': e.target.value})}
        >
          <MenuItem value={`Blue Valley High`}>Blue Valley High</MenuItem>
          <MenuItem value={`Blue Valley North`}>Blue Valley North</MenuItem>
          <MenuItem value={`Blue Valley West`}>Blue Valley West</MenuItem>
          <MenuItem value={`Blue Valley Northwest`}>Blue Valley Northwest</MenuItem>
          <MenuItem value={`Blue Valley Southwest`}>Blue Valley Southwest</MenuItem>
          <MenuItem value={`Olathe`}>Olathe</MenuItem>
          <MenuItem value={`Shawnee`}>Shawnee</MenuItem>
        </Select>
      </FormControl>


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

    </div>
  );
}
export default CollectionApp;
