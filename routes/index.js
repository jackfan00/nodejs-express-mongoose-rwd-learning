var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var bookclickHelper = require('./bookclickHelper.js');
var recommendvoteHelper = require('./recommendvoteHelper.js');
var viewhistoryupdateHelper = require('./viewhistoryupdateHelper.js');
var allrankingHelper = require('./allrankingHelper.js');
var rankingHelper = require('./rankingHelper.js');
var addmybookHelper = require('./addmybookHelper.js');
var peoplereadsupdateHelper = require('./peoplereadsupdateHelper.js');
var searchbookHelper = require('./searchbookHelper.js');
var delmybookHelper = require('./delmybookHelper.js');

//
var Bookmodel = require('../models/book.js');
var Usermodel = require('../models/user.js');
var Authormodel = require('../models/author.js');
var Articlemodel = require('../models/article.js');
var Commentmodel = require('../models/comment.js');
var ArticleContentmodel = require('../models/articlecontent.js');
var cats=["玄幻","奇幻","武俠","仙俠","都市","歷史","科幻","靈異","遊戲","運動","女生網"];

/* GET home page. */
router.get('/', function(req, res, next) {
	
	var user = req.session && req.session.user ? req.session.user : null;
	allrankingHelper(req, function(err, allclicks_books, alltickets_books, newbooks_books, newupdate_books, collect_books, allbooksnum){
		if (err){
			res.send(err);
		}
		else{
			res.render('index', { allclicks_books: allclicks_books, alltickets_books: alltickets_books, allbooksnum: allbooksnum,
			newbooks_books: newbooks_books, newupdate_books: newupdate_books, collect_books: collect_books,
			cats: cats, user: user });
		}
	});
	
  
});

router.post('/searchbook', function(req, res, next) {
	
	var user = req.session && req.session.user ? req.session.user : null;
	searchbookHelper(req, function(err, books){
		if (err){
			res.send(err);
		}
		else{
			res.render('searchbookindex', {user: user, mybook_books: books, cats: cats});
		}
	});
	
});


router.get('/list100/:rank', function(req, res, next) {
	
	var user = req.session && req.session.user ? req.session.user : null;
	var rank = req.params.rank;
	rankingHelper(req, function(err, rank_books){
		if (err){
			res.send(err);
		}
		else{
			itemname = ["點擊排行","推薦排行","收藏排行","新書上架","最近更新"];
			itemdes = ["點擊","推薦","收藏","",""];
			res.render('list100', { rank_books: rank_books, rank: rank, 
				itemdes: itemdes[rank], itemname: itemname[rank],
				cats: cats, user: user });
		}
	});
});

router.get('/getcomment/:bookid/:bookname', function(req, res, next) {
	
	//if (req.session && req.session.user){
		var bookid = req.params.bookid;
		var bookname = req.params.bookname;
		Commentmodel.find({book: req.params.bookid})
		.limit(5)
		.sort('-create_at')
		.populate('book user')
		.exec(function(err,comments){
			if (err){
				console.log("發表評論發生錯誤-getcomment-");
				res.send(err);
			}
			else {
				console.log("comments:"+comments);
				res.render('commentindex', {user: req.session.user, bookname: bookname, backurl: "/read/"+bookid,
				bookid: bookid, comments: comments});
			}
		});
		
	//}
	//else{
	//	res.redirect('/');
	//}
	
});

router.get('/postcomment/:bookid', function(req, res, next) {
	
	if (req.session && req.session.user){
		var bookid = req.params.bookid;
		Bookmodel.findOne({_id: bookid})
		
		.exec(function(err,book){
			if (err){
				console.log("發表評論發生錯誤-postcomment-");
				res.send(err);
			}
			else {
				console.log("book:"+book);
				res.render('postcomment', {user: req.session.user, book: book, 
					backurl: "/getcomment/"+bookid+"/"+book.name});
			}
		});
		
	}
	else{
		res.redirect('/signin');
	}
	
});


router.get('/signin', function(req, res, next) {
	
	res.render('signin');
});

router.get('/signup', function(req, res, next) {
	res.render('signup');
});

router.get('/signout', function(req, res, next) {
	req.session.user = null;
	req.session.authoruser = null;
	res.redirect('/');
});

router.get('/delmybook/:bookid', function(req, res, next) {
	if (req.session && req.session.user){
		delmybookHelper(req, function(err){
			if (err){
				res.send(err);
			}
			else{
				res.redirect('/mybookindex/0');
			}
		});
		
	}
	else{
		res.redirect('/signin');
	}
});

router.get('/clearmybooks', function(req, res, next) {
	if (req.session && req.session.user){
		Usermodel
		.update({_id: req.session.user._id}, {$set: {mybooks: [], mybooksreadstatus: []}},
		
		function(err, raw){
			if (err){
				res.send(err);
			}
			else{
				console.log("clearmybooks:"+JSON.stringify(raw));
				res.redirect('/mybookindex/0');
			}
		});
		
	}
	else{
		res.redirect('/signin');
	}
});

router.get('/mybookindex/:state', function(req, res, next) {
	req.session.forward = "/mybookindex/0";
	var fontsize = req.session && req.session.fontsize ? req.session.fontsize : "15px";
	if (req.session && req.session.user){
		var state = req.params.state;
		Usermodel
		.findOne({_id: req.session.user._id})
		.populate('mybooks author')
		.exec(function(err, user){
			if (err){
				res.send(err);
			}
			else{
				console.log("mybookindex user:"+user);
				var message=null;
				if (state==-1){
					message="已經在書架上";
				}
				else if (state==-2){
					message="已經超過書架最大容量";
				}
				
				mybooksreadstatus = user.mybooksreadstatus;
					
				res.render('mybookindex',{ message: message, mybook_books: user.mybooks, fontsize: fontsize,
				mybooksreadstatus: mybooksreadstatus,  cats: cats});
			}
		});
		
	}
	else{		
		res.redirect('/signin');
	}
});

router.get('/addmybook/:bookid', function(req, res, next) {
	if (req.session && req.session.user){
		addmybookHelper(req.session.user._id, req.params.bookid,
		function(err, state){
			if (err){
				res.send(err);
			}
			else{
				res.redirect('/mybookindex/'+state);
			}
		});
		
	}
	else{		
		res.redirect('/signin');
	}
});

router.get('/listchapters/:bookid/:order', function(req, res, next) {
	var backurl = "/read/"+req.params.bookid;
	req.session.forward = "/listchapters/"+req.params.bookid+"/"+req.params.order;
	var order = req.params.order;
	Bookmodel.findOne({_id: req.params.bookid})
	.populate('articles')
	.exec(function(err, book){
		if (err){
			console.log("目錄讀取失敗-listchapters-");
			res.send(err);
		}
		else{
			fontsize = req.session.fontsize ? req.session.fontsize : "15px";
			var chapterindex=[], chapterallnames = [], chapterupdatetimes = [];
			if (order==0){
				for (var i=0;i<book.articles.length;i++){
					if (book.articles[i].mode == "published"){
						chapterindex.push(i);
						chapterallnames.push("第 "+book.articles[i].chapternumber+" 章  "+book.articles[i].chaptername);
						strday = book.articles[i].create_at.getFullYear()+"-"+(book.articles[i].create_at.getMonth()+1)+"-"
						+book.articles[i].create_at.getDate()+" "+book.articles[i].create_at.getHours()+":"+book.articles[i].create_at.getMinutes();
						chapterupdatetimes.push(strday);
					}
				}
			}
			else{
				for (var i=book.articles.length-1;i>=0;i--){
					if (book.articles[i].mode == "published"){
						chapterindex.push(i);
						chapterallnames.push("第 "+book.articles[i].chapternumber+" 章  "+book.articles[i].chaptername);
						strday = book.articles[i].create_at.getFullYear()+"-"+(book.articles[i].create_at.getMonth()+1)+"-"
							+book.articles[i].create_at.getDate()+" "+book.articles[i].create_at.getHours()+":"+book.articles[i].create_at.getMinutes();
						chapterupdatetimes.push(strday);
					}
				}				
			}
			var user = req.session && req.session.user ? req.session.user : null;
			res.render('listchapters',{order: 1-order, book: book, allarticles: book.articles, chapterindex: chapterindex, 
				chapterallnames: chapterallnames, user: user, backurl: backurl,
				chapterupdatetimes: chapterupdatetimes, fontsize: fontsize});
		}
	});
});

router.get('/clearreadinghistory', function(req, res, next) {
	if (req.session && req.session.user){
		Usermodel
		.update({_id: req.session.user._id},
			{$set: {viewhistory: [], viewhistorydate: []}},
		function(err, raw){
			if (err){
				res.send(err);
			}
			else{
				//console.log("user:"+user);
				req.session.user.viewhistory= [];
				req.session.user.viewhistorydate= [];
				res.render('viewhistoryindex',{ viewhistory_books: req.session.user.viewhistory, penname: req.session.user.author.penname, 
				viewhistorydate: req.session.user.viewhistorydate, cats: cats});
			}
		});
	}
	else{		
		res.redirect('/signin');
	}	
});

router.get('/myreadinghistory', function(req, res, next) {
	
	var backurl = "/myreadinghistory";
	req.session.forward = backurl;
	if (req.session && req.session.user){
		Usermodel
		.findOne({_id: req.session.user._id})
		.populate('viewhistory author')
		.exec(function(err, user){
			if (err){
				res.send(err);
			}
			else{
				console.log("user:"+user);
				res.render('viewhistoryindex',{ viewhistory_books: user.viewhistory,  
				viewhistorydate: user.viewhistorydate, cats: cats});
			}
		});
		
	}
	else{		
		res.redirect('/signin');
	}
	
});


router.get('/read/:bookid', function(req, res, next) {
	
	req.session.forward = "/read/"+req.params.bookid;
	Bookmodel
	.findOne({_id: req.params.bookid})
	.populate('authorID comments articles')
	.exec(function(err,book){
		if (err) {
			res.send(err);
		}
		else{
			
			var articles = book.articles;
			var latestchapter=-1;
			var firstchapter=-1;
			for (var i=0; i<articles.length;i++){
				if (articles[i].mode == "published"){
					latestchapter = i;
				}
				if (articles[i].mode == "published" && firstchapter==-1){
					firstchapter = i;
				}
			}
			var nctp;
			if (articles.length >0 && latestchapter >=0){
				ntcp = "第 "+articles[latestchapter].chapternumber+" 章  "+articles[latestchapter].chaptername;
			}
			else{
				ntcp = null;
			}
			//var ntcp = articles.length >0 ? chstr : "無章節";
			var fontsize = req.session && req.session.fontsize ? req.session.fontsize : "15px";
			var user = req.session && req.session.user ? req.session.user : null;
			console.log("read book author:"+book.authorID);
			//
			Authormodel.findOne({_id: book.authorID._id})
			.populate('books')
			.exec(function(err, bookauthor){
				if (err){
					res.send(err);
				}
				else{
					res.render('readbookindex', { book: book, bookauthor: bookauthor, fontsize: fontsize, commentnum: book.comments.length,
					user: user, cats: cats, ntcp: ntcp, firstchapter: firstchapter, latestchapter: latestchapter});
				}
			});
			//if (req.session && req.session.user){
			//}
			//else{
			//	res.render('readbookindex', { book: book, fontsize: fontsize, cats: cats, ntcp: ntcp});
			//}
		}
	});	
});



router.get('/readarticle/:bookid/:chapter/:fontsize', function(req, res, next) {
	req.session.fontsize = req.params.fontsize;
	
	var paramschapter = req.params.chapter;
	var bookid = req.params.bookid;

	//update viewhistory
	if (req.session && req.session.user){
		viewhistoryupdateHelper(req.session.user._id, req.params.bookid,
		function(err, newviewhistory, newviewhistorydate){
			if (err){
				res.send(err);
			}
			console.log("viewhistory update:"+newviewhistory);
			req.session.user.viewhistory = newviewhistory;
			req.session.user.viewhistorydate = newviewhistorydate;
		});
	}

	
	//update mybooksreadstatus
	if (req.session && req.session.user){
		peoplereadsupdateHelper(req.params.chapter, req.session.user._id, req.params.bookid,
		function(err, state){
			if (err){
				res.send(err);
			}
			
			console.log("mybooksreadstatus update state:"+state);
		});
	}
	
	
	// update clicks
	bookclickHelper(req.params.bookid, function(err){
		if (err){
			console.log("clicks update err:"+err);
		}
		else{
			console.log("clicks +1");
		}
	});
	//
	
	//
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
			var chapter = Math.min(paramschapter, articles.length-1);
			if (articles.length > chapter && articles[chapter].mode == "published"){
				
				ArticleContentmodel.findOne({_id: articles[chapter].contentID}, function(err, articlecontent){
					if (err){
						res.send(err);
					}
					else{
						chname = "第 "+articles[chapter].chapternumber+" 章  "+articles[chapter].chaptername;
						var user = req.session && req.session.user ? req.session.user : null;
						
						var nextchapter=-1;
						for (var i=chapter+1;i<articles.length;i++){
							if (articles[i].mode == "published"){
								nextchapter=i;
								break;
							}
						}
						var previouschapter=-1;
						for (var i=chapter-1;i>=0;i--){
							if (articles[i].mode == "published"){
								previouschapter=i;
								break;
							}
						}
						//if (req.session && req.session.user){
						var	backurl = req.session.forward;
						res.render('readarticleindex', { booktickets: book.alltickets, content: articlecontent.content, fontsize: req.session.fontsize, 
						backurl: backurl, nextchapter: nextchapter, previouschapter: previouschapter, chapter: chapter, 
						bookid: book._id, bookname: book.name, chname: chname, user: user});
						//}
						//else{
						//	res.render('readarticleindex', { content: articlecontent.content, maxchapter: articles.length-1, chapter: chapter, bookid: book._id, bookname: book.name, chname: chname});
						//}
							

					}
					
				})
				
				
			}
			else{
				console.log("沒有文章可以閱讀");
				res.redirect('/read/'+bookid);
			}
		}
	});	
});

router.get('/recommend/:bookid/:bookname/:chapter/:booktickets', function(req, res, next) {
	
	var backurl = "/readarticle/"+req.params.bookid+"/"+req.params.chapter+"/"+req.session.fontsize;
	req.session.forward = backurl;
	if (req.session && req.session.user){
		res.render('recommendvote',{user: req.session.user, bookid: req.params.bookid, bookname: req.params.bookname, 
		tickets: req.session.user.tickets, backurl: backurl, booktickets: req.params.booktickets});
	}
	else{		
		res.redirect('/signin');
	}
});

router.get('/recommendvote/:bookid/:booktickets', function(req, res, next) {
	
	var backurl = req.session.forward;
	if (req.session && req.session.user){
		var tickets = req.params.booktickets>0 ? req.params.booktickets : req.session.user.tickets;
		recommendvoteHelper(req.session.user._id, req.params.bookid, tickets, 
		function(err, votes){
			if (err){
				console.log("recommendvote err:"+err);
				res.send(err)
			}
			else{
				req.session.user.tickets -= votes;
				res.redirect(backurl);
			}
		});
	}
	else{
		res.redirect('/signin');
	}
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
						if (req.session && req.session.forward){
							//var forward = req.session.forward;
							//req.session.forward = "/";
							res.redirect('/');
						}
						else{
							res.redirect('/');
						}
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

router.post('/signup', function(req, res, next)
{
	var callback_count=0;
	
	var saveuser = function(){
				var newUser = new Usermodel();
				newUser.username = req.body.username;
				newUser.displayname = req.body.displayname;
				newUser.password = bcrypt.hashSync(req.body.password);
				newUser.email = req.body.email;
				newUser.birth_year = req.body.birth_year;
				newUser.birth_mon = req.body.birth_mon;
				newUser.birth_day = req.body.birth_day;
				newUser.gender = req.body.gender;
				//newUser.author = auuser;
				newUser.save(function (err, user) {
					if (err) {
						console.log("new user save err");
						throw err;
					}
					else {
						console.log("user saved");
						res.redirect('/');
					}
				});
				
	};
	var f1_callback = function(err, obj){
		if (err){
			res.send(err);
		}
		else if (obj) {
			res.render('signup', {message: obj.username+" 已經被使用", formbody: req.body});
		}
		else {
			console.log("f1callback_count="+callback_count);
			callback_count++;
			if (callback_count==2){
				saveuser();
			}
		}
	};
	var f2_callback = function(err, obj){
		if (err){
			res.send(err);
		}
		else if (obj) {
			res.render('signup', {message: obj.email+" 已經被使用", formbody: req.body});
		}
		else {
			console.log("f2callback_count="+callback_count);
			callback_count++;
			if (callback_count==2){
				saveuser();
			}
		}
	};

//	
	if (req.body.password !== req.body.confirm_password || req.body.authorpassword !== req.body.confirm_authorpassword){
		res.render('signup', {message: "密碼確認不相符", formbody: req.body});
	}
	else{
		
		Usermodel.findOne({ username: req.body.username}).exec(f1_callback);
		Usermodel.findOne({ email: req.body.email}).exec(f2_callback);


	}
	//res.send(req.body);
});

router.post('/postcomment', function(req, res, next) {
	if (req.session && req.session.user){
				var newComment = new Commentmodel();
				newComment.user = req.session.user._id;
				newComment.book = req.body.bookid;
				newComment.des = req.body.des;
				bookname = req.body.bookname;
				//
				newComment.save(function (err, comment) {
					if (err) {
						console.log("new comment save err");
						res.send(err);
					}
					else {
						console.log("comment saved");
						Bookmodel.update({_id: comment.book},
							{$push: {comments: comment}},
							function(err,raw){
								if (err){
									res.send(err);
								}
								else{
									res.redirect('/getcomment/'+comment.book+'/'+bookname);
								}
							});
						
					}
				});
	}
	else{
		res.redirect('/signin');
	}	
});

module.exports = router;
