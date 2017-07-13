var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');


var bookupdate = function(newestchapter, req, wc, callback){
				Bookmodel.update({ _id: req.params.bookid }, 
				{ $set: { publishedupdate_at: new Date(), newestchapter: newestchapter}, $inc: {bookwordcount: wc}}, 
				function(err, raw){
					if (err){
						return callback(err);
					}
					console.log("publishallarticle:");
					callback(null, newestchapter);
				});

};
var publishall = function(req, callback){
		Bookmodel
		.findOne({ _id: req.params.bookid })
		.populate('articles')
		.exec( function(err, book){
				if (err){return callback(err);}
				//
				var ops=0, wc=0;
				for (var i=0;i<book.articles.length;i++){
					if (book.articles[i].mode == "writing"){
						ops++;
						wc += book.articles[i].wordcount;
					}
				}

				for (var i=0;i<book.articles.length;i++){
					if (book.articles[i].mode == "writing"){
						bookarticle = book.articles[i];
						Articlemodel.update({ _id: book.articles[i]._id }, 
							{ $set: { mode: "published"}}, 
							function(err1, raw1){
								if (err1){return callback(err1);}
								//
								ops--;
								bookarticle.mode = "published";
								console.log("publishall article:ops="+ops);
								if (ops==0){
									//
									
									found = -1;
									for (var i=0; i<book.articles.length; i++){
										if (book.articles[i].mode == "published"){
											found = i;
										}
									}
									newestchapter_index = found;		
									article	= book.articles[found];
									newestchapter_des = "第 "+article.chapternumber+" 章  "+article.chaptername;
									//
									bookupdate({des:newestchapter_des, index: newestchapter_index}, req, wc, callback);
									
								}
						});
					}
				}
				
		});
				
};


module.exports = publishall;
