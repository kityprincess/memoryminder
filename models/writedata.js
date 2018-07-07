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
 		console.log(hash);
 		newUserToDb(user, function(err, results){
			console.log(results);
			console.log(err);
			// need to add the user ID for the logged in user to the session
			// that will then be encoded in the cookie and added to session
			// table can now check to see if they have a user id on their
			// req.session, can assume they're logged in that ID to use
			// to query db - when logging out, delete the cookie

			//when successfully logging in, manually set the session to 
			// logged in user ID (line below) every time the client 
			// access protected information, check the user. If they 
			// have it, they're logged in, move on. If not, not logged in
			//req.session.userId=results.id;
			
			res.render('pages/vip/')
		 });
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

	var sql = 'INSERT INTO vipuser(username, password, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id';

	var params = [user.username, user.hashedPass, user.fname, user.lname];
// google search with node pg to get most recent user id
	dbconnect.query(sql, params, function(error, result) {
		if (error) {
			console.log('A DB error occured');
			console.log(error);
			callback(error, null);
		}

		console.log('Inserted into DB');

		callback(null, results);
	});

function newVIP(req, res) {
	console.log('create new VIP: ' )
	var vip = {
	fname: req.body.fname,
	lname: req.body.lname, 
	hashedPass: "",
	username: req.body.username
	};
};
}

module.exports = {newUser:newUser};