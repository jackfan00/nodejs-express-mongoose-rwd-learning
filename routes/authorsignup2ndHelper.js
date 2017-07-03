var bcrypt = require('bcrypt-nodejs');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');

var Usermodelupdate = function(req, userid, authorid, callback){
	Usermodel.update({_id: userid},
	{ $set:{author: authorid}},
	function(err,raw){
		if (err){
			return callback(err);
		}
		req.session.user.author = authorid;
		callback();
	});
};


var AuthormodelSave = function(req, callback){
	var newAuthor = new Authormodel();
	newAuthor.penname = req.body.penname;
	newAuthor.password = bcrypt.hashSync(req.body.authorpassword);
	newAuthor.save(function (err, auuser) {
		if (err){
			return callback(err);
		}
		console.log("AuthormodelSave success");
		Usermodelupdate(req, req.body.userid, auuser._id, callback);
	});

};

module.exports = AuthormodelSave;
