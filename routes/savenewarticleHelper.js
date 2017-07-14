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

var articleSave = function(chapterbooknumber,chapternumber,chaptername,bookID,wordcount, contentid, callback){
	var newArticle = new Articlemodel();
	newArticle.chapterbooknumber = chapterbooknumber;
	newArticle.chapternumber = chapternumber;
	newArticle.chaptername = chaptername;
	newArticle.bookID = bookID;
	newArticle.contentID = contentid;
	newArticle.wordcount = wordcount;
	newArticle.mode = "writing";
	newArticle.save(function (err, article) {
		if (err){
			return callback(err);
		}
		console.log("articleSave success:"+article);
		articleContentupdate(contentid, article.bookID, article._id, callback);
	});

};

var articleContentSave = function(req, callback){
	chapterbooknumber = req.body.booknumber;
	chapternumber = req.body.chapternumber;
	chaptername = req.body.chaptername;
	bookID = req.body.book_id;
	wordcount = req.body.content.replace(/\s/g, "").length;
//
	var newArticleContent = new ArticleContentmodel();
	newArticleContent.content = req.body.content;
	newArticleContent.save( function(err,arcont){
		if (err){
			return callback(err);
		}
		console.log("articleContentSave success");
		articleSave(chapterbooknumber,chapternumber,chaptername,bookID,wordcount, arcont._id, callback);
	});

};

module.exports = articleContentSave;
