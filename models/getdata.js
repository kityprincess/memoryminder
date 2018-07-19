const dbconnect = require('./../dbconnect.js')
const crypt = require('bcrypt');

function getVIP(req, res) {
 	console.log('getting vip');

  	var idVip = req.params.idVip;
	console.log('retrieving VIP ID: ', idVip);

  	getVipFromDb(idVip, function(error, result) {
      console.log('Back from the getVipFrom');

      if (error || result == null || result.length !=1) {
        res.status(500).json({success: false, data: error});
      } else {
		res.render('pages/vip', function(req, res){
			vip: result[0];
		})
        //res.json(result[0]);
      }
  	});
  }
 
//function getVipFromDb(idVip, callback) {
function getVipFromDb(callback) {	
	console.log('getVipFromDb called');

	var sql = 'SELECT id, vip_user_id, first_name, middle_name, last_name, dob, wedding_anniv FROM public.vip';

	//var params = [idVip];

	//dbconnect.any(sql, params)
	dbconnect.any(sql)
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

		res.render('pages/vip/' + result[0].id);
  
		if (error || result == null || result.length !=1) {
		  res.status(500).json({success: false, data: error});
		} 
		else {
			crypt.compare(password, result[0].password, function(err, res) {
				if (error) {
					console.log('Bad User name or password');
				} else {
				res.render('pages/vip/' + result[0].id)
				}
			});
		}
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

module.exports.getVIP = getVIP;
module.exports.getUser = getUser;