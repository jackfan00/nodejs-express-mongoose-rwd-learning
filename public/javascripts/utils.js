	$(function(){
		$("#textarea-wordcount").keyup(function(){
			var wc = $(this).val().replace(/\s/g, "").length;
			if (wc < 500){
				$("#span_wordcount").addClass("text-danger").text(wc);
			}
			else {
				
				$("#span_wordcount").removeClass("text-danger").text(wc);
			}
			
			console.log("wc:" + $("#span_wordcount").text());
		});
		$("textarea#description").keyup(function(){
			var wc = $(this).val().replace(/\s/g, "").length;
			if (wc < 100){
				$("#span_wordcount").addClass("text-danger").text(wc);
			}
			else {
				
				$("#span_wordcount").removeClass("text-danger").text(wc);
			}
			
			console.log("wc:" + $("#span_wordcount").text());
		});
		$("#chaptername-wordcount").keyup(function(){
			var wc = $(this).val().replace(/\s/g, "").length;
			if (wc < 2){
				$("#span_wordcount1").addClass("text-danger").text(wc);
			}
			else{
				$("#span_wordcount1").removeClass("text-danger").text(wc);
			}
			
			console.log("wc:" + $("#span_wordcount").text());
		});

	$("div#scoring img").mouseover(function() {
		alt = $( this ).attr("alt");
		$( "div#scoring").attr("score",alt);
		//console.log("mouseover alt:"+alt);
		for (var i=1; i<= 5; i++){
			if (i <= alt) {
				$( "div#scoring img[alt="+i+"]").attr("src","/images/star-on.png");
			}
			else {
				$( "div#scoring img[alt="+i+"]").attr("src","/images/star-off.png");
			}
		}		
	});

});


    function scoring( bookname){
		
		var sorce = $( "div#scoring").attr("score");
		$("div#myscoredialog h4").text("評價書籍: "+bookname+" "+sorce+"顆星");
		$("div#myscoredialog form").attr("action","/readbook/scoring/"+sorce);
		$("div#myscoredialog").addClass("in").attr("style", "display: block;");
		
	}
	
	function validatearticleForm() {
    var wc = $("#span_wordcount").text();
    var wc1 = $("#chaptername-wordcount").val().replace(/\s/g, "").length;
    if ( wc < 500 || wc1 < 2) {
        alert("字數不夠");
        return false;
    }


	var book ;
	var chapter ;
	var fields = $( ":input" ).serializeArray();
	jQuery.each( fields, function( i, field ) {
      //console.log( field.name + "=" + field.value + " " );
	  if (field.name == "booknumber"){ book = field.value;}
	  if (field.name == "chapternumber"){ chapter = field.value;}
    });
	
	
	if (confirm("保存為 第"+book+"冊,第"+chapter+"章") == true) {
        return true;
    } 
	else {
        return false;
    }
	
	}

	function writenewarticle() {
		console.log("writenewarticle:");
		$("input[name=editarticle]").remove();
		$("input#chaptername-wordcount").attr("value","");
		$("input#chaptername-wordcount").attr("placeholder","新章節");
		$("textarea#textarea-wordcount").text("");
		$("textarea#textarea-wordcount").attr("placeholder","新文章");
		$("a#dela").attr("href","#");
		$("button#delb").attr("disabled","true");
		$("div.list-group a.list-group-item.list-group-item-danger").attr("class","list-group-item");
		$("select[name=booknumber]").attr("disabled", false);
		$("select[name=chapternumber]").attr("disabled", false);
    }	
	
	function deletebook(hreflink, bookname) {
		console.log("deletebook:");
		if (confirm("刪除書籍: "+bookname+" ?") == true) {
			window.location.href = hreflink;
		} 

	}
	function deletearticle(bookid, articleid, chaptername) {
		console.log("deletearticle:"+articleid);
		if (confirm("刪除文章: "+chaptername+" ?") == true) {
			window.location.href = "/articles/deletearticle/writing/"+articleid+"/"+bookid;
		} 

	}
	function deletepublishedarticle(bookid, articleid, chaptername) {
		console.log("deletepublishedarticle:"+articleid);
		if (confirm("刪除文章: "+chaptername+" ?") == true) {
			window.location.href = "/author/deletearticle/published/"+articleid+"/"+bookid;
		} 

	}
	function deletedeleteedarticle(bookid, articleid, chaptername) {
		console.log("deletedeleteedarticle:"+articleid);
		if (confirm("徹底刪除文章: "+chaptername+" ?") == true) {
			window.location.href = "/author/deletearticle/deleted/"+articleid+"/"+bookid;
		} 

	}
	
	
	function publisharticle(bookid, articleid, book, chapternumber){
		console.log("article:"+articleid);
		var wc = $("textarea#textarea-wordcount").val().replace(/\s/g, "").length;
		if (confirm("發布 第"+book+"冊,第"+chapternumber+"章 ?") == true) {
			window.location.href = "/author/publishonearticle/"+articleid+"/"+bookid+"/"+wc;
		} 
	}
	function publisharticles(bookid){
		console.log("articles:"+bookid);
		if (confirm("發布 全部章節 ?") == true) {
			window.location.href = "/author/publishAllarticle/"+bookid;
		} 
	}
	
	function recommandvote(bookname){
		if (confirm("投推薦票給: "+bookname+" ?") == true) {
			return true;
		} 
		else{
			return false;
		}
	}
	function fontsizeup(){
		var fontSize = parseInt($("p#content").css("font-size"));
		fontSize = Math.min(fontSize+1, 30) + "px";
		$("p#content").css({'font-size':fontSize});

		console.log(fontSize);
	}
	
	function fontsizedown(){
		var fontSize = parseInt($("p#content").css("font-size"));
		fontSize = Math.max(fontSize-1, 12) + "px";
		$("p#content").css({'font-size':fontSize});

		console.log(fontSize);
	}