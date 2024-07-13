import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../global/Navbar';
import Sidebar from '../global/Sidebar';
import axios from 'axios';

const Stest = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const regno = localStorage.getItem('regno'); // Assuming student ID is stored in localStorage
                const response = await axios.get('http://localhost:3001/teacher/testdate', {
                    params: { regno }
                });
                setTests(response.data.tests);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching test dates:', error);
                setError('Failed to fetch test dates');
                setLoading(false);
            }
        };

        fetchTests();
    }, []);

    const isTestActive = (testDate) => {
        const today = new Date();
        const testDay = new Date(testDate);

       

        return today.toDateString() === testDay.toDateString();
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid" id="main">
                <div className="row row-offcanvas row-offcanvas-left">
                    <Sidebar />
                    <div className="col main pt-5 mt-3">
                        <div className="row mb-3">
                            <h2>TEST</h2>
                        </div>
                        <hr />

                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <div>
                                {tests.length > 0 ? (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Subject Name</th>
                                                <th>Test Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tests.map((test, index) => (
                                                <tr key={index}>
                                                    <td>{test.sname}</td>
                                                    <td>{new Date(test.date1).toLocaleDateString()}</td>
                                                    <td>
                                                        {isTestActive(test.date1) ? (
                                                            <Link to={`/displayquestion/${formatDate(test.date1)}`}>Take Test</Link>
                                                        ) : (
                                                            <span>Test not available</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No tests found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stest;
