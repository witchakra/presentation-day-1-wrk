const mysql = require('mysql');

var connection = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'WRK',
});

module.exports = connection;
