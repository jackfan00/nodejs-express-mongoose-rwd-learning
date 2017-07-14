var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');


var bookupdate = function(newestchapter, bookid, articleid, wc, callback){
				Bookmodel.update({ _id: bookid }, 
				{ $set: { publishedupdate_at: new Date(), newestchapter: newestchapter}, $inc: {bookwordcount: wc}}, 
				function(err, raw){
					if (err){
						return callback(err);
					}
					console.log("publishonearticle:"+articleid);
					callback(null, newestchapter);
				});

};
var publishone = function(req, callback){
	var articleid = req.params.articleid;
	var bookid = req.params.bookid;
	var wc = req.params.wc;
	
	Articlemodel.findOneAndUpdate({ _id: articleid }, 
			
			{ $set: { mode: "published"}}, 
			
			function(err, article){
				
				//
				newestchapter_des = "第 "+article.chapternumber+" 章  "+article.chaptername;
				//
				Bookmodel.findOne({ _id: bookid }, 
				function(err, book){
					if (err){
						return callback(err);
					}
					
					found = -1;
					for (var i=0; i<book.articles.length; i++){
						if (book.articles[i] == articleid){
							found = i;
							break;
						}
					}
					newestchapter_index = found;
					bookupdate({des:newestchapter_des, index: newestchapter_index}, bookid, articleid, wc, callback);
					
				});
				
				
			});

};


module.exports = publishone;
