const express = require('express');
const router = express.Router();

// Load User model

const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

router.post('/login', (req, res, next) => res.render ('dashboard'));

//Portfolio Page

router.get('/portfolio', (req,res) => res.render('portfolio'));
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
  
  module.exports = router;