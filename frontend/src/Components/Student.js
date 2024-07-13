import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from 'axios'; // Import Axios for making HTTP requests
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

function Student() {

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [formData, setFormData] = useState({
    regno: '',
    doAdmission: new Date().toISOString().slice(0, 10), // Today's date in ISO format (YYYY-MM-DD)
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    dob: '',
    subjects:[],//store an array of selected subjects
    gender: '' 
  });
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isDataSaved, setIsDataSaved] = useState(false); // State to track if data is saved successfully

const navigate = useNavigate()


  useEffect(() => {

// Fetch subjects from the backend
axios.get('http://localhost:3001/subject/getSubject')
.then(response => {
  setSubjects(response.data);
})
.catch(error => {
  console.error('Error fetching subjects:', error);
});




    // Fetch registration number from backend when the component mounts
    axios.get('http://localhost:3001/student')
      .then(response => {
        setRegistrationNumber(response.data.regno);
      })
      .catch(error => {
        console.error('Error fetching registration number:', error);
      });
  }, []); // Empty dependency array ensures this effect runs only once after initial render



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
       const newStudent = {
        regno: registrationNumber,
        doAdmission: formData.doAdmission,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        email: formData.email,
        dob: formData.dob,
       subjects: selectedSubjects.map(subject => subject.sname),
        gender: formData.gender // Include gender in the new student object
      };
  
      console.log('New Student:', newStudent);

      try {
        await axios.post('http://localhost:3001/student/save', newStudent);
        console.log('Data saved successfully');

        // Reset form fields after successful submission
   
      // setRegistrationNumber(registrationNumber + 1); NEED TO WORK ON IT : IT AFTER TEACHER SELECTION, IT WILL GET INCREAMENTED LETTER,
      setFormData({
        regno: '',
        doAdmission: new Date().toISOString().slice(0, 10),
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        dob: '',
        subjects:[],
        gender: '' // Reset gender field after submission
      });
      setSelectedSubjects([]);
      setIsDataSaved(true); // Set the flag to true indicating data is saved

    } catch (error) {
      console.error('Error saving data:', error);
  }

    
  };

  function goToTeacherAllocation(){
    navigate(`/teacher?regno=${registrationNumber}`,{state : {id : registrationNumber}})
  }
  
  


 

  

  return (

    <div>
   
      
    <MDBContainer fluid className='bg-dark'>

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol>

          <MDBCard className='my-4'>

            <MDBRow className='g-0'>

              <MDBCol md='4' className="d-none d-md-block">
                <MDBCardImage src='https://www.pngfind.com/pngs/m/12-123592_school-students-images-png-transparent-png.png' alt="Sample photo" className="rounded-start" fluid  style={{ height: '500px', width:'800px' }}/>
              </MDBCol>

              <MDBCol md='8'>

                <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
              

                  <MDBRow>
                    <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Registration Number' size='lg' name='regno' id='form4' type='text' value={registrationNumber} readOnly/>
                    </MDBCol>
                    <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Date of Admission' size='lg' id='form3' type='date' name='doAdmission' value={formData.doAdmission} onChange={handleInputChange}/>
                    </MDBCol>
                  </MDBRow>

                  
                  <MDBRow>
                    <MDBCol md='6'>
                      <MDBInput wrapperClass='mb-4' label='First Name' size='lg' id='form1' type='text' name='firstName' value={formData.firstName} onChange={handleInputChange}/>
                    </MDBCol>
                    <MDBCol md='6'>
                      <MDBInput wrapperClass='mb-4' label='Last Name' size='lg' id='form2' type='text' name='lastName' value={formData.lastName} onChange={handleInputChange}/>
                    </MDBCol>
                  </MDBRow>

                  <MDBInput wrapperClass='mb-4' label='Birthday' size='lg' id='form3' type='date' name='dob' value={formData.dob} onChange={handleInputChange}/>

                  <div className='d-md-flex ustify-content-start align-items-center mb-4'>
                    <h6 className="fw-bold mb-0 me-4">Gender: </h6>
                    <MDBRadio name='gender' id='inlineRadio1' value='Female' label='Female' inline onChange={handleInputChange} />
                    <MDBRadio name='gender' id='inlineRadio2' value='Male' label='Male' inline onChange={handleInputChange} />
                    <MDBRadio name='gender' id='inlineRadio3' value='Other' label='Other' inline onChange={handleInputChange} />
                  </div>

                  <MDBInput wrapperClass='mb-4' label='Contact Number' size='lg' id='form6' type='text' name='contactNumber' value={formData.contactNumber} onChange={handleInputChange}/>
                  <MDBInput wrapperClass='mb-4' label='Mail ID' size='lg' id='form7' type='text' name='email' value={formData.email} onChange={handleInputChange}/>
           


           
                  <div className='mb-4'>
                    <label className='form-label'>Select Subjects:</label>
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
                    <MDBBtn color='light' size='lg'>Reset all</MDBBtn>
                    <MDBBtn className='ms-2' color='warning' size='lg' onClick={handleRegistration}>SAVE DATA</MDBBtn>
                  </div>
                  {isDataSaved && (
                    <div className="text-center mt-4">
                      <p>Data saved successfully!</p>
                      <MDBBtn className='ms-2' color='success' size='lg' onClick={goToTeacherAllocation}>Go to Teacher Allocation Page</MDBBtn>
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

export default Student;
