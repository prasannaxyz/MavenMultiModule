	$(document).ready(function() {
		var res=null;
		var submitted = false;
		$('#squest1').change(function(){
			  var sel  = $('#squest1 option:selected').attr("value");
			  var selq1 = $('#squest1 option:selected').attr("id");
			  var selq2 = $('#squest2 option:selected').attr("id");
			  if(sel == "Select"){
				  $('#squest1 option[id]').remove();
				  $('#squest2 option[id]').remove();
				for(var i=0;i<res.length;i++){
					pid = res[i].Id;
					description = res[i].Description;
				$('#squest1').append("<option id="+pid+">"+description+"</option>");
				$('#squest2').append("<option id="+pid+">"+description+"</option>");
				}
			 }else if(selq1){
				 $('#squest2 option[id]').remove();
				 for(var i=0;i<res.length;i++){
						pid = res[i].Id;
						description = res[i].Description;
					$('#squest2').append("<option id="+pid+">"+description+"</option>");
				  }
				 $("#squest2 option[id="+selq1+"]").remove();
				 $("#squest2 option[id="+selq2+"]").attr("selected", "selected");
			 }
		});
		$('#squest2').change(function(){
			  var sel  = $('#squest2 option:selected').attr("value");
			  var selq1 = $('#squest1 option:selected').attr("id");
			  var selq2 = $('#squest2 option:selected').attr("id");
			  
			  if(sel == "Select"){
				  $('#squest1 option[id]').remove();
				  $('#squest2 option[id]').remove();
				for(var i=0;i<res.length;i++){
					pid = res[i].Id;
					description = res[i].Description;
				$('#squest1').append("<option id="+pid+">"+description+"</option>");
				$('#squest2').append("<option id="+pid+">"+description+"</option>");
				}
			 }else if(selq2){
				 $('#squest1 option[id]').remove();
				 for(var i=0;i<res.length;i++){
						pid = res[i].Id;
						description = res[i].Description;
					$('#squest1').append("<option id="+pid+">"+description+"</option>");
					}
				  $("#squest1 option[id="+selq2+"]").remove();
				  $("#squest1 option[id="+selq1+"]").attr("selected", "selected");
			 }
		});
  		 reset();
  		 if(!submitted){
  			 submitted = true;
  		   $.ajax({
					type : "GET",
					contentType : "application/json",
					dataType : "json",
					url : "rest/register",
					success : function(result) {
					res = result.Questions;
					for ( var i = 0; i < res.length; i++) {
						    pid = res[i].Id;
							description = res[i].Description;
						$('#squest1').append("<option id="+pid+">" + description+ "</option>");
						$('#squest2').append("<option id="+pid+">" + description+ "</option>");
						}
						submitted = false;
					}
				});
  		 }
				function isValidEmailAddress(emailAddress) {
				    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
				    return pattern.test(emailAddress);
				};
				
				function isPasswordValid(password){
					//var pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
					var pattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]).{8,20})");
					return pattern.test(password);
				}
				
				function isUsernameValid(uname){
					var pattern = new RegExp("^[a-z0-9_-]{8,15}$");
					return pattern.text(uname);
				}
				
				
				$('#pass').focus(function(){
					$('#passhint').show();
				});
				$('#pass').focusout(function(){
					$('#passhint').hide();
				});
					
				$("#create").click(function() {
					var uname    = $('#uname').val();
					var pass     = $('#pass').val();
					var cfpass   = $('#cfpass').val();
					var fname    = $('#firstname').val();
					var mname    = $('#middlename').val();
					var lname    = $('#lastname').val();
					var email    = $('#email').val();
					var sques1   = $('#squest1 option:selected').attr("id");
					var sans1    = $('#sans1').val();
					var sques2   = $('#squest2 option:selected').attr("id");
					var sans2    = $('#sans2').val();
					var urole	 = $('#urole option[id]:selected').val();
					var error	  = "";
					if(uname.length < 8){
						error += "Username should be atleast 8 characters"+"<br>";
						clearpass();
					}
					if(!isPasswordValid(pass)){
						error +="Invalid password type"+"<br>";
						scrolltop();
						clearpass();
					}
					if(cfpass != pass){
						error += "Password should match with confirm password"+"<br>";
						scrolltop();
						clearpass();
					}
					if(!fname){
						error += "Firstname must be entered"+"<br>";
						scrolltop();
						clearpass();
					}
					if(!isValidEmailAddress(email)){
						error += "Enter a valid email"+"<br>";
						scrolltop();
						clearpass();
					}
					if(!sques1){
						error += "Select security question 1"+"<br>";
						scrolltop();
						clearpass();
					}
					if(!sans1 || sans1.length < 6){
						error += "Security answer 1 should have atleast 6 characters"+"<br>";
						scrolltop();
						clearpass();
					}
					if(!sques2){
						error +="Select security question 2"+"<br>";
						scrolltop();
						clearpass();
					}
					if(!sans2 || sans2.length<6){
						error += "Security answer 2 should have atleast 6 characters"+"<br>";
						scrolltop();
						clearpass();
					}
					if(!urole){
						error += "Select a role"+"<br>";
						scrolltop();
						clearpass();
					}
					if(error.length > 0){
						$('#errormsgs').html(error);
					}else{
						if(!submitted){
							submitted = true;
							$.ajax({
						type : "POST",
						url : "rest/register",
						data : {
							usertype : usertype,
							username : uname,
							password : pass,
							firstname : fname,
							middlename : mname,
							lastname : lname,
							email : email,
							sques1 : sques1,
							sans1 : sans1,
							sques2 : sques2,
							sans2 : sans2
						},
						success : function(response) {
							var status = response.Status;
							var msg    = response.Message;
							if(status == 100){
								reset();
								$('#successmsg').show();
							}else if(status == 101){
								$('#errormsgs').text(msg);
							}else if(status == 102){
								$('#errormsgs').text(msg);
							} 
							submitted = false;
						}
					});
					}
				} 
		});
				$('#cancel').click(function() {
					window.location = "login.html";
				});
				
				$(":input").focus(function(){
					$('#errormsgs').text("");
				});
				
				function scrolltop(){
					$("html, body").animate({scrollTop: $("body").offset().top}, 1000);
				}
				
				function clearpass(){
					$('#pass').val('');
					$('#cfpass').val('');	
				}

				function reset() {
					$('#uname').val("");
					$('#pass').val("");
					$('#cfpass').val("");
					$('#firstname').val("");
					$('#middlename').val("");
					$('#lastname').val("");
					$('#email').val("");
					$('#squest1').val("");
					$('#sans1').val("");
					$('#squest2').val("");
					$('#sans2').val("");
				}
			});