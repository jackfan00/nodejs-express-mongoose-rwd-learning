var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var Commentmodel = require('../models/comment.js');
var ArticleContentmodel = require('../models/articlecontent.js');
var cats=["玄幻","奇幻","武俠","仙俠","都市","歷史","科幻","靈異","遊戲","運動","女生網"];

/* GET home page. */
router.get('/', function(req, res, next) {
	Bookmodel.find()	
	.limit(5)
	.sort('-allclicks')
	.populate('authorID') //, ['penname'], { mode: 'published'})
	.exec(function(err, books){
		console.log("req.session:"+JSON.stringify(req.session));
		if (req.session && req.session.user){
			console.log("DDDDDDDDDDDDDDDDDD");
			res.render('index', { allclicks_books: books, cats: cats, user: req.session.user });
		}
		else{
			res.render('index', { allclicks_books: books, cats: cats });
		}
	});
			
  
});

router.get('/signin', function(req, res, next) {
	
	res.render('signin');
});

router.get('/signout', function(req, res, next) {
	req.session.user = null;
	res.redirect('/');
});

router.get('/read/:bookid', function(req, res, next) {
	Bookmodel
	.findOne({_id: req.params.bookid})
	.populate('authorID comments articles')
	.exec(function(err,book){
		if (err) {
			res.send(err);
		}
		else{
			console.log("read book:"+book);
			var articles = book.articles;
			chstr = "第 "+articles[articles.length-1].chapternumber+" 章  "+articles[articles.length-1].chaptername;
			newestchapter = articles.length >0 ? chstr : "無章節";
			if (req.sesssion && req.sesssion.user){
				res.render('readbookindex', { book: book, user: req.sesssion.user, cats: cats, newestchapter: newestchapter});
			}
			else{
				res.render('readbookindex', { book: book, cats: cats, newestchapter: newestchapter});
			}
		}
	});	
});


router.get('/readarticle/:bookid/:chapter', function(req, res, next) {
	Bookmodel
	.findOne({_id: req.params.bookid})
	.populate('articles')
	.exec(function(err,book){
		if (err) {
			res.send(err);
		}
		else{
			console.log("read book:"+book);
			var articles = book.articles;
			var chapter = req.params.chapter;
			if (articles.length > chapter){
				
				ArticleContentmodel.findOne({_id: articles[chapter].contentID}, function(err, articlecontent){
					if (err){
						res.send(err);
					}
					else{
						chname = "第 "+articles[chapter].chapternumber+" 章  "+articles[chapter].chaptername;

						if (req.sesssion && req.sesssion.user){
							res.render('readarticleindex', { content: articlecontent.content, bookid: book._id, bookname: book.name, chname: chname, user: req.sesssion.user});
						}
						else{
							res.render('readarticleindex', { content: articlecontent.content, bookid: book._id, bookname: book.name, chname: chname});
						}
					}
					
				})
				
				
			}
			else{
				console.log("沒有文章可以閱讀");
				res.redirect('/read/'+req.params.bookid);
			}
		}
	});	
});

//post

router.post('/signin', function(req, res, next) {
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
						console.log("req.session.user="+req.session.user);
						res.redirect('/');
						
					}
					else {
						console.log("密碼錯誤:"+user);
						res.render('signin', {message: "登入失敗", formbody: req.body});
					}
					
				}catch (err) {
					console.log("bcrypt錯誤:"+err);
					res.render('signin', {message: "bcrypt錯誤"+err, formbody: req.body});
				}
				 
			}
			else{
				console.log("找不到使用者 "+req.body.username);
				res.render('signin', {message: "登入失敗", formbody: req.body});
			}

	});
});

module.exports = router;
