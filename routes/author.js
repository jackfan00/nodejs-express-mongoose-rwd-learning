var express = require('express');
var router = express.Router();
var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var ArticleContentmodel = require('../models/articlecontent.js');

var updatearticleHelper = require('./updatearticleHelper.js');
var savenewarticleHelper = require('./savenewarticleHelper.js');
var authorsignup2ndHelper = require('./authorsignup2ndHelper.js');
var publishoneHelper = require('./publishoneHelper.js');
var publishallHelper = require('./publishallHelper.js');

var bcrypt = require('bcrypt-nodejs');
var cats=["玄幻","奇幻","武俠","仙俠","都市","歷史","科幻","靈異","遊戲","運動","女生網"];

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.authoruser){
		console.log("author user:"+JSON.stringify(req.session.authoruser));
		Bookmodel
		.find({ authorID: req.session.authoruser._id })
		.populate('articles', null, { mode: 'published'})
		.exec(function(err, books){
			if (err){
				console.log("book findOne err");
				//res.send(err);
				res.render('forauthor/index', {user: req.session.user, authoruser:req.session.authoruser, wordcount: 0, authorlogined: true});
			}
			else if (books){
				console.log("author find books:"+books);
				var wordcount =0;
				for (var i=0; i < books.length; i++){
					for (var j=0; j < books[i].articles.length; j++) {
						wordcount += books[i].articles[j].wordcount ? books[i].articles[j].wordcount : 0;
					}
				}
				res.render('forauthor/index', {user: req.session.user, authoruser:req.session.authoruser, wordcount: wordcount, authorlogined: true});
			}
			else{
				console.log(req.session.authoruser.penname+" 沒有寫書");
				res.render('forauthor/index', {user: req.session.user, authoruser:req.session.authoruser, wordcount: 0, authorlogined: true});
			}
		});
		
	}
	else if (req.session.user){
		if (req.session.user.author){
			res.redirect('/author/authorsignin2nd');
		}
		else{
			res.redirect('/author/authorsignup2nd');
		}
	}
	else {
		console.log("debug kkkkkkkk");
		res.render('forauthor/authorsignin');
	}
});

router.get('/signout', function(req, res, next) {
	req.session.user = null;
	req.session.authoruser = null;
	res.redirect('/');
});

router.get('/authorsignin', function(req, res, next) {
	res.render('forauthor/authorsignin');
});

router.get('/authorsignup', function(req, res, next) {
	res.render('forauthor/authorsignup');
});

router.get('/authorsignin2nd', function(req, res, next) {
	res.render('forauthor/authorsignin2nd');
});

router.get('/authorsignup2nd', function(req, res, next) {
	res.render('forauthor/authorsignup2nd', {userid: req.session.user._id});
});

router.get('/authorprofile', function(req, res, next) {
});

router.get('/bookmanager', function(req, res, next) {
	if (req.session.authoruser){
		Bookmodel.find({ authorID: req.session.authoruser._id })
		.populate('articles')
		.exec(function(err, books){
			if (err){
				console.log("book findOne err");
				res.send(err);
			}
			else if (books){
				console.log("find books:"+books);
				//
				var newestchapters=[];
				for (var i=0;i<books.length;i++){
					var newestc=-1;
					for (var j=0;j<books[i].articles.length;j++){
						if (books[i].articles[j].mode=="published"){
							newestc = j;
						}
					}
					newestchapters.push(newestc);
				}
				console.log("find newestchapters:"+newestchapters);
				//
				res.render('forauthor/bookmanager', {newestchapters: newestchapters, user: req.session.user, cats: cats, books: books, authorlogined: true});				
			}
			else{
				console.log(req.session.user.author.penname+" 沒有寫書");
				res.render('forauthor/bookmamanger',{user: req.session.user, authorlogined: true});
			}
		});
		
	}
	else if (req.session.user){
		res.redirect('/author');
	}
	else {
		res.redirect('/');
	}	
});

router.get('/createnewbook', function(req, res, next) {
	res.render('forauthor/createnewbook', {user: req.session.user, authorlogined: true, cats: cats});
});

router.get('/editbook/:bookid', function(req, res, next) {
	var wordcount = 0;
	if (req.session.authoruser){
		Bookmodel.findOne({ _id: req.params.bookid })
		.populate('articles', null, { mode: 'published'})
		.exec( function(err, book){
			if (err){
				console.log("edit book findOne err:"+err+", book:"+book);
				res.render('forauthor/article', { user: req.session.user, book: book, cats: cats, wordcount: 0, mode: "bookinfo" });
			}
			else if (book){
				
				for (var i=0; i<book.articles.length; i++){
					wordcount += book.articles[i].wordcount;
				}
				console.log("edit book:"+book+",wordcount="+wordcount);
				deswords = book.des.replace(/\s/g, "").length;
//				res.render('books/editbook', { user: req.session.user, book: book, cats: cats, wordcount: wordcount, mode: "bookinfo" });			
				res.render('forauthor/articleAll', { authorlogined: true, user: req.session.user, book: book, deswords: deswords, cats: cats, wc: wordcount, mode: "bookinfo" });			
			}
			else{
				console.log("編輯書籍時書碼錯誤");
				res.redirect('/author');
			}
			
		});
		
	}
	else {
		res.redirect('/author');
	}
});

router.get('/deletebook/:bookid', function(req, res, next) {
	if (req.session.authoruser){
		Bookmodel.deleteOne({ _id: req.params.bookid }, function (err) {
			if (err){
				console.log("delete book err");
				res.send(err);
			}
			else {
				console.log("delete book success");
				res.redirect('/author/bookmanager');				
			}
			
		});
	}
	else if (req.session.user){
		res.redirect('/author');
	}
	else {
		res.redirect('/');
	}	
});

router.get('/article/:mode/:bookid/:articleid', function(req, res, next) {
	if (req.session.authoruser){
		Bookmodel
		.findOne({ _id: req.params.bookid })
		.populate('articles')
		.exec( function(err, book){
			if (err){
				console.log("edit book findOne err");
				res.send(err);
			}
			else if (book){
				console.log("articleid :"+req.params.articleid);
				
				if (req.params.articleid && req.params.articleid.length>6){
					Articlemodel
					.findOne({ _id: req.params.articleid })
					.populate('contentID')
					.exec(function(err, article){
						res.render('forauthor/articleAll', {authorlogined: true, article: article, content: article.contentID.content, user: req.session.user, book: book, mode: req.params.mode });
						
					});
				}
				else{
					res.render('forauthor/articleAll', {authorlogined: true, user: req.session.user, book: book, mode: req.params.mode });
					
				}
				
			}
			else{
				console.log("編輯草稿時書碼錯誤");
				res.redirect('/author');
			}
			
		});
		
	}
	else {
		res.redirect('/author');
	}
});

router.get('/publishedarticle/:bookid/:articleid', function(req, res, next) {
	if (req.session.authoruser){
		Bookmodel.findOne({ _id: req.params.bookid }, function(err, book){
			if (err){
				console.log("edit book findOne err");
				res.send(err);
			}
			else if (book){
				console.log("publishedarticle book:"+book);
				res.render('forauthor/articleAll', {authorlogined: true, article: req.session.article, user: req.session.user, book: book, mode: "published" });
			}
			else{
				console.log("檢視發布文章時書碼錯誤");
				res.redirect('/author');
			}
			
		});
		
	}
	else {
		res.redirect('/author');
	}	
});

router.get('/deletedarticle/:bookid/:articleid', function(req, res, next) {
	if (req.session.authoruser){
		Bookmodel.findOne({ _id: req.params.bookid }, function(err, book){
			if (err){
				console.log("edit book findOne err");
				res.send(err);
			}
			else if (book){
				console.log("deletedarticle book:"+book);
				res.render('forauthor/articleAll', {authorlogined: true, article: req.session.article, user: req.session.user, book: book, mode: "deleted" });
			}
			else{
				console.log("檢視回收桶時書碼錯誤");
				res.redirect('/author');
			}
			
		});
		
	}
	else {
		res.redirect('/author');
	}		
});

router.get('/editarticle/:mode/:articleID', function(req, res, next) {
	if (req.session.authoruser){
		Articlemodel.findOne({ _id: req.params.articleID })
		//.populate('bookID')
		.exec( function(err, article){
			if (err){
				console.log("edit article findOne err");
				res.send(err);
			}
			else if (article){
				console.log("article book:"+article.bookID);
				//req.session.article = req.params.articleID;
				//res.render('forauthor/articleAll', {authorlogined: true, article: article, content: article.contentID.content user: req.session.user, book: article.bookID, mode: req.params.mode });		
				res.redirect('/author/article/'+req.params.mode+'/'+article.bookID+'/'+req.params.articleID);
			}

			else{
				console.log("檢視文章時發生錯誤");
				res.redirect('/author');
			}
			
		});
		
	}
	else {
		res.redirect('/author');
	}
});

router.get('/recoverarticle/:articleid/:bookid', function(req, res, next) {
	
	if (req.session.authoruser){
			Articlemodel.update({ _id: req.params.articleid }, 
			
			{ $set: { mode: "writing"}}, 
			
			function(err, raw){
				console.log("deletearticle:"+err);
				res.redirect('/author/article/writing/'+req.params.bookid+'/1');
			});
	}
	else{
		res.redirect('/author');
	}		
});

router.get('/deletearticle/:mode/:articleid/:bookid', function(req, res, next) {
	var mode = req.params.mode == "deleted" ? "deleteddeleted" : "deleted";
	if (req.session.authoruser){
			Articlemodel.update({ _id: req.params.articleid }, 
			
			{ $set: { mode: mode}}, 
			
			function(err, raw){
				console.log("deletearticle:"+err);
				res.redirect('/author/article/deleted/'+req.params.bookid+'/1');
			});
	}
	else{
		res.redirect('/author');
	}		
});

router.get('/publishonearticle/:articleid/:bookid/:wc', function(req, res, next) {
	if (req.session.authoruser){
			publishoneHelper(req, function(err, raw){
				if (err){
					console.log("publishone err");
					res.send(err);
				}
				else{
					console.log("publishonearticle:"+req.params.articleid);
					res.redirect('/author/article/published/'+req.params.bookid+'/1');
				}
			});
	}
	else{
		res.redirect('/author');
	}	
});

router.get('/publishAllarticle/:bookid', function(req, res, next) {
	if (req.session.authoruser){
		publishallHelper(req, function(err, raw){
				if (err){
					console.log("publishall err");
					res.send(err);
				}
				else{
					console.log("publishallarticle:"+req.params.bookid);
					res.redirect('/author/article/published/'+req.params.bookid+'/1');
				}
			});
		/*
		Bookmodel
		.findOne({ _id: req.params.bookid })
		.populate('articles')
		.exec( function(err, book){
				var ops=0, wc=0;
				for (var i=0;i<book.articles.length;i++){
					if (book.articles[i].mode == "writing"){
						ops++;
						wc += book.articles[i].wordcount;
					}
				}

				for (var i=0;i<book.articles.length;i++){
					if (book.articles[i].mode == "writing"){
						Articlemodel.update({ _id: book.articles[i]._id }, 
							{ $set: { mode: "published"}}, 
							function(err1, raw1){
								ops--;
								console.log("publish article:ops="+ops);
								if (ops==0){
									//
									Bookmodel.update({ _id: req.params.bookid }, 
									{ $set: { publishedupdate_at: new Date(), newestchapter: newestchapter}, $inc: {bookwordcount: wc}}, 
									function(err2, raw2){
										console.log("publishAllarticle:"+err2);
										res.redirect('/author/article/published/'+req.params.bookid+'/1');
									});
								
									
								}
						});
					}
				}
				
		});*/
	}
	else{
		res.redirect('/author');
	}		
});

router.get('/authorsignout', function(req, res, next) {
	//req.session.authorlogined=null;
	req.session.authoruser=null;
	res.redirect('/');
});

//post
router.post('/authorsignup', function(req, res, next)
{
	var callback_count=0;
	
	var saveuser = function(){
		var newAuthor = new Authormodel();
		newAuthor.penname = req.body.penname;
		newAuthor.password = bcrypt.hashSync(req.body.authorpassword);
		newAuthor.save(function (err, auuser) {
			if (err) {
				console.log("new auuser save err");
				throw err;
			}
			else if (auuser){
				console.log("author saved");
				var newUser = new Usermodel();
				newUser.username = req.body.username;
				newUser.displayname = req.body.displayname;
				newUser.password = bcrypt.hashSync(req.body.password);
				newUser.email = req.body.email;
				newUser.birth_year = req.body.birth_year;
				newUser.birth_mon = req.body.birth_mon;
				newUser.birth_day = req.body.birth_day;
				newUser.gender = req.body.gender;
				newUser.author = auuser;
				newUser.save(function (err, user) {
					if (err) {
						console.log("new user save err");
						throw err;
					}
					else {
						console.log("user saved");
						res.redirect('/author');
					}
				});
			}	
		});		
	};
	var f1_callback = function(err, obj){
		if (err){
			res.send(err);
		}
		else if (obj) {
			res.render('forauthor/authorsignup', {message: obj.username+" 已經被使用", formbody: req.body});
		}
		else {
			console.log("f1callback_count="+callback_count);
			callback_count++;
			if (callback_count==3){
				saveuser();
			}
		}
	};
	var f2_callback = function(err, obj){
		if (err){
			res.send(err);
		}
		else if (obj) {
			res.render('forauthor/authorsignup', {message: obj.email+" 已經被使用", formbody: req.body});
		}
		else {
			console.log("f2callback_count="+callback_count);
			callback_count++;
			if (callback_count==3){
				saveuser();
			}
		}
	};
	var f3_callback = function(err, obj){
		if (err){
			res.send(err);
		}
		else if (obj) {
			res.render('forauthor/authorsignup', {message: obj.penname+" 已經被使用", formbody: req.body});
		}
		else {
			console.log("f3callback_count="+callback_count);
			callback_count++;
			if (callback_count==3){
				saveuser();
			}
		}
	};

//	
	if (req.body.password !== req.body.confirm_password || req.body.authorpassword !== req.body.confirm_authorpassword){
		res.render('forauthor/authorsignup', {message: "密碼確認不相符", formbody: req.body});
	}
	else{
		
		Usermodel.findOne({ username: req.body.username}).exec(f1_callback);
		Usermodel.findOne({ email: req.body.email}).exec(f2_callback);
		Authormodel.findOne({ penname: req.body.penname}).exec(f3_callback);

	}
	//res.send(req.body);
});

router.post('/authorsignin', function(req, res, next) {
	Usermodel.findOne({ username: req.body.username}, 
		function(err, user){
			console.log("login user:"+user);
			if (err){
				console.log("signin findOne err");
				res.send(err);
			}
			else if (user){
				try {
					
					if (bcrypt.compareSync(req.body.password, user.password)){
						req.session.user = user;
						//
						
						res.redirect('/author');
						
					}
					else {
						console.log("密碼錯誤:"+user);
						res.render('forauthor/authorsignin', {message: "登入失敗", formbody: req.body});
					}
					
				}catch (err) {
					console.log("bcrypt錯誤:"+err);
					res.render('forauthor/authorsignin', {message: "bcrypt錯誤"+err, formbody: req.body});
				}
				 
			}
			else{
				console.log("找不到使用者 "+req.body.username);
				res.render('forauthor/authorsignin', {message: "登入失敗", formbody: req.body});
			}

	});
});


router.post('/authorsignup2nd', function(req, res, next){
	if (req.body.password !== req.body.confirm_password){
		console.log("authorsignup:密碼確認不相符");
		res.render('forauthor/index', {user: req.session.user, message: "密碼確認不相符", formbody: req.body});
	}
	else{
		authorsignup2ndHelper(req, function(err){
			if (err){
				res.send(err);
			}
			else{
				res.redirect('/author');
			}
		});

	}
});


router.post('/authorsignin2nd', function(req, res, next) {
	
	Usermodel
		.findOne({ _id: req.session.user._id })
		.populate('author')
		.exec(
			function(err, user){
				if (err){
					console.log("authorsignin findOne err");
					res.send(err);
				}
				else if (user){
					try {
						if (bcrypt.compareSync(req.body.password, user.author.password)){
							//req.session.authorlogined = true;
							req.session.authoruser = user.author;
							res.redirect('/author');
							//res.render('forauthor/index', {user: req.session.user, authorlogined: req.session.authorlogined});
							console.log("authorsignin success:"+user.author);
						}
						else{
							res.render('forauthor/authorsignin2nd', {user: req.session.user, message: "密碼錯誤", formbody: req.body});
						}
					}catch (err) {
						console.log("bcrypt錯誤:"+err);
						res.render('forauthor/authorsignin2nd', {user: req.session.user, message: "bcrypt錯誤"+err, formbody: req.body});
					}
				}
				else{
					console.log("找不到會員id:"+req.session.user._id);
					res.render('forauthor/authorsignin2nd', {user: req.session.user, message: "找不到使用者id", formbody: req.body});
				}
		});
});

router.post('/createnewbook', function(req, res, next) {
	if (req.session.authoruser){

		var newBook = new Bookmodel();
		newBook.name = req.body.name;
		newBook.category = req.body.category;
		newBook.des = req.body.description;
		newBook.authorID = req.session.authoruser._id;
		newBook.authorname = req.session.authoruser.penname;
		//newBook.authorname = req.session.user.penname;
		//newBook.booknumber = randomstring.generate({length: 16, charset: 'numeric'});
		newBook.save(function (err, book) {
			if (err) {
				console.log("new book save err");
				throw err;
			}
			else{
				Authormodel.update({_id: req.session.authoruser._id},
					{$push: {books: book._id}},
					function(err,raw){
						if (err){
							console.log("作者增加書籍-createnewbook-失敗");
							res.send(err);
						}
						else{
							console.log("new book saved:"+book);
							res.redirect('/author/bookmanager');							
						}
					});
					
			}
		});
		
	}
	else{
		res.redirect('/author');
	}
});

router.post('/editbook', function(req, res, next) {
	if (req.session.authoruser){
			Bookmodel.update({ _id: req.body.bookid }, 
			
			{ $set: { category: req.body.category, des: req.body.description, authorname: req.session.authoruser.penname}}, 
			
			function(err, raw){
				if (err){
					console.log("update editbook err");
					res.send(err);
				}
				else if (raw){
					console.log("update editbook response:"+raw);
					res.redirect('/author/bookmanager');				
				}
				else{
					console.log("update editbook err");
					res.redirect('/author/bookmanager');
				}
			});
	}
	else{
		res.redirect('/author');
	}
});

router.post('/savenewarticle/:mode', function(req, res, next) {
	if (req.session.authoruser){	


		if (req.body.editarticle) {  //edit article
		
			updatearticleHelper(req, function(err){
				if (err){
						console.log("updatearticleHelper err");
						res.send(err);
				}
				else{
					res.redirect('/author/article/writing/'+req.body.book_id+"/1");
				}
			});
		
		/*
			Articlemodel.update({ _id: req.body.editarticle }, 

			{ $set: { chapternumber: req.body.chapternumber, chaptername: req.body.chaptername, chapterbooknumber: req.body.booknumber,
			//content: req.body.content, 
			create_at: new Date(), wordcount: req.body.content.replace(/\s/g, "").length}}, 

			function(err, raw){
				if (err){
					console.log("post edit article update err");
					res.send(err);
				}
				else if (raw){
					console.log("article update succeed:");
					
					ArticleContentmodel.update({ _id: req.body.editarticle.contentID }, 
						{$set: {content: req.body.content}}, function(err,raww){
							res.redirect('/author/article/writing/'+req.body.book_id+"/1");
						});
					
					
				}
				else{
					console.log("草稿更新失敗");
					res.redirect('/author/article/writing/'+req.body.book_id);
				}
			});
			*/
			
		}
		else {  //new article

			savenewarticleHelper(req, function(err){
				if (err){
						console.log("savenewarticleHelper err");
						res.send(err);
				}
				else{
					res.redirect('/author/article/writing/'+req.body.book_id+"/1");
				}
			});

		/*
			var newArticleContent = new ArticleContentmodel();
			newArticleContent.content = req.body.content;
			newArticleContent.save( function(err,arcont){

				var newArticle = new Articlemodel();
				newArticle.chapterbooknumber = req.body.booknumber;
				newArticle.chapternumber = req.body.chapternumber;
				newArticle.chaptername = req.body.chaptername;
				newArticle.bookID = req.body.book_id;
				newArticle.contentID = arcont._id;
				//newArticle.content = req.body.content;
				newArticle.wordcount = req.body.content.replace(/\s/g, "").length;
				newArticle.mode = "writing";
				newArticle.save(function (err, article) {
					if (err) {
						console.log("new article save err");
						throw err;
					}
					else {
						console.log("new article saved:");
						Bookmodel.update({ _id: req.body.book_id }, 

						{ $push: { articles: article._id}}, 

						function(err, raw){
							if (err){
								console.log("post edit article update err");
								res.send(err);
							}
							else if (raw){
								console.log("book update succeed:");
								res.redirect('/author/article/writing/'+req.body.book_id+"/1");
							}
							else{
								console.log("草稿更新失敗");
								res.redirect('/author/article/writing/'+req.body.book_id+"/1");
							}
						});
										
					}
				});
			});
			*/
		}	
		
			
		


	}
	else{
		res.redirect('/author');
	}
				
			

});

module.exports = router;
