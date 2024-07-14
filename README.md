# Institute Project

A comprehensive web application for managing student and teacher activities within an educational institute. This application allows students and teachers to interact with various features such as attendance, assignments, tests, and performance tracking.

## Overview

This project is built using React and includes a variety of components to manage different aspects of an educational institute. It provides separate dashboards and functionalities for students and teachers.

## Features

- **Student Login**: Allows students to log in to their accounts.
- **Student Dashboard**: Displays student-specific information and options.
- **Teacher Registration**: Allows teachers to register in the system.
- **Teacher Dashboard**: Displays teacher-specific information and options.
- **Attendance Management**: Enables both students and teachers to manage and view attendance records.
- **Assignment Management**: Teachers can assign homework and students can view it.
- **Test Management**: Teachers can create tests, and students can take them.
- **Performance Tracking**: Students can track their performance over time.
- **Profile Editing**: Both students and teachers can edit their profiles.

## Code Structure

### `App.js`
The root component that integrates all parts of the application using React Router for navigation.

### Components
Contains all the individual React components used in the application.

## Components

- **StudentLogin**: Handles the student login functionality.
- **StudentDashboard**: Displays the main dashboard for students.
- **TeacherReg**: Handles teacher registration.
- **TeacherDashboard**: Displays the main dashboard for teachers.
- **EditProfile**: Allows users to edit their profiles.
- **Attendance**: Manages and displays attendance records.
- **HomeWork**: Displays homework assigned to students.
- **Stest**: Manages student tests.
- **Displayquestion**: Displays questions for a test based on the selected date.
- **Performance**: Shows the performance metrics for students.
- **TAssignment**: Allows teachers to assign and manage homework.
- **Ttest**: Allows teachers to create and manage tests.
- **TAttendance**: Allows teachers to manage and view attendance records for their classes.

## Routes Configuration

The application uses React Router to define the routes for different components:

- `/`: Displays the `StudentLogin` component.
- `/teacherreg`: Displays the `TeacherReg` component for teacher registration.
- `/teacher`: Displays the `Teacher` component.
- `/editProfile`: Displays the `EditProfile` component.
- `/home`: Displays the `StudentDashboard` component.
- `/attendance`: Displays the `Attendance` component.
- `/homework`: Displays the `HomeWork` component.
- `/test`: Displays the `Stest` component.
- `/displayquestion/`: Displays the `Displayquestion` component for a specific date.
- `/performance`: Displays the `Performance` component.
- `/teacherdashboard`: Displays the `TeacherDashboard` component.
- `/tassignment`: Displays the `TAssignment` component.
- `/teacher/test`: Displays the `Ttest` component.
- `/teacher/attendance`: Displays the `TAttendance` component.

## How to Use

1. **Student Login**: Students can log in using their credentials.
2. **Teacher Registration**: Teachers can register through the registration form.
3. **Dashboards**: Once logged in, students and teachers are redirected to their respective dashboards where they can access various features.
4. **Attendance**: Both students and teachers can manage attendance records.
5. **Assignments**: Teachers can assign homework and students can view it.
6. **Tests**: Teachers can create tests, and students can take them.
7. **Performance Tracking**: Students can track their performance metrics.
8. **Profile Editing**: Users can edit their profiles.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/institute-project.git
    cd institute-project
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```
4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or issues, please open an issue on this repository or contact me at [tithikachar14@gmail.com](mailto:tithikachar14@gmail.com).
