import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdb-react-ui-kit';

function Teacher() {
  const [teacherID, setTeacherID] = useState('');
  const [formData, setFormData] = useState({
    tid: '',
    candidateName: '',
    contactNumber: '',
    email: '',
    education: '',
    gender: ''
  });
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isDataSaved, setIsDataSaved] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch subjects from the backend
    axios.get('http://localhost:3001/subject/getSubject')
      .then(response => {
        setSubjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
      });

    // Fetch teacher ID from backend when the component mounts
    axios.get('http://localhost:3001/teacher/teacherreg')
      .then(response => {
        setTeacherID(response.data.tid);
      })
      .catch(error => {
        console.error('Error fetching teacher ID:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectCheckboxChange = (subject) => {
    const index = selectedSubjects.findIndex(item => item.scode === subject.scode);
    if (index === -1) {
      setSelectedSubjects([...selectedSubjects, subject]);
    } else {
      const updatedSubjects = [...selectedSubjects];
      updatedSubjects.splice(index, 1);
      setSelectedSubjects(updatedSubjects);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault(); // Prevent form submission
    const newTeacher = {
      tid: teacherID,
      candidateName: formData.candidateName,
      contactNumber: formData.contactNumber,
      email: formData.email,
      education: formData.education,
      subjects: selectedSubjects.map(subject => subject.sname),
      gender: formData.gender
    };

    console.log('New Teacher:', newTeacher);

    try {
      await axios.post('http://localhost:3001/teacher/save1', newTeacher);
      console.log('Data saved successfully');

      // Reset form fields after successful submission
      setFormData({
        tid: '',
        candidateName: '',
        contactNumber: '',
        email: '',
        education: '',
        subjects: [],
        gender: ''
      });
      setSelectedSubjects([]);
      setIsDataSaved(true); // Set the flag to true indicating data is saved

    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div>
      <MDBContainer fluid className='bg-dark'>
        <MDBRow className='d-flex justify-content-center align-items-center h-100'>
          <MDBCol>
            <MDBCard className='my-4'>
              <MDBRow className='g-0'>
                <MDBCol md='6' className="d-none d-md-block">
                  <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp' alt="Sample photo" className="rounded-start" fluid />
                </MDBCol>

                <MDBCol md='6'>
                  <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
                 

                    <MDBRow>
                      <MDBCol md='6'>
                        <MDBInput wrapperClass='mb-4' label='Teacher ID' size='lg' name='tid' id='form4' type='text' value={teacherID} readOnly />
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol md='12'>
                        <MDBInput wrapperClass='mb-4' label='Candidate Name' size='lg' id='form1' type='text' name='candidateName' value={formData.candidateName} onChange={handleInputChange} />
                      </MDBCol>
                    </MDBRow>

                    

                    <div className='d-md-flex justify-content-start align-items-center mb-4'>
                      <h6 className="fw-bold mb-0 me-4">Gender: </h6>
                      <MDBRadio name='gender' id='inlineRadio1' value='Female' label='Female' inline onChange={handleInputChange} />
                      <MDBRadio name='gender' id='inlineRadio2' value='Male' label='Male' inline onChange={handleInputChange} />
                      <MDBRadio name='gender' id='inlineRadio3' value='Other' label='Other' inline onChange={handleInputChange} />
                    </div>

                    <MDBInput wrapperClass='mb-4' label='Contact Number' size='lg' id='form6' type='text' name='contactNumber' value={formData.contactNumber} onChange={handleInputChange} />
                    <MDBInput wrapperClass='mb-4' label='Mail ID' size='lg' id='form7' type='text' name='email' value={formData.email} onChange={handleInputChange} />
                    <MDBInput wrapperClass='mb-4' label='Educational Qualification' size='lg' id='form8' type='text' name='education' value={formData.education} onChange={handleInputChange} />

                    <div className='mb-4'>
                      <label className='form-label'> Subject Taught:</label>
                      <MDBDropdown>
                        <MDBDropdownToggle className='w-100'>
                          Choose Subjects
                        </MDBDropdownToggle>
                        <MDBDropdownMenu style={{ width: '100%', maxWidth: 'none' }}>
                          {subjects.map(subject => (
                            <MDBDropdownItem key={subject.scode}>
                              <div className='form-check'>
                                <input
                                  className='form-check-input'
                                  type='checkbox'
                                  id={subject.scode}
                                  value={subject.sname}
                                  checked={selectedSubjects.some(selected => selected.scode === subject.scode)}
                                  onChange={() => handleSubjectCheckboxChange(subject)}
                                />
                                <label className='form-check-label ms-2' htmlFor={subject.scode}>{subject.sname}</label>
                              </div>
                            </MDBDropdownItem>
                          ))}
                        </MDBDropdownMenu>
                      </MDBDropdown>
                    </div>

                    <div className="d-flex justify-content-end pt-3">
                      <MDBBtn color='light' size='lg' onClick={() => setFormData({ tid: '', candidateName: '', contactNumber: '', email: '', education: '', subjects: [], gender: '' })}>Reset all</MDBBtn>
                      <MDBBtn className='ms-2' color='warning' size='lg' onClick={handleRegistration}>SAVE DATA</MDBBtn>
                    </div>
                    {isDataSaved && (
                      <div className="text-center mt-4">
                        <p>Data saved successfully!</p>
                        <MDBBtn className='ms-2' color='success' size='lg' onClick={() => navigate('/dashboard')}>Go to Dashboard</MDBBtn>
                      </div>
                    )}
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Teacher;
