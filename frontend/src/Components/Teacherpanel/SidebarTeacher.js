import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const SidebarTeacher = () => {
  // State to store the teacher's name
  const [teacherName, setTeacherName] = useState('');

  // Fetch the teacher's name from local storage when the component mounts
  useEffect(() => {
    // Retrieve teacher data from local storage
    const storedTeacherData = JSON.parse(localStorage.getItem('teacher'));
    if (storedTeacherData) {
      // Extract first name and last name from teacher data
      const { tname } = storedTeacherData;
      // Set teacher name to be displayed in the sidebar
      setTeacherName(`${tname}`);
    }
  }, []);

  return (
    <div className="col-md-3 col-lg-2 sidebar-offcanvas pl-0" id="sidebar" role="navigation" style={{ backgroundColor: "#e9ecef", height: "100vh" }}>
      <ul className="nav flex-column sticky-top pl-0 pt-5 p-3 mt-3">
        {/* Teacher Name */}
        <li className="nav-item mb-2 mt-3">
          <a className="nav-link text-secondary" href="#">
            <h5>{teacherName}</h5>
          </a>
        </li>

        {/* Home */}
        <li className="nav-item mb-2">
          <NavLink className="nav-link text-secondary" activeclassname="active" to="/teacherdashboard">
            <i className="fas fa-home font-weight-bold"></i>
            <span className="ml-3">Home</span>
          </NavLink>
        </li>

        {/* Profile */}
        <li className="nav-item mb-2">
          <NavLink className="nav-link text-secondary" activeclassname="active" to="/teacher/profile">
            <i className="fas fa-user font-weight-bold"></i>
            <span className="ml-3">Profile</span>
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            className="nav-link text-secondary"
            activeclassname="active"
            to="/teacher/attendance"
          >
            <i className="fas fa-calendar-check font-weight-bold"></i>
            <span className="ml-3">Attendance</span>
          </NavLink>
        </li>

        {/* Assignments */}
        <li className="nav-item mb-2">
          <NavLink className="nav-link text-secondary" activeclassname="active" to="/tassignment">
            <i className="fas fa-tasks font-weight-bold"></i>
            <span className="ml-3">Assignments</span>
          </NavLink>
        </li>

    {/* Tests */}
    <li className="nav-item mb-2">
          <NavLink className="nav-link text-secondary" activeclassname="active" to="/teacher/test">
          <i className="fas fa-file-alt font-weight-bold"></i>
            <span className="ml-3">Tests</span>
          </NavLink>
        </li>

        {/* Grades */}
        <li className="nav-item mb-2">
          <NavLink className="nav-link text-secondary" activeclassname="active" to="/teacher/grades">
            <i className="fas fa-graduation-cap font-weight-bold"></i>
            <span className="ml-3">Grades</span>
          </NavLink>
        </li>

        {/* Settings */}
        <li className="nav-item mb-2">
          <NavLink className="nav-link text-secondary" activeclassname="active" to="/teacher/settings">
            <i className="fas fa-cog font-weight-bold"></i>
            <span className="ml-3">Settings</span>
          </NavLink>
        </li>

        {/* Add more sidebar items as needed */}
      </ul>
    </div>
  );
}

export default SidebarTeacher;
