
const express=require('express')

const app =express()
app.use(express.json());

const cors = require('cors'); // Import the cors package
app.use(cors());


const StudentController=require('./Controllers/StudentController')
const SubjectController=require('./Controllers/SubjectController')
const TeacherController=require('./Controllers/TeacherController')
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.set("view engine","ejs")
app.use("/student",StudentController)
app.use('/subject',SubjectController)
app.use('/teacher',TeacherController)



const port = 3001; // Define the port number

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`); // Print the URL in the console
});