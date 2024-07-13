import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBRow, MDBCol} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Student from '../Student'
import TeacherReg from '../TeacherReg/TeacherReg'




function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isStudent, setIsStudent] = useState(true); // Track if user is a student or teacher

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  const toggleRole = () => {
    setIsStudent(!isStudent);
  };

  return (
    <div style={{ backgroundImage: `url('https://wallpapercave.com/wp/wp9764101.jpg')`, backgroundSize: 'cover', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <MDBContainer fluid>
      <MDBRow className='d-flex justify-content-center align-items-center'>
        <MDBCol md='6'>
          <MDBCard className='shadow'>
          <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
          <h2 className="mb-5 text-uppercase fw-bold text-center"><u>
                {isRegistering ? (isStudent ? 'Student Registration form' : 'Teacher Registration form') : (isStudent ? 'Student Login' : 'Teacher Login')}
                </u>  </h2>
              {isRegistering ? (isStudent ? <Student /> : <TeacherReg />) : (isStudent ? <StudentLogin/> : <TeacherLogin/>)}
              <div className='text-center mt-3'>
                <MDBBtn color='secondary' onClick={toggleForm}>
                  {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
                </MDBBtn>
              </div>
              <div className='text-center mt-3'>
                <MDBBtn color='secondary' onClick={toggleRole}>
                  {isStudent ? 'Switch to Teacher' : 'Switch to Student'}
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </div>
  );
}


const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [regno, setRegno] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/student/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, regno }),
      });

      const data = await response.json();
console.log("data:",data);
      if (response.ok) {
        // Login successful, navigate to dashboard
        navigate('/home', { state: { student: data.student } });
        // Store student data in local storage
        localStorage.setItem('student', JSON.stringify(data.student));
        localStorage.setItem('regno', regno);
        const { scode } = response.data;
            localStorage.setItem('scode', scode);
        console.log(localStorage.getItem('student'));

      } else {
        // Login failed, display error message
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Internal server error');
    }
  };

  return (
    <div className="background-image" style={{ backgroundImage: `url('https://wallpapercave.com/wp/wp9764101.jpg')`, backgroundSize: 'cover',height:'400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <MDBContainer fluid className='d-flex align-items-center justify-content-center'>
        <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
          <MDBCardBody className='px-5'>
           
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass='mb-4'
                label='Your Email'
                size='lg'
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Registration Number'
                size='lg'
                id='registrationNumber'
                type='text'
                value={regno}
                onChange={(e) => setRegno(e.target.value)}
              />
              <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' type='submit'>Login</MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

const TeacherLogin = () => {
  const [tid, setTid] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/teacher/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tid }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('teacher', JSON.stringify(data.teacher));
        localStorage.setItem('tid', data.teacher.tid);
        localStorage.setItem('scode', data.teacher.scode);
        navigate('/teacherdashboard');

      } else {
        // Login failed, display error message
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Internal server error');
    }
  };

  return (<div className="background-image" style={{ backgroundImage: `url('https://wallpapercave.com/wp/wp9764101.jpg')`, backgroundSize: 'cover',height:'400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    
      <MDBContainer fluid className='d-flex align-items-center justify-content-center'>
        <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
          <MDBCardBody className='px-5'>
        
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass='mb-4'
                label='Teacher ID'
                size='lg'
                id='teacherId'
                type='text'
                value={tid}
                onChange={(e) => setTid(e.target.value)}
              />
              <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' type='submit'>Login</MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}



export default Login;
