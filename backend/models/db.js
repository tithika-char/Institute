const mysql=require("mysql");
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456789',
    database:'db_institute'
});
con.connect((err)=>{
    if(!err)
    {
        console.log("Connected...")
    }else{
        console.log("problem in connection..."+err)
    }
})
module.exports=con;