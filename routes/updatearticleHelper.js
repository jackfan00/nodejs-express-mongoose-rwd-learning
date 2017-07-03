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
var articleupdate = function(req, callback){
	Articlemodel.update( { _id: req.body.editarticle }, 
		{ $set: { chapternumber: req.body.chapternumber, chaptername: req.body.chaptername, chapterbooknumber: req.body.booknumber,
			//content: req.body.content, 
			create_at: new Date(), wordcount: req.body.content.replace(/\s/g, "").length}}, 
		function(err,raw){
			if (err){
				return callback(err);
			}
			console.log("articleupdate success"+JSON.stringify(raw));
			articleContentupdate(req.body.content, req.body.editarticle.contentID, callback );
		});

};


module.exports = articleupdate;
