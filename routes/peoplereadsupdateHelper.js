var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');




var userupdate = function(user, callback ){
	Usermodel.update({_id: user._id},
		{ $set: {mybooksreadstatus: user.mybooksreadstatus}},
		function(err, raw){
			if (err){
				return callback(err);
			}
			console.log("peoplereadsupdate success:"+JSON.stringify(raw))
			callback(null,0);
		});
};

var peoplereadsupdate = function(chapter, userid, bookid, callback){
	
	var readchapter = chapter;
	Usermodel.findOne( { _id: userid },
	
		function(err,user){
			if (err){
				return callback(err);
			}
			
			var found = -1;
			//
			for (var i=0;i<user.mybooks.length;i++){
				if (user.mybooks[i] == bookid){
					found=i;
					break;
				}
			}
			//
			if (found == -1){ //not in mybooks, no need to update
				//book.peoplereads.push(userid);
				callback(null, -1);
			}
			else{   //update user mybooksreadstatus
				user.mybooksreadstatus[found] = readchapter;
				console.log("after peoplereadsupdate user="+user);
				userupdate(user, callback);
			}
			
		});

};


module.exports = peoplereadsupdate;
