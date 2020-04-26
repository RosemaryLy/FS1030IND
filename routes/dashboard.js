var express = require('express');
var router = express.Router();

//Get dashboard
router.get('/', function(req, res, next) {    
    // render to add.ejs
    res.render('dashboard', {
           
    })
})

module.exports = router;