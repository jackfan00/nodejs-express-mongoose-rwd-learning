var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');


var searchbook = function(req, callback ){
	var pattern = req.body.searchkeyword;
	console.log("pattern:"+pattern);
	Bookmodel.find({ $or: [{name: { $regex: pattern }}, {authorname: {$regex: pattern}}, {des: {$regex: pattern}}]},
		function(err, books){
			if (err){
				return callback(err);
			}
			console.log("searchbook :"+books);
			callback(null, books);

		});
};




module.exports = searchbook;