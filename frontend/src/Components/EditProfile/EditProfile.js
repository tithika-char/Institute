import React, { useState, useEffect } from 'react';
import Navbar from '../global/Navbar';
import Sidebar from '../global/Sidebar';

const EditProfile = () => {
    const [studentData, setStudentData] = useState(null);
    const [regNo, setRegNo] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const storedStudentData = JSON.parse(localStorage.getItem('student'));
        if (storedStudentData) {
            setStudentData(storedStudentData);
            setRegNo(storedStudentData.regno);
            setFirstName(storedStudentData.firstName);
            setLastName(storedStudentData.lastName);
            setBirthday(formatDate(storedStudentData.dob));
            setGender(storedStudentData.gender);
            setContactNumber(storedStudentData.contactNumber);
            setEmail(storedStudentData.email);
            setProfilePicture(storedStudentData.profilePicture);
        }
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedDate = new Date(birthday).toISOString().split('T')[0];

        const formData = new FormData();
        formData.append('regno', regNo);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('dob', formattedDate);
        formData.append('gender', gender);
        formData.append('contactNumber', contactNumber);
        formData.append('email', email);
        if (profilePicture) {
            formData.append('proPic', profilePicture);
        }

        try {
            const response = await fetch('http://localhost:3001/student/update', {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            console.log('Data updated in backend:', data);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div className="edit-profile-page">
            <Navbar />
            <div className="container-fluid" id="main">
                <div className="row row-offcanvas row-offcanvas-left">
                    <Sidebar />
                    <div className="col main pt-5 mt-3">
                        <div className="edit-profile-box">
                            <h2 className="text-center mb-4">EDIT PROFILE</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 row">
                                    <label htmlFor="regNo" className="col-sm-3 col-form-label">Registration Number:</label>
                                    <div className="col-sm-9">
                                        <input type="text" readOnly className="form-control-plaintext" id="regNo" value={studentData?.regno || ''} />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="email" className="col-sm-3 col-form-label">Email:</label>
                                    <div className="col-sm-9">
                                        <input type="text" readOnly className="form-control-plaintext" id="email" value={studentData?.email || ''} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm">
                                        <div className="mb-3">
                                            <label htmlFor="firstName" className="form-label">First Name</label>
                                            <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm">
                                        <div className="mb-3">
                                            <label htmlFor="lastName" className="form-label">Last Name</label>
                                            <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="birthday" className="form-label">Birthday</label>
                                    <input type="date" className="form-control" id="birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="gender" className="form-label">Gender</label>
                                    <select className="form-select" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                                    <input type="text" className="form-control" id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                                    <input type="file" className="form-control" id="profilePicture" onChange={handleProfilePictureChange} />
                                    {profilePicture && (
                                        <div className="mt-3">
                                            <img src={URL.createObjectURL(profilePicture)} alt="Profile" className="img-thumbnail" style={{ width: '150px', height: '150px' }} />
                                        </div>
                                    )}
                                </div>
                                <button type="submit" className="btn btn-primary">UPDATE DATA</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
