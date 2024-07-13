import React, { useEffect, useState } from 'react';
import TNavbar from './TNavbar';
import SidebarTeacher from './SidebarTeacher';
import axios from 'axios';

const Ttest = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [testDetails, setTestDetails] = useState({
        scode: '',
        date1: ''
    });
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState({
        op1: '',
        op2: '',
        op3: '',
        op4: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTestDetails({ ...testDetails, [name]: value });
    };

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const tid = localStorage.getItem('tid');
                if (!tid) {
                    throw new Error('Teacher ID is required.');
                }

                const response = await axios.get('http://localhost:3001/teacher/subjects', {
                    params: { tid }
                });
                setSubjects(response.data.subjects);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                setError('Failed to fetch subjects');
            }
        };

        fetchSubjects();
    }, []);

    const handleSubjectChange = (event) => {
        const scode = event.target.value;
        setSelectedSubject(scode);
        setTestDetails({ ...testDetails, scode });
    };

    const handleOptionChange = (event, optionName) => {
        setOptions({ ...options, [optionName]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const tid = localStorage.getItem('tid');
            const { scode, date1 } = testDetails;
            const { op1, op2, op3, op4 } = options;

            // Validate fields
            if (!tid || !scode || !date1 || !question || !op1 || !op2 || !op3 || !op4 || !correctAnswer) {
                throw new Error('All fields are required.');
            }

            // Prepare data for POST request
            const postData = {
                tid,
                scode,
                date1,
                question,
                op1,
                op2,
                op3,
                op4,
                corrAns: correctAnswer
            };

            // Send POST request to backend
            const response = await axios.post('http://localhost:3001/teacher/questions', postData);
            console.log('Question saved:', response.data);
            setSuccess('Question saved successfully');

            // Clear form fields
            setQuestion('');
            setOptions({
                op1: '',
                op2: '',
                op3: '',
                op4: ''
            });
            setCorrectAnswer('');
            setTestDetails({
                scode: '',
                date1: ''
            });
            setSelectedSubject('');

        } catch (error) {
            console.error('Error saving question:', error);
            setError('Failed to save question');
        } finally {
            setLoading(false);
        }
    };

    const handleCorrectAnswerChange = (event) => {
        setCorrectAnswer(event.target.value);
    };

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
    };

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
                                <li className="breadcrumb-item active" aria-current="page">Upload Test</li>
                            </ol>
                        </nav>

                        <div className="row mb-3">
                            <h2>Test</h2>
                            <p className="lead d-none d-sm-block">Upload test</p>
                        </div>
                        <hr />

                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="subjectSelect">Select Subject:</label>
                                        <select 
                                            id="subjectSelect" 
                                            className="form-control" 
                                            value={selectedSubject} 
                                            onChange={handleSubjectChange}
                                            required
                                        >
                                            <option value="" disabled>Select a subject</option>
                                            {subjects.map((subject) => (
                                                <option key={subject.scode} value={subject.scode}>
                                                    {subject.sname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="date1">Date of Exam:</label>
                                        <input
                                            type="date"
                                            id="date1"
                                            name="date1"
                                            className="form-control"
                                            value={testDetails.date1}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <div>
                                <h3>Questions</h3>
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="form-group">
                                          
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={question}
                                                onChange={handleQuestionChange}
                                                placeholder="Enter question here..."
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Options:</label>
                                            <div className="row">
                                                <div className="col">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={options.op1}
                                                        onChange={(e) => handleOptionChange(e, 'op1')}
                                                        placeholder="Option 1"
                                                        required
                                                    />
                                                </div>
                                                <div className="col">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={options.op2}
                                                        onChange={(e) => handleOptionChange(e, 'op2')}
                                                        placeholder="Option 2"
                                                        required
                                                    />
                                                </div>
                                                <div className="col">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={options.op3}
                                                        onChange={(e) => handleOptionChange(e, 'op3')}
                                                        placeholder="Option 3"
                                                        required
                                                    />
                                                </div>
                                                <div className="col">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={options.op4}
                                                        onChange={(e) => handleOptionChange(e, 'op4')}
                                                        placeholder="Option 4"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Correct Answer:</label>
                                            <select
                                                className="form-control"
                                                value={correctAnswer}
                                                onChange={handleCorrectAnswerChange}
                                                required
                                            >
                                                <option value="">Select correct answer</option>
                                                <option value="a">A</option>
                                                <option value="b">B</option>
                                                <option value="c">C</option>
                                                <option value="d">D</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ttest;
