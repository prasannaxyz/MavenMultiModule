	$(document).ready(function(){
		var submitted = false;
		$('#check').click(function(){
			var username = $('#rusername').val();
			if(username.length < 8){
				$('#errname').text("Username must be atleast 8 characters");
			}else{
		if(!submitted){
			submitted = true;
			$.ajax({
				type : "POST",
				data :{username : username}, 
				url	 : "rest/forgotpw/ques",
				success : function(response){
					$('#rusername').val('');
					var res = response.Questions;
					var tok = response.Token;
					var rescode = response.ResponseCode;
					var status  = rescode.Status;
					var message = rescode.Message;
				if(status == 201){
					$('#errname').text('');
				 	$.cookie("securitytoken",tok.Id); 
					$('#rtoken').val(tok.Id);
					$('.question1').text(res[0].Description);
					$('.question1').attr("id",res[0].Id);
					$('.question2').text(res[1].Description);
					$('.question2').attr("id",res[1].Id);
					$('#ans1').val('');
					$('#ans2').val('');
					$('#checkuser').hide();
					$('#squestions').show();
					submitted = false;
				}else if(status == 404){
						$('#errname').text(message);
						$('#rusername').val('');
						submitted = false;
					}else{
						$('#errname').text('');
						$('#rusername').val('');
						submitted = false;
					} 
				}
				});
			}
			}
		});

		$(":input").focus(function(){
			$('#errname').text("");
			$('#errmsg').text("");
			$('#errpwd').text("");
		});
		
		$('#checkans').click(function(){
			var ques1 = $('.question1').attr("id");
			var ans1  = $('#ans1').val();
			var ques2 = $('.question2').attr("id");
			var ans2  = $('#ans2').val();
			if(!ans1 || !ans2){
				$("#errmsg").text("Security answer must be entered");
				ansclear();
			}else{
			$('#rtoken').val(); 
			if(!submitted){
				submitted = true;
			 $.ajax({
				type : "POST",
				data :{question1 : ques1,answer1: ans1,question2 : ques2, answer2 : ans2}, 
				url	 : "rest/forgotpw/check",
				success : function(response){
					$.removeCookie('securitytoken');
					var status = response.Status;
					var msg    = response.Message;
					var token0 = response.Token;
					var token1 = response.Token1;
					var token2 = response.Token2;
					if(status == 200){
						$('#s1token').val(token1);
						$('#s2token').val(token2);
						$.cookie("securitytoken1",token1);
						$.cookie("securitytoken2",token2);
						$('#squestions').hide();
						$('#changepass').show();
						submitted = false;
					}else if(status == 403){
						ansclear();
						$('#rtoken').val(token0);
						$('#errmsg').text("Invalid Secret Answers");
						submitted = false;
					}
				}
			});
		}
		  }
		});
		
		function ansclear(){
			$('#ans1').val('');
			$('#ans2').val('');			
		}
		function isPasswordValid(password){
			var pattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!]).{8,20})");
			return pattern.test(password);
		}
		
		$('#passchange').click(function(){
			var nwpass = $('#npass').val();
			var copass = $('#cpass').val();
			if(!isPasswordValid(nwpass)){
				$('#errpwd').text("Password must have digit,special symbol,uppercase,lowercase characters");
				passclear();
			}else if(!nwpass || !copass){
				$('#errpwd').text("Password cannot be blank");
				passclear();
			}else if(nwpass != copass){
				$('#errpwd').text("Passwords doesn't match");
				passclear();
			}else{
		if(!submitted){
			submitted = true;
			$.ajax({
				type : "POST",
				data :{confirmpass : copass}, 
				url	 : "rest/forgotpw/store",
				success : function(response){
					$.removeCookie("securitytoken1");
					$.removeCookie("securitytoken2");
				    var status = response.Status;
				    var msg    = response.Message;
					if(status == 200){
						$('#changepass').hide();
						$('#successpass').show();
						submitted=false;
					}else if(status == 401){
						$('#errpwd').text(msg);
						submitted=false;
					}else if(status == 408){
						$('#errpwd').text(msg);
						submitted=false;
					}
					passclear();
				}
			});
			}
			}
		});
		function passclear(){
			$('#npass').val("");
			$('#cpass').val("");
		}
	
		$.ajaxSetup({
			beforeSend:function(xhr)
			{
				xhr.setRequestHeader("token",$('#rtoken').val());
				xhr.setRequestHeader("securetoken1",$('#s1token').val());
				xhr.setRequestHeader("securetoken2",$('#s2token').val());
			}
		});
	});