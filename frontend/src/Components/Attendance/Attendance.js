import React, { useState, useEffect } from 'react';
import Navbar from '../global/Navbar';
import Sidebar from '../global/Sidebar';
import Calendar from 'react-calendar'; // Import Calendar component
import 'react-calendar/dist/Calendar.css'; // Import Calendar styles
import axios from 'axios';
import './Attendance.css'; // Import custom CSS file

const Attendance = ({ regno }) => {
    // State to store the selected date
    const [selectedDate, setSelectedDate] = useState(new Date());
    // State to store attendance data for the student
    const [attendanceData, setAttendanceData] = useState([]);

    // Function to handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Sample function to customize tile class name based on date
    const tileClassName = ({ date }) => {
        const dayOfMonth = date.getDate();
        const month = date.getMonth();

        // Check if the date is in April
        if (month === 3 && dayOfMonth === selectedDate.getDate()) {
            return 'present-day'; // Green color for present day
        }

        // Check if the date is in the past
        if (date < new Date()) {
            // Check if the date is a weekend (Saturday or Sunday)
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                return 'weekend'; // Apply styles for weekends
            }

            // Check if the date is an absent day
            // For demonstration purposes, let's consider the 10th, 15th, and 20th as absent days
            if ([10, 15, 20].includes(dayOfMonth)) {
                return 'absent-day'; // Light red color for absent days
            }

            // Check if the date is a leave day
            // For demonstration purposes, let's consider the 5th, 12th, and 25th as leave days
            if ([5, 12, 25].includes(dayOfMonth)) {
                return 'leave-day'; // Yellow color for leave days
            }

            // Check if the date is a holiday
            // For demonstration purposes, let's consider the 1st and 30th as holidays
            if ([1, 30].includes(dayOfMonth)) {
                return 'holiday'; // Purple color for holidays
            }
        }

        return null; // Default class for other days
    };

    // Function to fetch attendance data for a specific student
    const fetchAttendanceData = async (regno) => {
        try {
            const response = await axios.get(`http://localhost:3001/teacher/attendance/${regno}`);
            setAttendanceData(response.data.attendance);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    // useEffect to fetch attendance data when component mounts or regno changes
    useEffect(() => {
        if (regno) {
            fetchAttendanceData(regno);
        }
    }, [regno]); // Trigger fetchAttendanceData whenever regno changes

    return (
        <div>
            <Navbar />
            <div className="container-fluid" id="main">
                <div className="row row-offcanvas row-offcanvas-left">
                    <Sidebar />
                    <div className="col main pt-5 mt-3">
                        <p className="lead d-none d-sm-block">Student attendance</p>
                        <div className="row mb-3">
                            <h2>Attendance status</h2>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col">
                                <Calendar
                                    onChange={handleDateChange} // Handle date change
                                    value={selectedDate} // Set selected date
                                    tileClassName={tileClassName} // Apply custom class names to tiles
                                />
                            </div>
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Attendance Dates</h5>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
