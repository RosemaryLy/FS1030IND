const fs = require('fs');

module.exports = {
    addPlayerPage: (req, res) => {
        res.render('addPortfolio.ejs', {
            title: "Add a portfolio"
            ,message: ''
        });
    },
    addPlayer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let title = req.body.title;
        let link = req.body.link;
        let description = req.body.description;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let titleQuery = "SELECT * FROM `Portfolio` WHERE title = '" + title + "'";

        db.query(titleQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Title already exists';
                res.render('addPortfolio.ejs', {
                    message,
                    title: "Let's add a portoflio"
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
                        let query = "INSERT INTO `Portfolio` (title, description, link,) VALUES ('" +
                            title + "', '" + description + "', '" + link + "', '"  + "', '" + image_name + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('addPortfolio.ejs', {
                        message,
                        title: "Let's add a Portfolio"
                    });
                }
            }
        });
    },
    editPortfolioPage: (req, res) => {
        let portfolioId = req.params.id;
        let query = "SELECT * FROM `Portfolio` WHERE id = '" + portfolioId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('editPortfolio.ejs', {
                title: "Edit  Player"
                ,player: result[0]
                ,message: ''
            });
        });
    },
    editPortfolio: (req, res) => {
        let portfolioId = req.params.id;
        let title = req.body.title;
        let description = req.body.description;
        let link = req.body.link;
       

        let query = "UPDATE `Portfolio` SET `title` = '" + title + "', `description` = '" + description + "', `link` = '" + link + "' WHERE `portfolio`.`id` = '" + portfolioId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePlayer: (req, res) => {
        let portfolioId = req.params.id;
        let getImageQuery = 'SELECT image from `Portfolio` WHERE id = "' + portfolioId + '"';
        let deletetitleQuery = 'DELETE FROM Portfolio WHERE id = "' + portfolioId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deletetitleQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};