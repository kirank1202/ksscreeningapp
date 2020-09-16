import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listStudents } from './graphql/queries';
import { createStudent as createStudentMutation, deleteStudent as deleteStudentMutation } from './graphql/mutations';

const initialFormState = { code: '', name: '', gender: '', district: '', school: '', grade: ''}


function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchAllStudents();
  }, []);

  async function fetchAllStudents() {
    const apiData = await API.graphql({ query: listStudents });
    setStudents(apiData.data.listStudents.items);
  }

  async function createStudent() {
    if (!formData.code|| !formData.name) return;
    await API.graphql({ query: createStudentMutation, variables: { input: formData } });
    setStudents([ ...students, formData ]);
    setFormData(initialFormState);
  }

  async function deleteStudent( {id}) {
    const newStudentArray = students.filter(student => student.id !== id);
    setStudents(newStudentArray);
    await API.graphql({ query: deleteStudentMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>KS Screening App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'code': e.target.value})}
        placeholder="Student Code"
        value={formData.code}
      />
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Student Name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'gender': e.target.value})}
        placeholder="Student Gender"
        value={formData.gender}
      />
      <input
        onChange={e => setFormData({ ...formData, 'district': e.target.value})}
        placeholder="School District"
        value={formData.district}
      />
      <input
        onChange={e => setFormData({ ...formData, 'school': e.target.value})}
        placeholder="Student School"
        value={formData.school}
      />
      <input
        onChange={e => setFormData({ ...formData, 'grade': e.target.value})}
        placeholder="Student Grade"
        value={formData.grade}
      />
      <button onClick={createStudent}>Create student</button>

      <div style={{marginBottom: 30}}>
        {
          students.map(student => (
            <div key={student.id || student.code}>
               <h5>................................................................................................................</h5>
              <h5>{student.code} {student.name} {student.gender} {student.district} {student.school} {student.grade}
              <button onClick={() => deleteStudent(student)}>Delete Student</button> </h5>
            </div>
          ))
        }
      </div>

      
      <AmplifySignOut />

    </div>
  );
}

export default withAuthenticator(App);
