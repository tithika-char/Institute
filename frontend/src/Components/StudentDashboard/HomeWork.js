import React, { useEffect, useState } from 'react';
import Navbar from '../global/Navbar';
import Sidebar from '../global/Sidebar';
import axios from 'axios';

const HomeWork = () => {
    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const regno = localStorage.getItem('regno');
                const scode = localStorage.getItem('scode');
                if (!regno || !scode) {
                    throw new Error('Student ID and Subject Code are required.');
                }

                const response = await axios.get('http://localhost:3001/teacher/assignments', {
                    params: { regno, scode }
                });
                setAssignments(response.data.assignments);
            } catch (error) {
                console.error('Error fetching assignments:', error);
                setMessage('Failed to fetch assignments.');
            }
        };

        fetchAssignments();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container-fluid" id="main">
                <div className="row row-offcanvas row-offcanvas-left">
                    <Sidebar />
                    <div className="col main pt-5 mt-3">
                      

                        <div className="row mb-3">
                            <h2>Homework</h2>
                        </div>
                        <hr />

                        {message && <p className="text-danger">{message}</p>}

                        <div className="row">
                            <div className="col-12">
                                <h3>Assignments</h3>
                                {assignments.length > 0 ? (
                                    <ul className="list-group">
                                        {assignments.map((assignment, index) => (
                                            <li key={index} className="list-group-item">
                                                <div><strong>Filename:</strong> {assignment.originalname}</div>
                                                <div><strong>Date of Upload:</strong> {new Date(assignment.dateOfUpload).toLocaleDateString()}</div>
                                                <div>
                                                    <a href={`http://localhost:3001/uploads/${assignment.filename}`} target="_blank" rel="noopener noreferrer">
                                                        Download
                                                    </a>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No assignments found for this subject.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeWork;
