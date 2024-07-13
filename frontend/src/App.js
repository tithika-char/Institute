import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Student from './Components/Student';
import Teacher from './Components/Teacher/Teacher';
import StudentLogin from './Components/Login/StudentLogin';
import StudentDashboard from './Components/StudentDashboard/StudentDashboard';

import { useLocation } from 'react-router-dom'; // Import useLocation hook
import EditProfile from './Components/EditProfile/EditProfile';
import Attendance from './Components/Attendance/Attendance';
import TeacherDashboard from './Components/Teacherpanel/TeacherDashboard';

import TeacherReg from './Components/TeacherReg/TeacherReg';
import TAssignment from './Components/Teacherpanel/TAssignment';
import HomeWork from './Components/StudentDashboard/HomeWork';
import Ttest from './Components/Teacherpanel/Ttest';
import Stest from './Components/StudentDashboard/Stest';
import Displayquestion from './Components/StudentDashboard/Displayquestion';


import Performance from './Components/StudentDashboard/Performance';
import TAttendance from './Components/Teacherpanel/TAttendance';

function App() {
  
  const location = useLocation();



  return (
    <div className="App">
    
      <div className="container-fluid" id="main">
        <Routes>
          {/* <Route path="/" element={<Student />} /> */}
          <Route path="/teacherreg" element={<TeacherReg/>} />

          <Route path="/teacher" element={<Teacher />} />
          <Route path="/" element={<StudentLogin />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/home" element={<StudentDashboard />} />
          
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/homework" element={<HomeWork />} />
          <Route path="/test" element={<Stest />} />
          <Route path="/displayquestion/:date1" element={<Displayquestion />} />
       

          <Route path="/performance" element={<Performance />} />
          {/* Teacher Panel */}


          <Route path="/teacherdashboard" element={<TeacherDashboard/>} />
          <Route path="/tassignment" element={<TAssignment/>} />
          <Route path="/teacher/test" element={<Ttest/>} />
          <Route path="/teacher/attendance" element={<TAttendance/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
