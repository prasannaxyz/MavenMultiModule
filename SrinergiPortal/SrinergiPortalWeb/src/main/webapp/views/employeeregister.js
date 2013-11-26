var resp,pid,description,scode,sdesc;
var eregister = new employeeRegister();
var modeltesting = new registerModel();
var registermodel = new registerDetailModel();
var submit = false;
var states,score=0;
var randomnumbers;
var employeeRegisterView = Backbone.View.extend({
	template : _.template($('#employeetemp').html()),
	initialize : function(){
		this.getQuestions();
		this.render();
	},
	render : function(){
		$(this.el).html(this.template());
		Backbone.Validation.bind(this, {
		      valid: function(view, attr) {},
		      invalid: function(view, attr, error) {
		      	   alert(error);
		      }
		    });
		return this;
	},
	events : {
		"change #squest1"     : "reflect",
		"change #squest2"     : "reflects",
		"click #next"	      : "next",
		"focus #etaxid"	  	  : "masktax",
		"mouseover #passhint" : "showhints",
		"keyup #ecity"  	  : "getstatezip",
		"keyup #ezipcode"	  : "getcitystate",
		"click #register" 	  : "register",
		"focus #ephone"		  : "maskphone",
		"click #terms"	  	  : "getterms",
		"focus #efax"		  : "maskfax",
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
		$('#errormsg').text("");
		$('#errormsg').html("");
		$('#employ2').hide();
		$('#enum3').val("");
		$('#employ1').show();
	},
	
	masktax : function(){
		$('#etaxid').mask("99-9999999");
	},
	
    maskphone : function (){
	   	$("#ephone").mask("(999) 999-9999");
    },
    
    maskfax : function(){
 	    $("#efax").mask("(999) 999-9999");
	 },
	 
	showhints : function(e){
		e.preventDefault();
		var hint = $('#passhin').html();
	    $('#passhint').attr("title",hint);
		    $(function() {
		    	$(document).tooltip({
		    	position: {
		    	my: "center bottom-20",
		    	at: "center top",
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
			var pattern = new RegExp("^[a-zA-Z0-9_-]$");
			return pattern.test(uname);
		}
		var error	  = "";
		
		function clearpass(){
			$('#pass').val('');
			$('#cfpass').val('');	
		}
		var username 		= $('#uname').val();
		var password 		= $('#pass').val();
		var confirm 		= $('#cfpass').val();
		var roletype	    = $('#roletype').val();
		var groupno			= $('#groupno').val();
		var taxid			= $('#etaxid').val();
		var questionid1		= $('#squest1 option:selected').attr("id");
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
		}if(!questionid1){
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
			if(taxid){
				var taxid = $('#etaxid').val().match(/\d/g).join("");
			}else{
				var taxid = $('#etaxid').val();
			}
			$.ajax({
				type : "GET",
				data : {groupno : groupno},
				url : "rest/employee/groupdetails",
				success : function(response) {
					var status = response.responseMessage;
					var message= status.message;
					var errorstatus = status.errorStatus;
				if(errorstatus =="0"){
					var addrdetails = response.groupAddressDetails;
					var name 		= addrdetails.name;
					var tax 		= addrdetails.tax;
					var url 		= addrdetails.URL;
					var address1	= addrdetails.address1;
					var address2	= addrdetails.address2;
					var city 		= addrdetails.city;
					var county 		= addrdetails.county;
					var zipcode	 	= addrdetails.zipcode;
					var statecode 	= addrdetails.statecode;
					var phone	 	= addrdetails.phone;
					var ext		 	= addrdetails.phext;
					var fax		 	= addrdetails.FAX;
					registermodel.set({
							roletype	    : $('#roletype').val(),	
							username 		: $('#uname').val(),
							password 		: $('#pass').val(),
							questionid1		: $('#squest1 option:selected').attr("id"),
							answer1			: $('#sans1').val(),
							questionid2		: $('#squest2 option:selected').attr("id"),
							answer2			: $('#sans2').val()
						});	
						eregister.set({
							groupno			: $('#groupno').val(),
							group_name 		: name,
							taxid   		: taxid
							});
						$('#errormsgs').text("");
						$('#employ1').hide();
						$('#pass').val("");
						$('#cfpass').val("");
						eGetCaptcha();
						$('#employ2').show();
						$('#efirstname').focus();
						$('#egroupname').val(name);
						$('#eaddress1').val(address1);
 						$('#eaddress2').val(address2);
 						$('#ecity').val(city);
 						$('#egenstate option[name='+statecode+']').prop("selected",true);
 						$('#ezipcode').val(zipcode);
 						$('#ecounty').val(county);
 						$('#ephone').val(phone);
 						$('#ephoneext').val(ext);
 						$('#eurl').val(url);
 						$('#efax').val(fax);
						}else if(errorstatus == "1"){
							$('#errormsg').text(message);	
						}
					}

				});
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
		modeltesting.fetch({
    			success :function(model,result,xhr){
    				submit = true;
    				res = model.toJSON();
    				resp = res.Questions;
    				states = res.States;
    				randomnumbers = res.RandomNumbers;
    				for (var i = 0; i < resp.length; i++) {
						pid = resp[i].id;
						description = resp[i].description;
						$('#squest1').append("<option id="+pid+">" + description+ "</option>");
						$('#squest2').append("<option id="+pid+">" + description+ "</option>");
						}
    			    for(var i=0 ;i<states.length;i++){
    						var scode = states[i].StateCode;
    					 	var sdesc  = states[i].StateDescription;
    					 this.$('#egenstate').append("<option name="+scode+">" + sdesc+ "</option>");
    					}
    				submit = false;
			    }
    	});
	},
	getstatezip : function(){
		$("#ecity").autocomplete({
		             source: "rest/autosuggest/city",
		             select: function(e, ui) {
		            	 e.preventDefault();
		            	 var city = ui.item.City;
		            	 var state = ui.item.State;
		            	 var zip 	= ui.item.Zipcode;
		            	 var county = ui.item.County;
		            	 $( "#ecity" ).val(city);
		            	 $('#ecounty').val(county);
		            	 $('#egenstate option[name='+state+']').prop('selected',true);
		            	 $('#ezipcode').val(zip);
	              }	            
		    }).data("ui-autocomplete")._renderItem = function( ul, item ) {
		    	return $( "<li>" ).append( "<a>" + item.City + "," + item.State +", "+item.Zipcode+", "+item.County+"</a>")
		    	.appendTo(ul);
		    	};
	},

	getcitystate : function(){
		$("#ezipcode").autocomplete({
           source       : "rest/autosuggest/zipcode",
           select: function(e, ui) {
          	 e.preventDefault();
          	 var city = ui.item.City;
          	 var state = ui.item.State;
          	 var zip 	= ui.item.Zipcode;
          	 var county = ui.item.County;
          	 $( "#ecity" ).val(city);
          	 $('#ecounty').val(county);
          	 $('#egenstate option[name='+state+']').prop('selected',true);
          	 $('#ezipcode').val(zip);
            }
       }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
  	return $( "<li>" ).append( "<a>" + item.City + "," + item.State +", "+item.Zipcode+", "+item.County+"</a>")
  	.appendTo(ul);
  	};
	},

	register : function(){
		function  scrolltop (){$("html, body").animate({scrollTop: $("body").offset().top}, 1000);}
		function isValidEmailAddress(emailAddress) {
		    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		    return pattern.test(emailAddress);
		};
				var title			= $('#etitle').val();
				var firstname		= $('#efirstname').val();
				var lastname		= $('#elastname').val();
				var middleinitial 	= $('#emiddlename').val();
				var address1		= $('#eaddress1').val();
				var address2		= $('#eaddress2').val();
				var city			= $('#ecity').val();
				var state			= $('#egenstate option:selected').attr("name");
				var zipcode			= $('#ezipcode').val();
				var email			= $('#eemail').val();
				var	terms			= $('#etermflag').val();
				var phone			= $('#ephone').val();
				var url				= $('#eurl').val();
				var fax				= $('#efax').val();
				var phoneext		= $('#ephoneext').val();
				var no1 			= parseInt($('#enum1').val());
		  		var no2 			= parseInt($('#enum2').val());
		  		var no3 			= parseInt($('#enum3').val());
		   		var error 			= "";

		   		if(!firstname || firstname == ""){
	 				error +="<br>"+"First Name is required";
	 				$('#enum3').val("");
	 				scrolltop();
	 			}if(!lastname || lastname == ""){
	 				error +="<br>"+"Last Name is required";
	 				$('#enum3').val("");
	 				scrolltop();
	 			}if(!address1 || address1 == ""){
	 				error +="<br>"+"Address 1 is required";
	 				$('#enum3').val("");
	 				scrolltop();
	 			}if(!city || city == ""){
	 				error +="<br>"+"City is required";
	 				$('#enum3').val("");
	 				scrolltop();
	 			}if(!state || state == ""){
	 				error +="<br>"+"State is required";
	 				$('#enum3').val("");
	 				scrolltop();
	 			}if(!zipcode || zipcode == ""){
	 				error +="<br>"+"Zip Code is required";
	 				$('#enum3').val("");
	 				scrolltop();
	 			}if(!isValidEmailAddress(email)){
	 				if(!email || email==""){
		 				error +="<br>"+"Email is required";
		 				$('#enum3').val("");
		 				scrolltop();
	 				}else{
	 					error +="<br>"+"Email is invalid";
		 				$('#enum3').val("");
		 				scrolltop();
	 				}
	 			}if(!phone || phone == ""){
	 				error +="<br>"+"Phone is required";
	 				$('#enum3').val("");
	 				scrolltop();
	 			}if(isNaN(no3)){
	 				error +="<br>"+"Captcha is required";
	 				$('#enum3').val("");
	 				scrolltop();
	 			}if(!isNaN(no3)){
					if(no1 + no2 != no3){
			   			error +="<br>"+"Invalid Captcha";
			   			scrolltop();
			   			resetCaptcha();
			   			$('#enum3').val("");
					}
				}if($('#etermflag').is(":checked")==false){
	 				error +="<br>"+"Terms should be accepted";
		   			scrolltop();
	 			}if(error.length >0){
	 				$('#errormsgs').html(error);
	 				scrolltop();
	 			}else{
	 				$('#errormsgs').html("");
	 				$('#errormsgs').text("");
	 				$('#spambot').fadeOut('fast');
	 				if(phone){
	 					var phones = $('#ephone').val().match(/\d/g).join("");
	 				}else{
	 					var phones = $('#ephone').val();
	 				}
	 				if(fax){
	 					var faxid   = $('#efax').val().match(/\d/g).join("");
	 				}else{
	 					var faxid   = $('#efax').val();
	 				}
	 		 registermodel.set({
	 		      					title			: $('#etitle').val(),
	 		 						firstname		: $('#efirstname').val(),
	 		 						lastname		: $('#elastname').val(),
	 		 						middleinitial 	: $('#emiddlename').val(),
	 		 						address1		: $('#eaddress1').val(),
	 		 						address2		: $('#eaddress2').val(),
	 		 						city			: $('#ecity').val(),
	 		 						state			: $('#egenstate option:selected').attr("name"),
	 		 						zipcode			: $('#ezipcode').val(),
	 		 						county 			: $('#ecounty').val(),
	 		 						phone			: phones,
	 		 						ext				: $('#ephoneext').val(),
	 		 						url				: $('#eurl').val(),
	 		 						fax				: faxid,
	 		 						email			: $('#eemail').val(),
	 		 						terms			: $('#etermflag').val()
	 		   });
	 		registermodel.set({
	 	 			euserdetail : eregister
	 	  	  });
	 	     eregister.save({}, {
				success : function(model, result, xhr){
					var status     = result.responseMessage;
					var message 	= status.message;
					var errorstatus = status.errorStatus;
					function scrolltop(){
						$("html, body").animate({scrollTop: $("body").offset().top}, 1000);
					}	
					if(errorstatus == "0"){
						$('#errormsgs').html("");
						$('#errormsgs').text("");
						$('#employ1').hide();
						$('#employ2').hide();
				   this.$('#esuccessmsg').show();
						scrolltop();
							
					}else if(errorstatus == "1"){
						    $('#esuccessmsg').html("");
							$('#errormsgs').text(message);
							$('#enum3').val("");
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
	   				 $('#enum1').val(num1);
	   				 $('#enum2').val(num2);
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


var eGetCaptcha = function(){
		var numbers = modeltesting.get("RandomNumbers");
		    var n1 = numbers.R1;
			var n2 = numbers.R2;
			this.$('#enum1').val(n1);
			this.$('#enum2').val(n2);
	  };	
