import React, { useEffect, useState } from 'react';
import Navbar from '../global/Navbar';
import Sidebar from '../global/Sidebar';
import axios from 'axios';

const Performance = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [score, setScore] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [fullMarks, setFullMarks] = useState(0);
    const [showReview, setShowReview] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get('http://localhost:3001/teacher/results');
                const data = response.data.data;
                setResults(data);

                // Calculate full marks, score, and percentage
                const totalQuestions = data.length;
                const correctAnswers = data.filter(result => result.selected_option === result.corrAns).length;
                const fullMarks = totalQuestions; // Assuming each question is worth 1 mark

                setFullMarks(fullMarks);
                setScore(correctAnswers);
                setPercentage((correctAnswers / totalQuestions) * 100);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching results:', error);
                setError('Failed to fetch results');
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const handleShowReview = () => {
        setShowReview(!showReview);
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid" id="main">
                <div className="row row-offcanvas row-offcanvas-left">
                    <Sidebar />
                    <div className="col main pt-5 mt-3">
                    <div className="row mb-3" style={{ textAlign: 'center', color: 'white', backgroundColor: 'darkgreen' }}>
                            <h2>RESULT</h2>
                        </div>
                      

                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <>
                                <div className=" row mb-4" style={{textAlign:'center',color : 'red', backgroundColor: '#ffcccb' }}>
                                    <h4>Full Marks: {fullMarks}</h4>
                                    <h4>Total Score: {score}</h4>
                                    <h4>Percentage: {percentage.toFixed(2)}%</h4>
                                </div>
                                <button className="btn btn-primary mb-3" onClick={handleShowReview}>
                                    {showReview ? 'Hide Review' : 'Show Review'}
                                </button>
                                <hr />
                                {showReview && (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Question No</th>
                                                <th>Question</th>
                                                <th>Correct Answer</th>
                                                <th>Selected Answer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((result, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{result.question}</td>
                                                    <td>{result.corrAns}</td>
                                                    <td>{result.selected_option}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Performance;
