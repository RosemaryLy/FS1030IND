var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'nodeclient',
	password:'123456',
	database:'FS1030PROJECT'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;