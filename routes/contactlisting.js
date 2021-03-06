const express = require('express');
const router = express.Router();
const dbConn  = require('../config/db');
 
// display contactlisting page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM contactsfile ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/portfolios/index.ejs
            res.render('contactlisting',{data:''});   
        } else {
            // render to views/portfolios/index.ejs
            res.render('contactlisting',{data:rows});
        }
    });
});

module.exports = router;