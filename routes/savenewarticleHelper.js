var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');


var bookupdate = function(bookid,  articleid, callback){
	Bookmodel.update( {_id: bookid},
		{ $push: { articles: articleid}}, 
		function(err,raw){
			if (err){
				return callback(err);
			}
			console.log("bookupdate success:"+JSON.stringify(raw));
			callback();
		});

};

var articleContentupdate = function(contentid, bookid, articleid, callback){
	ArticleContentmodel.update( {_id: contentid},
		{$set: {articleID: articleid}},
		function(err,raw){
			if (err){
				return callback(err);
			}
			console.log("articleContentupdate success:"+JSON.stringify(raw)+",contentid="+contentid);
			bookupdate(bookid, articleid, callback);
		});

};

var articleSave = function(req, contentid, callback){
	var newArticle = new Articlemodel();
	newArticle.chapterbooknumber = req.body.booknumber;
	newArticle.chapternumber = req.body.chapternumber;
	newArticle.chaptername = req.body.chaptername;
	newArticle.bookID = req.body.book_id;
	newArticle.contentID = contentid;
	newArticle.wordcount = req.body.content.replace(/\s/g, "").length;
	newArticle.mode = "writing";
	newArticle.save(function (err, article) {
		if (err){
			return callback(err);
		}
		console.log("articleSave success:"+article);
		articleContentupdate(contentid, req.body.book_id, article._id, callback);
	});

};

var articleContentSave = function(req, callback){
	var newArticleContent = new ArticleContentmodel();
	newArticleContent.content = req.body.content;
	newArticleContent.save( function(err,arcont){
		if (err){
			return callback(err);
		}
		console.log("articleContentSave success");
		articleSave(req, arcont._id, callback);
	});

};

module.exports = articleContentSave;
