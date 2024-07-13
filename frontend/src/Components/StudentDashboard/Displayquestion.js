import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom'
import Navbar from '../global/Navbar';
import Sidebar from '../global/Sidebar';
import axios from 'axios';

const Displayquestion = () => {
    const { date1 } = useParams();
   
const navigate = useNavigate()
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isTestOver, setIsTestOver] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:3001/teacher/question', {
                    params: { date1 }
                });
                setQuestions(response.data.questions);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError('Failed to fetch questions');
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [date1]);

    const handleOptionChange = (questionId, option) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: option
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const regno = localStorage.getItem('regno');

            const answersToSubmit = questions.map((question, index) => {
                const selectedOption = selectedAnswers[index];
                return {
                    tid: localStorage.getItem('tid'),
                    scode: localStorage.getItem('scode'),
                    date1,
                    qid: question.qid,
                    selected_option: selectedOption,
                    regno: regno
                };
            });

            const response = await axios.post('http://localhost:3001/teacher/saveanswers', {
                date1,
                answers: answersToSubmit
            });

            console.log('Student answers saved successfully:', response.data);
            setIsTestOver(true);
            setSubmissionSuccess(true); // Set submission success state
        } catch (error) {
            console.error('Error saving answers:', error);
        }
    };

    const handleShowResults = () => {
        navigate(`/results`);
      
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid" id="main">
                <div className="row row-offcanvas row-offcanvas-left">
                    <Sidebar />
                    <div className="col main pt-5 mt-3">
                        <div className="row mb-3">
                            <h1>Attempt all questions</h1>
                            <h3>Each question is 1 marks! No negative marks.</h3>
                        </div>
                        <hr />

                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <div>
                                {isTestOver ? (
                                    <div>
                                         <p className="alert alert-success">Test is over. Thank you for your participation!</p>

                                        {/* <button onClick={handleShowResults} className="btn btn-primary">
                                            Show Results
                                        </button> */}
                                        <a href="/results" className="btn btn-primary"> Show Results</a>

                                    </div>
                                ) : questions.length > 0 ? (
                                    <form onSubmit={handleSubmit}>
                                        {questions.map((question, index) => (
                                            <div key={index} className="mb-3">
                                                <h5>Question {index + 1}</h5>
                                                <p>{question.question}</p>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        id={`a-${index}`}
                                                        name={`option-${index}`}
                                                        value="a"
                                                        checked={selectedAnswers[index] === 'a'}
                                                        onChange={() => handleOptionChange(index, 'a')}
                                                    />
                                                    <label htmlFor={`a-${index}`}>A. {question.op1}</label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        id={`b-${index}`}
                                                        name={`option-${index}`}
                                                        value="b"
                                                        checked={selectedAnswers[index] === 'b'}
                                                        onChange={() => handleOptionChange(index, 'b')}
                                                    />
                                                    <label htmlFor={`b-${index}`}>B. {question.op2}</label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        id={`c-${index}`}
                                                        name={`option-${index}`}
                                                        value="c"
                                                        checked={selectedAnswers[index] === 'c'}
                                                        onChange={() => handleOptionChange(index, 'c')}
                                                    />
                                                    <label htmlFor={`c-${index}`}>C. {question.op3}</label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        id={`d-${index}`}
                                                        name={`option-${index}`}
                                                        value="d"
                                                        checked={selectedAnswers[index] === 'd'}
                                                        onChange={() => handleOptionChange(index, 'd')}
                                                    />
                                                    <label htmlFor={`d-${index}`}>D. {question.op4}</label>
                                                </div>
                                                <hr />
                                            </div>
                                        ))}
                                        <button type="submit" className="btn btn-primary">
                                            Submit Answers
                                        </button>
                                    </form>
                                ) : (
                                    <p>No questions found for this test.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Displayquestion;
