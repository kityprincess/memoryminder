const dbconnect = require('./../dbconnect.js')

function getVIP(req, res) {
 	console.log('getting vip');

  	var idVip = req.params.idVip;
  	console.log('retrieving VIP ID: ', idVip);

  	getVipFromDb(idVip, function(error, result) {
      console.log('Back from the getVipFrom ID function with results: ', result);

      if (error || result == null || result.length !=1) {
        res.status(500).json({success: false, data: error});
      } else {
        res.json(result[0]);
      }
  	});
  }
 
function getVipFromDb(idVip, callback) {
	console.log('getVipFromDb called with ID: ', idVip);

	var sql = 'SELECT id, vip_user_id, first_name, middle_name, last_name, dob, wedding_anniv FROM public.vip WHERE id = $1::int';

	var params = [idVip];

	pool.query(sql, params, function(error, result) {
		if (error) {
			console.log('A DB error occured');
			console.log(error);
			callback(error, null);
		}

		console.log('Found DB result: ' + JSON.stringify(result.rows));

		callback(null, result.rows);
	});
}

module.exports = {getVIP:getVIP};