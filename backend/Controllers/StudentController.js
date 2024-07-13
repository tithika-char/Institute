const express = require("express");
const router = express.Router();
const db=require('../models/db');
const multer = require('multer');
const path=require('path');
// Configure multer to store files in memory
const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'D:\\react_mysql\\Institute\\frontend\\public')
  },
  filename:function(req,file,cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.round()*1E9);
    cb(null,uniqueSuffix+path.extname(file.originalname))
  }
})

const upload = multer({ storage });




const app = express();




router.get("/", (req, res) => {
  const query = 'SELECT alias, period, serial FROM setting';

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query: ', error);
      res.status(500).json({ error: 'Error fetching data from MySQL' });
      return;
    }

    if (results.length > 0) {
      const { alias, period, serial } = results[0];
      const regno = `${alias}-${period}-${serial}`;
      res.json({ regno });
    } else {
      res.status(404).json({ error: 'No registration number configuration found' });
    }
  });
});


// Route to handle saving student data,and updating serial number from setting table

router.post('/save', async (req, res) => {
  try {
    const { regno, doAdmission, firstName, lastName, contactNumber, email, dob, subjects, gender } = req.body;
    const subjectString = Array.isArray(subjects) ? subjects.join(', ') : '';

    const insertQuery = `
      INSERT INTO tb_student 
      (regno, doAdmission, firstName, lastName, contactNumber, email, dob, subject, gender) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [regno, doAdmission, firstName, lastName, contactNumber, email, dob, subjectString, gender], (error, results) => {
      if (error) {
        console.error('Error saving student details:', error);
        res.status(500).json({ error: 'Error saving student details' });
      } else {
        const updateQuery = 'UPDATE setting SET serial = serial + 1 WHERE alias = "REG"';
        db.query(updateQuery, (error, results) => {
          if (error) {
            console.error('Error updating registration number:', error);
            res.status(500).json({ error: 'Error updating registration number' });
          } else {
            res.status(200).json({ message: 'Student details saved successfully' });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error saving student details:', error);
    res.status(500).json({ error: 'Error saving student details' });
  }
});


// Route to fetch subjects chosen by a student
router.get('/subjects', (req, res) => {
  const  regno  = req.query.regno;

  // Query to fetch subjects chosen by the student with the specified registration number
  const query = 'SELECT subject FROM tb_student WHERE regno = ?';

  db.query(query, [regno], (error, results) => {
    console.log("Result ="+results)
    if (error) {
      console.error('Error fetching subjects for student:', error);
      res.status(500).json({ error: 'Error fetching subjects for student' });
    } else {
      if (results.length > 0) {
        const subjects = results[0].subject.split(',').map(subject => subject.trim());
        console.log(subjects)
        res.status(200).json({ subjects });
      } else {
        res.status(404).json({ error: 'Student not found or no subjects chosen' });
      }
    }
  });
});



// Route to fetch teacher names based on subject name (sname)
router.get('/teachers/:sname', (req, res) => {
  const { sname } = req.params; // Extract subject name from URL parameter

  const query = `
    SELECT t.tid, t.tname, s.scode
    FROM tb_teacher t
    INNER JOIN tb_subject s ON t.scode = s.scode
    WHERE s.sname = ?
  `;

  // Execute the SQL query with subject name as parameter
  db.query(query, [sname], (error, results) => {
    if (error) {
      console.error('Error fetching teachers:', error);
      res.status(500).json({ error: 'Error fetching teachers' });
      return;
    }

    if (results.length > 0) {
      // Map the results to include tid, tname, and scode
      const teachers = results.map(row => ({
        tid: row.tid,
        tname: row.tname,
        scode: row.scode
      }));
      res.status(200).json({ teachers });
    } else {
      res.status(404).json({ error: 'No teachers found for the specified subject' });
    }
  });
});


router.post("/saveCourses", (req, res) => {
  
    console.log('Received request body:', req.body); // Log the request body to check the received data

    const query = 'INSERT INTO assign_courses SET ?';
    console.log('Generated SQL query:', query); // Log the SQL query to check the correctness

    db.query(query, [req.body], (error, results) => {
      if (error) {
        console.error('Error updating student details:', error);
        res.status(500).json({ error: 'Error updating student details' });
        return;
      }
      
      console.log('Updated courses details:', results); // Log the results of the update operation
      res.status(200).json({ message: 'Student course details saved successfully' });
    });
});



router.post('/login', (req, res) => {
  const { email, regno } = req.body;

  // Query to check if the student exists in the database
  const query = 'SELECT * FROM tb_student WHERE email = ? AND regno = ?';
  db.query(query, [email, regno], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Student found, return success response
    res.status(200).json({ message: 'Login successful', student: results[0] });
  });
});




router.put("/update", upload.single('proPic'), (req, res) => {
    const { regno, firstName, lastName, contactNumber, email, dob, gender } = req.body;
    const proPic = req.file?.path
const p=proPic?.split('\\')
    console.log('Received request body:', p[p.length-1]); // Log the request body to check the received data
   
    if (req.file) {
        console.log('Received file:', req.file); // Log the uploaded file to check the received file
        // console.log('Base64 encoded file:', proPic); // Log the base64 encoded string
    } else {
        console.log('No file uploaded');
    }

    const updateQuery = 'UPDATE tb_student SET firstName=?, lastName=?, contactNumber=?, email=?, dob=?, gender=?, proPic=? WHERE regno=?';
    console.log('Generated SQL query:', updateQuery); // Log the SQL query to check the correctness

    db.query(updateQuery, [firstName, lastName, contactNumber, email, dob, gender, p[p.length-1], regno], (error, results) => {
        if (error) {
            console.error('Error updating student details:', error);
            res.status(500).json({ error: 'Error updating student details' });
            return;
        }

        console.log('Updated student details:', results); // Log the results of the update operation
        res.status(200).json({ message: 'Student details updated successfully',data:results });
    });
});











module.exports = router;