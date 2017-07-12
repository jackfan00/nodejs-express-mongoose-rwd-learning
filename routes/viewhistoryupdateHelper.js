var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');




var userupdate = function(userid, newviewhistory, callback ){
	console.log("newviewhistory::"+newviewhistory);
	Usermodel.update({_id: userid},
		{ $set: {viewhistory: newviewhistory}},
		function(err, raw){
			if (err){
				return callback(err);
			}
			console.log("viewhistoryupdate success:"+JSON.stringify(raw))
			callback(null,newviewhistory);
		});
};

var viewhistoryupdate = function(userid, bookid, callback){
	Usermodel.findOne( { _id: userid },
		function(err,user){
			if (err){
				return callback(err);
			}
			var found = -1;
			var newviewhistory=[];
			//
			console.log("user.viewhistory:"+user.viewhistory);
			for (var i=0;i<user.viewhistory.length;i++){
				if (user.viewhistory[i] == bookid){
					found=i;
					break;
				}
			}
			//
			if (found == -1){
				var newviewhistory=[];
				if (user.viewhistory.length>=20){ 
					for (var i=1;i<user.viewhistory.length;i++){  //remove oldest one
						newviewhistory.push(user.viewhistory[i]);
					}
					newviewhistory.push(bookid);   //add new one
					userupdate(userid, newviewhistory, callback);
				}
				else{
					user.viewhistory.push(bookid);
					userupdate(userid, user.viewhistory, callback);
				}
				
				
			}
			else{   //move found one to newest
				var newviewhistory=[];
				for (var i=0;i<user.viewhistory.length;i++){
					if (i != found){
						newviewhistory.push(user.viewhistory[i]);
					}
				}
				newviewhistory.push(bookid);   //add new one
				userupdate(userid, newviewhistory, callback);
			}
			
		});

};


module.exports = viewhistoryupdate;
