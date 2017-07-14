var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');


var delmybook = function(req, callback ){

	var bookid = req.params.bookid;
	Usermodel.findOne({_id: req.session.user._id},
		function(err, user){
			if (err){
				return callback(err);
			}
			console.log("delmybook user:"+user);
			var newmybooks=[], newmybooksreadstatus=[];
			for (var i=0; i<user.mybooks.length; i++){
				if (user.mybooks[i] != bookid){
					newmybooks.push(user.mybooks[i]);
					newmybooksreadstatus.push(user.mybooksreadstatus[i]);
				}
			}
			Usermodel.update({_id: req.session.user._id},
				{ $set: {mybooks: newmybooks, mybooksreadstatus: newmybooksreadstatus}},
				function(err, raw){
					if (err){
						return callback(err);
					}
					console.log("delmybook status:"+JSON.stringify(raw));
					callback(null);
				});

		});
};




module.exports = delmybook;