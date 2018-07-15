const crypt = require('bcrypt');
const dbconnect = require('./../dbconnect.js');

function newUser(req, res) {
	var user = {
	fname: req.body.fname,
	lname: req.body.lname, 
	email: req.body.email,
	phone: req.body.phone,
	hashedPass: "",
	username: req.body.username
	};

 	console.log(req.body);

 	crypt.hash(req.body.password, 10, function(err,hash) {
 		user.hashedPass = hash;
 		//console.log(hash);
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
			
			res.render('pages/addvip')
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
	console.log('send user to db');
	
	var vip_user_id;
	var userparams = [user.username, user.hashedPass, user.fname, user.lname];
	//var contactparams = [id, user.phone, user.email];

	var usersql   = 'INSERT INTO vipuser(username, password, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id';
	//var contactsql = 'INSERT INTO contact(vip_user_id, phone, email) VALUES ($1, $2, $3)';

	// allows simpler implementation for multiple db queries
	// https://baudehlo.com/2014/04/28/node-js-multiple-query-transactions/
	dbconnect.tx(t => {
		return t.one(usersql, userparams, x=>+x.id)
			.then(id => {
				var contactparams = [id, user.phone, user.email];
				var contactsql = 'INSERT INTO contact(vip_user_id, phone, email) VALUES ($1, $2, $3)';
				return t.none(contactsql, contactparams)
			});
	})
	.then(data => {
		console.log('saved user to DB: ', data[0].id);
	})
	.catch(error => {
		console.log('Error: ', error);
	});

	// var vip_user_id;
	
	// dbconnect.begin_transaction(userparams, function(error, result) {
	// 	if (error) {
	// 		console.log('A DB error occured');
	// 		console.log(error);
	// 		callback(error, null);
	// 	}
	
		
	// 	var usersql = 'INSERT INTO vipuser(username, password, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id';
	// 	// do this in javascript / node, not PHP
	// 	var vip_user_id = results.id;		

	// 	//can I nest the next sql stmt? If not, need to occur async (after results)
	// 	// dbconnect.query(contactsql, params)
	// 	console.log('Inserted into User Table');

	// 	callback(null, results);
	// });

	// var contactsql = 'INSERT INTO contact(vip_user_id, phone, email) VALUES ($1, $2, $3)';z
	// var contactparams = [vip_user_id, user.phone, user.email];

	// dbconnect.query(contactsql, contactparams, function(error, result) {
	// 	if (error) {
	// 		console.log('A DB error occured');
	// 		console.log(error);
	// 		callback(error, null);
	// 	}

	// 	console.log('Inserted into Contact Table');

	// 	callback(null, results);
	// });
};

function newVIP(req, res) {
	console.log('create new VIP: ' )

	var vip = {
		fname: req.body.row1.fname,
		mname: req.body.row1.mname,
		lname: req.body.row1.lname, 
		dob: req.body.row1.dob,
		wedAnniv: req.body.row1.wedAnniv,
		phone: req.body.row2.phone,
		phoneType: req.body.row2.phoneType,
		email: req.body.row2.email,
		addy1: req.body.row2.dob,
		addy2: req.body.row2.addy2,
		city: req.body.row2.city,
		state: req.body.row2.state,
		zip: req.body.row2.zip,
		country: req.body.row2.country,
		// how do I handle multiple family members?
		// fname[]: req.body.row3.fname[],
		ename: req.body.row4.ename,
		workdAnniv: req.body.row4.workdAnniv,
		title: req.body.row4.title,
		jobDesc: req.body.row4.jobDesc,
		manager: req.body.row4.manager,
		favcolor: req.body.row5.favcolor,
		favsport: req.body.row5.favsport,
		favteam: req.body.row5.favteam,
		favrest: req.body.row5.favrest,
		favmusic: req.body.row5.favmusic,
		favtvshow: req.body.row5.favtvshow,
		pname: req.body.row6.pname,
		ptype: req.body.row6.ptype,
		pdob: req.body.row6.pdob,
		favtreat: req.body.row6.favtreat
		};

	// var vipDetails = {
	// fname: req.body.row1.fname,
	// mname: req.body.row1.mname,
	// lname: req.body.row1.lname, 
	// dob: req.body.row1.dob,
	// wedAnniv: req.body.row1.wedAnniv
	// };
	// var vipContact = {
	// phone: req.body.row2.phone,
	// phoneType: req.body.row2.phoneType,
	// email: req.body.row2.email,
	// addy1: req.body.row2.dob,
	// addy2: req.body.row2.addy2,
	// city: req.body.row2.city,
	// state: req.body.row2.state,
	// zip: req.body.row2.zip,
	// country: req.body.row2.country
	// };
	// var vipFam = {
	// // how do I handle multiple family members?
	// // fname[]: req.body.row3.fname[],
	// };
	// var vipEmp = {
	// ename: req.body.row4.ename,
	// workAnniv: req.body.row4.workAnniv,
	// title: req.body.row4.title,
	// jobDesc: req.body.row4.jobDesc,
	// manager: req.body.row4.manager
	// };
	// var vipFav = {
	// favcolor: req.body.row5.favcolor,
	// favsport: req.body.row5.favsport,
	// favteam: req.body.row5.favteam,
	// favrest: req.body.row5.favrest,
	// favmusic: req.body.row5.favmusic,
	// favtvshow: req.body.row5.favtvshow
	// };
	// var vipPet = {
	// pname: req.body.row6.pname,
	// ptype: req.body.row6.ptype,
	// pdob: req.body.row6.pdob,
	// favtreat: req.body.row6.favtreat
	// };

	console.log(req.body);

	//should these be treated as 1 JSON or individual JSONs?
	newVipToDb(vip, function(err, results){
		console.log(results);
		console.log(err);
		
		res.render('pages/vip')
	 });


	function newVipToDb(user, callback) {
		console.log('send vip to db');
		
		var vipId;
		//need to figure out how to get the user ID of the current user
		var vipUserId;
		var vipDetParams = [vip.fname, vip.mname, vip.lname, vip.dob, vip.wedAnniv];
		var vipContactParams = [vipUserId, vip.phone, vip.phoneType, vip.email, vip.addy1, vip.addy2, vip.city, vip.state, vip.zip, vip.country];
		//var vipFamParams = [vipUserId, user.phone, user.email];
		var vipEmpParams = [vipUserId, vip.ename, vip.workAnniv, vip.title, vip.jobDesc, vip.manager];
		var vipFavParams = [vipUserId, vip.favcolor, vip.favsport, vip.favteam, vip.favrest, vip.favmusic, vip.favtvshow];
		var vipPetParams = [vipUserId, vip.pname, vip.ptype, vip.pdob, vip.favtreat];
	
		var vipDetSql   = 'INSERT INTO vip(vip_user_id, first_name, middle_name, last_name, dob, wedding_anniv) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id';
		var vipContactSql = 'INSERT INTO contact(vip_id, phone, phoneType, email, address1, address2, city, state, zip, country) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)';
		//var vipFamSql = 'INSERT INTO family(vip_id, first_name, middle_name, last_name, relationship, dob) VALUES ($1,)';
		var vipEmpSql = 'INSERT INTO employment(vip_id, employer_name, work_anniv, title, job_desc, manager) VALUES ($1,$2,$3,$4,$5,$6)';
		var vipFavSql = 'INSERT INTO preferences(vip_id, fav_color, fav_sport, fav_team, fav_restuarant, fav_music, fav_tv_show) VALUES ($1,$2,$3,$4,$5,$6,$7)';
		var vipPetSql = 'INSERT INTO pets(vip_id, name, type, dob, fav_treat) VALUES ($1,$2,$3,$4,$5)';
	
		// allows simpler implementation for multiple db queries
		// https://baudehlo.com/2014/04/28/node-js-multiple-query-transactions/
		dbconnect.waterfall([
			function (client, callback) {
				client.query(vipDetSql, vipDetParams, callback);
			},
			function (client, results, callback) {
				vipId = results.rows[0].id;
				client.query(vipContactSql, vipContactParams, callback);
			},
			// function (client, callback) {
			// 	client.query(vipFamSql, vipFamParams, callback);
			// },
			function (client, callback) {
				client.query(vipEmpSql, vipEmpParams, callback);
			},
			function (client, callback) {
				client.query(vipFavSql, vipfavParams, callback);
			},
			function (client, callback) {
				client.query(vipPetSql, vipPetParams, callback);
			},
		], callback);
	};
	
	 // function newVipToDb(user, callback) {
	// 	console.log('send user to db: ', user.hashedPass);
	
	// 	//needs to grab the current logged on users ID
	// 	//var vip_user_id;
	// 	var vipDetails = 'INSERT INTO vipuser(username, password, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id';
		
	// 	var params = [user.username, user.hashedPass, user.fname, user.lname, user.phone, user.email, vip_user_id];
	// 	dbconnect.query(usersql, userparams, function(error, result) {
	// 		if (error) {
	// 			console.log('A DB error occured');
	// 			console.log(error);
	// 			callback(error, null);
	// 		}
	
	// 		// do this in javascript / node, not PHP
	// 		var vip_user_id = results.id;		
	
	// 		//can I nest the next sql stmt? If not, need to occur async (after results)
	// 		// dbconnect.query(contactsql, params)
	// 		console.log('Inserted into User Table');
	
	// 		callback(null, results);
	// 	});
	
	// };
}

module.exports.newUser = newUser;