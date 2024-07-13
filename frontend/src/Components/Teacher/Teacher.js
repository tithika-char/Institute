import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button } from 'reactstrap'; 
import './Teacher.css'; 

function Teacher() {
  const location = useLocation();
  const registrationNumber = location.state.id;

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [teachersBySubject, setTeachersBySubject] = useState({});

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/student/subjects`, {
          params: { regno: registrationNumber }
        });

      const { subjects } = response.data;
        setSubjects(subjects);

        const initialSelectedSubjects = {};
        subjects.forEach(subject => {
          initialSelectedSubjects[subject] = ''; // Initialize each subject with an empty teacher selection
        });
        setSelectedSubjects(initialSelectedSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [registrationNumber]);

  const fetchTeachersForSubject = async (subject) => {
    try {
      const response = await axios.get(`http://localhost:3001/student/teachers/${subject}`);
      const { teachers } = response.data;
      setTeachersBySubject(prevState => ({
        ...prevState,
        [subject]: teachers
      }));
    } catch (error) {
      console.error(`Error fetching teachers for ${subject}:`, error);
      setTeachersBySubject(prevState => ({
        ...prevState,
        [subject]: []
      }));
    }
  };

  const handleSubjectChange = (subject) => {
    if (!teachersBySubject[subject]) {
      fetchTeachersForSubject(subject);
    }
  };

  const handleTeacherSelect = (event, subject) => {
    const selectedTeacherId = event.target.value;
    setSelectedSubjects(prevState => ({
      ...prevState,
      [subject]: selectedTeacherId
    }));

    // const selectedTeacher = teachersBySubject[subject]?.find(teacher => teacher.tid === selectedTeacherId);
    // if (selectedTeacher) {
    //   // const { tid, tname, scode } = selectedTeacher;
      // console.log(`Registration Number: ${registrationNumber}, Subject Name: ${subject}, Teacher ID: ${tid}, Teacher Name: ${tname}, Subject Code: ${scode}`);
    // }
  };

  const handleUpdateData = async () => {
    try {
      for (const [subject, teacherId] of Object.entries(selectedSubjects)) {
        const selectedTeacher = teachersBySubject[subject]?.find(teacher => teacher.tid === teacherId);
        if (selectedTeacher) {
          const { tid, scode } = selectedTeacher;
  
          // Construct data object with regno, scode, and tid
          const data = {
            regno: registrationNumber,
            scode: scode, // Use the specific scode associated with the subject
            tid: tid
          };
  
          // Send POST request to backend API
          const response = await axios.post('http://localhost:3001/student/saveCourses', data);
          console.log('Response from backend:', response.data);
        }
      }
    } catch (error) {
      console.error('Error updating course details:', error);
    }
  };
  
  

  return (
    <div className="teacher-container">
      <h1 className="page-title">Teacher Allocation Page</h1>
      <p className="registration-number"><strong>Registration Number:</strong> {registrationNumber}</p>
      <div className="subject-cards">
        {subjects.map(subject => (
          <div key={subject} className="subject-card">
            <Card>
              <CardBody>
                <CardTitle tag="h5">{subject}</CardTitle>
                <Form>
                  <FormGroup>
                    <Label for={`${subject}-teacher-select`}>Select Teacher:</Label>
                    <Input
                      type="select"
                      name={`${subject}-teacher-select`}
                      id={`${subject}-teacher-select`}
                      value={selectedSubjects[subject]}
                      onChange={(event) => handleTeacherSelect(event, subject)}
                      onClick={() => handleSubjectChange(subject)}
                    >
                      <option value="">Select Teacher</option>
                      {teachersBySubject[subject] && (
                        teachersBySubject[subject].map((teacher) => (
                          <option key={teacher.tid} value={teacher.tid}>
                            {teacher.tname}
                          </option>
                        ))
                      )}
                    </Input>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
      <Button color="primary" onClick={handleUpdateData}>Update Data</Button>
    </div>
  );
}

export default Teacher;
