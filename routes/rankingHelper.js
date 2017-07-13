var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');

var collectranking = function(req, callback){
	Bookmodel.find()
	.limit(200)
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
				if (sliced_collect_books.length>99){
					break;
				}
			}
		}

		callback(null, sliced_collect_books );
		
	});
};	


var newupdateranking = function(req,  callback){
	Bookmodel.find()
	.limit(200)
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
				if (sliced_newupdate_books.length>99){
					break;
				}
			}
		}

		callback(null, sliced_newupdate_books  );
		
	});
};	


var newbooksranking = function(req,  callback){
	Bookmodel.find()
	.limit(200)
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
				if (sliced_newbooks_books.length>99){
					break;
				}
			}
		}

		callback(null,  sliced_newbooks_books);
		
	});
};	


var ticketsranking = function(req, callback){
	Bookmodel.find()
	.limit(200)
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
				if (sliced_alltickets_books.length>99){
					break;
				}
			}
		}

		callback(null, sliced_alltickets_books);
		
	});
};	

var clicksranking = function(req, callback){
	Bookmodel.find()	
	.limit(200)
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
				if (sliced_allclicks_books.length>99){
					break;
				}
			}
		}
		console.log("after slice::allclicks_books:"+sliced_allclicks_books.length);
		callback(null, sliced_allclicks_books);
		
	});
};	

var rank = function(req, callback){
	if (req.params.rank==0){
		clicksranking(req, callback);
	}
	else if (req.params.rank==1){
		ticketsranking(req, callback);
	}
	else if (req.params.rank==2){
		collectranking(req, callback);
	}
	else if (req.params.rank==3){
		newbooksranking(req, callback);
	}
	else if (req.params.rank==4){
		newupdateranking(req, callback);
	}

};	
module.exports = rank;
	