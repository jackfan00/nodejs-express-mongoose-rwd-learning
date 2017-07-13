var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');


var bookupdate = function(newestchapter, req, callback){
				Bookmodel.update({ _id: req.params.bookid }, 
				{ $set: { publishedupdate_at: new Date(), newestchapter: newestchapter}, $inc: {bookwordcount: req.params.wc}}, 
				function(err, raw){
					if (err){
						return callback(err);
					}
					console.log("publishonearticle:"+req.params.articleid);
					callback(null, newestchapter);
				});

};
var publishone = function(req, callback){
	Articlemodel.findOneAndUpdate({ _id: req.params.articleid }, 
			
			{ $set: { mode: "published"}}, 
			
			function(err, article){
				
				//
				newestchapter_des = "第 "+article.chapternumber+" 章  "+article.chaptername;
				//
				Bookmodel.findOne({ _id: req.params.bookid }, 
				function(err, book){
					if (err){
						return callback(err);
					}
					
					found = -1;
					for (var i=0; i<book.articles.length; i++){
						if (book.articles[i] == req.params.articleid){
							found = i;
							break;
						}
					}
					newestchapter_index = found;
					bookupdate({des:newestchapter_des, index: newestchapter_index}, req, callback);
					
				});
				
				
			});

};


module.exports = publishone;
