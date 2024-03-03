const sql = require('../config/db');

//constructor
const CoBranch = function (coBranch) {
	this.id = coBranch.id;
	this.name = coBranch.name;
	this.tel = coBranch.tel;
};
CoBranch.getAll = (result) => {
	sql.query('SELECT * FROM coBranchs;', (err, res) => {
		if (err) {
			console.log('error: ', err);
			result(err, null);
			return;
		}
		console.log('coBranchs: ', res);
		result(null, res);
	});
};

module.exports = CoBranch;
