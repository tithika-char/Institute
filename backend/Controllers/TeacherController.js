const express = require("express");
const router = express.Router();
const db=require('../models/db');
const multer = require('multer');
const path=require('path');

// Configure multer to store files in memory
const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'D:\\react_mysql\\Institute\\frontend\\public\\assignment')
  },
  fileUpload:function(req,file,cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.round()*1E9);
    cb(null,uniqueSuffix+path.extname(file.originalname))
  }
})

const upload = multer({ storage });



router.get("/teacherreg", (req, res) => {
  const query = 'SELECT alias1,serial1 FROM setting';

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query: ', error);
      res.status(500).json({ error: 'Error fetching data from MySQL' });
      return;
    }

    if (results.length > 0) {
      const { alias1, serial1 } = results[0];
      const tid = `${alias1}${String(serial1).padStart(2, '0')}`; // Format as T01, T02, etc.
      res.json({ tid });
    } else {
      res.status(404).json({ error: 'No registration number configuration found' });
    }
  });
});


router.post('/save1', async (req, res) => {
  try {
    const { tid, candidateName, contactNumber, email,subjects, gender } = req.body;
    const subjectString = Array.isArray(subjects) ? subjects.join(', ') : '';

    const insertQuery = `
      INSERT INTO tbl_teacherdetails 
      (tid, candidateName,contactNumber, email, subjects, gender) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [tid, candidateName, contactNumber, email,subjectString, gender], (error, results) => {
      if (error) {
        console.error('Error saving teacher details:', error);
        res.status(500).json({ error: 'Error saving teacher details' });
      } else {
        const updateQuery = 'UPDATE setting SET serial1 = serial1 + 1 WHERE alias = "T"';
        db.query(updateQuery, (error, results) => {
          if (error) {
            console.error('Error updating registration number:', error);
            res.status(500).json({ error: 'Error updating registration number' });
          } else {
            res.status(200).json({ message: 'teacher details saved successfully' });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error saving student details:', error);
    res.status(500).json({ error: 'Error saving student details' });
  }
});









router.post('/login', (req, res) => {
  const { tid } = req.body;

  // Query to check if the student exists in the database
  const query = 'SELECT * FROM tb_teacher WHERE tid = ?';
  db.query(query, [tid], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Student found, return success response
    res.status(200).json({ message: 'Login successful', teacher: results[0] });
  });
});


// New endpoint to fetch subjects for a teacher
router.get('/subjects', (req, res) => {
  const { tid } = req.query; // Use req.query to get tid from the query parameters

  if (!tid) {
    return res.status(400).json({ message: 'Teacher ID is required' });
  }

  // Query to get the subjects for the teacher
  const subjectQuery = `
    SELECT s.scode, s.sname
    FROM tb_subject s
    INNER JOIN tb_teacher ts ON s.scode = ts.scode
    WHERE ts.tid = ?
  `;

  db.query(subjectQuery, [tid], (err, results) => {
    if (err) {
      console.error('Error fetching subjects for teacher:', err);
      return res.status(500).json({ message: 'Error fetching subjects for teacher' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No subjects found for the specified teacher' });
    }

    // Return the subjects
    res.status(200).json({ subjects: results });
  });
});


router.get('/studentName', (req, res) => {
  const { tid, scode } = req.query;

  // Validate that tid and scode are provided
  if (!tid || !scode) {
    return res.status(400).json({ message: 'tid and scode are required parameters' });
  }

  // Query to fetch the student name based on teacher and subject
  const query = `
    SELECT DISTINCT s.firstName, s.lastName
    FROM tb_student s
    INNER JOIN assign_courses ac ON s.regno = ac.regno
    WHERE ac.tid = ? AND ac.scode = ?
  `;

  // Execute the query
  db.query(query, [tid, scode], (err, results) => {
    if (err) {
      console.error('Error fetching student name:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No students found for the specified teacher and subject' });
    }

    // Return the student names in the response
    res.status(200).json({ students: results });
  });
});



router.post('/uploadAssignment', upload.single('fileUpload'), (req, res) => {
  const { tid, scode, regno  } = req.body;
  const file = req.file;

  if (!tid || !scode || !file) {
    return res.status(400).send('Teacher ID, Subject Code, and file are required.');
  }

  const filename = file.filename; // The saved file name (unique with timestamp)
  const originalname = file.originalname; // The original file name
  const dateOfUpload = new Date();

  const insertQuery = `
    INSERT INTO tbl_tassignment (tid, scode, fileUpload, dateOfUpload, originalname)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [tid, scode, filename, dateOfUpload, originalname], (err, results) => {
    if (err) {
      console.error('Error saving assignment details:', err);
    
      return res.status(500).json({ message: 'Failed to save assignment details.' });
    }
    const slnum = results.insertId; // Retrieve the auto-generated slnum

    console.log('slnum:', slnum); // Log the slnum to console



    // Fetch all students' regnos for the subject
    const getStudentsQuery = `
      SELECT regno FROM assign_courses WHERE scode = ?
    `;

    db.query(getStudentsQuery, [scode], (err, studentResults) => {
      if (err) {
        console.error('Error fetching students:', err);
        return res.status(500).json({ message: 'Failed to fetch students.' });
      }

 // Insert into homework table for each student
 const homeworkInsertQuery = `
 INSERT INTO tbl_homework (scode, slnum, status, fileUpload, regno)
 VALUES (?, ?, ?, ?, ?)
`;

studentResults.forEach(student => {
 const studentRegno = student.regno;
 db.query(homeworkInsertQuery, [scode, slnum, 0, filename, studentRegno], (err, homeworkResults) => {
   if (err) {
     console.error('Error saving homework details for student:', studentRegno, err);
   } else {
    //  console.log('Homework details saved successfully for student:', studentRegno);
   }
 });
});

res.status(200).json({ message: 'File uploaded and assignment details saved successfully.' });
});
});
});





// Endpoint to fetch assignments for students
router.get('/assignments', (req, res) => {
  const { regno, scode } = req.query;

  if (!regno || !scode) {
      return res.status(400).json({ message: 'Student ID and Subject Code are required' });
  }

  const query = `
      SELECT t.fileUpload AS filename, t.originalname, t.dateOfUpload
      FROM tbl_tassignment t
      INNER JOIN assign_courses ac ON t.scode = ac.scode AND t.tid = ac.tid
      WHERE ac.regno = ? AND t.scode = ?
  `;

  db.query(query, [regno, scode], (err, results) => {
      if (err) {
          console.error('Error fetching assignments:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'No assignments found for this subject' });
      }

      res.status(200).json({ assignments: results });
  });
});


// In your existing Express router file
router.get('/assignmentStatusCount', (req, res) => {
  const { regno } = req.query;

  if (!regno) {
    return res.status(400).json({ message: 'Student registration number is required.' });
  }

  // Query to fetch the count of assignments with status 0 for the student
  const query = `
    SELECT COUNT(*) AS count
    FROM tbl_homework
    WHERE regno = ? AND status = 0
  `;

  db.query(query, [regno], (err, results) => {
    if (err) {
      console.error('Error fetching assignment status count:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }

    const count = results[0].count;
    // console.log('Count of assignments with status 0 for regno', regno, ':', count);

    res.status(200).json({ count });
  });
});


// In your existing Express router file
router.post('/markAssignmentsChecked', (req, res) => {
  const { regno } = req.body;

  if (!regno) {
    return res.status(400).json({ message: 'Student registration number is required.' });
  }

  const updateQuery = `
    UPDATE tbl_homework
    SET status = 1
    WHERE regno = ? AND status = 0
  `;

  db.query(updateQuery, [regno], (err, results) => {
    if (err) {
      console.error('Error updating assignment status:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }

    res.status(200).json({ message: 'Assignments marked as checked successfully.' });
  });
});


// POST endpoint to submit a new question
router.post('/questions', (req, res) => {
  const { tid,date1,scode, question, op1, op2, op3, op4, corrAns } = req.body;

  // Validation: Ensure all required fields are present
  if (!tid || !date1||!scode || !question || !op1 || !op2 || !op3 || !op4 || !corrAns) {
      return res.status(400).json({ message: 'All fields (Teacher ID, Subject Code, Question, Options, Correct Answer) are required' });
  }

  // SQL query to insert new question into tbl_question
  const insertQuery = `
      INSERT INTO tbl_question (tid, scode, date1,question, op1, op2, op3, op4, corrAns)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  // Execute the query
  db.query(insertQuery, [tid, scode,date1, question, op1, op2, op3, op4, corrAns], (err, result) => {
      if (err) {+-
          console.error('Error inserting question:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }

      console.log('Question inserted successfully:', result);

      // Respond with success message
      res.status(201).json({ message: 'Question inserted successfully' });
  });
});





// GET endpoint to fetch exam dates for a student
router.get('/testdate', (req, res) => {
  const regno = req.query.regno; // Assuming you pass the student ID as a query parameter

  if (!regno) {
    return res.status(400).json({ message: 'Student ID is required' });
  }

  // SQL query to fetch exam dates and subjects
  const fetchQuery = `
    SELECT t.sname, q.date1
    FROM tb_subject t
    JOIN tbl_question q ON t.scode = q.scode
    WHERE q.date1 IS NOT NULL
    GROUP BY t.sname, q.date1
  `;

  // Execute the query
  db.query(fetchQuery, [regno], (err, results) => {
    if (err) {
      console.error('Error fetching exam dates:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Respond with the fetched exam dates
    res.status(200).json({ tests: results });
  });
});


// GET endpoint to fetch questions for a specific test date
router.get('/question', (req, res) => {
  const { date1 } = req.query;

  if (!date1) {
    return res.status(400).json({ message: 'Test date is required' });
  }

  // SQL query to fetch questions for the specified date
  const fetchQuery = `
    SELECT qid,question, op1, op2, op3, op4, corrAns
    FROM tbl_question
    WHERE date1 = ?
  `;

  // Execute the query
  db.query(fetchQuery, [date1], (err, results) => {
    if (err) {
      console.error('Error fetching questions:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Respond with the fetched questions
    res.status(200).json({ questions: results });
  });
});

// POST endpoint to save student answers
router.post('/saveanswers', (req, res) => {
  const { date1, answers } = req.body;

  // Validate inputs
  if (!date1 || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Invalid request format' });
  }

  // Prepare the SQL query for batch insertion
  const insertQuery = `
    INSERT INTO tbl_checkingtest (tid, scode, date1, qid, selected_option,regno)
    VALUES ?
  `;

  // Iterate through each answer and prepare the values for batch insertion
  const values = answers.map((answer) => {
    const { tid, scode, qid, selected_option,regno } = answer;
    return [tid, scode, date1, qid, selected_option,regno];
  });

  // Execute the batch insert query
  db.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error('Error inserting student answers:', err);
      return res.status(500).json({ message: 'Failed to save student answers' });
    }

    console.log('Student answers saved successfully:', result);

    // Respond with success message
    res.status(201).json({ message: 'Student answers saved successfully' });
  });
});


// GET endpoint to fetch results based on query parameters

router.get('/results', (req, res) => {
  const query = `
    SELECT ct.checkingTestId, ct.tid, ct.scode, ct.date1, ct.qid, ct.selected_option, ct.regno, q.question, q.corrAns
    FROM tbl_checkingtest ct
    JOIN tbl_question q ON ct.qid = q.qid
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching checking test data:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json({ data: results });
  });
});

// Route to save attendance data
router.post('/attendance', (req, res) => {
  const { date, regno, scode} = req.body;

  if (!date || !regno || !scode ) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  const attendanceData = {
      date: new Date(date),
      regno,
      scode
  };

  const sql = 'INSERT INTO tbl_attendance SET ?';
  db.query(sql, attendanceData, (err, result) => {
      if (err) {
          console.error('Error saving attendance data:', err);
          return res.status(500).json({ message: 'Internal server error.' });
      }
      res.status(200).json({ message: 'Attendance saved successfully.' });
  });
});



// Route to get attendance data for a specific student
router.get('/attendance/:regno', (req, res) => {
  const { regno } = req.params;

  const sql = 'SELECT DATE_FORMAT(date, "%Y-%m-%d") AS date FROM tbl_attendance WHERE regno = ?';
  db.query(sql, [regno], (err, results) => {
      if (err) {
          console.error('Error fetching attendance data:', err);
          return res.status(500).json({ message: 'Internal server error.' });
      }

      res.status(200).json({ attendance: results });
  });
});









module.exports = router;