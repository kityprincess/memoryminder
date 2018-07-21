const dbconnect = require('./../dbconnect.js')
const crypt = require('bcrypt');

function getVip(req, res) {
 	console.log('getting vip: ' , req);

  	var userId = req.params.userId;
	console.log('retrieving VIPs for user: ', userId);

  	getVipFromDb(userId, function(error, result) {
      console.log('Back from getVipFrom');

      if (error || result == null) {
        res.status(500).json({success: false, data: error});
      } else {
		res.render('pages/vip', function(req, res){
			vip: result;
		})
        //res.json(result[0]);
      }
  	});
  }
 
function getVipFromDb(userId, callback) {
	console.log('getVipFromDb called');

	var sql = 'SELECT id, vip_user_id, first_name, middle_name, last_name, dob, wedding_anniv FROM public.vip WHERE vip_user_id = $1::int';

	// var params = [userId];
	var params = [userId];

	dbconnect.any(sql, params)
		.then(function(result){
			console.log('Found DB result: ' + JSON.stringify(result));

			callback(null, result);
		})
		.catch(function(error){
			console.log('A DB error occured');
			console.log(error);
			callback(error, null);
		});
}

function getUser(req, res) {
	console.log('checking user in db: ', req.body.username);

	var username = req.body.username;
	var password = req.body.password

	getUserFromDb(username, function(error, result) {
		console.log('Back from the getUserFromDb function with results: ', result.id);

		if (error || result == null) {
		  res.status(500).json({success: false, data: error});
		} 
		else {
			crypt.compare(password, result.password, function(err, res) {
				if (error) {
					console.log('Bad User name or password');
				} else {
					console.log('succesfully logged in')
				}
			});
		}

		console.log('going to getVip: ' , result.id);

		getVip(result.id, function(error, results) {
			console.log('i still dont want to see this');
		});
		//res.render('pages/vip/' + result.id)
		//res.render('pages/vip')
		// res.render('pages/vip', function(req, res){
		// 	userId: result.id;
		// })
	 });


};

function getUserFromDb(username, callback) {
	console.log('getUserFromDb called with user: ', username);

	var sql = "SELECT id, username, password, first_name, last_name FROM public.vipuser WHERE username = $1";

	var params = [username];

	dbconnect.oneOrNone(sql, params)
		.then(function(result){
			console.log('Found DB result: ' + JSON.stringify(result));

			callback(null, result);
		})
		.catch(function(error){
			console.log('A DB error occured');
			console.log(error);
			callback(error, null);
		});
}

module.exports.getVip = getVip;
module.exports.getUser = getUser;