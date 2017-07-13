var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');


var allbooksnum = function(req, allclicks_books, alltickets_books, newbooks_books, newupdate_books, collect_books, callback){
	Bookmodel.find()
	.populate('authorID')
	.exec(function(err, all_books){
		if (err){
			console.log("collectranking err="+err);
			return callback(err);
		}
		var sliced_allbooksnum= 0;
		for (var i=0;i<all_books.length;i++){
			if (all_books[i].authorID){
				sliced_allbooksnum++;
			}
		}

		callback(null, allclicks_books, alltickets_books, newbooks_books, newupdate_books, collect_books,sliced_allbooksnum );
		
	});
};	


var collectranking = function(req, allclicks_books, alltickets_books, newbooks_books, newupdate_books, callback){
	Bookmodel.find()
	.limit(20)
	.sort('-collectusers')
	.populate('authorID') //, ['penname'], { mode: 'published'})
	.exec(function(err, collect_books){
		if (err){
			console.log("collectranking err="+err);
			return callback(err);
		}
		var sliced_collect_books= [];
		for (var i=0;i<collect_books.length;i++){
			if (collect_books[i].authorID){
				sliced_collect_books.push(collect_books[i]);
				console.log("collect push "+i);
				if (sliced_collect_books.length>4){
					break;
				}
			}
		}

		allbooksnum(req, allclicks_books, alltickets_books, newbooks_books, newupdate_books, sliced_collect_books, callback );
		
	});
};	


var newupdateranking = function(req, allclicks_books, alltickets_books, newbooks_books, callback){
	Bookmodel.find()
	.limit(20)
	.sort('-publishedupdate_at')
	.populate('authorID') //, ['penname'], { mode: 'published'})
	.exec(function(err, newupdate_books){
		if (err){
			console.log("newupdateranking err="+err);
			return callback(err);
		}
		var sliced_newupdate_books= [];
		for (var i=0;i<newupdate_books.length;i++){
			if (newupdate_books[i].authorID){
				sliced_newupdate_books.push(newupdate_books[i]);
				console.log("newupdate push "+i);
				if (sliced_newupdate_books.length>4){
					break;
				}
			}
		}

		collectranking(req, allclicks_books, alltickets_books, newbooks_books, sliced_newupdate_books, callback );
		
	});
};	


var newbooksranking = function(req, allclicks_books, alltickets_books, callback){
	Bookmodel.find()
	.limit(20)
	.sort('-create_at')
	.populate('authorID') //, ['penname'], { mode: 'published'})
	.exec(function(err, newbooks_books){
		if (err){
			console.log("newbooksranking err="+err);
			return callback(err);
		}
		var sliced_newbooks_books= [];
		for (var i=0;i<newbooks_books.length;i++){
			if (newbooks_books[i].authorID){
				sliced_newbooks_books.push(newbooks_books[i]);
				console.log("newbook push "+i);
				if (sliced_newbooks_books.length>4){
					break;
				}
			}
		}

		newupdateranking(req, allclicks_books, alltickets_books, sliced_newbooks_books, callback);
		
	});
};	


var ticketsranking = function(req, allclicks_books, callback){
	Bookmodel.find()
	.limit(20)
	.sort('-alltickets')
	.populate('authorID') //, ['penname'], { mode: 'published'})
	.exec(function(err, alltickets_books){
		if (err){
			console.log("ticketsranking err="+err);
			return callback(err);
		}
		var sliced_alltickets_books= [];
		for (var i=0;i<alltickets_books.length;i++){
			if (alltickets_books[i].authorID){
				sliced_alltickets_books.push(alltickets_books[i]);
				console.log("ticket push "+i);
				if (sliced_alltickets_books.length>4){
					break;
				}
			}
		}

		newbooksranking(req, allclicks_books, sliced_alltickets_books, callback);
		
	});
};	

var clicksranking = function(req, callback){
	Bookmodel.find()	
	.limit(20)
	.sort('-allclicks')
	.populate('authorID') //, ['penname'], { mode: 'published'})
	.exec(function(err, allclicks_books){
		if (err){
			console.log("clicksranking err="+err);
			return callback(err);
		}
		console.log("allclicks_books:"+allclicks_books.length);
		var sliced_allclicks_books= [];
		for (var i=0;i<allclicks_books.length;i++){
			if (allclicks_books[i].authorID){
				sliced_allclicks_books.push(allclicks_books[i]);
				console.log("clicks push "+i);
				if (sliced_allclicks_books.length>4){
					break;
				}
			}
		}
		console.log("after slice::allclicks_books:"+sliced_allclicks_books.length);
		ticketsranking(req, sliced_allclicks_books, callback);
		
	});
};	
	
module.exports = clicksranking;
	