var express = require('express');
var router = express.Router();
var dbConn  = require('../config/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM portfolios ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('portfolios',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('portfolios',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('portfolios/add', {
        name: '',
        description: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let description = req.body.description;
    let errors = false;

    if(description.length === 0 || description.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('portfolios/add', {
            name: name,
            description: description
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            description: description
        }
        
        // insert query
        dbConn.query('INSERT INTO portfolios SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('portfolios/add', {
                    name: form_data.name,
                    description: form_data.description                   
                })
            } else {                
                req.flash('success', 'Book successfully added');
                res.redirect('/portfolios');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM portfolios WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/portfolios')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('portfolios/edit', {
                title: 'Edit Book', 
                id: rows[0].id,
                name: rows[0].name,
                description: rows[0].description
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let description = req.body.description;
    let errors = false;

    if(name.length === 0 || description.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('portfolios/edit', {
            id: req.params.id,
            name: name,
            description: description
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            description: description
        }
        // update query
        dbConn.query('UPDATE portfolios SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('portfolios/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    description: form_data.description
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/portfolios');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM portfolios WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/portfolios')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/portfolios')
        }
    })
})

module.exports = router;