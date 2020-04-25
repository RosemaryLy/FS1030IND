const fs = require('fs');

module.exports = {
    addPortfolioPage: (req, res) => {
        res.render('add-portfolio.ejs', {
            title: "Welcome to Socka | Add a new player"
            ,message: ''
        });
    },
    addPortfolio: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let name = req.body.name;
        let description = req.body.description;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `portfolios` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-portfolio.ejs', {
                    message,
                    title: "Welcome to Socka | Add a new player"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database
                        let query = "INSERT INTO `portfolios` (name, description, image, user_name) VALUES ('" +
                            name + "', '" + description + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-player.ejs', {
                        message,
                        title: "Welcome to Socka | Add a new player"
                    });
                }
            }
        });
    },
    editPortfolioPage: (req, res) => {
        let portfolioId = req.params.id;
        let query = "SELECT * FROM `portfolios` WHERE id = '" + portfolioId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-portfolio.ejs', {
                title: "Edit  Player"
                ,player: result[0]
                ,message: ''
            });
        });
    },
    editPortfolio: (req, res) => {
        let portfolioId = req.params.id;
        let name = req.body.name;
        let description = req.body.description;
        

        let query = "UPDATE `portfolios` SET `name` = '" + name + "', `description` = '" + description + "' " + "' WHERE `portfolio`.`id` = '" + portfolioId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePortfolio: (req, res) => {
        let portfolioId = req.params.id;
        let getImageQuery = 'SELECT image from `portfolios` WHERE id = "' + portfolioId + '"';
        let deleteUserQuery = 'DELETE FROM portfolio WHERE id = "' + portfolioId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};