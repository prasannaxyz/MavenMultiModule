(function($) {
	$.fn.flash_message = function(options) {
		options = $.extend({
			text : 'Done',
			time : 2000,
			how : 'before',
			class_name : ''
		}, options);

		return $(this).each(function() {
			if ($(this).parent().find('.flash_message').get(0))
				return;

			var message = $('<span />', {
				'class' : 'flash_message ' + options.class_name,
				text : options.text
			}).hide().fadeIn('fast');

			$(this)[options.how](message);

			message.delay(options.time).fadeOut('normal', function() {
				$(this).remove();
			});
		});
	};
})(jQuery);
var pagecollection;
var selrole = "BRKR";
var lgrid, clgrid, roledesc, recid, roledescs, rlcode, stcode, selEle, license, fullDate;
var statearray, statuscode;
var delstatearray = new Array();
var bccollection, columns;
var parentModel;
var registrationManagementView = Backbone.View
		.extend({
			template : _.template($('#registertemp').html()),
			initialize : function() {
				this._modelBinder = new Backbone.ModelBinder();
			},
			render : function() {
				$(this.el).html(this.template());
				Backbone.Relational.store.reset();
				columns = [
						{
							name : "username",
							label : "User Name",
							cell : Backgrid.UriCell.extend({
								render : function() {
									Backgrid.UriCell.prototype.render
											.call(this);
									this.$('a').attr('href',
											this.model.get("id"));
									this.$('a').attr('id', "getId");
									return this;
								}
							}),
							editable : false,
						},
						{
							name : "name",
							label : "Name",
							cell : "string",
							editable : false,
						},
						{
							name : "role",
							label : "Role",
							cell : "string",
							editable : false,
						},
						{
							name : "email",
							label : "E-mail",
							cell : Backgrid.UriCell.extend({
								render : function() {
									var status = this.model.get("status");
									if (status == "Pending") {
										Backgrid.UriCell.prototype.render
												.call(this);
										this.$('a').attr('href',
												this.model.get("id"));
										this.$('a').attr('id', "getName");
									} else {
										Backgrid.StringCell.prototype.render
												.call(this);
									}
									return this;
								}
							}),
							editable : false,
							sortable : false
						}, {
							name : "submitteddate",
							label : "Submitted Date",
							cell : "string",
							editable : false
						}, {
							name : "actiondate",
							label : "Action Date",
							cell : "string",
							editable : false

						}, {
							name : "status",
							label : "Status",
							cell : "string",
							editable : false

						} ];
				loginrole = $.cookie("role");
				if (loginrole == "CMGR") {
					columns = [ {
						name : "checkbox",
						cell : "select-row",
						headerCell : "select-all",
					} ].concat(columns);
				} else {
					var that = this;
					that.$('#approve').hide();
					that.$('#nregister').hide();
				}
				var regcollection = new registerCollection();
				var response = this.collection.toJSON();
				regdetails = response[0].registration;
				states = response[0].states;
				roles = response[0].roles;
				doctype = response[0].documents;
				statuscode = response[0].StatusCodes;
				estatus = response[0].responseMessage;
				errorstatus = estatus.errorStatus;
				message = estatus.message;
				if (errorstatus == "0") {
					for ( var i = 0; i < regdetails.length; i++) {
						var registerParent = new registerManageModel({
							id : regdetails[i].id,
							role : regdetails[i].role,
							username : regdetails[i].username,
							name : regdetails[i].name,
							title : regdetails[i].title,
							firstname : regdetails[i].firstname,
							lastname : regdetails[i].lastname,
							submitteddate : regdetails[i].submitteddate,
							actiondate : regdetails[i].actiondate,
							middleinitial : regdetails[i].middleinitial,
							address1 : regdetails[i].address1,
							address2 : regdetails[i].address2,
							groupno : regdetails[i].groupno,
							taxid : regdetails[i].taxid,
							email : regdetails[i].email,
							city : regdetails[i].city,
							agencyname : regdetails[i].agencyname,
							county : regdetails[i].county,
							zipcode : regdetails[i].zipcode,
							phone : regdetails[i].phone,
							phext : regdetails[i].phext,
							indbroker : regdetails[i].indbroker,
							fax : regdetails[i].fax,
							state : regdetails[i].state,
							ssn : regdetails[i].ssn,
							comments : regdetails[i].comments,
							status : regdetails[i].status
						});
						var license = regdetails[i].brokerlicense;
						for ( var j = 0; j < license.length; j++) {

							var bromodel = new brokerLicense({
								id : license[j].id,
								statecode : license[j].statecode,
								license : license[j].license,
								dateofexpiry : license[j].dateofexpiry,
								blicense : registerParent
							});
						}
						regcollection.add(registerParent);
					}
					this.dataGrid(regcollection.toJSON());
					for ( var i = 0; i < statuscode.length; i++) {
						var scode = statuscode[i].Status;
						var sdesc = statuscode[i].Description;
						this.$('#filterstatus').append(
								"<option statuscode=" + scode + " statusdesc="
										+ sdesc + ">" + sdesc + "</option>");
					}

					for ( var i = 0; i < roles.length; i++) {
						var rcode = roles[i].Role_Code;
						var rdesc = roles[i].Role_Desc;
						var rtype = roles[i].Role_Type;
						this.$('#filterrole').append(
								"<option roletype=" + rtype + " rolecode="
										+ rcode + " roledesc=" + rdesc + ">"
										+ rdesc + "</option>");
					}
				} else if (errorstatus == "2") {
					alert(message);
					this.clearCookies();
				}
				this._modelBinder = new Backbone.ModelBinder();
				return this;
			},

			events : {
				"click #approve" : "Approve",
				"click #nregister" : "NewRegister",
				"click #addnew" : "Addnew",
				"click #uploadfile" : "upload",
				"keyup #zipcode" : "getcitystate",
				"keyup #city" : "getstatezip",
				"click #cancel" : "cancel",
				"click #submit" : "Submitform",
				"click #getId" : "dataPopulation",
				"click #getName" : "emailPopulate",
				"change #role" : "changeRole",
				"click :radio[name='ibroker']" : "getid",
				"click #filtersearch" : "filtersearch",
				"keyup #groupno" : "getEGroups",
				"keyup #mgroupno" : "getMGroups",
				"keyup #searchfilter" : "getSearchDetails"
			},

			getSearchDetails : function(event) {
				var search = this;
				if (event.which == 13 || event.keyCode == 13) {
					var searchname = $('#searchfilter').val();
					$.ajax({
						type : "GET",
						data : {
							Title : searchname
						},
						url : "rest/rmgmt/registrationDetails",
						success : function(response) {
							var status = response.responseMessage;
							var errorstatus = status.errorStatus;
							var message = status.message;
							if (errorstatus == "0") {
								var rcollect = response.registration;
								search.dataGrid(rcollect);
							} else if (errorstatus == "2") {
								alert(message);
								search.clearCookies();
							}
						}
					});
				}
			},

			clearCookies : function() {
				$.removeCookie("authtoken");
				$.removeCookie("firstName");
				$.removeCookie("lastName");
				$.removeCookie("lastLogin");
				$.removeCookie("role");
				$.removeCookie("roletype");
				window.location = "login.html";
			},

			getEGroups : function() {
				$("#groupno").autocomplete({
					source : "rest/autosuggest/benefitAdmin/groupids",
					select : function(e, ui) {
						e.preventDefault();
						var groupno = ui.item.groupNumber;
						$('#groupno').val(groupno);
					}
				}).data("ui-autocomplete")._renderItem = function(ul, item) {
					return $("<li>").append(
							"<a>" + item.groupNumber + " " + item.groupName
									+ "</a>").appendTo(ul);
				};
			},
			getMGroups : function() {
				$("#mgroupno").autocomplete({
					source : "rest/autosuggest/member/groupids",
					select : function(e, ui) {
						e.preventDefault();
						var groupno = ui.item.groupNumber;
						$('#mgroupno').val(groupno);
					}
				}).data("ui-autocomplete")._renderItem = function(ul, item) {
					return $("<li>").append("<a>" + item.groupNumber + "</a>")
							.appendTo(ul);
				};
			},

			getid : function() {
				var value = $('input:radio[name=ibroker]:checked')
						.attr("value");
				if (value == 1) {
					$('#mandateagency').hide();
				}
				if (value == 0) {
					$('#mandateagency').show();
				}
			},

			/* Populating the Data from the model */

			dataPopulation : function(e) {
				e.preventDefault();
				$('#userroles').hide();
				this.$('#grids').empty();
				this.$("#brokerdoc").empty();
				var id = parseInt($(e.currentTarget).attr("href"));
				console.log(id);
				parentModel = pagecollection.get(id);
				var rolecode = parentModel.get("role");
				var rolecode = parentModel.get("role");
				var id = parentModel.get("id");
				var title = parentModel.get("title");
				var username = parentModel.get("name");
				var firstname = parentModel.get("firstname");
				var lastname = parentModel.get("lastname");
				var middleinitial = parentModel.get("middleinitial");
				var address1 = parentModel.get("address1");
				var address2 = parentModel.get("address2");
				var groupno = parentModel.get("groupno");
				var taxid = parentModel.get("taxid");
				var email = parentModel.get("email");
				var city = parentModel.get("city");
				var agency = parentModel.get("agencyname");
				var county = parentModel.get("county");
				var zipcode = parentModel.get("zipcode");
				var phone = parentModel.get("phone");
				var ext = parentModel.get("phext");
				var indbroker = parentModel.get("indbroker");
				var fax = parentModel.get("fax");
				var statecodes = parentModel.get("state");
				var ssn = parentModel.get("ssn");
				var status = parentModel.get("status");
				var comments = parentModel.get("comments");
				var licenseArray = parentModel.get("brokerlicense").toJSON();
				var complianceArray = parentModel.get("compliance");
				$('#registersection').show();
				if (rolecode == "Broker") {
					var brokLicense = null;
					$('.box').css({
						"margin-top" : 10
					});
					$('.box').css({
						"margin-bottom" : 10
					});
					$('#errormsgs').text("");
					$('#errormsgs').html("");
					$('#successmsg').text("");
					this.template = _.template($('#brokerdetailtemp').html());
					$($('#registersection')).html(this.template());
					this.template1 = _.template($('#admintemp').html());
					$('#adminsection1').html(this.template1());
					if (status == "Active") {
						this.$('#submit').hide();
						this.$('#addnew').hide();
						this.$('#uploadfile').hide();
						this.$('#fileToUpload').attr("disabled", true);
						statearray = states.slice(0);
						var abcollection = new brokerLicenseCollection(
								licenseArray);
						this.brokerGrid(abcollection);
						if (abcollection.length == 0) {
							$('.statelist').attr("disabled", false);
						} else {
							$('.statelist').attr("disabled", true);
						}

						$('#addnew').attr('disabled', true);
						$('#bcdocuments').hide();
						/*
						 * var abccollection = new
						 * brokerComplianceCollection(complianceArray);
						 * this.brokerCompliance(abccollection);
						 */
						$('#active').attr("checked", "checked");
					} else if (status == "Reject") {
						this.$('#submit').hide();
						$('#reject').attr("checked", "checked");
					} else if (status == "Pending") {
						$('#pending').attr("checked", "checked");
						this.$('#submit').show();
						bccollection = new brokerComplianceCollection();

						for ( var i = 0; i < regdetails.length; i++) {
							if (regdetails[i].id == id) {
								brokLicense = regdetails[i].brokerlicense;
								break;
							}
						}
						parentModel.set({
							"brokerlicense" : brokLicense
						});
						statearray = states.slice(0);
						bcollection = new brokerLicenseCollection(brokLicense);
						this.brokerGrid(bcollection);
						if (brokLicense != null) {
							for ( var i = 0; i < brokLicense.length; i++) {
								for ( var j = 0; j < statearray.length; j++) {
									if (statearray[j] != null) {
										if (brokLicense[i].statecode == statearray[j].stateCode) {
											delete statearray[j];
										}
									}
								}
							}
						}
						if (brokLicense == null || brokLicense.length == 0) {
							stcode = license = fullDate = selEle = null;
						} else {
							stcode = license = fullDate = "********";
							selEle = null;
						}
						$('.statelist').attr("disabled", true);
						this.brokerCompliance(bccollection);
					}
					$('#taxid').focus();
					for ( var i = 0; i < roles.length; i++) {
						var rcode = roles[i].Role_Code;
						var rdesc = roles[i].Role_Desc;
						rtype = roles[i].Role_Type;
						$('#role').append(
								"<option roletype=" + rtype + " rolecode="
										+ rcode + " roledesc=" + rdesc + ">"
										+ rdesc + "</option>");
					}
					for ( var i = 0; i < states.length; i++) {
						var scode = states[i].stateCode;
						var sdesc = states[i].stateDescription;
						$('#state').append(
								"<option name=" + scode + ">" + sdesc
										+ "</option>");
						$('#cstate').append(
								"<option name=" + scode + ">" + sdesc
										+ "</option>");
					}
					for ( var i = 0; i < doctype.length; i++) {
						var dcode = doctype[i].Code;
						var dtype = doctype[i].Doc_Type;
						var desc = doctype[i].Description;
						$('#doctype').append(
								"<option code=" + dcode + ">" + desc
										+ "</option>");
					}
					$('#taxid').mask("99-9999999");
					$("#phone").mask("(999) 999-9999");
					$("#fax").mask("(999) 999-9999");
					$('#title').val(title);
					$('#firstname').val(firstname);
					$('#lastname').val(lastname);
					$('#middlename').val(middleinitial);
					$('#address1').val(address1);
					$('#address2').val(address2);
					$('#taxid').val(taxid);
					$('#email').val(email);
					$('#city').val(city);
					$('#agencyname').val(agency);
					$('#county').val(county);
					$('#zipcode').val(zipcode);
					$('#phone').val(phone);
					$('#phoneext').val(ext);
					$('input:radio[name=ibroker][value=' + indbroker + ']')
							.attr('checked', 'checked');
					$('#fax').val(fax);
					$('#state option[name=' + statecodes + ']').prop(
							'selected', true);
					$('#comment1').val(comments);
				} else if (rolecode == "Employer") {
					$('#errormsgs').html("");
					$('#errormsgs').text("");
					$('#successmsg').text("");
					this.template = _.template($('#employeedetailtemp').html());
					$('#registersection').html(this.template());
					this.template1 = _.template($('#admintemp').html());
					$($('#adminsection2')).html(this.template1());
					if (status == "Active") {
						$('#active').attr("checked", "checked");
						this.$('#submit').hide();

					} else if (status == "Reject") {
						$('#reject').attr("checked", "checked");
						this.$('#submit').hide();
					} else if (status == "Pending") {
						$('#pending').attr("checked", "checked");
						this.$('#submit').show();
						$('#groupno').attr('readonly', true);
					}
					$('#fax').focus();
					for ( var i = 0; i < roles.length; i++) {
						var rcode = roles[i].Role_Code;
						var rdesc = roles[i].Role_Desc;
						$('#role').append(
								"<option rolecode=" + rcode + ">" + rdesc
										+ "</option>");
					}
					$('#taxid').mask("99-9999999");
					$("#phone").mask("(999) 999-9999");
					$("#fax").mask("(999) 999-9999");
					$('#firstname').val(firstname);
					$('#lastname').val(lastname);
					$('#middlename').val(middleinitial);
					$('#address1').val(address1);
					$('#address2').val(address2);
					$('#groupno').val(groupno);
					$('#taxid').val(taxid);
					$('#email').val(email);
					$('#county').val(county);
					$('#phone').val(phone);
					$('#phoneext').val(ext);
					$('#fax').val(fax);
					$('#city').val(city);
					$('#zipcode').val(zipcode);
					for ( var i = 0; i < states.length; i++) {
						var scode = states[i].stateCode;
						var sdesc = states[i].stateDescription;
						$('#state').append(
								"<option name=" + scode + ">" + sdesc
										+ "</option>");
					}
					$('#state option[name=' + statecodes + ']').prop(
							'selected', true);
					$('#comment1').val(comments);
				} else if (rolecode == "Member") {
					$('#errormsgs').text("");
					$('#errormsgs').html("");
					$('#successmsg').text("");
					this.template = _.template($('#memberdetailtemp').html());
					$('#registersection').html(this.template());
					this.template1 = _.template($('#admintemp').html());
					$($('#adminsection3')).html(this.template1());
					if (status == "Active") {
						$('#active').attr("checked", "checked");
						this.$('#submit').hide();
					} else if (status == "Reject") {
						this.$('#submit').hide();
						$('#reject').attr("checked", "checked");
					} else if (status == "Pending") {
						$('#pending').attr("checked", "checked");
						this.$('#submit').show();
					}
					$('#fax').focus();
					for ( var i = 0; i < roles.length; i++) {
						var rcode = roles[i].Role_Code;
						var rdesc = roles[i].Role_Desc;
						$('#role').append(
								"<option rolecode=" + rcode + ">" + rdesc
										+ "</option>");
					}
					for ( var i = 0; i < states.length; i++) {
						var scode = states[i].stateCode;
						var sdesc = states[i].stateDescription;
						$('#state').append(
								"<option name=" + scode + ">" + sdesc
										+ "</option>");
					}
					$('#ssn').mask("999-99-9999");
					$("#phone").mask("(999) 999-9999");
					$("#fax").mask("(999) 999-9999");
					$('#firstname').val(firstname);
					$('#lastname').val(lastname);
					$('#middlename').val(middleinitial);
					$('#address1').val(address1);
					$('#address2').val(address2);
					$('#mgroupno').val(groupno);
					$('#ssn').val(ssn);
					$('#county').val(county);
					$('#email').val(email);
					$('#phone').val(phone);
					$('#phoneext').val(ext);
					$('#city').val(city);
					$('#fax').val(fax);
					$('#zipcode').val(zipcode);
					$('#state option[name=' + statecodes + ']').prop(
							'selected', true);
					$('#comment1').val(comments);
				}
			},
			/* Sending an Email from dialog window */

			emailPopulate : function(e) {
				e.preventDefault();
				var id = parseInt($(e.currentTarget).attr("href"));
				console.log(id);
				parentModel = pagecollection.get(id);
				var rolecode = parentModel.get("role");
				var email = parentModel.get("email");
				this.template = _.template($('#emailtemp').html());
				$('#section1').html("");
				$('#section1').append(this.template());
				$("#section1").dialog({
					closeOnEscape : true,
					title : "Email",
					modal : true,
					height : 400,
					width : 550,
					open : function(event, ui) {
						$(".ui-dialog-titlebar-close", ui.dialog || ui).hide();
					}
				});
				$('#emailto').val(email);
				$('#sendmail').click(function() {
					var emailto = $('#emailto').val();
					var emailfrom = $('#emailfrom').val();
					var message = $('#message').val();
					var subject = $('#subject').val();
					var error = "";
					if (!emailto || emailto == "") {
						error += "To address must be entered" + "<br>";
					}
					if (!emailfrom || emailfrom == "") {
						error += "From address must be entered" + "<br>";
					}
					if (!subject || subject == "") {
						error += "Subject must be entered" + "<br>";
					}
					if (!message || message == "") {
						error += "Message must be entered" + "<br>";
					}
					if (error.length > 0) {
						$('#errors').html(error);
					} else {
						$.ajax({
							type : "POST",
							url : "rest/mail",
							data : {
								to : emailto,
								from : emailfrom,
								subject : subject,
								message : message,
							},
							success : function(response) {
								var errorstatus = response.errorstatus;
								var msg = response.message;
								if (errorstatus == 0) {
									$("#section1").dialog('close');
									$('#successmsg').flash_message({
										text : 'Email Sent Successfully',
										how : 'append'
									});
								} else if (errorstatus == 1) {
									$('#successmsg').html("");
									$('#errors').html(msg);
								}
							}
						});
					}
				});
			},
			Submitform : function() {
				var that = this;
				var role = $('#role').val();
				/* Creating New Users */
				if (parentModel.isNew()) {
					console.log("New Record");
					if (role == "Employer") {
						function scrolltop() {
							$("html, body").animate({
								scrollTop : $("body").offset().top
							}, 1000);
						}
						function isValidEmailAddress(emailAddress) {
							var pattern = new RegExp(
									/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
							return pattern.test(emailAddress);
						}
						;
						var title = $('#title').val();
						var firstname = $('#firstname').val();
						var lastname = $('#lastname').val();
						var middleinitial = $('#middlename').val();
						var address1 = $('#address1').val();
						var address2 = $('#address2').val();
						var city = $('#city').val();
						var state = $('#state option:selected').attr("name");
						var zipcode = $('#zipcode').val();
						var phone = $('#phone').val();
						var taxid = $('#taxid').val();
						var groupno = $('#groupno').val();
						var fax = $('#fax').val();
						var ext = $('#phoneext').val();
						var email = $('#email').val();
						var error = "";

						if (!firstname || firstname == "") {
							error += "<br>" + "First Name is required";
							scrolltop();
						}
						if (!lastname || lastname == "") {
							error += "<br>" + "Last Name is required";
							scrolltop();
						}
						if (!address1 || address1 == "") {
							error += "<br>" + "Address 1 is required";
							scrolltop();
						}
						if (!city || city == "") {
							error += "<br>" + "City is required";
							scrolltop();
						}
						if (!state || state == "") {
							error += "<br>" + "State is required";
							scrolltop();
						}
						if (!groupno || groupno == "") {
							error += "<br>" + "Group Number is required";
							scrolltop();
						}
						if (!email || email == "") {
							error += "<br>" + "Email is required";
							scrolltop();
						}
						if (email) {
							if (!isValidEmailAddress(email)) {
								error += "<br>" + "Email is invalid";
								scrolltop();
							}
						}
						if (!zipcode || zipcode == "") {
							error += "<br>" + "Zip Code is required";
							scrolltop();
						}
						if (!phone || phone == "") {
							error += "<br>" + "Phone is required";
							scrolltop();
						}
						if (error.length > 0) {
							$('#errormsgs').html(error);
							scrolltop();
						} else {
							$('#errormsgs').html("");
							$('#errormsgs').text("");
							if (taxid) {
								var taxids = $('#taxid').val().match(/\d/g)
										.join("");
							} else {
								var taxids = $('#taxid').val();
							}
							if (phone) {
								var phones = $('#phone').val().match(/\d/g)
										.join("");
							} else {
								var phones = $('#phone').val();
							}
							if (fax) {
								var faxid = $('#fax').val().match(/\d/g).join(
										"");
							} else {
								var faxid = $('#fax').val();
							}
							parentModel.set({
								role : "EMP",
								title : $('#title option:selected').text(),
								firstname : $.trim($('#firstname').val()),
								lastname : $.trim($('#lastname').val()),
								middleinitial : $.trim($('#middlename').val()),
								address1 : $.trim($('#address1').val()),
								address2 : $.trim($('#address2').val()),
								city : $.trim($('#city').val()),
								state : $('#state option:selected')
										.attr("name"),
								zipcode : $.trim($('#zipcode').val()),
								phone : phones,
								phext : $.trim($('#phoneext').val()),
								county : $('#county').val(),
								fax : faxid,
								email : $.trim($('#email').val()),
								groupno : $.trim($('#groupno').val()),
								taxid : taxids
							});
							parentModel.url = "rest/employee/insertemp";
							parentModel.save({}, {
								success : function(model, result, xhr) {
									var status 		= result.responseMessage;
									var message 	= status.message;
									var errorstatus = status.errorStatus;
									function scrolltop() {	$("html, body").animate({scrollTop : $("body").offset().top}, 1000);}
									if (errorstatus == "0") {
										$('#registersection').hide();
										$('#errormsgs').text("");
										$('#errormsgs').html("");
										$('#userroles').hide();
										$('#successmsg').flash_message({
											text : 'User created successfully',
											how : 'append'
										});
										scrolltop();
									} else if (errorstatus == "1") {
										$('#successmsg').html("");
										$('#errormsgs').flash_message({
											text : message,
											how : 'append'
										});
										scrolltop();
									} else if (errorstatus == "2") {
										alert(message);
										that.clearCookies();
									}
								}
							});
						}
					} else if (role == "Member") {
						function scrolltop() {	$("html, body").animate({scrollTop : $("body").offset().top}, 1000);}
						function isValidEmailAddress(emailAddress) {
							var pattern = new RegExp(
									/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
							return pattern.test(emailAddress);
						}
						;
						var title = $('#title option:selected').text();
						var firstname = $('#firstname').val();
						var lastname = $('#lastname').val();
						var middleinitial = $('#middlename').val();
						var address1 = $('#address1').val();
						var address2 = $('#address2').val();
						var city = $('#city').val();
						var ssn = $('#ssn').val();
						var phone = $('#phone').val();
						var ext = $('#phoneext').val();
						var groupno = $('#mgroupno').val();
						var fax = $('#fax').val();
						var state = $('#state option:selected').attr("name");
						var zipcode = $('#zipcode').val();
						var email = $('#email').val();
						var error = "";

						if (!firstname || firstname == "") {
							error += "<br>" + "First Name is required";
							scrolltop();
						}
						if (!lastname || lastname == "") {
							error += "<br>" + "Last Name is required";
							scrolltop();
						}
						if (!address1 || address1 == "") {
							error += "<br>" + "Address 1 is required";
							scrolltop();
						}
						if (!ssn || ssn == "") {
							error += "<br>" + "SSN is required";
							scrolltop();
						}
						if (!email || email == "") {
							error += "<br>" + "Email is required";
							scrolltop();
						}
						if (email) {
							if (!isValidEmailAddress(email)) {
								error += "<br>" + "Email is invalid";
								scrolltop();
							}
						}
						if (!groupno || groupno == "") {
							error += "<br>" + "Group Number is required";
							scrolltop();
						}
						if (!city || city == "") {
							error += "<br>" + "City is required";
							scrolltop();
						}
						if (!state || state == "") {
							error += "<br>" + "State is required";
							scrolltop();
						}
						if (!zipcode || zipcode == "") {
							error += "<br>" + "Zipcode is required";
							scrolltop();
						}
						if (error.length > 0) {
							$('#errormsgs').html(error);
							scrolltop();
						} else {
							$('#errormsgs').html("");
							$('#errormsgs').text("");
							if (ssn) {
								var ssns = $('#ssn').val().match(/\d/g)
										.join("");
							} else {
								var ssns = $('#ssn').val();
							}

							if (phone) {
								var phones = $('#phone').val().match(/\d/g)
										.join("");
							} else {
								var phones = $('#phone').val();
							}
							if (fax) {
								var faxid = $('#fax').val().match(/\d/g).join(
										"");
							} else {
								var faxid = $('#fax').val();
							}

							parentModel.set({
								role 			: "MEM",
								title 			: $('#title option:selected').text(),
								firstname 		: $.trim($('#firstname').val()),
								lastname 		: $.trim($('#lastname').val()),
								middleinitial 	: $.trim($('#middlename').val()),
								address1 		: $.trim($('#address1').val()),
								address2 		: $.trim($('#address2').val()),
								city 			: $.trim($('#city').val()),
								state 			: $('#state option:selected').attr("name"),
								zipcode 		: $.trim($('#zipcode').val()),
								county 			: $('#county').val(),
								phone 			: phones,
								phext 			: $.trim($('#phoneext').val()),
								fax 			: faxid,
								email 			: $.trim($('#email').val()),
								groupno 		: $.trim($('#mgroupno').val()),
								ssn 			: ssns
							});
									parentModel.url = "rest/member/insertmember",
									parentModel.save({},{

														success : function(model, result,xhr) {
															var status 		= result.responseMessage;
															var message 	= status.message;
															var errorstatus = status.errorStatus;
															$('#userroles').hide();
															function scrolltop() {	$("html, body").animate({scrollTop : $("body").offset().top},1000);}
															if (errorstatus == "0") {
																$('#registersection').hide();
																$('#errormsgs').text("");
																$('#errormsgs').html("");
																$('#userroles').hide();
																$('#successmsg').flash_message({
																		text : 'User created successfully',
																		how : 'append'
																});
																scrolltop();
															} else if (errorstatus == "1") {
																$('#successmsg').text("");
																$('#errormsgs').flash_message({
																					text : message,
																					how : 'append'
																				});
																scrolltop();
															} else if (errorstatus == "2") {
																alert(message);
																that.clearCookies();
															}
														}
													});
						}
					} else if (role == "Broker") {
						var title = $('#title').val();
						var firstname = $('#firstname').val();
						var lastname = $('#lastname').val();
						var middleinitial = $('#middlename').val();
						var address1 = $('#address1').val();
						var address2 = $('#address2').val();
						var city = $('#city').val();
						var state = $('#state option:selected').attr("name");
						var zipcode = $('#zipcode').val();
						var county = $('#county').val();
						var email = $('#email').val();
						var agencyname = $('#agencyname').val();
						var taxid = $('#taxid').val();
						var phone = $('#phone').val();
						var indbroker = $('input:radio[name=ibroker]:checked')
								.attr("value");
						var ext = $('#phoneext').val();
						var fax = $('#fax').val();
						var error = "";
						function isValidEmailAddress(emailAddress) {
							var pattern = new RegExp(
									/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
							return pattern.test(emailAddress);
						}
						function scrolltop() {
							$("html, body").animate({
								scrollTop : $("body").offset().top
							}, 1000);
						}
						if (!firstname || firstname == "") {
							error += "<br>" + "First Name is required";
							scrolltop();
						}
						if (!lastname || lastname == "") {
							error += "<br>" + "Last Name is required";
							scrolltop();
						}
						if (!address1 || address1 == "") {
							error += "<br>" + "Address1 is required";
							scrolltop();
						}
						if (!city || city == "") {
							error += "<br>" + "City is required";
							scrolltop();
						}
						if (!state || state == "") {
							error += "<br>" + "State is required";
							scrolltop();
						}
						if (!zipcode || zipcode == "") {
							error += "<br>" + "Zip Code is required";
							scrolltop();
						}
						if (!email || email == "") {
							error += "<br>" + "Email is required";
							scrolltop();
						}
						if (email) {
							if (!isValidEmailAddress(email)) {
								error += "<br>" + "Email is invalid";
								scrolltop();
							}
						}
						if (!phone || phone == "") {
							error += "<br>" + "Phone is required";
							scrolltop();
						}
						if (indbroker == 0) {
							if (!agencyname || agencyname == "") {
								error += "<br>" + "Agency name is required";
								scrolltop();
							}
						}
						if (error.length > 0) {
							$('#errormsgs').html(error);
							scrolltop();
						} else {
							$('#errormsgs').html("");
							$('#errormsgs').text("");

							if (bcollection.length > 0) {
								var test = bcollection.toJSON();
								var lrecord = test[test.length - 1];
								if (lrecord.statecode == ""
										|| lrecord.statecode == null) {
									alert("State must be selected");
									return false;
								}
								if (lrecord.license == "") {
									alert("License must be selected");
									return false;
								}
								if (lrecord.dateofexpiry == "") {
									alert("Date of expiry must be selected");
									return false;
								}
							}
							if (taxid) {
								var taxids = $('#taxid').val().match(/\d/g)
										.join("");
							} else {
								var taxids = $('#taxid').val();
							}
							var phones = $('#phone').val().match(/\d/g)
									.join("");
							if (fax) {
								var faxid = $('#fax').val().match(/\d/g).join(
										"");
							} else {
								var faxid = $('#fax').val();
							}

							parentModel.set({
								role 			: "BRKR",
								firstname 		: $.trim($('#firstname').val()),
								lastname 		: $.trim($('#lastname').val()),
								middleinitial 	: $.trim($('#middlename').val()),
								address1 		: $.trim($('#address1').val()),
								address2 		: $.trim($('#address2').val()),
								city 			: $.trim($('#city').val()),
								state 			: $('#state option:selected').attr("name"),
								county 			: $('#county').val(),
								zipcode 		: $.trim($('#zipcode').val()),
								phone 			: phones,
								phext 			: $.trim($('#phoneext').val()),
								fax 			: faxid,
								taxid 			: taxids,
								title 			: $('#title option:selected').text(),
								email 			: $.trim($('#email').val()),
								indbroker 		: $('input:radio[name=ibroker]:checked').attr("value"),
								agencyname 		: $.trim($('#agencyname').val()),
							});
							parentModel.url = "rest/broker/insertbroker";
							parentModel.save({},{
								success : function(model, result, xhr) {
									function scrolltop() {$("html, body").animate({scrollTop : $("body").offset().top},1000);}
									var status 		= result.responseMessage;
									var message 	= status.message;
									var errorstatus = status.errorStatus;

									if (errorstatus == "0") {
										$('#registersection').hide();
										$('#errormsgs').text("");
										$('#userroles').hide();
										$('#successmsg').flash_message({
											text : 'User created successfully',
											how : 'append'
										});
										scrolltop();
									} else if (errorstatus == "1") {
										$('#successmsg').html("");
										$('#errormsgs').flash_message({
											text : message,
											how : 'append'
										});
										scrolltop();
									} else if (errorstatus == "2") {
										alert(message);
										that.clearCookies();
									}
								}
							});
						}
					} else if (role == "Content Manager") {
						var title 			= $('#title').val();
						var firstname 		= $.trim($('#firstname').val());
						var lastname 		= $.trim($('#lastname').val());
						var middleinitial	= $.trim($('#middlename').val());
						var email 			= $.trim($('#email').val());
						var phone 			= $('#phone').val();
						var ext 			= $.trim($('#phoneext').val());
						var fax 			= $("#fax").val();
						var rlcode 			= $('#rolecode').attr("rolecode");
						var error 			= "";
						function isValidEmailAddress(emailAddress) {
							var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
							return pattern.test(emailAddress);
						}
						function scrolltop() {$("html, body").animate({scrollTop : $("body").offset().top},1000);}
						if (!firstname || firstname == "") {
							error += "<br>" + "First Name is required";
							scrolltop();
						}
						if (!lastname || lastname == "") {
							error += "<br>" + "Last Name is required";
							scrolltop();
						}
						if (!email || email == "") {
							error += "<br>" + "Email is required";
							scrolltop();
						}
						if (email) {
							if (!isValidEmailAddress(email)) {
								error += "<br>" + "Email is invalid";
								scrolltop();
							}
						}
						if (!phone || phone == "") {
							error += "<br>" + "Phone is required";
							scrolltop();
						}
						if (error.length > 0) {
							$('#errormsgs').html(error);
							scrolltop();
						} else {
							$('#errormsgs').html("");
							$('#errormsgs').text("");
							if (fax) {
								var faxid = $('#fax').val().match(/\d/g).join(
										"");
							} else {
								var faxid = $('#fax').val();
							}
							if (phone) {
								var phones = $('#phone').val().match(/\d/g)
										.join("");
							} else {
								var phones = $('#phone').val();
							}
							var contmanage = new internaluser({
								title 			: title,
								firstname 		: firstname,
								lastname 		: lastname,
								middleinitial 	: middleinitial,
								phone 			: phones,
								ext	 			: ext,
								fax 			: faxid,
								email 			: email,
								rolecode 		: rlcode
							});
							contmanage.url = "rest/iuser/insertUser";
							contmanage.save({}, {
								success : function(model, result, xhr) {
									function scrolltop() {$("html, body").animate({scrollTop : $("body").offset().top}, 1000);}
									var status 		= result.responseMessage;
									var message 	= status.message;
									var errorstatus = status.errorStatus;

									if (errorstatus == "0") {
										$('#registersection').hide();
										$('#errormsgs').text("");
										$('#userroles').hide();
										$('#successmsg').flash_message({
											text : 'User created successfully',
											how : 'append'
										});
										scrolltop();
									} else if (errorstatus == "1") {
										$('#successmsg').text("");
										$('#errormsgs').flash_message({
											text : message,
											how : 'append'
										});
										scrolltop();
									} else if (errorstatus == "2") {
										alert(message);
										that.clearCookies();
									}
								}
							});
						}
					} else if (role == "Content User") {
						var title 			= $('#title').val();
						var firstname 		= $.trim($('#firstname').val());
						var lastname 		= $.trim($('#lastname').val());
						var middleinitial 	= $.trim($('#middlename').val());
						var email 			= $.trim($('#email').val());
						var phone 			= $('#phone').val();
						var fax 			= $('#fax').val();
						var ext 			= $.trim($('#phoneext').val());
						var rlcode 			= $('#rolecode').attr("rolecode");
						var error 			= "";
						function isValidEmailAddress(emailAddress) {
							var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
							return pattern.test(emailAddress);
						}
						function scrolltop() {$("html, body").animate({scrollTop : $("body").offset().top},1000);}
						if (!firstname || firstname == "") {
							error += "<br>" + "First Name is required";
							scrolltop();
						}
						if (!lastname || lastname == "") {
							error += "<br>" + "Last Name is required";
							scrolltop();
						}
						if (!email || email == "") {
							error += "<br>" + "Email is required";
							scrolltop();
						}
						if (email) {
							if (!isValidEmailAddress(email)) {
								error += "<br>" + "Email is invalid";
								scrolltop();
							}
						}
						if (!phone || phone == "") {
							error += "<br>" + "Phone is required";
							scrolltop();
						}
						if (error.length > 0) {
							$('#errormsgs').html(error);
							scrolltop();
						} else {
							$('#errormsgs').html("");
							$('#errormsgs').text("");
							if (fax) {
								var faxid = $('#fax').val().match(/\d/g).join(
										"");
							} else {
								var faxid = $('#fax').val();
							}
							if (phone) {
								var phones = $('#phone').val().match(/\d/g)
										.join("");
							} else {
								var phones = $('#phone').val();
							}
							var contmanage = new internaluser({
								title 		: title,
								firstname : firstname,
								lastname : lastname,
								middleinitial : middleinitial,
								phone : phones,
								fax : faxid,
								ext : ext,
								email : email,
								rolecode : rlcode

							});
							contmanage.url = "rest/iuser/insertUser";
							contmanage.save({}, {
								success : function(model, result, xhr) {
									function scrolltop(){$("html, body").animate({scrollTop : $("body").offset().top}, 1000);}
									var status 		= result.responseMessage;
									var message 	= status.message;
									var errorstatus = status.errorStatus;
									if (errorstatus == "0") {
										$('#registersection').hide();
										$('#errormsgs').text("");
										$('#errormsgs').html("");
										$('#userroles').hide();
										$('#successmsg').flash_message({
											text : 'User created successfully',
											how : 'append'
										});
										scrolltop();
									} else if (errorstatus == "1") {
										$('#successmsg').html("");
										$('#successmsg').text("");
										$('#errormsgs').flash_message({
											text : message,
											how : 'append'
										});
										scrolltop();
									} else if (errorstatus == "2") {
										alert(message);
										that.clearCookies();
									}
								}
							});
						}
					} else if (role == "Admin") {
						var title = $('#title').val();
						var firstname = $.trim($('#firstname').val());
						var lastname = $.trim($('#lastname').val());
						var middleinitial = $.trim($('#middlename').val());
						var email = $.trim($('#email').val());
						var phone = $('#phone').val();
						var fax = $('#fax').val();
						var ext = $.trim($('#phoneext').val());
						var rlcode = $('#rolecode').attr("rolecode");
						var error = "";
						function isValidEmailAddress(emailAddress) {
							var pattern = new RegExp(
									/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
							return pattern.test(emailAddress);
						}
						function scrolltop() {
							$("html, body").animate({
								scrollTop : $("body").offset().top
							}, 1000);
						}
						if (!firstname || firstname == "") {
							error += "<br>" + "First Name is required";
							scrolltop();
						}
						if (!lastname || lastname == "") {
							error += "<br>" + "Last Name is required";
							scrolltop();
						}
						if (!email || email == "") {
							error += "<br>" + "Email is required";
							scrolltop();
						}
						if (email) {
							if (!isValidEmailAddress(email)) {
								error += "<br>" + "Email is invalid";
								scrolltop();
							}
						}
						if (!phone || phone == "") {
							error += "<br>" + "Phone is required";
							scrolltop();
						}
						if (error.length > 0) {
							$('#errormsgs').html(error);
							scrolltop();
						} else {
							$('#errormsgs').html("");
							$('#errormsgs').text("");
							if (fax) {
								var faxid = $('#fax').val().match(/\d/g).join(
										"");
							} else {
								var faxid = $('#fax').val();
							}
							if (phone) {
								var phones = $('#phone').val().match(/\d/g)
										.join("");
							} else {
								var phones = $('#phone').val();
							}
							var contmanage = new internaluser({
								title : title,
								firstname : firstname,
								lastname : lastname,
								middleinitial : middleinitial,
								phone : phones,
								fax : faxid,
								ext : ext,
								email : email,
								rolecode : rlcode

							});
							contmanage.url = "rest/iuser/insertUser";
							contmanage.save({}, {
								success : function(model, result, xhr) {
									function scrolltop() {
										$("html, body").animate({
											scrollTop : $("body").offset().top
										}, 1000);
									}
									var status 		= result.responseMessage;
									var message 	= status.message;
									var errorstatus = status.errorStatus;
									
									if (errorstatus == "0") {
										$('#registersection').hide();
										$('#errormsgs').text("");
										$('#errormsgs').html("");
										$('#userroles').hide();
										$('#successmsg').flash_message({
											text : 'User created successfully',
											how : 'append'
										});
										scrolltop();
									} else if (errorstatus == "1") {
										$('#successmsg').html("");
										$('#successmsg').text("");
										$('#errormsgs').flash_message({
											text : message,
											how  : 'append'
										});
										scrolltop();
									} else if (errorstatus == "2") {
										alert(message);
										that.clearCookies();
									}
								}
							});
						}
					} else if (role == "Internal Sales Rep") {
						var title = $('#title').val();
						var firstname = $('#firstname').val();
						var lastname = $('#lastname').val();
						var middleinitial = $('#middlename').val();
						var email = $('#email').val();
						var fax = $('#fax').val();
						var phone = $('#phone').val();
						var ext = $('#phoneext').val();
						var rlcode = $('#rolecode').attr("rolecode");
						var error = "";
						function isValidEmailAddress(emailAddress) {
							var pattern = new RegExp(
									/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
							return pattern.test(emailAddress);
						}
						function scrolltop() {
							$("html, body").animate({
								scrollTop : $("body").offset().top
							}, 1000);
						}
						if (!firstname || firstname == "") {
							error += "<br>" + "First Name is required";
							scrolltop();
						}
						if (!lastname || lastname == "") {
							error += "<br>" + "Last Name is required";
							scrolltop();
						}
						if (!email || email == "") {
							error += "<br>" + "Email is required";
							scrolltop();
						}
						if (email) {
							if (!isValidEmailAddress(email)) {
								error += "<br>" + "Email is invalid";
								scrolltop();
							}
						}
						if (!phone || phone == "") {
							error += "<br>" + "Phone is required";
							scrolltop();
						}
						if (error.length > 0) {
							$('#errormsgs').html(error);
							scrolltop();
						} else {
							$('#errormsgs').html("");
							$('#errormsgs').text("");
							if (fax) {
								var faxid = $('#fax').val().match(/\d/g).join(
										"");
							} else {
								var faxid = $('#fax').val();
							}
							if (phone) {
								var phones = $('#phone').val().match(/\d/g)
										.join("");
							} else {
								var phones = $('#phone').val();
							}
							var contmanage = new internaluser({
								title : title,
								firstname : firstname,
								lastname : lastname,
								middleinitial : middleinitial,
								phone : phones,
								fax : faxid,
								ext : ext,
								email : email,
								rolecode : rlcode

							});
							contmanage.url = "rest/iuser/insertUser";
							contmanage.save({}, {
								success : function(model, result, xhr) {
									function scrolltop() {$("html, body").animate({scrollTop : $("body").offset().top}, 1000);}
									var status 		= result.responseMessage;
									var message 	= status.message;
									var errorstatus = status.errorStatus;
									if (errorstatus == "0") {
										$('#registersection').hide();
										$('#errormsgs').text("");
										$('#errormsgs').html("");
										$('#userroles').hide();
										$('#successmsg').flash_message({
											text : 'User created successfully',
											how : 'append'
										});
										scrolltop();
									} else if (errorstatus == "1") {
										$('#successmsg').html("");
										$('#errormsgs').flash_message({
											text : message,
											how : 'append'
										});
										scrolltop();
									} else if (errorstatus == "2") {
										alert(message);
										that.clearCookies();
									}
								}
							});
						}
					}
				}
				/* Updating Existing Records */

				else {
					var that = this;
					var role = parentModel.get("role");
					var recid = parentModel.get("id");
					console.log("existing record" + recid + " " + role);
					if (role == "Employer") {
						function scrolltop(){$("html, body").animate({scrollTop : $("body").offset().top}, 1000);}
						function isValidEmailAddress(emailAddress) {
							var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
							return pattern.test(emailAddress);
						};
						var title = $('#title').val();
						var firstname = $('#firstname').val();
						var lastname = $('#lastname').val();
						var middleinitial = $('#middlename').val();
						var address1 = $('#address1').val();
						var address2 = $('#address2').val();
						var city = $('#city').val();
						var state = $('#state option:selected').attr("name");
						var zipcode = $('#zipcode').val();
						var email = $('#email').val();
						var phone = $('#phone').val();
						var groupno = $('#groupno').val();
						var taxid = $('#taxid').val();
						var fax = $('#fax').val();
						var ext = $('#phoneext').val();
						var status = $('input[name="statusmsg"]:checked').val();
						var error = "";
						if (!firstname || firstname == "") {
							error += "<br>" + "First Name is required";
							scrolltop();
						}
						if (!lastname || lastname == "") {
							error += "<br>" + "Last Name is required";
							scrolltop();
						}
						if (!address1 || address1 == "") {
							error += "<br>" + "Address1 is required";
							scrolltop();
						}
						if (!city || city == "") {
							error += "<br>" + "City is required";
							scrolltop();
						}
						if (!state || state == "") {
							error += "<br>" + "State is required";
							scrolltop();
						}
						if (!zipcode || zipcode == "") {
							error += "<br>" + "Zip Code is required";
							scrolltop();
						}
						if (!email || email == "") {
							error += "<br>" + "Email is required";
							scrolltop();
						}
						if (email) {
							if (!isValidEmailAddress(email)) {
								error += "<br>" + "Email is invalid";
								scrolltop();
							}
						}
						if (!groupno || groupno == "") {
							error += "<br>" + "Group Number is required";
							scrolltop();
						}
						if (!phone || phone == "") {
							error += "<br>" + "Phone is required";
							scrolltop();
						}
						if (!status || status == "") {
							error += "<br>" + "Status is required";
							scrolltop();
						}
						if (error.length > 0) {
							$('#errormsgs').html(error);
							scrolltop();
						} else {
							$('#errormsgs').html("");
							$('#errormsgs').text("");
							if (taxid) {
								var taxids = $('#taxid').val().match(/\d/g)
										.join("");
							} else {
								var taxids = $('#taxid').val();
							}
							var phones = $('#phone').val().match(/\d/g)
									.join("");
							if (fax) {
								var faxid = $('#fax').val().match(/\d/g).join(
										"");
							} else {
								var faxid = $('#fax').val();
							}

							var today = new Date();
							var dd = today.getDate();
							var mm = today.getMonth() + 1;
							var yyyy = today.getFullYear();
							if (dd < 10) {
								dd = '0' + dd;
							}
							if (mm < 10) {
								mm = '0' + mm;
							}
							var cdate = mm + '-' + dd + '-' + yyyy;
							$('#comment1').val($('#comment1').val() + firstname + " "+ lastname + " " + cdate + "\n"+ $('#comments').val() + "\n");
							parentModel.set({
								role : "EMP",
								firstname : $('#firstname').val(),
								lastname : $('#lastname').val(),
								middleinitial : $('#middlename').val(),
								address1 : $('#address1').val(),
								address2 : $('#address2').val(),
								city : $('#city').val(),
								state : $('#state option:selected').attr("name"),
								zipcode : $('#zipcode').val(),
								county : $('#county').val(),
								email : $('#email').val(),
								phone : phones,
								fax : faxid,
								phext : $('#phoneext').val(),
								status : $('input[name="statusmsg"]:checked').val(),
								comments : $('#comment1').val(),
								groupno : $('#groupno').val(),
								taxid : taxids

							});
							var pattributes = parentModel.previousAttributes();
							parentModel.url = "rest/employee/updateemp";
							parentModel.save({},{
												success : function(model,result, xhr) {
													var status 		= result.responseMessage;
													var message 	= status.message;
													var errorstatus = status.errorStatus;
													$('#registersection').hide();
													function scrolltop() {$("html, body").animate({scrollTop : $("body").offset().top}, 1000);}
													if (errorstatus == "0") {
														$('#errormsgs').text("");
														this.model = pagecollection	.get(recid);
														this.model.set({
															role : "Employer"
														});
														if (status == "Active") {
															pagecollection.remove(recid);
														}
														$('#successmsg').flash_message({
																		text : 'Details updated successfully',
																		how : 'append'
															});
														scrolltop();
													} else if (errorstatus == "1") {
														parentModel.set({
																	role : pattributes.role,
																	firstname : pattributes.firstname,
																	lastname : pattributes.lastname,
																	middleinitial : pattributes.middlename,
																	address1 : pattributes.address1,
																	address2 : pattributes.address2,
																	city : pattributes.city,
																	state : pattributes.state,
																	zipcode : pattributes.zipcode,
																	county : pattributes.county,
																	email : pattributes.email,
																	phone : pattributes.phone,
																	fax : pattributes.fax,
																	phext : pattributes.phext,
																	status : pattributes.status,
																	comments : pattributes.comments,
																	groupno : pattributes.groupno,
																	taxid : pattributes.taxid
																});
														$('#successmsg').text("");
														$('#successmsg').html("");
														$('#errormsgs').flash_message({
																	text : message,
																	how : 'append'
														});
														scrolltop();
													} else if (errorstatus == "2") {
														alert(message);
														that.clearCookies();
													}
												}
											});
						}
					} else if (role == "Member") {
						function scrolltop() {$("html, body").animate({scrollTop : $("body").offset().top}, 1000);}
						function isValidEmailAddress(emailAddress) {
							var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
							return pattern.test(emailAddress);
						};
						var title = $('#title').val();
						var firstname = $('#firstname').val();
						var lastname = $('#lastname').val();
						var middleinitial = $('#middlename').val();
						var address1 = $('#address1').val();
						var address2 = $('#address2').val();
						var city = $('#city').val();
						var groupno = $('#mgroupno').val();
						var ssn = $('#ssn').val();
						var phone = $('#phone').val();
						var ext = $('#phoneext').val();
						var state = $('#state option:selected').attr("name");
						var zipcode = $('#zipcode').val();
						var email = $('#email').val();
						var fax = $('#fax').val();
						var status = $('input[name="statusmsg"]:checked').val();
						var comments = $('#comments').val();
						var error = "";
						if (!firstname || firstname == "") {
							error += "<br>" + "First Name is required";
							scrolltop();
						}
						if (!lastname || lastname == "") {
							error += "<br>" + "Last Name is required";
							scrolltop();
						}
						if (!address1 || address1 == "") {
							error += "<br>" + "Address1 is required";
							scrolltop();
						}
						if (!city || city == "") {
							error += "<br>" + "City is required";
							scrolltop();
						}
						if (!state || state == "") {
							error += "<br>" + "State is required";
							scrolltop();
						}
						if (!zipcode || zipcode == "") {
							error += "<br>" + "Zip Code is required";
							scrolltop();
						}
						if (!groupno || groupno == "") {
							error += "<br>" + "Group Number is required";
							scrolltop();
						}
						if (!ssn || ssn == "") {
							error += "<br>" + "SSN is required";
							scrolltop();
						}
						if (!email || email == "") {
							error += "<br>" + "Email is required";
							scrolltop();
						}
						if (email) {
							if (!isValidEmailAddress(email)) {
								error += "<br>" + "Email is invalid";
								scrolltop();
							}
						}
						if (!status || status == "") {
							error += "<br>" + "Status is required";
							scrolltop();
						}
						if (error.length > 0) {
							$('#errormsgs').html(error);
							scrolltop();
						} else {
							$('#errormsgs').html("");
							$('#errormsgs').text("");
							if(phone){
								var phones = $('#phone').val().match(/\d/g).join("");
							}else{
								var phones = $('#phone').val();
							}
							if (fax) {
								var faxid = $('#fax').val().match(/\d/g).join(
										"");
							} else {
								var faxid = $('#fax').val();
							}
							if(ssn){
								var ssns = $('#ssn').val().match(/\d/g).join("");
							}else{
								var ssns = $('#ssn').val();
							}
				
							var today = new Date();
							var dd = today.getDate();
							var mm = today.getMonth() + 1;
							var yyyy = today.getFullYear();
							if (dd < 10) {
								dd = '0' + dd;
							}
							if (mm < 10) {
								mm = '0' + mm;
							}
							var cdate = mm + '-' + dd + '-' + yyyy;
							$('#comment1').val($('#comment1').val() + firstname + " "+ lastname + " " + cdate + "\n"+ $('#comments').val() + "\n");
							parentModel.set({
								role 			: "MEM",
								title 			: $('#title option:selected').text(),
								firstname 		: $('#firstname').val(),
								lastname 		: $('#lastname').val(),
								middleinitial 	: $('#middlename').val(),
								address1 		: $('#address1').val(),
								address2 		: $('#address2').val(),
								city 			: $('#city').val(),
								state 			: $('#state option:selected').attr("name"),
								zipcode 		: $('#zipcode').val(),
								county 			: $('#county').val(),
								phone 			: phones,
								phext 			: $('#phoneext').val(),
								fax 			: faxid,
								email 			: $('#email').val(),
								status 			: $('input[name="statusmsg"]:checked').val(),
								comments 		: $('#comment1').val(),
								groupno 		: $('#mgroupno').val(),
								ssn 			: ssns
							});
							var pattributes = parentModel.previousAttributes();
							parentModel.url = "rest/member/updatemember";
							parentModel.save({},{
												success : function(model,result, xhr) {
													var status 		= result.responseMessage;
													var message 	= status.message;
													var errorstatus = status.errorStatus;
													function scrolltop() {$("html, body").animate({scrollTop : $("body").offset().top}, 1000);}
													if (errorstatus == "0") {
														$('#registersection').hide();
														$('#errormsgs').text("");
														this.model = pagecollection.get(recid);
															this.model.set({
																role : "Member",
																status : "Pending"
															});
														if (status == "Active") {
															pagecollection.remove(recid);
														}
														$('#successmsg').flash_message({
																			text : 'Details updated successfully',
																			how : 'append'
															});
														scrolltop();
													} else if (errorstatus == "1") {
														$('#successmsg').html("");
														$('#successmsg').text("");
														$('#errormsgs').flash_message({
																	text : message,
																	how : 'append'
															});
														parentModel.set({
																	role 			: pattributes.role,
																	title 			: pattributes.title,
																	firstname 		: pattributes.firstname,
																	lastname 		: pattributes.lastname,
																	middleinitial 	: pattributes.middlename,
																	address1 		: pattributes.address1,
																	address2 		: pattributes.address2,
																	city 			: pattributes.city,
																	state 			: pattributes.state,
																	zipcode 		: pattributes.zipcode,
																	county 			: pattributes.county,
																	phone 			: pattributes.phone,
																	phext 			: pattributes.phext,
																	fax 			: pattributes.fax,
																	email 			: pattributes.email,
																	status 			: pattributes.status,
																	comments 		: pattributes.comments,
																	groupno 		: pattributes.groupno,
																	ssn 			: pattributes.ssn
																});
														scrolltop();
													} else if (errorstatus == "2") {
														alert(message);
														that.clearCookies();
													}
												}
											});
						}
					} else if (role == "Broker") {
						var title = $('#title').val();
						var firstname = $('#firstname').val();
						var lastname = $('#lastname').val();
						var middleinitial = $('#middlename').val();
						var address1 = $('#address1').val();
						var address2 = $('#address2').val();
						var city = $('#city').val();
						var state = $('#state option:selected').attr("name");
						var indbroker = $('input:radio[name=ibroker]:checked').attr("value");
						var agencyname = $('#agencyname').val();
						var zipcode = $('#zipcode').val();
						var county = $('#county').val();
						var taxid = $('#taxid').val();
						var email = $('#email').val();
						var phone = $('#phone').val();
						var ext = $('#phoneext').val();
						var fax = $('#fax').val();
						var status = $('input:radio[name=statusmsg]:checked').val();
						var error = "";
						function isValidEmailAddress(emailAddress) {
							var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
							return pattern.test(emailAddress);
						}
						function scrolltop() {$("html, body").animate({scrollTop : $("body").offset().top}, 1000);}
						if (!firstname || firstname == "") {
							error += "<br>" + "First Name is required";
							scrolltop();
						}
						if (!lastname || lastname == "") {
							error += "<br>" + "Last Name is required";
							scrolltop();
						}
						if (!address1 || address1 == "") {
							error += "<br>" + "Address 1 is required";
							scrolltop();
						}
						if (!city || city == "") {
							error += "<br>" + "City is required";
							scrolltop();
						}
						if (!state || state == "") {
							error += "<br>" + "State is required";
							scrolltop();
						}
						if (!zipcode || zipcode == "") {
							error += "<br>" + "Zip Code is required";
							scrolltop();
						}
						if (!email || email == "") {
							error += "<br>" + "Email is required";
							scrolltop();
						}
						if (email) {
							if (!isValidEmailAddress(email)) {
								error += "<br>" + "Email is invalid";
								scrolltop();
							}
						}
						if (!phone || phone == "") {
							error += "<br>" + "Phone is required";
							scrolltop();
						}
						if (indbroker == 0) {
							if (!agencyname || agencyname == "") {
								error += "<br>" + "Agency name is required";
								scrolltop();
							}
						}
						if (!status || status == "") {
							$('#successmsg').html("");
							error += "<br>" + "Status is required";
							scrolltop();
						}
						if (error.length > 0) {
							$('#errormsgs').html(error);
							scrolltop();
						} else {
							$('#errormsgs').html("");
							$('#errormsgs').text("");
							if (bcollection.length > 0) {
								var test = bcollection.toJSON();
								var lrecord = test[test.length - 1];
								if (lrecord.statecode == "") {
									alert("State must be selected");
									return false;
								}
								if (lrecord.license == "") {
									alert("License must be selected");
									return false;
								}
								if (lrecord.dateofexpiry == "") {
									alert("Date of expiry must be selected");
									return false;
								}
							}
							var phones = $('#phone').val().match(/\d/g)
									.join("");
							if (fax) {
								var faxid = $('#fax').val().match(/\d/g).join(
										"");
							} else {
								var faxid = $('#fax').val();
							}
							if (taxid) {
								var taxids = $('#taxid').val().match(/\d/g)
										.join("");
							} else {
								var taxids = $('#taxid').val();
							}

							var today = new Date();
							var dd = today.getDate();
							var mm = today.getMonth() + 1;
							var yyyy = today.getFullYear();
							if (dd < 10) {
								dd = '0' + dd;
							}
							if (mm < 10) {
								mm = '0' + mm;
							}
							var cdate = mm + '-' + dd + '-' + yyyy;
							// var temp = $('#comment1').val() + firstname + "
							// "+ lastname + " " + cdate + "\n"+
							// $('#comments').val() + "\n";
							// $('#comment1').val(temp);
							var pattributes = parentModel.previousAttributes();
							parentModel.startTracking();
							clonedmodel = _.clone(parentModel.attributes);
							parentModel.set({
								role : "BRKR",
								// role : "Broker",
								firstname : $.trim($('#firstname').val()),
								lastname : $.trim($('#lastname').val()),
								middleinitial : $.trim($('#middlename').val()),
								address1 : $.trim($('#address1').val()),
								address2 : $.trim($('#address2').val()),
								city : $.trim($('#city').val()),
								state : $('#state option:selected')
										.attr("name"),
								county : $('#county').val(),
								zipcode : $.trim($('#zipcode').val()),
								phone : phones,
								phext : $.trim($('#phoneext').val()),
								fax : faxid,
								title : $('#title option:selected').text(),
								email : $.trim($('#email').val()),
								// status : "Pending",
								status : $('input[name="statusmsg"]:checked').val(),
								comments : $('#comment1').val(),
								taxid : taxids,
								indbroker : $('input:radio[name=ibroker]:checked').attr("value"),
								agencyname : $.trim($('#agencyname').val()),
							});

							var uattributes = parentModel.unsavedAttributes();
							alert("unsaved attributes:"
									+ JSON.stringify(uattributes));
							alert(JSON.stringify(clonedmodel));
							parentModel.url = "rest/broker/updatebroker";
							parentModel.save({},{
												success : function(model,result, xhr) {
													var status 		= result.responseMessage;
													var message 	= status.message;
													var errorstatus = status.errorStatus;
													function scrolltop() {$("html, body").animate({scrollTop : $("body").offset().top}, 1000);}
													$('#errormsgs').text();
													$('#errormsgs').html("");
													if (errorstatus == "0") {
														$("#registersection").hide();
														if (status == "Pending") {
															var registration = result.registration;
															var brlicense = registration[0].brokerlicense;
															var getId = parentModel.get("id");
															for ( var i = 0; i < regdetails.length; i++) {
																if (regdetails[i].id == getId) {
																	regdetails[i].brokerlicense = brlicense;
																}
															}
															$('#errormsgs').text("");
															$('#errormsgs').html("");
															child = parentModel.get("brokerlicense").toJSON();
															for ( var i = 0; i < child.length; i++) {
																var id1 = child[i].id;
																var statecode1 = child[i].statecode;
																if (id1 == null) {
																	for ( var j = 0; j < brlicense.length; j++) {
																		var id2 = brlicense[j].id;
																		var statecode2 = brlicense[j].statecode;
																		if (statecode1 == statecode2) {
																			subchild = parentModel.get("brokerlicense").findWhere({
																								statecode : statecode1,
																								id : null
																			});
																			subchild.set({id : id2},{merge : true});
																			break;
																		}
																	}
																}
															}
															parentModel = pagecollection.get(recid);
															parentModel.set({
																role : "Broker"
															});
														}
														if (status == "Active") {
															pagecollection.remove(recid);
														}
														$('#errormsgs').text("");
														$('#errormsgs').html("");
														$('#successmsg').flash_message({
																			text : 'Details updated successfully',
																			how : 'append'
															});
														$('#userroles').hide();
														scrolltop();
													} else if (errorstatus == "1") {
														parentModel.set({
																	role : pattributes.role,
																	firstname : pattributes.firstname,
																	lastname : pattributes.lastname,
																	middleinitial : pattributes.middleinitial,
																	address1 : pattributes.address1,
																	address2 : pattributes.address2,
																	city : pattributes.city,
																	state : pattributes.state,
																	county : pattributes.county,
																	zipcode : pattributes.zipcode,
																	phone : pattributes.phone,
																	phext : pattributes.phext,
																	fax : pattributes.fax,
																	title : pattributes.title,
																	email : pattributes.email,
																	status : pattributes.status,
																	comments : pattributes.comments,
																	taxid : pattributes.taxid,
																	indbroker : pattributes.indbroker,
																	agencyname : pattributes.agencyname,
																});
														$('#successmsg').html("");
														$('#successmsg').text("");
														$('#errormsgs').flash_message({
																text : message,
																how : 'append'
														});
														$('#userroles').hide();
														scrolltop();
													} else if (errorstatus == "2") {
														alert(message);
														that.clearCookies();
													}
												}
											});
						}
					}
				}
			},
			/* Closing the child Section */

			cancel : function(e) {
				e.preventDefault();
				var r = confirm("Are you sure?");
				if (r == true) {
					this.$("#brokerdoc").empty();
					$('#errormsgs').text("");
					$('#userroles').hide();
					$('#roles').val("");
					$('#roles').empty();
					$('#successmsg').text("");
					$('.box').css({"margin-top" : 10});
					$('.box').css({"margin-bottom":10	});
					$('#registersection').hide();
				}
			},

			/* Auto suggest getting state, zipcode , county on changing city */

			getstatezip : function() {
				$("#city").autocomplete(
						{
							source : "rest/autosuggest/city",
							select : function(e, ui) {
								e.preventDefault();
								var city = ui.item.City;
								var state = ui.item.State;
								var zip = ui.item.Zipcode;
								var county = ui.item.County;
								$("#city").val(city);
								$('#county').val(county);
								$('#state option[name=' + state + ']').prop(
										'selected', true);
								$('#zipcode').val(zip);
							}
						}).data("ui-autocomplete")._renderItem = function(ul,
						item) {
					return $("<li>").append(
							"<a>" + item.City + "," + item.State + ", "
									+ item.Zipcode + ", " + item.County
									+ "</a>").appendTo(ul);
				};
			},

			/* Auto suggest getting city , state ,county on changing zipcode */

			getcitystate : function() {
				$("#zipcode").autocomplete(
						{
							source : "rest/autosuggest/zipcode",
							select : function(e, ui) {
								e.preventDefault();
								var city = ui.item.City;
								var state = ui.item.State;
								var zip = ui.item.Zipcode;
								var county = ui.item.County;
								$("#city").val(city);
								$('#state option[name=' + state + ']').prop(
										'selected', true);
								$('#zipcode').val(zip);
								$('#county').val(county);
							}
						}).data("ui-autocomplete")._renderItem = function(ul,
						item) {
					return $("<li>").append(
							"<a>" + item.City + "," + item.State + ", "
									+ item.Zipcode + ", " + item.County
									+ "</a>").appendTo(ul);
				};
			},

			/* Uploading a file */
			upload : function() {
				var that = this;
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1;
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				var temp = parentModel;
				var currentdate = mm + '-' + dd + '-' + yyyy;
				var dtype = $('#doctype').val();
				var state = $('#cstate').val();
				var fname = $('#fileToUpload').val();
				var filename = $('#fileToUpload').get(0).files[0];
				if (fname != "" && state != "select" && dtype != "select") {
					if (filename.size <= 5000000&& (filename.type == "application/pdf" || filename.type == "application/msword")) {
						if (bccollection.length > 0) {
							var filearray = bccollection.toJSON();
							for ( var i = 0; i < filearray.length; i++) {
								if (fname == filearray[i].name) {
									alert("Cannot upload same file");
									$('#fileToUpload').val("");
									$('#fileToUpload').text("");
									$('#cstate').val("");
									$('#doctype').val("");
									return false;
								}
							}
						}
						this.$('#brokerupload').ajaxForm({
											success : function(response) {
												var uresponse 	 = response.uploadResponse;
												var rkey 		 = uresponse.key;
												var status    	 = uresponse.responseMessage;
												var message		 = status.message;
												var errorstatus  = status.errorStatus;
											if(errorstatus == "0"){
												var stcode = $('#cstate').find('option:selected').attr('name');
												var doccode = $('#doctype').find('option:selected').attr('code');
												var key = JSON.stringify(rkey);
												var fname = $('#fileToUpload').val().split('\\').pop();
												var bcompliancemodel = new brokerComplianceModel({
															bcompliance : temp,
															id : key,
															name : fname,
															state : state,
															doctype : dtype,
															dateuploaded : currentdate,
															statecode : stcode,
															documentcode : doccode
														});
												clgrid.insertRow(bcompliancemodel);
												$('#fileToUpload').val("");
												$('#fileToUpload').text("");
												$('#cstate').val("");
												$('#doctype').val("");
												}else if(errorstatus == "1"){
													$('#errormsgs').flash_message({
														text : message,
														how : 'append'
													});
												}else if(errorstatus == "2"){
													alert(message);
													that.clearCookies();
												}
											}
										});
					} else {
						if (filename.size > 5000000) {
							alert("Exceeding File Size");
							return false;
						} else if (filename.type != "application/pdf"
								|| filename.type != "application/msword") {
							alert("File type not supported");
							return false;
						}
					}
				} else {
					if (state == "select") {
						alert("Select a state");
						return false;
					} else if (dtype == "select") {
						alert("Select Document type");
						return false;
					} else if (fname == "") {
						alert("Select a file to upload");
						return false;
					}
				}
			},

			/* Adding new Row to Broker License Grid */

			checkcollection : function() {
				if (bcollection.length == 0) {
					// empty delete array
					delstatearray = [];
					selEle = "";
					statearray = states.slice(0);
				} else {
					if (selEle != null) {
						for ( var i = 0; i < statearray.length; i++) {
							if (statearray[i] != null) {
								if (statearray[i].stateCode == selEle) {
									delete statearray[i];
								}
							} else {
								delete statearray[i];
							}
						}
					}
					for ( var j = 0; j < delstatearray.length; j++) {
						for ( var i = 0; i < states.length; i++) {

							if (states[i].stateCode == delstatearray[j]) {

								statearray
										.push({
											stateCode : states[i].stateCode,
											stateDescription : states[i].stateDescription
										});
							}
						}
					}
					// empty delete array
					delstatearray = [];

				}
			},

			Addnew : function() {
				if (bcollection.length > 0) {
					if (!stcode || stcode == "" || stcode == "select") {
						alert("State must be selected");
						return false;
					} else if (!license || license == "") {
						alert("License must be entered");
						return false;
					} else if (!fullDate || fullDate == "") {
						alert("Date must be entered");
						return false;
					} else if (bcollection.length == states.length) {
						$('#addnew').attr("disabled", true);
					} else {
						this.checkcollection();
						$('.statelist').attr("disabled", true);
						lgrid.insertRow(new brokerLicense({
							blicense : parentModel
						}));
						stcode = license = fullDate = null;
						return true;
					}
				} else if (bcollection.length == 0) {
					this.checkcollection();
					scode = license = fullDate = null;
					$('.statelist').attr("disabled", true);
					lgrid.insertRow(new brokerLicense({
						blicense : parentModel
					}));
				}
			},

			/* Approving the Selected Record From Grid */

			Approve : function() {
				var i = 0, j = 0;
				var selectedRows = new Array();
				var applicableRows = new Array();
				var selectedModels = this.pageableGrid.getSelectedModels();
				_.each(selectedModels, function(model) {
					selectedRows[i] = model.toJSON().id;
					i++;
					if (model.toJSON().status == "Pending") {
						applicableRows[j] = model.toJSON().id;
						j++;
					}
				});
				if (selectedRows.length == applicableRows.length) {
					this.changeStatus(applicableRows, "Active");
				} else {
					alert("Only Pending Records are allowed");
					return;
				}
			},

			changeStatus : function(ids, operationType) {
				if (ids.length != 0) {
					var opmodel = new operationModel();
					opmodel.set({
						id : ids,
						optype : operationType
					});
					var that = this;
					opmodel.save({}, {
						success : function(response) {
							var status = response.toJSON().errorStatus;
							if (status == "0") {
								for ( var i = 0; i < ids.length; i++) {
									usermanagemodel = pagecollection
											.get(ids[i]);
									usermanagemodel.set({
										status : operationType,
									});
									usermanagemodel.trigger("backgrid:select",
											usermanagemodel, false);
									pagecollection.remove(ids);
								}
							} else if (status == "2") {
								var msg = response.toJSON().message;
								alert(msg);
								that.clearCookies();
							} else if (status == "1") {
								var msg = response.toJSON().message;
								alert(msg);
							}
						}
					});
				} else {
					alert("please select at least one record");
				}
			},
			/* Change of Role in Role list */

			changeRole : function() {
				$('#errormsgs').text("");
				selrole = $('#role option:selected').attr("rolecode");
				this.NewRegister();
			},

			/* New Register of a User */

			NewRegister : function() {
				this.$('#registersection').show();
				$('#role').empty();
				$('#role').append("<option>select</option>");
				for ( var i = 0; i < roles.length; i++) {
					rcode = roles[i].Role_Code;
					rdesc = roles[i].Role_Desc;
					rtype = roles[i].Role_Type;
					$('#role').append("<option roletype=" + rtype + " rolecode=" + rcode+ " roledesc=" + rdesc + ">" + rdesc+ "</option>");

				}

				$('#role option[rolecode=' + selrole + ']').attr("selected","selected").text();
				$('#userroles').show();
				var rolecode = $('#role option:selected').attr("rolecode");
				var roletype = $("#role option[rolecode=" + rolecode + "]").attr("roletype");
				// roledescs = $('#role
				// option[roletype='+roletype+']').attr("roledesc");
				if (roletype == "E") {
					var roledesc = $('#role option:selected').val();
					if (roledesc == "Broker" || roledesc == undefined) {
						parentModel = new registerManageModel();
						this.template = _.template($('#brokerdetailtemp').html());
						$('#registersection').html(this.template());
						bcollection = new brokerLicenseCollection();
						bccollection = new brokerComplianceCollection();
						this.brokerGrid(bcollection);
						this.brokerCompliance(bccollection);
						$('#role option[rolecode=BRKR]').attr("selected",
								"selected").text();
						for ( var i = 0; i < states.length; i++) {
							var scode = states[i].stateCode;
							var sdesc = states[i].stateDescription;
							$('#state').append("<option name=" + scode + ">" + sdesc+ "</option>");
							$('#cstate').append("<option name=" + scode + ">" + sdesc+ "</option>");
						}
						for ( var i = 0; i < doctype.length; i++) {
							var dcode = doctype[i].Code;
							var dtype = doctype[i].Doc_Type;
							var desc = doctype[i].Description;
							$('#doctype').append(
									"<option dtype=" + dtype + " code=" + dcode
											+ ">" + desc + "</option>");
						}
						$('#zipcode')
								.on(
										"keyup",
										function() {
											$("#zipcode")
													.autocomplete(
															{
																source : "rest/autosuggest/zipcode",
																select : function(
																		e, ui) {
																	// e.preventDefault();
																	var city = ui.item.City;
																	var state = ui.item.State;
																	var zip = ui.item.Zipcode;
																	var county = ui.item.County;
																	$("#city")
																			.val(
																					city);
																	$(
																			'#state option[name='
																					+ state
																					+ ']')
																			.prop(
																					'selected',
																					true);
																	$(
																			'#zipcode')
																			.val(
																					zip);
																	$('#county')
																			.val(
																					county);
																}
															}).data(
															"ui-autocomplete")._renderItem = function(
													ul, item) {

												return $("<li>").append(
														"<a>" + item.City + ","
																+ item.State
																+ ", "
																+ item.Zipcode
																+ ", "
																+ item.County
																+ "</a>")
														.appendTo(ul);
											};
										});
						$('#city')
								.on(
										"keyup",
										function() {
											$("#city")
													.autocomplete(
															{
																source : "rest/autosuggest/city",
																select : function(
																		e, ui) {
																	e
																			.preventDefault();
																	var city = ui.item.City;
																	var state = ui.item.State;
																	var zip = ui.item.Zipcode;
																	var county = ui.item.County;
																	$("#city")
																			.val(
																					city);
																	$(
																			'#state option[name='
																					+ state
																					+ ']')
																			.prop(
																					'selected',
																					true);
																	$(
																			'#zipcode')
																			.val(
																					zip);
																	$('#county')
																			.val(
																					county);
																}
															}).data(
															"ui-autocomplete")._renderItem = function(
													ul, item) {
												return $("<li>").append(
														"<a>" + item.City + ","
																+ item.State
																+ ", "
																+ item.Zipcode
																+ ", "
																+ item.County
																+ "</a>")
														.appendTo(ul);
											};
										});
						$('#taxid').mask("99-9999999");
						$("#phone").mask("(999) 999-9999");
						$("#fax").mask("(999) 999-9999");
					} else if (roledesc == "Employer") {
						parentModel = new registerManageModel();
						this.template = _.template($('#employeedetailtemp')
								.html());
						$('#registersection').html(this.template());
						for ( var i = 0; i < states.length; i++) {
							var scode = states[i].stateCode;
							var sdesc = states[i].stateDescription;
							$('#state').append(
									"<option name=" + scode + ">" + sdesc
											+ "</option>");
						}
						$('#zipcode')
								.on(
										"keyup",
										function() {
											$("#zipcode")
													.autocomplete(
															{
																source : "rest/autosuggest/zipcode",
																select : function(
																		e, ui) {
																	e
																			.preventDefault();
																	var city = ui.item.City;
																	var state = ui.item.State;
																	var zip = ui.item.Zipcode;
																	var county = ui.item.County;
																	$("#city")
																			.val(
																					city);
																	$(
																			'#state option[name='
																					+ state
																					+ ']')
																			.prop(
																					'selected',
																					true);
																	$(
																			'#zipcode')
																			.val(
																					zip);
																	$('#county')
																			.val(
																					county);
																}
															}).data(
															"ui-autocomplete")._renderItem = function(
													ul, item) {
												return $("<li>").append(
														"<a>" + item.City + ","
																+ item.State
																+ ", "
																+ item.Zipcode
																+ ", "
																+ item.County
																+ "</a>")
														.appendTo(ul);
											};
										});
						$('#city')
								.on(
										"keyup",
										function() {
											$("#city")
													.autocomplete(
															{
																source : "rest/autosuggest/city",
																select : function(
																		e, ui) {
																	e
																			.preventDefault();
																	var city = ui.item.City;
																	var state = ui.item.State;
																	var zip = ui.item.Zipcode;
																	$("#city")
																			.val(
																					city);
																	$(
																			'#state option[name='
																					+ state
																					+ ']')
																			.prop(
																					'selected',
																					true);
																	$(
																			'#zipcode')
																			.val(
																					zip);
																}
															}).data(
															"ui-autocomplete")._renderItem = function(
													ul, item) {
												return $("<li>").append(
														"<a>" + item.City + ","
																+ item.State
																+ ", "
																+ item.Zipcode
																+ ", "
																+ item.County
																+ "</a>")
														.appendTo(ul);
											};
										});
						$('#taxid').mask("99-9999999");
						$("#phone").mask("(999) 999-9999");
						$("#fax").mask("(999) 999-9999");
					} else if (roledesc == "Member") {
						parentModel = new registerManageModel();
						this.template = _.template($('#memberdetailtemp')
								.html());
						$('#registersection').html(this.template());
						for ( var i = 0; i < states.length; i++) {
							var scode = states[i].stateCode;
							var sdesc = states[i].stateDescription;
							$('#state').append(
									"<option name=" + scode + ">" + sdesc
											+ "</option>");
						}
						$('#zipcode')
								.on(
										"focus",
										function() {
											$("#zipcode")
													.autocomplete(
															{
																source : "rest/autosuggest/zipcode",
																select : function(
																		e, ui) {
																	e
																			.preventDefault();
																	var city = ui.item.City;
																	var state = ui.item.State;
																	var zip = ui.item.Zipcode;
																	var county = ui.item.County;
																	$("#city")
																			.val(
																					city);
																	$(
																			'#state option[name='
																					+ state
																					+ ']')
																			.prop(
																					'selected',
																					true);
																	$(
																			'#zipcode')
																			.val(
																					zip);
																	$('#county')
																			.val(
																					county);
																}
															}).data(
															"ui-autocomplete")._renderItem = function(
													ul, item) {
												return $("<li>").append(
														"<a>" + item.City + ","
																+ item.State
																+ ", "
																+ item.Zipcode
																+ ", "
																+ item.County
																+ "</a>")
														.appendTo(ul);
											};
										});
						$('#city')
								.on(
										"focus",
										function() {
											$("#city")
													.autocomplete(
															{
																source : "rest/autosuggest/city",
																select : function(
																		e, ui) {
																	e
																			.preventDefault();
																	var city = ui.item.City;
																	var state = ui.item.State;
																	var zip = ui.item.Zipcode;
																	var county = ui.item.County;
																	$("#city")
																			.val(
																					city);
																	$(
																			'#state option[name='
																					+ state
																					+ ']')
																			.prop(
																					'selected',
																					true);
																	$(
																			'#zipcode')
																			.val(
																					zip);
																	$('#county')
																			.val(
																					county);
																}
															}).data(
															"ui-autocomplete")._renderItem = function(
													ul, item) {
												return $("<li>").append(
														"<a>" + item.City + ","
																+ item.State
																+ ", "
																+ item.Zipcode
																+ ", "
																+ item.County
																+ "</a>")
														.appendTo(ul);
											};
										});
						$('#ssn').mask("999-99-9999");
						$("#phone").mask("(999) 999-9999");
						$("#fax").mask("(999) 999-9999");
					}
				} else if (roletype == "I") {
					var rolecode = $('#role option:selected').attr("rolecode");
					var role = $('#role option:selected').val();
					parentModel = new registerManageModel();
					this.template = _.template($('#internalusers').html());
					$('#registersection').html(this.template());
					$("#phone").mask("(999) 999-9999");
					$("#fax").mask("(999) 999-9999");
					$('#rolecode').val(role);
					$('#rolecode').attr("rolecode", rolecode);
				} else {
					alert("Invalid role type");
				}
			},

			/* Broker Compliance Grid */

			brokerCompliance : function(bccollection) {
				$('#brokerdoc').empty();
				var columns = [
						{
							name : "namecell",
							label : "Name",
							cell : Backgrid.StringCell
									.extend({
										template : _
												.template('<input type="text" class="docname" maxlength="50" style="width:180px;" readonly="readonly"/>'),
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											var test = this;
											test.model = this.model;
											this.$('.docname').val(
													this.model.get("name"));
											this.$('.docname').change(
													'input',
													function() {
														var name = $(this)
																.val();
														test.model.set({
															"name" : name
														});
													});
											return this;
										},
									}),
							editable : false
						},
						{
							name : "statecell",
							label : "State",
							cell : Backgrid.StringCell
									.extend({
										template : _
												.template('<input type="text" class="state" maxlength="20" style="width:180px;" readonly="readonly"/>'),
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											var test = this;
											test.model = this.model;
											this.$('.state').val(
													this.model.get("state"));
											this.$('.state').change('input',
													function() {
														state = $(this).val();
														test.model.set({
															"state" : state
														});
													});
											return this;
										},
									}),
							editable : false
						},
						{
							name : "doccell",
							label : "Document Type",
							cell : Backgrid.StringCell
									.extend({
										template : _
												.template('<input type="text" class="doctype" maxlength="20" style="width:180px;" readonly="readonly"/>'),
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											var test = this;
											test.model = this.model;
											this.$('.doctype').val(
													this.model.get("doctype"));
											this.$('.doctype').change(
													'input',
													function() {
														var doctype = $(this)
																.val();
														test.model.set({
															"doctype" : doctype
														});
													});
											return this;
										},
									}),
							editable : false
						},
						{
							name : "datecell",
							label : "Date Uploaded",
							cell : Backgrid.StringCell
									.extend({
										template : _
												.template('<input type="text" class="dateupload" maxlength="20" style="width:180px;" readonly="readonly"/>'),
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											var test = this;
											test.model = this.model;
											this
													.$('.dateupload')
													.val(
															this.model
																	.get("dateuploaded"));
											this
													.$('.dateupload')
													.change(
															'input',
															function() {
																var dateuploaded = $(
																		this)
																		.val();
																test.model
																		.set({
																			"dateuploaded" : dateuploaded
																		});
															});
											return this;
										}
									}),
							editable : false
						},
						{
							name : 'Delete',
							cell : Backgrid.Cell
									.extend({
										template : _
												.template('<div align="center"><img id="remove" src="images/close1.png"></div>'),
										events : {
											"click #remove" : "deleteRow"
										},
										deleteRow : function(e) {
											e.preventDefault();
											bccollection.remove(this.model);
											$('.box').css({
												"margin-top" : 0
											});
											$('.box').css({
												"margin-bottom" : 0
											});
										},
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											return this;
										}
									})
						} ];
				clgrid = new Backgrid.Grid({
					columns : columns,
					collection : bccollection,
				});
				$("#brokerdoc").append(clgrid.render().$el);
			},

			/* Registration Management Grid */

			dataGrid : function(collection) {
				$('#reggrid').empty();
				var grids = this.$("#reggrid");
				var Rcollection = Backbone.PageableCollection.extend({
					model : registerManageModel,
					url : "rest/rmgmt/registrationDetails",
					state : {
						pageSize : 5,
					},
					mode : "infinite",
				});
				pagecollection = new Rcollection(collection);
				this.pageableGrid = new Backgrid.Grid({
					columns : columns,
					collection : pagecollection,
				});
				grids.append(this.pageableGrid.render().$el);
				this.paginator = new Backgrid.Extension.Paginator({
					collection : pagecollection
				});
				grids.append(this.paginator.render().$el);
				this.$('#searchbox').show();
				$('#statusbuttons').show();
			},

			/* Broker License Grid */

			brokerGrid : function(bcollection) {
				this.$('#grids').empty();
				var columns = [
						{
							name : "statecell",
							label : "State",
							cell : Backgrid.StringCell
									.extend({
										template : _
												.template('<select class="statelist" style="width:180px;"><option>select</option></select>'),
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											for ( var i = 0; i < statearray.length; i++) {
												if (statearray[i] != null) {
													var statecode = statearray[i].stateCode;
													var statedesc = statearray[i].stateDescription;
													this
															.$('.statelist')
															.append(
																	"<option statecode="
																			+ statecode
																			+ ">"
																			+ statedesc
																			+ "</option>");
												}
											}
											var stest = this;
											stest.model = this.model;
											this
													.$(
															'.statelist option[statecode='
																	+ this.model
																			.get("statecode")
																	+ ']')
													.prop('selected', true);
											var sel = $(
													'.statelist option:selected')
													.attr("statecode");
											this
													.$('.statelist')
													.change(
															'select',
															function() {
																stcode = $(this)
																		.find(
																				'option:selected')
																		.attr(
																				'statecode');
																selEle = stcode;
																stest.model
																		.set({
																			statecode : stcode
																		});
																if (bcollection.length == states.length) {
																	$('#addnew')
																			.attr(
																					"disabled",
																					true);
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
							cell : Backgrid.StringCell
									.extend({
										template : _
												.template('<input type="text" class="licenses" maxlength="20" style="width:180px;"/>'),
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											var test = this;
											test.model = this.model;
											this.$('.licenses').val(
													this.model.get("license"));
											this
													.$('.licenses')
													.keyup(
															'input',
															function() {
																license = $(
																		this)
																		.val();
																test.model
																		.set({
																			"license" : license
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
										template : _
												.template('<input type="text" class="datepicker" style="width:180px;" readonly="readonly"/>'),
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											var that = this;
											that.model = this.model;
											that
													.$('.datepicker')
													.val(
															this.model
																	.get("dateofexpiry"));
											that
													.$('.datepicker ')
													.datepicker(
															{
																dateFormat : 'mm-dd-yy',
																changeMonth : true,
																changeYear : true,
																minDate : 0,
																onSelect : function() {
																	var day1 = that
																			.$(
																					".datepicker")
																			.datepicker(
																					'getDate')
																			.getDate();
																	var month1 = that
																			.$(
																					".datepicker")
																			.datepicker(
																					'getDate')
																			.getMonth() + 1;
																	var year1 = that
																			.$(
																					".datepicker")
																			.datepicker(
																					'getDate')
																			.getFullYear();
																	fullDate = year1
																			+ "-"
																			+ month1
																			+ "-"
																			+ day1;
																	that.model
																			.set(
																					"dateofexpiry",
																					fullDate);
																}
															});
											return this;
										},
									}),
							editable : false,
							sortable : false
						},
						{
							name : 'Delete',
							cell : Backgrid.Cell
									.extend({
										template : _
												.template('<div align="center"><img id="remove" src="images/close1.png"></div>'),
										events : {
											"click #remove" : "deleteRow"
										},
										deleteRow : function(e) {
											e.preventDefault();
											var rmstate = this.model
													.get("statecode");
											delstatearray.push(rmstate);
											if (rmstate == "") {
												rmstate = null;
											}
											if (rmstate == stcode) {
												stcode = license = fullDate = "*********";// cannot
																							// be
																							// null..put
																							// empty
																							// string
											}
											parentModel.get("brokerlicense")
													.remove(this.model);
											bcollection.remove(this.model);
											if (bcollection.length < states.length) {
												$('#addnew').attr('disabled',
														false);
											}
											$('.box').css({
												"margin-top" : 0
											});
											$('.box').css({
												"margin-bottom" : 0
											});
										},
										render : function() {
											this.$el.html(this.template());
											this.delegateEvents();
											return this;
										}
									}),
							editable : false,
							sortable : false
						} ];
				lgrid = new Backgrid.Grid({
					columns : columns,
					collection : bcollection,
				});
				this.$("#grids").append(lgrid.render().$el);
				if (parentModel.isNew()) {
					if (bcollection.length == 0) {
						this.Addnew();
					}
				} else {
					return;
				}

			}
		});
