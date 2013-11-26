var resp, pid, description, scode, sdesc, selEle ,license ,fullDate;
var regmodel = new registerModel();
var statearray,nextClick=0;
var delstatearray = new Array();
var testcollection = new brokerLicenseCollection();
var registermodel = new registerDetailModel();
var bregister = new brokerRegister();
var submit = false;
var score = 0;
var brokerRegisterView = Backbone.View.extend({
			template : _.template($('#brokertemp').html()),
			initialize : function() {
				this.getQuestions();
				this.render();
			},
			render : function() {
				$(this.el).html(this.template());
				Backbone.Validation.bind(this, {
					valid : function(view, attr) {
					},
					invalid : function(view, attr, error) {
						$('#errormsg').text(error);
					}
				});
				return this;
			},
			events : {
				"change #squest1" : "reflect",
				"change #squest2" : "reflects",
				"click #next" : "next",
				"mouseover #passhint" : "showhints",
				"keyup #city" : "getstatezip",
				"keyup #zipcode" : "getcitystate",
				"click #register" : "register",
				"click #terms" : "getterms",
				"click #addnew" : "addlicense",
				"click :radio[name='ibroker']" : "getid",
				"click #backs" : "pview",
				"focus #phone" : "maskphone",
				"focus #taxid" : "masktaxid",
				"focus #fax"  : "maskfax",
				"click #back" : "getBack",
				"keyup #pass" : "pstrength",
				"focusout #pass":"hidePstrength"
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
				$('#errormsgs').text("");
				$('#broker2').hide();
				$('#num3').val("");
				$('#broker1').show();
			},

			maskphone : function() {
				$("#phone").mask("(999) 999-9999");
			},
			masktaxid : function() {
				$('#taxid').mask("99-9999999");
			},
			maskfax : function() {
				$("#fax").mask("(999) 999-9999");
			},
	
			showhints : function(e){
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

			next : function() {
				var roletype = $.cookie('roletype');
				$('#roletype').val(roletype);
				function scrolltop() {$("html, body").animate({scrollTop : $("body").offset().top}, 1000);
				}
				var error = "";
				function isValidEmailAddress(emailAddress) {
					var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
					return pattern.test(emailAddress);
				}

				function isPasswordValid(password) {
					var pattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]).{8,20}$)");
					return pattern.test(password);
				}

				function isUsernameValid(uname) {
					var pattern = new RegExp("/^[[:alnum:]]+(?:[-_ ]?[[:alnum:]]+)*$/");
					return pattern.test(uname);
				}

				function clearpass() {
					$('#pass').val('');
					$('#cfpass').val('');
				}
				var username = $('#uname').val();
				var password = $('#pass').val();
				var confirm = $('#cfpass').val();
				var roletype = $('#roletype').val();
				var questionid1 = $('#squest1 option:selected').attr("id");
				var answer1 = $('#sans1').val();
				var questionid2 = $('#squest2 option:selected').attr("id");
				var answer2 = $('#sans2').val();
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
						error += "<br>" + "Password is required";
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
				}
				if (!questionid1) {
					error += "<br>" + "Question id 1 is required";
					clearpass();
					scrolltop();
				}
				if (!answer1 || answer1=="") {
					error += "<br>"	+ "Security answer 1 is required";
					clearpass();
					scrolltop();
				}
				if (!questionid2) {
					error += "<br>" + "Question id 2 is required";
					clearpass();
					scrolltop();
				}
				if (!answer2 || answer2=="") {
					error += "<br>"+ "Security answer 2 is required";
					clearpass();
					scrolltop();
				}
				if (error.length > 0) {
					$('#errormsg').html(error);
					scrolltop();
				} else {
					$('#errormsg').html("");
					$('#errormsg').text("");
				registermodel.set({
						roletype : $('#roletype').val(),
						username : $('#uname').val(),
						password : $('#pass').val(),
						questionid1 : $('#squest1 option:selected').attr("id"),
						answer1 : $('#sans1').val(),
						questionid2 : $('#squest2 option:selected').attr("id"),
						answer2 : $('#sans2').val()
					});
					$('#broker1').hide();
					$('#pass').val("");
					$('#cfpass').val("");
					$('#broker2').show();
						bgetCaptcha();
					$('#firstname').focus();
					if(nextClick == 0){
						nextClick += 1;
						this.dataGrid();
					}
				}
			},
			reflect : function() {
				var selq1 = $('#squest1 option:selected').attr("id");
				var selq2 = $('#squest2 option:selected').attr("id");
				if (selq1) {
					$('#squest2 option[id]').remove();
					for ( var i = 0; i < resp.length; i++) {
						pid = resp[i].id;
						description = resp[i].description;
						$('#squest2').append(
								"<option id=" + pid + ">" + description	+ "</option>");
					}
					$("#squest2 option[id=" + selq1 + "]").remove();
					$("#squest2 option[id=" + selq2 + "]").attr("selected","selected");
				}
			},

			reflects : function() {
				var selq1 = $('#squest1 option:selected').attr("id");
				var selq2 = $('#squest2 option:selected').attr("id");
				if (selq2) {
					$('#squest1 option[id]').remove();
					for ( var i = 0; i < resp.length; i++) {
						pid = resp[i].id;
						description = resp[i].description;
						$('#squest1').append("<option id=" + pid + ">" + description+ "</option>");
					}
					$("#squest1 option[id=" + selq2 + "]").remove();
					$("#squest1 option[id=" + selq1 + "]").attr("selected","selected");
				}
			},
			getQuestions : function() {
				$('#squest1').val('');
				$('#squest2').val('');
				regmodel.fetch({
					success : function(model, result, xhr) {
						submit = true;
						res = model.toJSON();
						resp = res.Questions;
						states = res.States;
						for ( var i = 0; i < resp.length; i++) {
							pid = resp[i].id;
							description = resp[i].description;
							$('#squest1').append("<option id=" + pid + ">" + description+ "</option>");
							$('#squest2').append("<option id=" + pid + ">" + description+ "</option>");
						}
						for ( var i = 0; i < states.length; i++) {
							var scode = states[i].StateCode;
							var sdesc = states[i].StateDescription;
							this.$('#genstate').append("<option name=" + scode + ">" + sdesc+ "</option>");
						}
						submit = false;
					}
				});
			},
			getstatezip : function() {
				$("#city").autocomplete({
							source : "rest/autosuggest/city",
							select : function(e, ui) {
								e.preventDefault();
								var city = ui.item.City;
								var state = ui.item.State;
								var zip = ui.item.Zipcode;
								var county = ui.item.County;
								$('#genstate option[name=' + state + ']').prop('selected', true);
								$('#county').val(county);
								$("#city").val(city);
								$('#zipcode').val(zip);
							}
						}).data("ui-autocomplete")._renderItem = function(ul,
						item) {
					return $("<li>").append("<a>" + item.City + "," + item.State + ", "	+ item.Zipcode + ", " + item.County+ "</a>").appendTo(ul);
				};
			},
			getcitystate : function() {
				$("#zipcode").autocomplete({
							source : "rest/autosuggest/zipcode",
							select : function(e, ui) {
								e.preventDefault();
								var city = ui.item.City;
								var state = ui.item.State;
								var zip = ui.item.Zipcode;
								var county = ui.item.County;
								$('#genstate option[name=' + state + ']').prop('selected', true);
								$('#county').val(county);
								$("#city").val(city);
								$('#zipcode').val(zip);
							}
						}).data("ui-autocomplete")._renderItem = function(ul,item) {
					return $("<li>").append("<a>" + item.City + "," + item.State + ", "	+ item.Zipcode + ", " + item.County+ "</a>").appendTo(ul);
				};
			},

			
			checkcollection : function() {
				if (testcollection.length == 0) {
					//empty delete array
					delstatearray=[];
					selEle = "";
					states = regmodel.get("States");
					statearray = states.slice(0);
				} else {
					for ( var i = 0; i < statearray.length; i++) {
						if (statearray[i] != null) {
							if (statearray[i].StateCode == selEle) {
								delete statearray[i];
							}
						}else{
							  delete statearray[i];
						}
					}
					for(var j=0;j<delstatearray.length;j++)	{
						for ( var i = 0; i < states.length; i++) {
							if (states[i].StateCode == delstatearray[j]) {
								statearray.push({StateCode:states[i].StateCode,StateDescription:states[i].StateDescription});
							}
						}
					}
					//empty delete array
					delstatearray=[];
					
				}
			},
			
			addlicense : function() {
				if(testcollection.length > 0){
					if(!scode || scode == "" || scode =="select"){
						alert("State must be selected");
						return false;
					}else if(!license || license ==""){
						alert("license cannot be null");
						return false;
					}else if(!fullDate || fullDate == ""){
						alert("Date must be entered");
						return false;
					}else if(testcollection.length==states.length){
						$('#addnew').attr('disabled',true);
					}else{
						this.checkcollection();
						$('.state').attr("disabled", true);
						grid.insertRow(new brokerLicense({livesIn : bregister}));
						scode=license=fullDate=null;
						return true;
					}
				}else if(testcollection.length == 0){
					this.checkcollection();
					scode=license=fullDate=null;
					grid.insertRow(new brokerLicense({livesIn : bregister}));
				}
			},
			getid : function() {
				var value = $('input:radio[name=ibroker]:checked').attr("value");
				if (value == 1) {
					$('#mandateagency').hide();
				}
				if (value == 0) {
					$('#mandateagency').show();
				}
			},
				
		register : function() {
				var firstname = $('#firstname').val();
				var lastname = $('#lastname').val();
				var middleinitial = $('#middlename').val();
				var address1 = $('#address1').val();
				var address2 = $('#address2').val();
				var city = $('#city').val();
				var state = $('#genstate option:selected').attr("name");
				var zipcode = $('#zipcode').val();
				var county = $('#county').val();
				var email = $('#email').val();
				var phone = $('#phone').val();
				var ext = $('#phoneext').val();
				var url = $('#url').val();
				var fax = $('#fax').val();
				var taxid = $('#taxid').val();
				var indbroker = $('input:radio[name=ibroker]:checked').attr("value");
				var agencyname = $('#agencyname').val();
				var terms = $('#termflag').val();
				var no1 = parseInt($('#num1').val());
				var no2 = parseInt($('#num2').val());
				var no3 = parseInt($('#num3').val());
				var error = "";
				function isValidEmailAddress(emailAddress) {
					var pattern = new RegExp(
							/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
					return pattern.test(emailAddress);
				}
				function scrolltop() {
					$("html, body").animate({scrollTop : $("body").offset().top	}, 1000);
				}
				if (!firstname || firstname == "") {
					error += "<br>" + "First Name is required";
					$('#num3').val("");
					scrolltop();
				}
				if (!lastname || lastname == "") {
					error += "<br>" + "Last Name is required";
					$('#num3').val("");
					scrolltop();
				}
				if (!address1 || address1 == "") {
					error += "<br>" + "Address 1 is required";
					$('#num3').val("");
					scrolltop();
				}		
				if (!city || city == "") {
					error += "<br>" + "City is required";
					$('#num3').val("");
					scrolltop();
				}
				if (!state || state == "") {
					error += "<br>" + "State is required";
					$('#num3').val("");
					scrolltop();
				}
				if (!zipcode || zipcode == "") {
					error += "<br>" + "Zip Code is required";
					$('#num3').val("");
					scrolltop();
				}if(!email || email==""){
					error += "<br>" + "Email is required";
					$('#num3').val("");
					scrolltop();
				}if(email){
					if (!isValidEmailAddress(email)) {
						error += "<br>" + "Email is invalid";
						$('#num3').val("");
						scrolltop();
					}
				}		
				if (!phone || phone == "") {
					error += "<br>" + "Phone is required";
					$('#num3').val("");
					scrolltop();
				}			
				if (indbroker == 0) {
					if (!agencyname || agencyname == "") {
						error += "<br>" + "Agency name is required";
						$('#num3').val("");
						scrolltop();
					}
				}
			   if (isNaN(no3)) {
					error += "<br>" + "Captcha is required";
					$('#num3').val("");
					scrolltop();
				}
				if (!isNaN(no3)) {
					if (no1 + no2 != no3) {
						error += "<br>" + "Invalid Captcha";
						scrolltop();
						resetCaptcha();
						$('#num3').val("");
					}
				}
				if ($('#termflag').is(":checked") == false) {
					error += "<br>" + "Terms should be accepted";
					scrolltop();
				}
				if (error.length > 0) {
					$('#errormsgs').html(error);
					scrolltop();
				} else {
					$('#errormsgs').html("");
					$('#errormsgs').text("");
					if(testcollection.length>0){
						var test = testcollection.toJSON();
						var lrecord = test[test.length-1];
						if(lrecord.statecode =="" || lrecord.statecode =="select"){
							alert("State must be selected");
							return false;
						}if(lrecord.license==""){
							alert("License must be selected");
							return false;
						}if(lrecord.dateofexpiry ==""){
							alert("Date of expiry must be selected");
							return false;
						}
					}
					$('#spambot').fadeOut('fast');
					var phones = $('#phone').val().match(/\d/g).join("");
					if(fax){
						var faxes = $('#fax').val().match(/\d/g).join("");
					}else{
						var faxes = $('#fax').val();
					}

					registermodel.set({
						firstname : firstname,
						lastname : lastname,
						middleinitial : middleinitial,
						address1 : address1,
						address2 : address2,
						city : city,
						state : $('#genstate option:selected').attr("name"),
						county : county,
						zipcode : zipcode,
						phone : phones,
						ext : ext,
						fax : faxes,
						url : url,
						title : $('#title option:selected').text(),
						email : email,
						terms : $('#termflag').val(),
					});
					if(taxid){
						var taxides = $('#taxid').val().match(/\d/g).join("");
					}else{
						var taxides = $('#taxid').val();
					}
					bregister.set({
						indbroker : $('input:radio[name=ibroker]:checked').attr("value"),
						agencyname : $('#agencyname').val(),
						taxid : taxides
					});
				registermodel.set({
						register11 : bregister
					});
					bregister.save({}, {
						success : function(model, result, xhr) {
							function scrolltop() {
								$("html, body").animate({scrollTop : $("body").offset().top}, 1000);
							}
							var status     = result.responseMessage;
							var message 	= status.message;
							var errorstatus = status.errorStatus;
							if (errorstatus == "0") {
								$('#errormsgs').text("");
								$('#broker1').hide();
								$('#broker2').hide();
					       this.$('#bsuccessmsg').show();
								scrolltop();
							} else if (errorstatus == "1") {
								$('#bsuccessmsg').text("");
								$('#errormsgs').text(message);
								resetCaptcha();
								scrolltop();
								$('#num3').val("");
							} 
						}
					});
				}
				function resetCaptcha() {
					$.ajax({
						type : "GET",
						url : "rest/register/random",
						success : function(response) {
							var num1 = response.R1;
							var num2 = response.R2;
							$('#num1').val(num1);
							$('#num2').val(num2);
						}
					});
				}

			},
	dataGrid : function() {
		collection = new brokerLicenseCollection();
			var columns = [{
							name : "statecell",
							label : "State",
							cell : Backgrid.StringCell.extend({
										template : _.template('<select class="state"><option>select</option></select>'),
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
										for ( var i = 0; i < statearray.length; i++) {
											if (statearray[i] != null) {
												var statecode = statearray[i].StateCode;
												var statedesc = statearray[i].StateDescription;
									   		    this.$('.state').append("<option statecode="+ statecode	+ ">"+ statedesc+ "</option>");
												}
											}
									var stest = this;
									stest.model = this.model;
									this.$('.state option[statecode='+ this.model.get("statecode")+ ']').attr('selected', true);
									var sel = $('.state option:selected').attr("statecode");
									this.$('.state').change('select',function() {
												scode = $(this).find('option:selected').attr('statecode');
												selEle = scode;
												stest.model.set({
																   statecode : scode
											 	});
												if(testcollection.length == states.length){
													$('#addnew').attr("disabled",true);
												}
											});
											return this;
										},
									}),
							editable : false,
							sortable : false
						},
						{
							name : "licensecell",
							label : "License #",
							cell : Backgrid.StringCell.extend({
										template : _.template('<input type="text" class="licenses" maxlength="20"/>'),
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											var test = this;
											test.model = this.model;
											this.$('.licenses').val(this.model.get("license"));
											this.$('.licenses').keyup('input',function() {
													license = $(this).val();
														test.model.set({
															license : license
														});
													});
											return this;
										},
									}),
							editable : false,
							sortable : false
						},
						{
							name : "dateCell",
							label : "Date of Expiry",
							cell : Backgrid.StringCell
									.extend({
										template : _.template('<input type="text" class="datepicker" readonly="readonly"/>'),
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											var that = this;
											that.model = this.model;
											this.$('.datepicker').val(this.model.get("dateofexpiry"));
											this.$('.datepicker ').datepicker({
													dateFormat : 'mm-dd-yy',
													changeMonth : true,
													changeYear : true,
													minDate : 0,
													onSelect : function() {
															var day1 = that.$(".datepicker").datepicker('getDate').getDate();
															var month1 = that.$(".datepicker").datepicker('getDate').getMonth() + 1;
															var year1 = that.$(".datepicker").datepicker('getDate').getFullYear();
															fullDate = year1+ "-"+ month1+ "-"+ day1;
															that.model.set("dateofexpiry",	fullDate);
														}
											});
											return this;
										},
									}),
							editable : false,
							sortable : false
						},{
							name : 'Delete',
							cell : Backgrid.Cell.extend({
										template : _.template('<div align="center"><img id="remove" src="images/close1.png"></div>'),
										events : {
											"click #remove" : "deleteRow"
										},
										deleteRow : function(e) {
											e.preventDefault();
											var rmstate = this.model.get("statecode");
											delstatearray.push(rmstate);
											
												if(rmstate==""){
													
													rmstate=null;
													
												}if(rmstate==scode){
													
														scode=license=fullDate="*********";//cannot be null..put empty string
														
												}
											this.model.destroy();
											testcollection.remove(this.model);
											if(testcollection.length < states.length){
												$('#addnew').attr("disabled",false);
											}
									},
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											return this;
										}
									}),
									sortable : false,
									editable : false
						} ];
				grid = new Backgrid.Grid({
					columns : columns,
					collection : testcollection,
				});
				this.$("#grids").append(grid.render().$el);
				this.$("#grids").append($('#statusbuttons'));
				if(testcollection.length==0){
					this.addlicense();
				}
				$('.box').css({"margin-top":0});
				$('.box').css({"margin-bottom":0});
			},
			getterms : function(e) {
				e.preventDefault();
				var roletype = $.cookie('roletype');
				$.ajax({
					type : "GET",
					url : "rest/terms",
					data : {
						Role : roletype
					},
					success : function(response) {
						var terms = response.terms;
						$('#section1').empty();
						$('#section1').append(terms);
						$("#section1").dialog({
									closeOnEscape : true,
									title : "Terms",
									modal : true,
									height : 600,
									width : 800,
									open : function(event, ui) {
										$(".ui-dialog-titlebar-close",ui.dialog || ui).hide();
									}
								});
					}
				});
			}
		});
var bgetCaptcha = function() {
	var numbers = regmodel.get("RandomNumbers");
	var n1 = numbers.R1;
	var n2 = numbers.R2;
	this.$('#num1').val(n1);
	this.$('#num2').val(n2);
};
