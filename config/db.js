var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'nodeclient',
	password:'123456',
	database:'MyPortfolio'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;