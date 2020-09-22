import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut, AmplifyAuthFields } from '@aws-amplify/ui-react';
import { listStudents } from './graphql/queries';
import { createStudent as createStudentMutation, deleteStudent as deleteStudentMutation } from './graphql/mutations';

const initialFormState = { code: '', name: '', gender: '', district: '', school: '', grade: '', leftimage: '', rightimage: ''}

const resetStudentState = {code:'', gender:'', leftimageselection:'', rightimageselection:''}

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
   /*fetchAllStudents(); */
  }, []);


/* Store leftimage if a file is selected */
async function onChangeleftimage(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, leftimage: file.name });
    await Storage.put(file.name, file);
    fetchAllStudents();
    } 
async function onChangerightimage(e) {
      if (!e.target.files[0]) return
      const file = e.target.files[0];
      setFormData({ ...formData, rightimage: file.name });
      await Storage.put(file.name, file);
      fetchAllStudents();
      } 
async function onChangetopimage(e) {
        if (!e.target.files[0]) return
        const file = e.target.files[0];
        setFormData({ ...formData, topimage: file.name });
        await Storage.put(file.name, file);
        fetchAllStudents(); 
        } 
async function onChangebottomimage(e) {
          if (!e.target.files[0]) return
          const file = e.target.files[0];
          setFormData({ ...formData, bottomimage: file.name });
          await Storage.put(file.name, file);
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
        const image = await Storage.get(student.leftimage);
        student.leftimage = image;
      }
      if (student.topimage) {
        const image = await Storage.get(student.leftimage);
        student.leftimage = image;
      }
      if (student.bottomimage) {
        const image = await Storage.get(student.leftimage);
        student.leftimage = image;
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
  }

  async function deleteStudent( {id}) {
    const newStudentArray = students.filter(student => student.id !== id);
    setStudents(newStudentArray);
    await API.graphql({ query: deleteStudentMutation, variables: { input: { id } }});

  }

  return (
    <div className="App">
      <h1>Kansas Dental Screening App</h1>
 
      DATA COLLECTOR'S NAME: <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Nurse Name"
        value={formData.name}
      />
      <p></p>STUDENT SCHOOL DISTRICT: 
      <input
        onChange={e => setFormData({ ...formData, 'district': e.target.value})}
        placeholder="School District"
        value={formData.district}
      />
      <p></p>STUDENT'S SCHOOL:
      <input
        onChange={e => setFormData({ ...formData, 'school': e.target.value})}
        placeholder="Student School"
        value={formData.school}
      />
      <p></p>STUDENT GRADE: 
      <input
        onChange={e => setFormData({ ...formData, 'grade': e.target.value})}
        placeholder="Student Grade"
        value={formData.grade}
      />
      <h4>..........................................................  </h4>
      <p></p>STUDENT CODE: 
      <input
        onChange={e => setFormData({ ...formData, 'code': e.target.value})}
        placeholder="Student Code"
        value={formData.code}
      />
      <p></p>STUDENT GENDER: 
      <input
        onChange={e => setFormData({ ...formData, 'gender': e.target.value})}
        placeholder="Student Gender"
        value={formData.gender}
      />
       <h4>Upload Indicated Pictures: </h4>
       <h4> Upload left Image: 
       <input type="file" name='leftimageselection' onChange={onChangeleftimage} /> </h4>
       <h4> Upload Right Image: 
       <input type="file" name= 'rightimageselection' onChange={onChangerightimage} /> </h4>
       <h4> Upload Top Image: 
       <input type="file" onChange={onChangetopimage} /> </h4>
       <h4> Upload Bottom Image: 
       <input type="file" onChange={onChangebottomimage} /> </h4>

      <h4>
      <button onClick={createStudent}>Submit Student</button> 
      </h4>

      <div style={{marginBottom: 30}}>
        {
          
          students.map(student => (
            <div key={student.id || student.code}>
               <h5>................................................................................................................</h5>
              <h5>{student.code} {student.gender} {student.grade}
              <button onClick={() => deleteStudent(student)}>Delete Student</button> </h5>
            </div>
            
              /*          
              {
                student.leftimage && <img src={student.leftimage} style={{width: 400}} />
              }             
              */
          ))
          
        }
      </div>

      
      <AmplifySignOut />

    </div>
  );
}
export default withAuthenticator(App);
