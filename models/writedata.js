const crypt = require('bcrypt');
const dbconnect = require('./../dbconnect.js');


function newUser(req, res) {
	var user = {
	fname: req.body.fname,
	lname: req.body.lname, 
	hashedPass: "",
	username: req.body.username
	};

 	console.log(req.body);

 	crypt.hash(req.body.password, 10, function(err,hash) {
 		user.hashedPass = hash;
 		newUserToDb(user);
 	});

  	// var idVip = req.params.idVip;
  	// console.log('retrieving VIP ID: ', idVip);

  	// newUserToDb(idVip, function(error, result) {
   //    console.log('Back from the getVipFrom ID function with results: ', result);

   //    if (error || result == null || result.length !=1) {
   //      res.status(500).json({success: false, data: error});
   //    } else {
   //      res.json(result[0]);
   //    }
  	// });
  };


function newUserToDb(user, callback) {
	console.log('send user to db: ', user.hashedPass);

	var sql = 'INSERT INTO vipuser(username, password, first_name, last_name) VALUES ($1,$2,$3,$4)';

	var params = [user.username, user.hashpass, user.fname, user.lname];

	dbconnect.query(sql, params, function(error, result) {
		if (error) {
			console.log('A DB error occured');
			console.log(error);
			callback(error, null);
		}

		console.log('Inserted into DB');

		callback(null, vip.js/1);
	});
}

module.exports = {newUser:newUser};