import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { listStudents } from './graphql/queries';
import { createStudent as createStudentMutation, deleteStudent as deleteStudentMutation } from './graphql/mutations';


const EvaluationApp = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
   /*fetchAllStudents(); */
  }, []);

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


 
  async function deleteStudent( {id}) {
    const student = students.find(student => student.id === id);
    const newStudentArray = students.filter(student => student.id !== id);
    setStudents(newStudentArray);
    await API.graphql({ query: deleteStudentMutation, variables: { input: { id } }});
    await Storage.remove(student.leftimage);
    await Storage.remove(student.rightimage);
    await Storage.remove(student.topimage);
    await Storage.remove(student.bottomimage);
   
    

  }

  return (
/*   if  user.group = "datacollector"
    {

    } */
   

    <div className="App">
      <h2>Screening Evaluation App</h2>


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
          
               
             </h5> 
            </div>
            
              /*       
               <button onClick={() => deleteStudent(student)}>Delete Student</button>
              */
          ))
          
        }

      </div>

      

    </div>
  );
}
export default EvaluationApp;
