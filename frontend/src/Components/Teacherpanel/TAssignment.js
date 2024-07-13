import React, { useEffect, useState } from 'react';
import TNavbar from './TNavbar';
import SidebarTeacher from './SidebarTeacher';
import axios from 'axios';

const TAssignment = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');

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

    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedSubject || !selectedFile) {
            setMessage('Please select a subject and upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('tid', localStorage.getItem('tid'));
        formData.append('scode', selectedSubject);
        formData.append('fileUpload', selectedFile);

        try {
            const response = await axios.post('http://localhost:3001/teacher/uploadAssignment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Failed to upload file.');
        }
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
                                <li className="breadcrumb-item"><a href="#">Library</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Data</li>
                            </ol>
                        </nav>

                        <div className="row mb-3">
                            <h2>ASSIGNMENT</h2>
                            <p className="lead d-none d-sm-block">Give Assignment to students</p>
                        </div>
                        <hr />

                        <div className="row">
                            <div className="col-12 col-md-3">
                                <div className="form-group">
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
                            </div>
                        </div>

                        <hr/>

                        <div className="row">
                            <div className="col-12 col-md-3">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="assignmentUpload">Upload Assignment:</label>
                                        <input 
                                            type="file" 
                                            id="assignmentUpload" 
                                            className="form-control" 
                                            onChange={handleFileChange} 
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Upload</button>
                                </form>
                                {message && <p className="mt-3">{message}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TAssignment;
