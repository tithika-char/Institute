import React, { useEffect, useState } from 'react';
import TNavbar from './TNavbar';
import SidebarTeacher from './SidebarTeacher';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const TAttendance = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSubject, setSelectedSubject] = useState('');
    const [regno, setRegno] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const tid = localStorage.getItem('tid');
                if (!tid) {
                    throw new Error('Teacher ID is required.');
                }

                const response = await axios.get(`http://localhost:3001/teacher/subjects`, {
                    params: { tid: tid }
                });
                setSubjects(response.data.subjects);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    const handleRegnoChange = (event) => {
        setRegno(event.target.value);
    };

    const handleAttendanceSubmit = async () => {
        setError('');
        setSuccessMessage('');

        if (!selectedDate || !selectedSubject || !regno) {
            setError('All fields are required.');
            return;
        }

        try {
            const attendanceData = {
                date: selectedDate,
                regno,
                scode: selectedSubject
            };

            const response = await axios.post('http://localhost:3001/teacher/attendance', attendanceData);

            if (response.status === 200) {
                setSuccessMessage(response.data.message);
                setRegno(''); // Clear the registration number field after successful submission
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            setError('Failed to save attendance');
        }
    };

    return (
        <div>
            <TNavbar />
            <div className="container-fluid" id="main">
                <div className="row row-offcanvas row-offcanvas-left">
                    <SidebarTeacher />
                    <div className="col main pt-5 mt-3">
                        <div className="row mb-3" style={{ textAlign: 'center', color: 'white', backgroundColor: 'darkgreen' }}>
                            <h2>GIVE ATTENDANCE</h2>
                        </div>
                        <hr/>

                        <div className="row mb-3">
                            <div className="col-md-3">
                                <label htmlFor="datePicker">Select Date:</label>
                                <br />
                                <DatePicker
                                    id="datePicker"
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="subjectSelect">Select Subject:</label>
                                <select 
                                    id="subjectSelect" 
                                    className="form-control" 
                                    value={selectedSubject} 
                                    onChange={handleSubjectChange}
                                >
                                    <option value="" disabled>Select a subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.scode} value={subject.scode}>
                                            {subject.sname}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="regnoInput">Register Number:</label>
                                <input
                                    id="regnoInput"
                                    type="text"
                                    className="form-control"
                                    value={regno}
                                    onChange={handleRegnoChange}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-12">
                                <button className="btn btn-primary" onClick={handleAttendanceSubmit}>
                                    Mark Attendance
                                </button>
                            </div>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TAttendance;
