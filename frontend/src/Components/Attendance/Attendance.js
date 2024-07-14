import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../global/Navbar';
import Sidebar from '../global/Sidebar';
import Calendar from 'react-calendar'; // Import Calendar component
import 'react-calendar/dist/Calendar.css'; // Import Calendar styles
import './Attendance.css'; // Import custom CSS file

const Attendance = () => {
    // State to store the selected date
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceDates, setAttendanceDates] = useState([]);

    // Function to handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Function to fetch attendance data
    const fetchAttendanceData = async (regno) => {
        try {
            const response = await axios.get(`http://localhost:3001/teacher/attendance/${encodeURIComponent(regno)}`);
            const attendanceData = response.data.attendance.map((item) => new Date(item.date));
            setAttendanceDates(attendanceData);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    // useEffect to fetch attendance data when component mounts
    useEffect(() => {
        const regno = localStorage.getItem('regno'); // Or any method to dynamically get the regno
        fetchAttendanceData(regno);
    }, []);

    // Function to count number of present days from April till selectedDate
    const countPresentDaysFromApril = () => {
        const startDate = new Date(selectedDate.getFullYear(), 3, 1); // April 1st of the current year
        return attendanceDates.filter(date => {
            return (
                date >= startDate && // Date is after or equal to April 1st
                date <= selectedDate && // Date is before or equal to selectedDate
                date.getDay() !== 0 && // Exclude Sundays
                date.getDay() !== 6 && // Exclude Saturdays
                attendanceDates.some(
                    (attendanceDate) =>
                        attendanceDate.getDate() === date.getDate() &&
                        attendanceDate.getMonth() === date.getMonth() &&
                        attendanceDate.getFullYear() === date.getFullYear()
                )
            );
        }).length;
    };

    // Function to count number of absent days from April till selectedDate
    const countAbsentDaysFromApril = () => {
        const startDate = new Date(selectedDate.getFullYear(), 3, 1); // April 1st of the current year
        return Array.from({ length: Math.ceil((selectedDate - startDate) / (1000 * 3600 * 24)) }, (_, index) => {
            const dateToCheck = new Date(startDate);
            dateToCheck.setDate(startDate.getDate() + index);
            return dateToCheck;
        }).filter(date => {
            return (
                date >= startDate && // Date is after or equal to April 1st
                date <= selectedDate && // Date is before or equal to selectedDate
                date.getDay() !== 0 && // Exclude Sundays
                date.getDay() !== 6 && // Exclude Saturdays
                !attendanceDates.some(
                    (attendanceDate) =>
                        attendanceDate.getDate() === date.getDate() &&
                        attendanceDate.getMonth() === date.getMonth() &&
                        attendanceDate.getFullYear() === date.getFullYear()
                )
            );
        }).length;
    };

    // Function to customize tile class name
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const isPresent = attendanceDates.some(
                (attendanceDate) =>
                    attendanceDate.getDate() === date.getDate() &&
                    attendanceDate.getMonth() === date.getMonth() &&
                    attendanceDate.getFullYear() === date.getFullYear()
            );
            if (isPresent) {
                return 'present-day'; // Custom CSS class for present day
            } else {
                // Check if the date is after April 1st and not a weekend
                const startDate = new Date(date.getFullYear(), 3, 1); // April 1st of the current year
                if (date >= startDate && date.getDay() !== 0 && date.getDay() !== 6) {
                    return 'absent-day'; // Mark as absent for weekdays not present in attendanceDates
                }
            }
        }
        return null;
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid" id="main">
                <div className="row row-offcanvas row-offcanvas-left">
                    <Sidebar />
                    <div className="col main pt-5 mt-3">

                    <div className="row mb-3" style={{ textAlign: 'center', color: 'white', backgroundColor: 'darkgreen' }}>
                            <h2>STUDENT  ATTENDANCE    STATUS</h2>
                        </div>
                   
                        <div className="row mb-3">
                            {/* <h2>Attendance Status</h2> */}
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
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <div className="card green-card"> {/* Apply green-card class */}
                                    <div className="card-body">
                                        <h5 className="card-title">   Present Days Count from April  <i className="fas fa-school mr-2"></i> </h5>
                                       <br></br> <p className="card-text">{countPresentDaysFromApril()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                    <div className="card red-card"> {/* Apply red-card class */}
                        <div className="card-body">
                            <h5 className="card-title"> Absent Days Count from April  <i className="fas fa-school mr-2"></i> </h5>
                           <br></br> <p className="card-text">{countAbsentDaysFromApril()}</p>
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
