var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');


var bookupdate = function(newdailyclicks, bookid, callback ){
	Bookmodel.update({_id: bookid},
		{ $set: {dailyclicks: newdailyclicks}, $inc: {allclicks: 1}},
		function(err, raw){
			if (err){
				return callback(err);
			}
			console.log("bookupdate success:"+JSON.stringify(raw))
			callback();
		});
};

var bookupdateclicks = function(bookid, callback){
	Bookmodel.findOne( { _id: bookid },
		function(err,book){
			if (err){
				return callback(err);
			}
			var newdailyclicks ;
			if (book.dailyclicks.length==0){
				newdailyclicks = [{day:new Date(), clicks:1}];
			}
			else{
				newdailyclicks = book.dailyclicks;
				var day = book.dailyclicks[book.dailyclicks.length-1].day.getDate();
				var today = new Date().getDate();
				if (day == today){					
					newdailyclicks[book.dailyclicks.length-1].clicks++;
				}
				else{
					newdailyclicks.push({day:new Date(), clicks:1});
				}
			}
			console.log("newdailyclicks="+newdailyclicks);
			bookupdate(newdailyclicks, bookid, callback );
		});

};


module.exports = bookupdateclicks;
