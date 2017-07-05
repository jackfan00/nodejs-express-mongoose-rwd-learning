var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');

var collectranking = function(req, allclicks_books, alltickets_books, newbooks_books, newupdate_books, callback){
	Bookmodel.find()
	.limit(5)
	.sort('-collectusers')
	.populate('authorID') //, ['penname'], { mode: 'published'})
	.exec(function(err, collect_books){
		if (err){
			console.log("collectranking err="+err);
			return callback(err);
		}
		callback(null, allclicks_books, alltickets_books, newbooks_books, newupdate_books, collect_books );
		
	});
};	


var newupdateranking = function(req, allclicks_books, alltickets_books, newbooks_books, callback){
	Bookmodel.find()
	.limit(5)
	.sort('-publishedupdate_at')
	.populate('authorID') //, ['penname'], { mode: 'published'})
	.exec(function(err, newupdate_books){
		if (err){
			console.log("newupdateranking err="+err);
			return callback(err);
		}
		collectranking(req, allclicks_books, alltickets_books, newbooks_books, newupdate_books, callback );
		
	});
};	


var newbooksranking = function(req, allclicks_books, alltickets_books, callback){
	Bookmodel.find()
	.limit(5)
	.sort('-create_at')
	.populate('authorID') //, ['penname'], { mode: 'published'})
	.exec(function(err, newbooks_books){
		if (err){
			console.log("newbooksranking err="+err);
			return callback(err);
		}
		newupdateranking(req, allclicks_books, alltickets_books, newbooks_books, callback);
		
	});
};	


var ticketsranking = function(req, allclicks_books, callback){
	Bookmodel.find()
	.limit(5)
	.sort('-alltickets')
	.populate('authorID') //, ['penname'], { mode: 'published'})
	.exec(function(err, alltickets_books){
		if (err){
			console.log("ticketsranking err="+err);
			return callback(err);
		}
		newbooksranking(req, allclicks_books, alltickets_books, callback);
		
	});
};	

var clicksranking = function(req, callback){
	Bookmodel.find()	
	.limit(5)
	.sort('-allclicks')
	.populate('authorID') //, ['penname'], { mode: 'published'})
	.exec(function(err, allclicks_books){
		if (err){
			console.log("clicksranking err="+err);
			return callback(err);
		}
		ticketsranking(req, allclicks_books, callback);
		
	});
};	
	
module.exports = clicksranking;
	