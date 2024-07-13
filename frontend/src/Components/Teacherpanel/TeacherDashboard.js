import React, { useEffect, useState } from 'react';
import TNavbar from './TNavbar';
import SidebarTeacher from './SidebarTeacher';
import axios from 'axios';
import './TeacherDashboard.css';

function TeacherDashboard() {
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const tid = localStorage.getItem('tid');
        if (!tid) {
            return;
        }
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/teacher/subjects`, {
                    params: { tid: tid }
                });
                setSubjects(response.data.subjects);
            } catch (error) {
                console.error('Error fetching teacher subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    useEffect(() => {
        const fetchStudentNames = async () => {
            const tid = localStorage.getItem('tid');
            const scode = localStorage.getItem('scode');

            if (!tid || !scode) {
                setError('Teacher ID and Subject Code are required.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3001/teacher/studentName?tid=${tid}&scode=${scode}`);
                const data = await response.json();

                if (response.ok) {
                    setStudents(data.students);
                } else {
                    setError(data.message || 'Failed to fetch student names');
                }
            } catch (err) {
                console.error('Error fetching student names:', err);
                setError('Internal server error');
            }
        };

        fetchStudentNames();
    }, []);

    return (
        <div>
            <TNavbar />
            <div className="container-fluid" id="main">
                <div className="row row-offcanvas row-offcanvas-left">
                    <SidebarTeacher />
                    <div className="col main pt-5 mt-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Library</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Data</li>
                            </ol>
                        </nav>

                        <hr />
                        <div className="row mb-3">
                            <h2 className="subject-header"><u>Subjects taught by the teacher:</u></h2>
                        </div>

                        <div className="row">
                            {subjects.map(subject => (
                                <div key={subject.scode} className="col-md-4">
                                    <div className="card subject-card mb-4">
                                        <div className="card-body">
                                            <h5 className="card-title">{subject.sname}</h5>
                                           
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr />
                        <div className="student-section">
                            <h3 className="student-header">Students enrolled:</h3>
                            <ul className="student-list">
                                {students.map((student, index) => (
                                    <li key={index} className="student-item">{`${student.firstName} ${student.lastName}`}</li>
                                ))}
                            </ul>
                        </div>

                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;
