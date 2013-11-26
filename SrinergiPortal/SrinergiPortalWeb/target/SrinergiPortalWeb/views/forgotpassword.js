var forgotPassView = Backbone.View.extend({
	template : _.template($('#forgotpass').html()),
	initialize : function() {
		this.render();
	},
	render : function() {
		$(this.el).html(this.template());
		return this;
	},
	events : {
		"click #check" 		: "questions",
		"click #checkans" 	: "checkanswer",
		"click #passchange" : "changepassword",
		"click #getusername": "getUser",
		"click #bquestion"  : "showquestions"
	},
			
	showquestions : function(){
		$('#errmsg').text("");
		$('#changepass').hide();
		$('#squestions').show();
	},

	getUser : function(){
		$('#errname').text("");
		$('#squestions').hide();
		$('#checkuser').show();
	},
	questions : function() {
		var usernames = $('#rusername').val();
		if (!usernames || usernames == "") {
			$('#errname').text("User Name must be specified");
		}else{
		$('#errname').text("");
		$.ajax({
			type : "GET",
			data : {
				username : usernames
			},
			url : "rest/forgotpw",
			success : function(response) {
				var res = response.questions;
				var tok = response.token;
				var rescode = response.responseCode;
				var status = rescode.errorStatus;
				var message = rescode.message;
				if(status == "0"){
				$.cookie("securitytoken",tok.Id);
				$('#rtoken').val(tok.Id);
				$('#checkuser').hide();
				$('#squestions').show();
				$('#ans1').focus();
				$('.question1').text(res[0].description);
				$('.question1').attr("id", res[0].id);
				$('.question2').text(res[1].description);
				$('.question2').attr("id", res[1].id);
				}else if(status== "1"){
					$('#errname').text(message);
				}
				}
			});
			}
	},
	
 checkanswer : function() {
		var ques1 = $('.question1').attr("id");
		var ans1 = $('#ans1').val();
		var ques2 = $('.question2').attr("id");
		var ans2 = $('#ans2').val();
		var error = "";
		function ansclear(){
			$('#ans1').val('');
			$('#ans2').val('');			
		}
		if (!ans1 || ans1=="") {
			error += "<br>"+ "Answer1 must be specified";
		}if(!ans2 || ans2==""){
			error += "<br>"+ "Answer2 must be specified";
		}
		if (error.length > 0) {
			$('#errmsg').html(error);
		}else{		
			$('#errmsg').text("");
			$('#errmsg').html("");
		this.model.set({
			questionid1 : ques1,
			answer1		: ans1,
			questionid2	: ques2,
			answer2		: ans2
		});
		this.model.save({},{
			success : function(model, result, xhr){
				var msg    = result.message;
				var status = result.errorStatus;
				var token0 = result.token;
			  if(status == "0"){
					$('#rtoken').val(token0);
					$.cookie("securitytoken1",token0);
					$('#squestions').hide();
					$('#changepass').show();
					$('#npass').focus();
				}else if(status == "1"){
						ansclear();
						$('#rtoken').val(token0);
						$('#errmsg').text(msg);
				}
			}
		}); 
		}
	},
	changepassword : function(){
		
		var nwpass = $('#npass').val();
		var copass = $('#cpass').val();
		if(!isPasswordValid(nwpass)){
			$('#errpwd').text("Enter valid password!");
			passclear();
		}else if(nwpass != copass){
			$('#errpwd').text("passwords mismatch!");
			passclear();
		}else{
			$('#errpwd').text("");
		$.ajax({
			type : "POST",
			data : {confirmpass : copass}, 
			url	 : "rest/forgotpw/store",
			success : function(response){
				$.removeCookie('securitytoken');
				$.removeCookie("securitytoken1");
				$.removeCookie("securitytoken2");
			    var msg    = response.message;
			    var status = response.errorStatus;
				if(status == "0"){
					$('#changepass').hide();
					$('#successpass').show();
				}else if(status == "1"){
					$('#errpwd').text(msg);
					passclear();
				}
				passclear();
			}
		});
	}
		function passclear(){
			$('#npass').val("");
			$('#cpass').val("");
		}
		function isPasswordValid(password){
			var pattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!]).{8,20})");
			return pattern.test(password);
		}
	}
});

$(document).ready(function(){
	$('#rusername').focus();
});
