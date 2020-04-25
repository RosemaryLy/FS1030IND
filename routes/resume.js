var express = require('express');
var router = express.Router();
var dbConn  = require('../config/db');
 
// display resume page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM resume ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/Resume/index.ejs
            res.render('Resume',{data:''});   
        } else {
            // render to views/Resume/index.ejs
            res.render('Resume',{data:rows});
        }
    });
});

// display add Resume page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('Resume/add', {
        date: '',
        employer: ''   ,
        position:  ''   ,
        description: '' 
    })
})

// add a new resume item
router.post('/add', function(req, res, next) {    

    let date = req.body.date;
    let employer = req.body.employer;
    let position = req.body.position;
    let description = req.body.description;
    let errors = false;

    if(description.length === 0 || description.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and description");
        // render to add.ejs with flash message
        res.render('Resume/add', {
            date: date,
            employer: employer,
            position: position,
            description: description

        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            date: date,
            employer: employer,
            position: position,
            description: description
        }
        
        // insert query
        dbConn.query('INSERT INTO resume SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('Resume/add', {
                    date: form_data.date,
                    employer: form_data.employer ,
                    position: form_data.position ,
                    description: form_data.description                   
                })
            } else {                
                req.flash('success', 'resume item successfully added');
                res.redirect('/resume');
            }
        })
    }
})

// display edit resume  page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM resume WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'resume item not found with id = ' + id)
            res.redirect('/resume')
        }
        // if resume item found
        else {
            // render to edit.ejs
            res.render('Resume/edit', {
                title: 'Edit Resume Item', 
                id: rows[0].id,
                date: rows[0].date,
                employer: rows[0].employer,
                position: rows[0].position,
                description: rows[0].description
            })
        }
    })
})

// update Portfolio data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let date = req.body.date;
    let employer = req.body.employer;
    let position = req.body.position;
    let description = req.body.description;
    let errors = false;

    if(date.length === 0 || employer.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter date and employer information");
        // render to add.ejs with flash message
        res.render('Resume/edit', {
            id: req.params.id,
            date: date,
            employer: employer,
            position: position,
            description: description
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            date: date,
            employer: employer,
            position: position,
            description: description
        }
        // update query
        dbConn.query('UPDATE resume SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('Resume/edit', {
                    id: req.params.id,
                    date: form_data.date,
                    employer: form_data.employer,
                    position: form_data.position,
                    description: form_data.description
                })
            } else {
                req.flash('success', 'resume item successfully updated');
                res.redirect('/resume');
            }
        })
    }
})
   
// delete resume item
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM resume WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/resume')
        } else {
            // set flash message
            req.flash('success', 'resume item successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/resume')
        }
    })
})

module.exports = router;