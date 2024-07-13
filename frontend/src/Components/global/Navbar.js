import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [assignmentCount, setAssignmentCount] = useState(0);

  useEffect(() => {
    const fetchAssignmentCount = async () => {
      try {
        const regno = JSON.parse(localStorage.getItem('student')).regno; // Assuming student info is stored in localStorage
        const response = await axios.get('http://localhost:3001/teacher/assignmentStatusCount', {
          params: { regno }
        });
        setAssignmentCount(response.data.count);
      } catch (error) {
        console.error('Error fetching assignment count:', error);
      }
    };

    fetchAssignmentCount();
  }, []);

  const markAssignmentsChecked = async () => {
    try {
      const regno = JSON.parse(localStorage.getItem('student')).regno;
      await axios.post('http://localhost:3001/teacher/markAssignmentsChecked', { regno });
      setAssignmentCount(0); // Reset the count to 0
    } catch (error) {
      console.error('Error marking assignments as checked:', error);
    }
  };

  return (
    <nav className="navbar fixed-top navbar-expand-md navbar-dark bg-dark mb-3">
      <div className="flex-row d-flex">
        <button type="button" className="navbar-toggler mr-2" data-toggle="offcanvas" title="Toggle responsive left sidebar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <a className="navbar-brand" href="#" title="Free Bootstrap 4 Admin Template">STUDENT PANEL</a>
      </div>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="navbar-collapse collapse" id="collapsingNavbar">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <Link className="nav-link" to="/home">Home <span className="sr-only">Home</span></Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/homework" onClick={markAssignmentsChecked}>
              Homework
              {assignmentCount > 0 && (
                <span className="badge badge-danger ml-2">{assignmentCount}</span>
              )}
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="#myAlert" data-toggle="collapse">Alert</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="" data-target="#myModal" data-toggle="modal">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link waves-effect waves-light text-white">
              <i className="fab fa-google-plus-g"></i>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link waves-effect waves-light text-white">
              <i className="fas fa-envelope-open-text"></i>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link waves-effect waves-light text-white">
              <i className="fas fa-align-justify"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
