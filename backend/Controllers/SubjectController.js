const express = require("express");
const router = express.Router();
const db=require('../models/db');



  router.get("/getSubject",  (req, res)=> {
    const query = 'SELECT scode,sname   FROM tb_subject';
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error executing MySQL query: ', error);
        res.status(500).json({ error: 'Error fetching data from MySQL' });
        return;
      }
      res.send(JSON.stringify(results))
    });
});

module.exports = router;