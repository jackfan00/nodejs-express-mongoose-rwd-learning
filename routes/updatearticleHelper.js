var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');


var articleContentupdate = function(content, contentid, callback){
	ArticleContentmodel.update( {_id: contentid},
		{$set: {content: content}},
		function(err,raw){
			if (err){
				return callback(err);
			}
			console.log("articleContentupdate success"+JSON.stringify(raw));
			callback();
		});

};

var findcontentid = function(content, articleid, callback){
	Articlemodel.findOne({_id: articleid}, function(err, article){
		if (err){
			return callback(err);
		}
		articleContentupdate(content, article.contentID, callback );
	});
};

var articleupdate = function(req, callback){
	var content = req.body.content;
	var editarticle = req.body.editarticle;
	var chapternumber = req.body.chapternumber;
	var chaptername = req.body.chaptername;
	var booknumber = req.body.booknumber;
	var wordcount = req.body.content.replace(/\s/g, "").length;
	
	Articlemodel.update( { _id: editarticle }, 
		{ $set: { chapternumber: chapternumber, chaptername: chaptername, chapterbooknumber: booknumber,
			//content: req.body.content, 
			create_at: new Date(), wordcount: wordcount}}, 
		function(err,raw){
			if (err){
				return callback(err);
			}
			console.log("articleupdate success"+JSON.stringify(raw));
			findcontentid(content, editarticle, callback );
		});

};


module.exports = articleupdate;
