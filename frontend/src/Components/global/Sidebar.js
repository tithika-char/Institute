import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
const Sidebar = () => {
  // State to store the student's name and profile picture
  const [studentInfo, setStudentInfo] = useState({ name: "", proPic: "" });

  // Fetch the student's data from local storage when the component mounts
  useEffect(() => {
    // Retrieve student data from local storage
    const storedStudentData = JSON.parse(localStorage.getItem("student"));
    if (storedStudentData) {
      // Extract first name, last name, and profile picture from student data
      const { firstName, lastName, proPic } = storedStudentData;
      // Set student name and profile picture to be displayed in the sidebar
      setStudentInfo({ name: `${firstName} ${lastName}`, proPic });
    }
  }, []);

  useEffect(() => {                 //for printing
    console.log(studentInfo.proPic);
  }, [studentInfo.proPic]);

  return (
    <div
      className="col-md-3 col-lg-2 sidebar-offcanvas pl-0"
      id="sidebar"
      role="navigation"
      style={{ backgroundColor: "#e9ecef", height: "100vh" }}
    >
      <ul className="nav flex-column sticky-top pl-0 pt-5 p-3 mt-3">
        {/* Student Name */}
        <li className="nav-item mb-2 mt-3">
          <a className="nav-link text-secondary" href="#">
            {/* Display profile picture */}
            {studentInfo.proPic && (
              <img
                src={`${studentInfo.proPic}`}
                alt="Profile"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            )}
            <h5>{studentInfo.name}</h5>
          </a>
        </li>

        {/* Home */}
        <li className="nav-item mb-2">
          <NavLink
            className="nav-link text-secondary"
            activeclassname="active"
            to="/home"
          >
            <i className="fas fa-home font-weight-bold"></i>
            <span className="ml-3">Home</span>
          </NavLink>
        </li>

        {/* Edit Profile */}
        <li className="nav-item mb-2">
          <NavLink
            className="nav-link text-secondary"
            activeclassname="active"
            to="/editprofile"
          >
            <i className="fas fa-user-edit font-weight-bold"></i>
            <span className="ml-3">Edit Profile</span>
          </NavLink>
        </li>

        {/* Attendance */}
        <li className="nav-item mb-2">
          <NavLink
            className="nav-link text-secondary"
            activeclassname="active"
            to="/attendance"
          >
            <i className="fas fa-calendar-check font-weight-bold"></i>
            <span className="ml-3">Attendance</span>
          </NavLink>
        </li>

        {/* Homework */}
        <li className="nav-item mb-2">
          <NavLink
            className="nav-link text-secondary"
            activeclassname="active"
            to="/homework"
          >
            <i className="fas fa-clipboard-list font-weight-bold"></i>
            <span className="ml-3">Homework</span>
          </NavLink>
        </li>

        {/* Exam Details */}
        <li className="nav-item mb-2">
          <NavLink
            className="nav-link text-secondary"
            activeclassname="active"
            to="/test"
          >
           <i className="fas fa-file-alt font-weight-bold"></i>
           <span className="ml-3">Tests</span>
          </NavLink>
        </li>



     




        {/* Performance */}
        <li className="nav-item mb-2">
          <NavLink
            className="nav-link text-secondary"
            activeclassname="active"
            to="/performance"
          >
            <i className="fas fa-chart-line font-weight-bold"></i>
            <span className="ml-3">Performance</span>
          </NavLink>
        </li>

        {/* Settings */}
        <li className="nav-item mb-2">
          <NavLink
            className="nav-link text-secondary"
            activeclassname="active"
            to="/settings"
          >
            <i className="fas fa-cog font-weight-bold"></i>
            <span className="ml-3">Settings</span>
          </NavLink>
        </li>

        {/* Add more sidebar items as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
