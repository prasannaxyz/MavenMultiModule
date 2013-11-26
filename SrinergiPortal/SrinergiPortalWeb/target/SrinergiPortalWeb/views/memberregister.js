var resp,pid,description,scode,sdesc;
var membmodel = new registerDetailModel();
var mreg = new memberRegister();
var statesmodel = new registerModel();
var submit = false;
var score = 0;
var memberRegisterView = Backbone.View.extend({
	template : _.template($('#membertemp').html()),
	initialize : function(){
		this.getQuestions();
		this.render();
	},
	render : function(){
		$(this.el).html(this.template());
		return this;
	},
	events : {
		"change #squest1"     : "reflect",
		"change #squest2"     : "reflects",
		"click #next"	      : "next",
		"click #pass"	      : "showhints",
		"focus #ssn"	      : "maskssn",
		"mouseover #passhint" : "showdet",
		"keyup #city" 	 	  : "getstatezip",
		"keyup #zipcode"	  : "getcitystate",
		"click #register" 	  : "register",
		"focus #phone"		  : "maskphone",
		"focus #fax"		  : "maskfax",
		"click #terms"	  	  : "getterms",
		"click #back"		  : "getBack",
		"keyup #pass"		  : "pstrength",
		"focusout #pass"	  : "hidePstrength"
	},
	
	hidePstrength :function(){
		$('#PassValue').hide();
		$('#scorepercent').hide();
	},	
	
	pstrength : function(){
		$('#PassValue').show();
		$('#scorepercent').show();
		var password = $('#pass').val();
		score = 0;
		var pattern1 = new RegExp('[a-z]');
		var pattern2 = new RegExp('[A-Z]');
		var pattern3 = new RegExp('[0-9]');
		var pattern4 = new RegExp('[!@#$%]');
		if(pattern1.test(password)){
			score=score + 20;
		}if(pattern2.test(password)){
			score=score + 20;
		}if(pattern3.test(password)){
			score=score + 20;
		}if(pattern4.test(password)){
			score=score + 20;
		}if(password.length>=8){
			score=score + 20;
		}
		  $("#pass").complexify({}, function (valid, complexity) {
	            $("#PassValue").val(score);
	        });
		this.getPercent();  
	},
	
	getPercent : function(){
		this.$('#scorepercent').text(score+"%");
	},	
	
	
	
	getBack : function(){
		$('#errormsgs').text("");
		$('#member2').hide();
		$('#num3').val("");
		$('#member1').show();
		
	},
	
	maskssn : function(){
			$('#ssn').mask("999-99-9999");
	},
    maskphone : function (){
	    	$("#phone").mask("(999) 999-9999");
	},
	
	maskfax : function(){
			$("#fax").mask("(999) 999-9999");
	 },
	 
 showdet : function(e){
	 	e.preventDefault();
		var hint = $('#passhin').html();
	    $('#passhint').attr("title",hint);
		    $(function() {
		    	$(document).tooltip({
		    	position: {
		    	my: "center bottom-20",
		    	at: "center right",
		    	using: function( position, feedback ) {
		    	$( this ).css( position );
		    	$( "<div>" )
		    	.addClass( "arrow" )
		    	.addClass( feedback.vertical )
		    	.addClass( feedback.horizontal )
		    	.appendTo( this );
		    	}
		    	},
		    	content: function () {
		              return $(this).prop('title');
		          }
		    	});
		    	});
	},
	
	next : function(){
		var roletype = $.cookie('roletype');
		$('#roletype').val(roletype);
		var error	  = "";
		function scrolltop(){
			$("html, body").animate({scrollTop: $("body").offset().top}, 1000);
		}
			
		function isValidEmailAddress(emailAddress) {
		    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		    return pattern.test(emailAddress);
		};
		
		function isPasswordValid(password){
			var pattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]).{8,20}$)");
			return pattern.test(password);
		}
		
		function isUsernameValid(uname){
			var pattern = new RegExp("^[A-Za-z0-9_-]$");
			return pattern.test(uname);
		}
		function clearpass(){
			$('#pass').val('');
			$('#cfpass').val('');	
		}
		
		var username 		= $('#uname').val();
		var password 		= $('#pass').val();
		var confirm 		= $('#cfpass').val();
		var groupno			= $('#mgroupno').val();
		var ssn				= $('#ssn').val();
		var roletype	    = $('#roletype').val();
		var questionid1		=$('#squest1 option:selected').attr("id");
		var answer1			= $('#sans1').val();
		var questionid2		= $('#squest2 option:selected').attr("id");
		var answer2			= $('#sans2').val();
		if (!isUsernameValid(username)) {
			if(!username || username == ""){
			error += "<br>" + "User Name is required";
	    	clearpass();
			scrolltop();
			}else if(username.length < 8){
				error += "<br>" + "User Name must be atleast 8 characters";
		    	clearpass();
				scrolltop();	
			}
		}if(!password || password==""){
				error+="<br>"+"Password is required";
				clearpass();
				scrolltop();
		}if(password){
			if(!isPasswordValid(password)){
				error+="<br>"+"Password is invalid";
				clearpass();
				scrolltop();
			}else if(confirm != password){
				error +="<br>"+"Password should match with confirm password";
				clearpass();
				scrolltop();
			}
		}if(!groupno || groupno == ""){
			error+="<br>"+"Group Number is required";
			clearpass();
			scrolltop();
		}if(!ssn || ssn == ""){
			error+="<br>"+"SSN is required";
			clearpass();
			scrolltop();
		}		
		if(!questionid1){
			error+="<br>"+"Question id 1 is required";
			clearpass();
			scrolltop();
		}if(!answer1 || answer1==""){
				error+="<br>"+"Security answer 1 is required";
				clearpass();
				scrolltop();
		}if(!questionid2){
			error+="<br>"+"Question id 2 is required";
			clearpass();
			scrolltop();
		}if(!answer2 || answer2==""){
				error+="<br>"+"Security answer 2 is required";
				clearpass();
				scrolltop();
		}if(error.length > 0){
			$('#errormsg').html(error);
			scrolltop();
		}else{
				$('#errormsg').html("");
			    $('#errormsg').text("");
				var ssns = $('#ssn').val().match(/\d/g).join("");
	   		    membmodel.set({
							roletype	    : $('#roletype').val(),
							username 		: $('#uname').val(),
							password 		: $('#pass').val(),
							questionid1		: $('#squest1 option:selected').attr("id"),
							answer1			: $('#sans1').val(),
							questionid2		: $('#squest2 option:selected').attr("id"),
							answer2			: $('#sans2').val()
				   	});
				 	mreg.set({
			 			groupno			: $('#mgroupno').val(),
						ssn   		    : ssns
				 	});	
				 		$('#member1').hide();
				 		$('#pass').val("");
						$('#cfpass').val("");
						mgetCaptchas();
				 		$('#member2').show();
						$('#firstname').focus();
		}
	},
	reflect : function(){
		  var selq1 = $('#squest1 option:selected').attr("id");
		  var selq2 = $('#squest2 option:selected').attr("id");
		  if(selq1){
			 $('#squest2 option[id]').remove();
			 for(var i=0;i<resp.length;i++){
					pid = resp[i].id;
					description = resp[i].description;
				$('#squest2').append("<option id="+pid+">"+description+"</option>");
			  }
			 $("#squest2 option[id="+selq1+"]").remove();
			 $("#squest2 option[id="+selq2+"]").attr("selected", "selected");
		 }
	},
	
	reflects : function(){
		  var selq1 = $('#squest1 option:selected').attr("id");
		  var selq2 = $('#squest2 option:selected').attr("id");
		  if(selq2){
			 $('#squest1 option[id]').remove();
			 for(var i=0;i<resp.length;i++){
					pid = resp[i].id;
					description = resp[i].description;
				$('#squest1').append("<option id="+pid+">"+description+"</option>");
				}
			  $("#squest1 option[id="+selq2+"]").remove();
			  $("#squest1 option[id="+selq1+"]").attr("selected", "selected");
		 }
	},
	getQuestions : function(){
		$('#squest1').val('');
		$('#squest2').val('');
	
	   	statesmodel.fetch({
    			success :function(model,result,xhr){
    				submit = true;
    				res = model.toJSON();
    				resp = res.Questions;
    				states = res.States;
    				for (var i = 0; i < resp.length; i++) {
						pid = resp[i].id;
						description = resp[i].description;
						$('#squest1').append("<option id="+pid+">" + description+ "</option>");
						$('#squest2').append("<option id="+pid+">" + description+ "</option>");
						}
    				for(var i=0 ;i<states.length;i++){
    					var scode = states[i].StateCode;
    				 	var sdesc  = states[i].StateDescription;
    				 	this.$('#mgenstate').append("<option name="+scode+">" + sdesc+ "</option>");
    				}
    	   				submit = false;
			    }
    	});
	},

	getstatezip : function(){
		$("#city").autocomplete({
		             source: "rest/autosuggest/city",
		             select: function(e, ui) {
		            	 e.preventDefault();
		            	 var city = ui.item.City;
		            	 var state = ui.item.State;
		            	 var zip 	= ui.item.Zipcode;
		            	 var county = ui.item.County;
		            	 $( "#city" ).val(city);
		            	 $('#mgenstate option[name='+state+']').prop('selected',true);
		            	 $('#county').val(county);
		            	 $('#zipcode').val(zip);
	              }	            
		    }).data("ui-autocomplete")._renderItem = function( ul, item ) {
		    	return $( "<li>" ).append( "<a>" + item.City + "," + item.State +", "+item.Zipcode+", "+item.County+" </a>")
		    	.appendTo(ul);
		    	};
	},
	getcitystate : function(){
		$("#zipcode").autocomplete({
           source       : "rest/autosuggest/zipcode",
           select: function(e, ui) {
          	 e.preventDefault();
          	 var city = ui.item.City;
          	 var state = ui.item.State;
          	 var county = ui.item.County;
          	 var zip 	= ui.item.Zipcode;
          	 $( "#city" ).val(city);
          	 $('#mgenstate option[name='+state+']').prop('selected',true);
          	 $('#county').val(county);
          	 $('#zipcode').val(zip);
            }
       }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
  	return $( "<li>" ).append( "<a>" + item.City + "," + item.State +", "+item.Zipcode+", "+item.County+"</a>")
  	.appendTo(ul);
  	};
	},

	register : function(){
		var title			= $('#title').val();
		var firstname		= $('#firstname').val();
		var lastname		= $('#lastname').val();
		var middleinitial 	= $('#middlename').val();
		var address1		= $('#address1').val();
		var address2		= $('#address2').val();
		var city			= $('#city').val();
		var state			= $('#mgenstate option:selected').attr("name");
		var zipcode			= $('#zipcode').val();
		var county			= $('#county').val();
		var email			= $('#email').val();
		var phone			= $('#phone').val();
		var ext				= $('#phoneext').val();
		var url				= $('#url').val();
		var fax 			= $('#fax').val();
		var	terms			= $('#termflag').val();
		var no1			    = parseInt($('#num1').val());
	  	var no2 			= parseInt($('#num2').val());
	  	var no3 			= parseInt($('#num3').val());
		var error 			= "";
		function  scrolltop (){
				$("html, body").animate({scrollTop: $("body").offset().top}, 1000);
			}
		function isValidEmailAddress(emailAddress) {
		    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		    return pattern.test(emailAddress);
		}
			if(!firstname || firstname == ""){
				error +="<br>"+"Firstname is required";
				$('#num3').val("");
				scrolltop();
			}if(!lastname || lastname == ""){
				error +="<br>"+"Lastname is required";
				$('#num3').val("");
				scrolltop();
			}if(!address1 || address1 == ""){
				error +="<br>"+"Address1 is required";
				$('#num3').val("");
				scrolltop();
			}if(!city || city == ""){
				error +="<br>"+"City is required";
				$('#num3').val("");
				scrolltop();
			}if(!state || state == "" || state=="select"){
				error +="<br>"+"State is required";
				$('#num3').val("");
				scrolltop();
			}if(!zipcode || zipcode == ""){
				error +="<br>"+"Zipcode is required";
				$('#num3').val("");
				scrolltop();
			}if(!isValidEmailAddress(email)){
				if(!email || email==""){
					error +="<br>"+"Email is required";
					$('#num3').val("");
					scrolltop();
				}else{
					error +="<br>"+"Email is invalid";
					$('#num3').val("");
					scrolltop();
				}
			}if(isNaN(no3)){
				error +="<br>"+"Captcha is required";
				$('#num3').val("");
				scrolltop();
			}if(!isNaN(no3)){
				if(no1 + no2 != no3){
		   			error +="<br>"+"Invalid Captcha";
		   			scrolltop();
		   			resetCaptcha();
		   			$('#num3').val("");
				}
			}if($('#termflag').is(":checked")==false){
				error +="<br>"+"Terms must be accepted";
				$('#num3').val("");
				scrolltop();
			}if(error.length >0){
				$('#errormsgs').html(error);
				scrolltop();
			}else{
				$('#errormsgs').html("");
				$('#errormsgs').text("");
				if(phone){
					var phones = $('#phone').val().match(/\d/g).join("");
				}else{
					var phones = $('#phone').val();
				}
				if(fax){
				  	var faxes =  $('#fax').val().match(/\d/g).join("");
				}else{
					var faxes =  $('#fax').val();
				}
		  	membmodel.set({
						title			: $('#title').val(),
						firstname		: $('#firstname').val(),
						lastname		: $('#lastname').val(),
						middleinitial 	: $('#middlename').val(),
						address1		: $('#address1').val(),
						address2		: $('#address2').val(),
						city			: $('#city').val(),
						county			: $('#county').val(),
						state			: $('#mgenstate option:selected').attr("name"),
						zipcode			: $('#zipcode').val(),
						phone			: phones,
						ext				: $('#phoneext').val(),
						url				: $('#url').val(),
						fax				: faxes,
						email			: $('#email').val(),
						terms			: $('#termflag').val(),
				      });
			membmodel.set({
				muserdetail : mreg
			});
		   mreg.save({}, {
				success : function(model, result, xhr){
					var status     = result.responseMessage;
					var message 	= status.message;
					var errorstatus = status.errorStatus;
					function scrolltop (){$("html, body").animate({scrollTop: $("body").offset().top}, 1000);}
					if(errorstatus == "0"){
							$('#errormsgs').text("");
							$('#member1').hide();
							$('#member2').hide();
							this.$('#msuccessmsg').show();
							scrolltop();
					}else if(errorstatus == "1"){
							$('#msuccessmsg').text("");
							$('#errormsgs').text(message);
							$('#num3').val("");
							resetCaptcha();
							scrolltop();
					}
				}
			});	
		}
			function resetCaptcha(){
				$.ajax({
	   				type : "GET",
	   			 url	 : "rest/register/random",
	   			 success : function(response){
	   				 var num1 = response.R1;
	   				 var num2 = response.R2;
	   				 $('#num1').val(num1);
	   				 $('#num2').val(num2);
	   			 	}
	   			});
			}	
			
	},
	getterms : function(e){
		e.preventDefault();
		var roletype = $.cookie('roletype');
		$.ajax({
			type : "GET",
			url	 : "rest/terms",
			data : {Role : roletype},
			success : function(response){
				var terms = response.terms;
				$('#section1').empty();
				$('#section1').append(terms);
				$("#section1").dialog({
					   closeOnEscape: true,
					   title:"Terms",
					   modal: true,
					   height: 600, 
					   width: 800,
					   open: function(event, ui) { $(".ui-dialog-titlebar-close", ui.dialog || ui).hide(); 
					 }
			 	});
			}
		});
	}
});
var mgetCaptchas = function(){
	var numbers = statesmodel.get("RandomNumbers");
	var n1 = numbers.R1;
	var n2 = numbers.R2;
	this.$('#num1').val(n1);
	this.$('#num2').val(n2);
};
