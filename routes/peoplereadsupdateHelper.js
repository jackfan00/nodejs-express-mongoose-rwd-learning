var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');




var bookupdate = function(userid, bookid, callback ){
	Bookmodel.update({_id: bookid},
		{ $push: {peoplereads: userid}},
		function(err, raw){
			if (err){
				return callback(err);
			}
			console.log("peoplereadsupdate success:"+JSON.stringify(raw))
			callback(null,0);
		});
};

var peoplereadsupdate = function(userid, bookid, callback){
	Bookmodel.findOne( { _id: bookid },
		function(err,book){
			if (err){
				return callback(err);
			}
			var found = -1;
			//
			for (var i=0;i<book.peoplereads.length;i++){
				if (book.peoplereads[i] == userid){
					found=i;
					break;
				}
			}
			//
			if (found == -1){				
				book.peoplereads.push(userid);
				bookupdate(userid, bookid, callback);
			}
			else{   //already in
				callback(null, -1);
			}
			
		});

};


module.exports = peoplereadsupdate;
