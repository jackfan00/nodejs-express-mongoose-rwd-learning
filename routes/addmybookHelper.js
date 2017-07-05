var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');

var updatebook = function(bookid, callback ){
	Bookmodel.update({_id: bookid},
		{ $inc: {collectusers: 1}},
		function(err,raw){
			if (err){
				return callback(err);
			}
			console.log("updatebook:"+JSON.stringify(raw));
			callback(null,0);
		});
};

var addmybook = function(userid, bookid, callback ){
	Usermodel.findOne({_id: userid},
		function(err, user){
			if (err){
				return callback(err);
			}
			console.log("before user:"+user);
			var found=false;
			for (var i=0;i<user.mybooks.length;i++){
				if (bookid == user.mybooks[i]){
					found=true;
					break;
				}
			}
			if (found){
				callback(null, -1);
			}
			else if (user.mybooks.length>30){
				callback(null, -2);
			}
			else{
				Usermodel.update({_id: userid},
					{$push: {mybooks: bookid}},
					function(err, raw){
						if (err){
							return callback(err);
						}
						console.log("after user:"+JSON.stringify(raw));
						updatebook(bookid, callback);
					});
			}
			
		});
};




module.exports = addmybook;