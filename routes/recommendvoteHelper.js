var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');

var bookupdate = function(newdailytickets, bookid, tickets, callback ){
	Bookmodel.update({_id: bookid},
		{ $set: {dailytickets: newdailytickets}, $inc: {alltickets: tickets}},
		function(err, raw){
			if (err){
				return callback(err);
			}
			console.log("recommendvoteupdate success:"+JSON.stringify(raw))
			callback();
		});
};

var bookupdatevote = function( bookid, tickets, callback ){
	Bookmodel.findOne( { _id: bookid },
		function(err,book){
			if (err){
				return callback(err);
			}
			var newdailytickets ;
			if (book.dailytickets.length==0){
				newdailytickets = [{day:new Date(), tickets:tickets}];
			}
			else{
				newdailytickets = book.dailytickets;
				var day = book.dailytickets[book.dailytickets.length-1].day.getDate();
				var today = new Date().getDate();
				if (day == today){					
					newdailytickets[book.dailytickets.length-1].tickets += tickets;
				}
				else{
					newdailytickets.push({day:new Date(), tickets:tickets});
				}
			}
			console.log("newdailytickets="+newdailytickets);
			bookupdate(newdailytickets, bookid, tickets, callback );
		});	
};

var recommendvote = function(userid, bookid, tickets, callback ){
	Usermodel.findOne({_id: userid},
		
		function(err, user){
			if (err){
				return callback(err);
			}
			//console.log("bookupdate success:"+JSON.stringify(raw))
			if (user.tickets >=tickets){
				Usermodel.update({_id: userid},
					{$inc: {tickets: -tickets}},
					function(err, raw){
						if (err){
							return callback(err);
						}
						bookupdatevote(bookid, tickets, callback);
					});
			}
			else{
				callback(-1);
			}
			
		});
};

module.exports = recommendvote;
