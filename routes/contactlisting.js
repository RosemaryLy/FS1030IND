var express = require('express');
var router = express.Router();
var dbConn  = require('../config/db');
 
// display portfolios page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM portfolios ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/portfolios/index.ejs
            res.render('portfolios',{data:''});   
        } else {
            // render to views/portfolios/index.ejs
            res.render('portfolios',{data:rows});
        }
    });
});