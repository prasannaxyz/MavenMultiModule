(function($) {
    $.fn.flash_message = function(options) {
      
      options = $.extend({
        text: 'Done',
        time:2000,
        how: 'before',
        class_name: ''
      }, options);
      
      return $(this).each(function() {
        if( $(this).parent().find('.flash_message').get(0) )
          return;
        
        var message = $('<span />', {
          'class': 'flash_message ' + options.class_name,
          text: options.text
        }).hide().fadeIn('fast');
        
        $(this)[options.how](message);
        
        message.delay(options.time).fadeOut('normal', function() {
          $(this).remove();
        });
      });
    };
})(jQuery);
var pagecollection,columns;
userManagementView = Backbone.View.extend({
	template :  _.template($('#usermanage').html()),
	initialize : function(){},
	render: function(){
		$(this.el).html(this.template());
		
		 columns = [{
       	  	name : "username",
       		label: "User Name",
       		cell :  Backgrid.UriCell.extend({
       			render: function() {
       				Backgrid.UriCell.prototype.render.call(this);
       				this.$('a').attr('href',this.model.get("id"));
           		    this.$('a').attr('id',"getdetails");
           		    return this;
           		  }
           		}),
       		editable : false,
       	},
       	{
       	  	name : "name",
       		label: "Name",
       		cell : "string",
       		editable : false,
       	},
      	{
       	  	name : "role",
       		label: "Role",
       		cell : "string",
       		editable : false,
       	},
       	{
       		  name : "login",
       		  label: "Last Login",
       		  cell : "string",
       		  editable : false
       	},
       	{
       		  name : "status",
       		  label: "Status",
       		  cell : "string",
       		  editable : false
       	},{
       		  name : "reset",
       	      label: "Reset Password",
       	      cell : Backgrid.UriCell.extend({
           			 render: function() {
	           				Backgrid.UriCell.prototype.render.call(this);
	           				this.$('a').attr('href',this.model.get("id"));
		           		    this.$('a').attr('id',"resetpass");
		           		    return this;
		           		  }
		       	}),
		       	editable : false
       	},{
       		  name : "unlock",
       		  label: "Lock/Unlock",
       		  
       		cell : Backgrid.Cell.extend({
           		template: _.template('<img id="locking" style="width:20px;height:20px;cursor:pointer;"/>'),
   		        events: {
   		        			"click #locking": "unlock"
   		        },
	       unlock: function (e){
		 	      e.preventDefault();
		 	       var that = this;
			       var recid = this.model.get("id");
			       $.ajax({
			   				type : "POST",
			   				data : {id : recid},
   				url : "rest/umgmt/lock",
   				success : function(response){
   					var status 		= response.responseMessage;
   					var errorstatus = status.errorStatus;
   					var msg    		= status.message;
   					if(errorstatus == "0"){
   						var uresponse = response.unlockResponse;
   						var unlock	  = uresponse.unlock;	
   						this.model = pagecollection.get(recid);
   						if(unlock == "true"){
   							this.model.set({
   								unlock : true
   							});
   							 that.$('#locking').attr("src","images/unlock.png");
   						 	 $('#successmsgs').flash_message({
   							        text: 'User unlocked successfully',
   							        how: 'append'
   							    });
   						}if(unlock == "false"){
   							this.model.set({
   								unlock : false
   							});
   							 that.$('#locking').attr("src","images/lock.png");
   							 $('#successmsgs').flash_message({
   							        text: 'User locked successfully',
   							        how: 'append'
   							    });
   						}
   						$('#errormsgs').html("");
   					}else if(errorstatus=="1"){
   						  $('#errormsgs').focus();
   						  $('#errormsgs').flash_message({
   						        text: msg,
   						        how: 'append'
   						    });
   					}else if(errorstatus == "2"){
   							alert(msg);
   					}
   				 }
   				});
   		      },
   		    render: function () {
   		    	this.$el.html(this.template());
   		    	this.delegateEvents();
   		    	if(this.model.get("unlock") == "false"){
	   			   	this.$('#locking').attr('src','images/lock.png');
			   }else{
				   this.$('#locking').attr('src','images/unlock.png');
   		    	  }
   		    	return this;
   		    }
        }),
        	editable : false
       	}];
		var collect = this.collection.toJSON();
		var response = collect[0].responseMessage;
		var errorstatus = response.errorStatus;
		var message     = response.message;

		if(errorstatus=="0"){
			var ucollect = collect[0].userMgmtDetails;
			this.dataGrid(ucollect);	
		}else if(errorstatus=="2"){
			alert(message);
			this.clearCookies();
		}
		return this;
	},
	events : {
		"click #getId"			: "showId",
		"keyup #mzipcode"		: "getcitystate",
		"keyup #mcity"			: "getstatezip",
		"click #getdetails"		: "getdetails",
		"click #resetpass"		: "passwordreset",
		"click #perclear"   	: "personalclear",
		"click #addrclear"		: "addressclear",
		"click #baddrclear"		: "baddressclear",
		"click #caddrclear"		: "caddressclear",
		"click #closedetail"	: "closedetails",
		"click #commentclear"   : "commentclear",
		"change #mcopyfrom"		: "mainpopulate",
		"change #bcopyfrom"		: "billingpopulate",
		"change #ccopyfrom"		: "currentpopulate",
		"click  #savedetails"	: "saveuserdetails",
		"click #persave"		: "savepersonaldetails",
		"keyup #searchfilter"   : "getSearchDetails"
 	},
 	
 	getSearchDetails : function(event){
 		var search = this;
 		if (event.which == 13 || event.keyCode == 13) {
 			var searchname = $('#searchfilter').val();		
 			$.ajax({
 				type : "GET",
 				data : {Title : searchname},
 				url : "rest/umgmt/userdetails",
 				success : function(response) {
 					var status = response.responseMessage;
 					var errorstatus = status.errorStatus;
 					var message   = status.message;
 					if(errorstatus == 0){
 						var rcollect = response.userMgmtDetails;
 						search.dataGrid(rcollect);
 					}else if(errorstatus =="1"){
 						alert("Request timed out!");
 						search.clearCookies();
 					}
 				 }
 				});
 			}
 		},

 	 clearCookies :function(){
 		$.removeCookie("authtoken");
		$.removeCookie("firstName");
		$.removeCookie("lastName");
		$.removeCookie("lastLogin");
		$.removeCookie("role");
		$.removeCookie("roletype");
    	window.location = "login.html";
 	 },
 	 	
 	filtersearch : function(){
 		var role   = $('#filterrole').val();
 		var status = $('#filterstatus').val(); 
 	/*	$.ajax({
 				type : "GET",
 				data : {
 					role   : role,
 					status : status
 				},
 				url : "rest/",
 				success : function(response) {
 					var errorstatus = response.errorstatus;
 					var msg    = response.message;
 					var usercollection = new usermanagementCollection();
 					for(var i=0;i<collect.length;i++){
 					   var umodel  = new usermanagementModel({id:collect[i].id,username:collect[i].username,name:collect[i].firstname+" "+collect[i].lastname,reset:collect[i].reset,unlock:collect[i].unlock,role:collect[i].role,status:collect[i].status,login:collect[i].login});
 					   usercollection.add(umodel);
 					}
 					this.dataGrid(usercollection);
 				 }
 				});*/
 	},
 		
	saveuserdetails : function(){
		var roletype = this.model.get("role");
		var recid    = this.model.get("id");
		var that = this;
		if(roletype == "Employer"){
			var eregister = new employeemanageModel();
			var tax = $('#tax').val();
			var fax = $('#fax').val();
			if(tax){
				var taxid = $('#tax').val().match(/\d/g).join("");
			}else{
				var taxid = $('#tax').val();
			}
			if(fax){
				var faxid = $('#fax').val().match(/\d/g).join("");
			}else{
				var faxid = $('#fax').val();
			}
			
			eregister.set({
				recid			: recid,
				title			: $('#title').val(),
				firstname 		: $('#firstname').val(),
				lastname 		: $('#lastname').val(),
				middlename 		: $('#middlename').val(),
				email			: $('#email').val(),
				fax				: faxid,
				taxid			: taxid,
				url				: $('#websiteurl').val()
			});
			var addr	 = $('#maddress').val();
			var city	 = $('#mcity').val();
			var state   = $('#mstate').val();
			var county  = $('#mcounty').val();
			var zipcode = $('#mzipcode').val();
			
			if(!addr || !city || state=="select" || !county || !zipcode){
				console.log("No sufficient fields exist");
			}else{
				var maddressmodel = new userAddressModel({eusermanagement:eregister});
				var phone = $('#mphone').val();
				var fax    = $('#mfax').val();
				if(phone){
					var phones = $('#mphone').val().match(/\d/g).join("");
				}else{
					var phones = $('#mphone').val();
				}
				if(fax){
					var faxid    = $('#mfax').val().match(/\d/g).join("");
				}else{
					var faxid    = $('#mfax').val();
				}
				maddressmodel.set({
					type			: $('#mtype').attr('name'),
					address1		: $('#maddress').val(),
					address2		: $('#maddress2').val(),
					fax				: faxid,
					phone			: phones,
					phoneext		: $('#mphoneext').val(),	
					city			: $('#mcity').val(),
					state			: $('#mstate option:selected').attr('name'),
					zipcode			: $('#mzipcode').val(),
					county			: $('#mcounty').val()
				});
			}
			var addr1= $('#baddress').val();
			var city1 = $('#bcity').val();
			var state1 = $('#bstate').val();
			var county1 = $('#bcounty').val();
			var zipcode1 = $('#bzipcode').val();
			
			if(!addr1 || !city1 || !state1 || !county1 || !zipcode1){
				console.log("No sufficient fields exist");
			}else{
				var baddressmodel = new userAddressModel({eusermanagement:eregister});
				var phone = $('#bphone').val();
				var fax   = $('bfax').val(); 
				if(phone){
					var phones = $('#bphone').val().match(/\d/g).join("");
				}else{
					var phones = $('#bphone').val();
				}
				if(fax){
					var faxid    = $('#bfax').val().match(/\d/g).join("");
				}else{
					var faxid    = $('#bfax').val();
				}
				baddressmodel.set({
				type			: $('#btype').attr('name'),
				address1		: $('#baddress').val(),
				address2		: $('#baddress2').val(),
				fax				: faxid,
				phone			: phones,
				phoneext		: $('#bphoneext').val(),
				city			: $('#bcity').val(),
				state			: $('#bstate option:selected').attr('name'),
				zipcode			: $('#bzipcode').val(),
				county			: $('#bcounty').val()
				});
			}
			var addr2= $('#caddress').val();
			var city2 = $('#ccity').val();
			var state2 = $('#cstate').val();
			var county2 = $('#ccounty').val();
			var zipcode2 = $('#czipcode').val();

			if(!addr2 || !city2 || !state2 || !county2 || !zipcode2){
				console.log("No sufficient fields exist");
			}else{
				var caddressmodel = new userAddressModel({eusermanagement:eregister});
				var phone = $('#cphone').val();
				var fax   = $('cfax').val();
				
				if(phone){
					var phones = $('#cphone').val().match(/\d/g).join("");
				}else{
					var phones = $('#cphone').val();
				}
				if(fax){
					var faxid    = $('#cfax').val().match(/\d/g).join("");
				}else{
					var faxid    = $('#cfax').val().match(/\d/g).join("");
				}
				
				
				caddressmodel.set({
				type			: $('#ctype').attr('name'),
				address1		: $('#caddress').val(),
				address2		: $('#caddress2').val(),
				fax				: faxid,
				phone			: phones,
				phoneext		: $('#cphoneext').val(),
				city			: $('#ccity').val(),
				state			: $('#cstate option:selected').attr('name'),
				zipcode			: $('#czipcode').val(),
				county			: $('#ccounty').val()
				});
			}
			var fname = $('#firstname').val();
			eregister.url = "rest/eumgmt/savedetails";
			eregister.save({},{
				success : function(model, result, xhr){
					var rstatus = result.responseMessage;
					var msg = rstatus.message;
					var errorstatus = rstatus.errorStatus;
				if(errorstatus == "0"){
					$('#userssection').html("");
					this.model = pagecollection.get(recid);
						this.model.set({
							firstname : fname
						});
						$('#errormsgs').html("");
						 $('#successmsgs').flash_message({
						        text: 'User updation successful',
						        how: 'append'
						    });
					}else if(errorstatus == "1"){
						$('#errormsgs').focus();
						$('#successmsgs').html("");
						$('#errormsgs').flash_message({
					        text: msg,
					        how: 'append'
					    });
					}else if(errorstatus =="2"){
						alert(msg);
						that.clearCookies();
					}
				},
			});
			eregister=null;
		}else if(roletype =="Member"){
			var mregister = new membermanageModel();
			var ssn    = $('#ssn').val();
			if(ssn){
				var ssns    = $('#ssn').val().match(/\d/g).join("");	
			}else{
				var ssns    = $('#ssn').val();
			}
			mregister.set({
				recid		: recid,
				title		: $('#title').val(),
				firstname   : $('#firstname').val(),
				lastname    : $('#lastname').val(),
				middlename  : $('#middlename').val(),
				email		: $('#email').val(),
				ssn			: ssns,
				url			: $('#websiteurl').val()
			});
			var addr= $('#maddress').val();
			var city = $('#mcity').val();
			var state = $('#mstate').val();
			var county = $('#mcounty').val();
			var zipcode = $('#mzipcode').val();
			if(!addr || !city || !state || !county || !zipcode){
				console.log("No sufficient fields exist");
			}else{
			var maddressmodel = new userAddressModel({musermanagement:mregister});
			var phone = $('#mphone').val();
			if(phone){
				var phones = $('#mphone').val().match(/\d/g).join("");
			}else{
				var phones = $('#mphone').val();
			}
			
			maddressmodel.set({
				type			: $('#mtype').attr('name'),
				address1		: $('#maddress').val(),
				address2		: $('#maddress2').val(),
				phone			: phones,
				phoneext		: $('#mphoneext').val(),
				city			: $('#mcity').val(),
				state			: $('#mstate option:selected').attr('name'),
				zipcode			: $('#mzipcode').val(),
				county			: $('#mcounty').val()
				});
			}
			var addr1		= $('#baddress').val();
			var city1 		= $('#bcity').val();
			var state1 		= $('#bstate').val();
			var county1 	= $('#bcounty').val();
			var zipcode1	= $('#bzipcode').val();
			if(!addr1 || !city1 || !state1 || !county1 || !zipcode1){
				console.log("No sufficient fields exist");
			}else{
				
			var baddressmodel = new userAddressModel({musermanagement:mregister});
			var phone = $('#bphone').val();
			if(phone){
				var phones = $('#bphone').val().match(/\d/g).join("");
			}else{
				var phones = $('#bphone').val();
			}
			baddressmodel.set({
				type			: $('#btype').attr('name'),
				address1		: $('#baddress').val(),
				address2		: $('#baddress2').val(),
				phone			: phones,
				phoneext		: $('#bphoneext').val(),
				city			: $('#bcity').val(),
				state			: $('#bstate option:selected').attr('name'),
				zipcode			: $('#bzipcode').val(),
				county			: $('#bcounty').val()
				});
			}
			
			var addr2		= $('#caddress').val();
			var city2 		= $('#ccity').val();
			var state2 		= $('#cstate').val();
			var county2 	= $('#ccounty').val();
			var zipcode2	= $('#czipcode').val();
			
			if(!addr2 || !city2 || !state2 || !county2 || !zipcode2){
				console.log("No sufficient fields exist");
			}else{
					
			var caddressmodel = new userAddressModel({musermanagement:mregister});
			var phone  = $('#cphone').val();
			if(phone){
				var phones = $('#cphone').val().match(/\d/g).join("");
			}else{
				var phones = $('#cphone').val();
			}
			caddressmodel.set({
				type			: $('#ctype').attr('name'),
				address1		: $('#caddress').val(),
				address2		: $('#caddress2').val(),
				phone			: phones,
				phoneext		: $('#cphoneext').val(),
				city			: $('#ccity').val(),
				state			: $('#cstate option:selected').attr('name'),
				zipcode			: $('#czipcode').val(),
				county			: $('#ccounty').val()
				});
			}
			var fname = $('#firstname').val();
			mregister.url = "rest/mumgmt/savedetails";
			mregister.save({},{
				success : function(model, result, xhr){
					var rstatus = result.responseMessage;
					var msg = rstatus.message;
					var errorstatus = rstatus.errorStatus;
				if(errorstatus == "0"){
					$('#userssection').html("");
					$('#errormsgs').html("");
					this.model = pagecollection.get(recid);
					this.model.set({
						firstname : fname
					});
					 $('#successmsgs').flash_message({
					        text: 'User updation successful',
					        how: 'append'
					    });
				}else if(errorstatus == "1"){
					  $('#errormsgs').focus();
					  $('#successmsgs').html("");
					  $('#errormsgs').flash_message({
					        text: msg,
					        how: 'append'
					    });
				 }else if(errorstatus == "2"){
					 alert(msg);
					 that.clearCookies();
				 }
				}
			});
		}else if(roletype == "Broker"){
			var bregister = new brokermanageModel();
			var phone = $('#phone').val();
			if(phone){
				var phones = $('#phone').val().match(/\d/g).join("");
			}else{
				var phones = $('#phone').val();
			}
			
			var faxs = $('#fax').val();
			if(faxs){
				var faxid    = $('#fax').val().match(/\d/g).join("");
			}else{
				var faxid    = $('#fax').val();
			}
			
			
			bregister.set({
				recid			: recid,
				title			: $('#title').val(),
				firstname 		: $('#firstname').val(),
				lastname 		: $('#lastname').val(),
				middlename 		: $('#middlename').val(),
				email			: $('#email').val(),
				indbroker		: $('input[id=type]:checked').val(),
				agencyname      : $('#agencyname').val(),
				phone			: phones,
				fax				: faxid,
				url				: $('#websiteurl').val()
			});
			
			var addr		= $('#maddress').val();
			var city 		= $('#mcity').val();
			var state 		= $('#mstate').val();
			var county 		= $('#mcounty').val();
			var zipcode		= $('#mzipcode').val();
			
			if(!addr || !city || !state || !county || !zipcode){
				console.log("No sufficient fields exist");
			}else{
			
			var maddressmodel = new userAddressModel({busermanagement:bregister});
			var phone = $('#mphone').val();
			if(phone){
				var phones = $('#mphone').val().match(/\d/g).join("");
			}else{
				var phones = $('#mphone').val();
			}
			var fax    = $('#mfax').val();
			if(fax){
				var faxid    = $('#mfax').val().match(/\d/g).join("");
			}else{
				var faxid    = $('#mfax').val();
			}
			maddressmodel.set({
				type			: $('#mtype').attr('name'),
				address1		: $('#maddress').val(),
				address2		: $('#maddress2').val(),
				fax				: faxid,
				phone			: phones,
				phoneext		: $('#mphoneext').val(),
				city			: $('#mcity').val(),
				state			: $('#mstate option:selected').attr('name'),
				zipcode			: $('#mzipcode').val(),
				county			: $('#mcounty').val()
				});
			}
			var addr1		= $('#baddress').val();
			var city1 		= $('#bcity').val();
			var state1 		= $('#bstate').val();
			var county1 	= $('#bcounty').val();
			var zipcode1	= $('#bzipcode').val();
			
			if(!addr1 || !city1 || !state1 || !county1 || !zipcode1){
				console.log("No sufficient fields exist");
			}else{
			
			var baddressmodel = new userAddressModel({busermanagement:bregister});
			var phone = $('#bphone').val();
			if(phone){
				var phones = $('#bphone').val().match(/\d/g).join("");
			}else{
				var phones = $('#bphone').val();
			}
			var fax    = $('#bfax').val();
			if(fax){
				var faxid    = $('#bfax').val().match(/\d/g).join("");
			}else{
				var faxid    = $('#bfax').val();
			}
			
			
			baddressmodel.set({
				type			: $('#btype').attr('name'),
				address1		: $('#baddress').val(),
				address2		: $('#baddress2').val(),
				fax				: faxid,
				phone			: phones,
				phoneext		: $('#bphoneext').val(),
				city			: $('#bcity').val(),
				state			: $('#bstate option:selected').attr('name'),
				zipcode			: $('#bzipcode').val(),
				county			: $('#bcounty').val()
				});
			}
			
			var addr2		= $('#caddress').val();
			var city2 		= $('#ccity').val();
			var state2 		= $('#cstate').val();
			var county2 	= $('#ccounty').val();
			var zipcode2	= $('#czipcode').val();
			
			if(!addr2 || !city2 || !state2 || !county2 || !zipcode2){
				console.log("No sufficient fields exist");
			}else{
			var caddressmodel = new userAddressModel({busermanagement:bregister});
			var phone = $('#cphone').val();
			if(phone){
				var phones = $('#cphone').val().match(/\d/g).join("");
			}else{
				var phones = $('#cphone').val();
			}
			var fax    = $('#cfax').val();
			if(fax){
				var faxid    = $('#cfax').val().match(/\d/g).join("");
			}else{
				var faxid    = $('#cfax').val();
			}
			caddressmodel.set({
				type			: $('#ctype').attr('name'),
				address1		: $('#caddress').val(),
				address2		: $('#caddress2').val(),
				fax				: faxid,
				phone			: phones,
				phoneext		: $('#cphoneext').val(),
				city			: $('#ccity').val(),
				state			: $('#cstate option:selected').attr('name'),
				zipcode			: $('#czipcode').val(),
				county			: $('#ccounty').val()
				});
			}
			var fname = $('#firstname').val();
			bregister.url = "rest/bumgmt/savedetails";
			bregister.save({},{
				success : function(model, result, xhr){
					var status = result.responseMessage;
					var msg = status.message;
					var errorstatus = status.errorStatus;
				if(errorstatus == "0"){
					$('#userssection').html("");
					$('#errormsgs').html("");
					this.model = pagecollection.get(recid);
					this.model.set({
						firstname : fname
					});
					 $('#successmsgs').flash_message({
					        text: 'User updation successful',
					        how: 'append'
					    });
				}else if(errorstatus == "1"){
					$('#errormsgs').focus();
					$('#successmsgs').html("");
					$('#errormsgs').flash_message({
				        text: msg,
				        how: 'append'
				    });
				}else if(errorstatus == "2"){
					alert(msg);
					that.clearCookies();
				}
				}
			});
		}else if(roletype == "Content User"){
			var curegister = new internalusermanage();
			var phone = $('#phone').val();
			var fax = $('#fax').val();
			if(phone){
				var phones = $('#phone').val().match(/\d/g).join("");
			}else{
				var phones = $('#phone').val();
			}
			if(fax){
				var faxid    = $('#fax').val().match(/\d/g).join("");
			}else{
				var faxid    = $('#fax').val();
			}
			curegister.set({
				id				: recid,
				title			: $('#title').val(),
				firstname   	: $('#firstname').val(),
				lastname    	: $('#lastname').val(),
				middleinitial   : $('#middlename').val(),
				email			: $('#email').val(),
				phone			: phones,
				fax				: faxid,
				ext				: $('#ext').val()
			});
			var fname = $('#firstname').val();
			curegister.url ="rest/iuser/savedetails";
			curegister.save({},{
				success : function(model, result, xhr){
					var rstatus = result.responseMessage;
					var msg = rstatus.message;
					var errorstatus = rstatus.errorStatus;
				if(errorstatus == "0"){
					$('#userssection').html("");
					$('#errormsgs').html("");
					this.model = pagecollection.get(recid);
					this.model.set({
						firstname : fname
					});
					$('#successmsgs').text("User updation successful");
				}else if(errorstatus == "1"){
					$('#errormsgs').focus();
					$('#successmsgs').html("");
					 $('#errormsgs').flash_message({
				        text: msg,
				        how: 'append'
				    });
						}else if(errorstatus == "2"){
							alert(msg);
							that.clearCookies();
						}
					}
				});
		}else if(roletype == "Content Manager"){
			var cmregister = new internalusermanage();
			var phone = $('#phone').val();
			var fax = $('#fax').val();
			if(phone){
				var phones = $('#phone').val().match(/\d/g).join("");
			}else{
				var phones = $('#phone').val();
			}
			if(fax){
				var faxid    = $('#fax').val().match(/\d/g).join("");
			}else{
				var faxid    = $('#fax').val();
			}
			cmregister.set({
				id				: recid,
				title			: $('#title').val(),
				firstname   	: $('#firstname').val(),
				lastname    	: $('#lastname').val(),
				middleinitial   : $('#middlename').val(),
				email			: $('#email').val(),
				phone			: phones,
				fax				: faxid,
				ext				: $('#ext').val()
			});
			var fname = $('#firstname').val();
			cmregister.url ="rest/iuser/savedetails";
			cmregister.save({},{
				success : function(model, result, xhr){
					var rstatus 	= result.responseMessage;
					var msg 		= rstatus.message;
					var errorstatus = rstatus.errorStatus;
				if(errorstatus == "0"){
					$('#userssection').html("");
					$('#errormsgs').html("");
					this.model = pagecollection.get(recid);
					this.model.set({
						firstname : fname
						});
					 $('#successmsgs').flash_message({
					        text: 'User updation successful',
					        how: 'append'
					    });
				}else if(errorstatus == "1"){
					  $('#errormsgs').focus();
					  $('#successmsgs').html("");
					  $('#errormsgs').focus();
					  $('#errormsgs').flash_message({
					        text: msg,
					        how: 'append'
					    });
					}else if(errorstatus == "2"){
							alert(msg);
							that.clearCookies();
					}
				}
			});
		}else if(roletype == "Admin"){
			var adregister = new internalusermanage();
			var phone   = $('#phone').val();
			var fax  	= $('#fax').val();
			if(phone){
				var phones = $('#phone').val().match(/\d/g).join("");
			}else{
				var phones = $('#phone').val();
			}
			if(fax){
				var faxid    = $('#fax').val().match(/\d/g).join("");
			}else{
				var faxid    = $('#fax').val();
			}
			adregister.set({
				id				: recid,
				title			: $('#title').val(),
				firstname   	: $('#firstname').val(),
				lastname    	: $('#lastname').val(),
				middleinitial   : $('#middlename').val(),
				email			: $('#email').val(),
				phone			: phones,
				fax				: faxid,
				ext				: $('#ext').val()
			});
			var fname 	   = $('#firstname').val();
			adregister.url ="rest/iuser/savedetails";
			adregister.save({},{
				success : function(model, result, xhr){
					var rstatus 	= result.responseMessage;
					var msg 	 	= rstatus.message;
					var errorstatus = rstatus.errorStatus;
				if(errorstatus == "0"){	
					$('#userssection').html("");
					$('#errormsgs').html("");
					this.model = pagecollection.get(recid);
					this.model.set({
						firstname : fname
					});
					 $('#successmsgs').flash_message({
					        text: 'User updation successful',
					        how: 'append'
					    });
				}else if(errorstatus == "1"){
					  $('#successmsgs').html("");
					  $('#errormsgs').focus();
					  $('#errormsgs').flash_message({
					        text: msg,
					        how: 'append'
					    });
				}else if(errorstatus == "2"){
					alert(msg);
					that.clearCookies();
				}
				}
			});
		}else if(roletype == "Internal Sales Rep"){
			var Isregister = new internalusermanage();
			var phone = $('#phone').val();
			var fax = $('#fax').val();
			if(phone){
				var phones = $('#phone').val().match(/\d/g).join("");
			}else{
				var phones = $('#phone').val();
			}
			if(fax){
				var faxid    = $('#fax').val().match(/\d/g).join("");
			}else{
				var faxid    = $('#fax').val();
			}
			Isregister.set({
				id				: recid,
				title			: $('#title').val(),
				firstname   	: $('#firstname').val(),
				lastname    	: $('#lastname').val(),
				middleinitial   : $('#middlename').val(),
				email			: $('#email').val(),
				phone			: phones,
				fax				: faxid,
				ext				: $('#ext').val()
			});
			var fname 	   = $('#firstname').val();
			Isregister.url ="rest/iuser/savedetails";
			Isregister.save({},{
				success : function(model, result, xhr){
					var rstatus     = result.responseMessage;
					var msg 		=  rstatus.message;
					var errorstatus =  rstatus.errorStatus;
				if(errorstatus == "0"){	
					$('#userssection').html("");
					$('#errormsgs').html("");
					this.model = pagecollection.get(recid);
					this.model.set({
						firstname : fname
					});
					 $('#successmsgs').flash_message({
					        text: 'User updation successful',
					        how: 'append'
					    });
				}else if(errorstatus == "1"){
					  $('#successmsgs').html("");
					  $('#errormsgs').focus();
					  $('#errormsgs').flash_message({
					        text: msg,
					        how: 'append'
					    });
				}else if(errorstatus == "2"){
					alert(msg);
					that.clearCookies();
				}
				}
			});
		}
	},
	passwordreset : function(e){
		var that = this;
		e.preventDefault();
		var recid = parseInt($(e.currentTarget).attr("href"));
		$.ajax({
			type : "POST",
			data : {
				id : recid
			},
			url : "rest/umgmt/resetpw",
			success : function(response) {
				var rstatus 	 = response.responseMessage;
				var errorstatus  = rstatus.errorStatus;
				var msg 		 = rstatus.message;
				if(errorstatus == "0"){
					 $('#successmsgs').flash_message({
					        text: 'Password reset successful new password has been sent to registered email id',
					        how: 'append'
					    });
				}else if(errorstatus == "1"){
					$('#successmsgs').html("");
					$('#errormsgs').focus();
					 $('#errormsgs').flash_message({
					        text: msg,
					        how: 'append'
					    });
				}else if(errorstatus == "2"){
					alert(msg);
					that.clearCookies();
				}
			 }
		});
	},
	getdetails : function(e){
		e.preventDefault();
		var recid = parseInt($(e.currentTarget).attr("href"));
		this.model = pagecollection.get(recid);
		var that = this;
		$('#successmsgs').html("");
		console.log(recid);
		var rolecode = this.model.get("role");
		if(rolecode == "Employer"){
		$.ajax({
			type : "GET",
			data : { id : recid	},
			url : "rest/eumgmt/userdetails",
			success : function(response) {
				  var status = response.responseMessage;
				  var msg	 = status.message;
				  var errorstatus = status.errorStatus;
				  if(errorstatus == "0"){
				 this.template = _.template( $('#employeetabs').html()); 
				   $($('#userssection')).html(this.template());
				   $('div.tabs').tabs();
				   $('#perclear').focus();
				   var pdetails = response.personalDetails;
				   var adetails = response.addressDetails;
				   var states	= response.states;
				   var title = pdetails.title;
				   var uname = pdetails.username;
				   var fname = pdetails.firstname;
				   var lname = pdetails.lastname;
				   var mname = pdetails.middlename;
				   var email = pdetails.email;
				   var fax   = pdetails.fax;
				   var tax	 = pdetails.tax;
				   var url  = pdetails.url;
				   
				   /*	Address Details Main  */

			   if(!pdetails || pdetails == null || pdetails == ""){				   
					   $('#perdetails').append('<img src="images/unchecked.gif"/>');
			   }else{
				       $('#perdetails').append('<img src="images/checked.png"/>');
			   }
			   	$('#tax').mask("99-9999999");
				$("#phone").mask("(999) 999-9999");
				$("#fax").mask("(999) 999-9999");
			    $('#title').val(title);
			    $("#unames").val(uname);
			    $('#firstname').val(fname);
			    $('#lastname').val(lname);
			    $('#middlename').val(mname);
			    $('#fax').val(fax);
			    $('#email').val(email);
			    $('#websiteurl').val(url);
			    $('#tax').val(tax);
			    
			    if(!adetails || adetails == null || adetails == ""){
			    	 $('#addrdetails').append('<img src="images/unchecked.gif"/>');
			    }else {
			    	$('#addrdetails').append('<img src="images/checked.png"/>');
			    }
			    
			    for(var i=0;i<states.length;i++){
			    	var scode = states[i].stateCode;
			    	var sdesc = states[i].stateDescription;
			    	$('#mstate').append("<option name="+scode+">"+sdesc+"</option>");
			    	$('#bstate').append("<option name="+scode+">"+sdesc+"</option>");
			    	$('#cstate').append("<option name="+scode+">"+sdesc+"</option>");
			    }
			       $("#mphone").mask("(999) 999-9999");
				   $("#mfax").mask("(999) 999-9999");
			       $("#bphone").mask("(999) 999-9999");
				   $("#bfax").mask("(999) 999-9999");
			       $("#cphone").mask("(999) 999-9999");
				   $("#cfax").mask("(999) 999-9999");
			    
			for(var i=0;i<adetails.length;i++){
					   var type = adetails[i].type;
					   var address1 = adetails[i].address1;
					   var address2 = adetails[i].address2;
					   var zipcode = adetails[i].zipcode;
					   var city	    = adetails[i].city;
					   var state 	= adetails[i].state;
					   var county  = adetails[i].county;
					   var phone   = adetails[i].phone;
					   var ext     = adetails[i].phExt;
					   var fax 	   = adetails[i].fax;
					   
			if(type == "MAIN"){
						$('#main').append('<img src="images/checked.png"/>');	
					    $('#maddress').val(address1);
					    $('#maddress2').val(address2);
					    $('#mphone').val(phone);
					    $('#mphoneext').val(ext);
					    $('#mcounty').val(county);
					    $('#mfax').val(fax);
					    $('#mcity').val(city);
					    $('#mzipcode').val(zipcode);
				    	$('#mstate option[name='+state+']').prop('selected',true);
			    }else if(type == "BILL"){
			    		$('#billing').append('<img src="images/checked.png"/>');
			    	    $('#baddress').val(address1);
					    $('#baddress2').val(address2);
					    $('#bphone').val(phone);
					    $('#bphoneext').val(ext);
					    $('#bcounty').val(county);
					    $('#bfax').val(fax);
					    $('#bcity').val(city);
					    $('#bzipcode').val(zipcode);
					   	$('#bstate option[name='+state+']').prop('selected',true);
			    }else if(type =="CURR"){
			    		$('#current').append('<img src="images/checked.png"/>');
			    	 	$('#caddress').val(address1);
					    $('#caddress2').val(address2);
					    $('#cphone').val(phone);
					    $('#cphoneext').val(ext);
					    $('#ccounty').val(county);
					    $('#cfax').val(fax);
					    $('#ccity').val(city);
					    $('#czipcode').val(zipcode);
					   	$('#cstate option[name='+state+']').prop('selected',true);
			    		}
					}	
			    }else if(errorstatus == "2"){
			    		alert(msg);
			    		that.clearCookies();
			    }
			   }
			});
		}else if(rolecode == "Broker"){
			$.ajax({
				type : "GET",
				data : { id : recid },
				url : "rest/bumgmt/userdetails",
				success : function(response) {
				   var status 		= response.responseMessage;
				   var msg	 		= status.message;
				   var errorstatus = status.errorStatus;
				if(errorstatus == "0"){
					this.template = _.template( $('#brokertabs').html()); 
					   $($('#userssection')).html(this.template());
					   $('div.tabs').tabs();
					   $('#perclear').focus();
					    var pdetail = response.personalDetails;
					    var adetail = response.addressDetails;
					    var states	= response.states;
					    var title = pdetail.title;
					    var uname = pdetail.username;
					    var fname = pdetail.firstname;
					    var mname = pdetail.middlename;
					    var lname = pdetail.lastname;
					    var email = pdetail.email;
					    var phone = pdetail.phone;
					    var fax = pdetail.fax;
					    var indbroker = pdetail.indbroker;
					    var agency = pdetail.agencyname;
					    var url = pdetail.url;
					    
					   /*	Address Details Main  */
			   
					    if(!pdetail || pdetail == null || pdetail == ""){				   
							   $('#perdetails').append('<img src="images/unchecked.gif"/>');
					   }else{
						       $('#perdetails').append('<img src="images/checked.png"/>');
					   }
					    
					    $("#phone").mask("(999) 999-9999");
						$("#fax").mask("(999) 999-9999");
					    $('#title').val(title);
					    $("#unames").val(uname);
					    $('#firstname').val(fname);
					    $('#lastname').val(lname);
					    $('#middlename').val(mname);
					    $('#phone').val(phone);
					    $('#fax').val(fax);
					    $('#email').val(email);
					    $('input[id=type][value='+indbroker+']').attr('checked','checked');
					    $('#agencyname').val(agency);
					    $('#websiteurl').val(url);
			
					    if(!adetail || adetail == "" || adetail == null){
					    	$('#addrdetail').append('<img src="images/unchecked.gif"/>');
					    }else{
					    	$('#addrdetail').append('<img src="images/checked.png"/>');
					    }
					    for(var i=0;i<states.length;i++){
					    	var scode = states[i].stateCode;
					    	var sdesc = states[i].stateDescription;
					    	$('#mstate').append("<option name="+scode+">"+sdesc+"</option>");
					    	$('#bstate').append("<option name="+scode+">"+sdesc+"</option>");
					    	$('#cstate').append("<option name="+scode+">"+sdesc+"</option>");
					    }
					       $("#mphone").mask("(999) 999-9999");
						   $("#mfax").mask("(999) 999-9999");
					       $("#bphone").mask("(999) 999-9999");
						   $("#bfax").mask("(999) 999-9999");
					       $("#cphone").mask("(999) 999-9999");
						   $("#cfax").mask("(999) 999-9999");
					    
					    
					    for(var i=0;i<adetail.length;i++){
							   var type = adetail[i].type;
							   var address1 = adetail[i].address1;
							   var address2 = adetail[i].address2;
							   var zipcode = adetail[i].zipcode;
							   var city	    = adetail[i].city;
							   var state 	= adetail[i].state;
							   var county  = adetail[i].county;
							   var phone   = adetail[i].phone;
							   var ext     = adetail[i].phExt;
							   var fax 	   = adetail[i].fax;
								   
							   if(type == "MAIN"){
								   		$('#main').append('<img src="images/checked.png"/>');
										$('#maddress').val(address1);
									    $('#maddress2').val(address2);
									    $('#mphone').val(phone);
									    $('#mphoneext').val(ext);
									    $('#mcounty').val(county);
									    $('#mfax').val(fax);
									    $('#mcity').val(city);
									    $('#mzipcode').val(zipcode);
									    $('#mstate option[name='+state+']').prop('selected',true);
								  }else if(type == "BILL"){
									  	$('#billing').append('<img src="images/checked.png"/>');
										$('#baddress').val(address1);
									    $('#baddress2').val(address2);
									    $('#bphone').val(phone);
									    $('#bphoneext').val(ext);
									    $('#bcounty').val(county);
									    $('#bfax').val(fax);
									    $('#bcity').val(city);
									    $('#bzipcode').val(zipcode);
									    $('#bstate option[name='+state+']').prop('selected',true);
								  }else if(type == "CURR"){
									  	$('#current').append('<img src="images/checked.png"/>');
									    $('#caddress').val(address1);
									    $('#caddress2').val(address2);
									    $('#cphone').val(phone);
									    $('#cphoneext').val(ext);
									    $('#ccounty').val(county);
									    $('#cfax').val(fax);
									    $('#ccity').val(city);
									    $('#czipcode').val(zipcode);
									    $('#cstate option[name='+state+']').prop('selected',true);
								  }
						   }
						}else if(errorstatus == "2"){
							alert(msg);
							that.clearCookies();
						}
					}
				});
		}else if(rolecode == "Member"){
			$.ajax({
				type : "GET",
				data : { id : recid	},
				url : "rest/mumgmt/userdetails",
				success : function(response) {
					  var status 	  = response.responseMessage;
					  var msg	 	  = status.message;
					  var errorstatus = status.errorStatus;
					  if(errorstatus == "0"){
					this.template = _.template( $('#membertabs').html()); 
					   $($('#userssection')).html(this.template());
					   $('div.tabs').tabs();
					   $('#perclear').focus();
					   var pdetail = response.personalDetails;
					   var adetail = response.addressDetails;
					   var states	= response.states;
					    var title = pdetail.title;
					    var uname = pdetail.username;
					    var fname = pdetail.firstname;
					    var mname = pdetail.middlename;
					    var lname = pdetail.lastname;
					    var email = pdetail.email;
					    var ssn	  = pdetail.ssn;
			
					    if(!pdetail || pdetail == null || pdetail == ""){				   
							   $('#perdetails').append('<img src="images/unchecked.gif"/>');
					   }else{
						       $('#perdetails').append('<img src="images/checked.png"/>');
					   } 
					    
					    $("#phone").mask("(999) 999-9999");
						$('#ssn').mask("999-99-9999");
						$('#title').val(title);
					    $("#unames").val(uname);
					    $('#firstname').val(fname);
					    $('#lastname').val(lname);
					    $('#middlename').val(mname);
					    $('#ssn').val(ssn);
					    $('#email').val(email);
					    if(adetail == "" || adetail==null){
					    	$('#addrdetails').append('<img src="images/unchecked.gif"/>');
					    }else{
					    	$('#addrdetails').append('<img src="images/checked.png"/>');
					    }
				    for(var i=0;i<states.length;i++){
					    	var scode = states[i].stateCode;
					    	var sdesc = states[i].stateDescription;
					    	$('#mstate').append("<option name="+scode+">"+sdesc+"</option>");
					    	$('#bstate').append("<option name="+scode+">"+sdesc+"</option>");
					    	$('#cstate').append("<option name="+scode+">"+sdesc+"</option>");
					 }
				       $("#mphone").mask("(999) 999-9999");
				       $("#bphone").mask("(999) 999-9999");
				       $("#cphone").mask("(999) 999-9999");
					   
				    for(var i=0;i<adetail.length;i++){
						       var type     = adetail[i].type;
							   var address1 = adetail[i].address1;
							   var address2 = adetail[i].address2;
							   var zipcode = adetail[i].zipcode;
							   var city	    = adetail[i].city;
							   var state 	= adetail[i].state;
							   var county  = adetail[i].county;
							   var ext	   = adetail[i].phExt;
							   var phone   = adetail[i].phone;
							   var fax 	   = adetail[i].fax;
						   
					   if(type == "MAIN"){
						   	$('#main').append('<img src="images/checked.png"/>');
						    $('#maddress').val(address1);
						    $('#maddress2').val(address2);
						    $('#mcounty').val(county);
						    $('#mcity').val(city);
						    $('#mzipcode').val(zipcode);
						    $('#mphoneext').val(ext);
						    $('#mphone').val(phone);
						    $('#mfax').val(fax);
						    $('#mstate option[name='+state+']').prop('selected',true);
					  }else if(type == "BILL"){	  	
						  	$('#billing').append('<img src="images/checked.png"/>');
						    $('#baddress').val(address1);
						    $('#baddress2').val(address2);
						    $('#bcounty').val(county);
						    $('#bcity').val(city);
						    $('#bzipcode').val(zipcode);
						    $('#bphoneext').val(ext);
						    $('#bphone').val(phone);
						    $('#bfax').val(fax);
						    $('#bstate option[name='+state+']').prop('selected',true);
					  }else if(type == "CURR"){
						  	$('#current').append('<img src="images/checked.png"/>');
						  	$('#caddress').val(address1);
						    $('#caddress2').val(address2);
						    $('#ccounty').val(county);
						    $('#ccity').val(city);
						    $('#czipcode').val(zipcode);
						    $('#cphone').val(phone);
						    $('#cphoneext').val(ext);
						    $('#cfax').val(fax);
						    $('#cstate option[name='+state+']').prop('selected',true);
					  		}
				    	}
					  }else if(errorstatus == "2"){
						  alert(msg);
						  that.clearCookies();
					  }
					}
				});
		}
		else if(rolecode == "Admin"){
			$.ajax({
				type : "GET",
				data : { id : recid	},
				url : "rest/iuser/userdetails",
				success : function(response) {
					  var status = response.responseMessage;
					  var msg	 = status.message;
					  var errorstatus = status.errorStatus;
					  if(errorstatus == "0"){
		  			   this.template = _.template( $('#internaluser').html()); 
					   $($('#userssection')).html(this.template());
					   $('#perclear').focus();
					   var pdetail = response.personalDetails;
					    var uname = pdetail.username;
					    var title = pdetail.title;
					    var fname = pdetail.firstname;
					    var mname = pdetail.middlename;
					    var lname = pdetail.lastname;
					    var email = pdetail.email;
					    var fax	  = pdetail.fax;
					    var phone = pdetail.phone;
					    var ext   = pdetail.phext;

					    if(!pdetail || pdetail == null || pdetail == ""){				   
							   $('#perdetails').append('<img src="images/unchecked.gif"/>');
					   }else{
						       $('#perdetails').append('<img src="images/checked.png"/>');
					   } 
					    $("#phone").mask("(999) 999-9999");
					    $("#fax").mask("(999) 999-9999");
					    $('#firstname').val(fname);
					    $('#title').val(title);
					    $('#lastname').val(lname);
					    $('#middlename').val(mname);
					    $('#unames').val(uname);
					    $('#fax').val(fax);
					    $('#email').val(email);
					    $('#phone').val(phone);
					    $('#ext').val(ext);
					  }else if(errorstatus == "2"){
						  alert(msg);
						  that.clearCookies();
					  }
					}
				});
		}else if(rolecode == "Content Manager"){
			$.ajax({
				type : "GET",
				data : { id : recid	},
				url : "rest/iuser/userdetails",
				success : function(response) {
					  var status = response.responseMessage;
					  var msg	 = status.message;
					  var errorstatus = status.errorStatus;
					  if(errorstatus == "0"){
					   this.template = _.template( $('#internaluser').html()); 
					   $($('#userssection')).html(this.template());
					   $('#perclear').focus();
					   var pdetail = response.personalDetails;
					    var title = pdetail.title;
					    var uname = pdetail.username;
					    var fname = pdetail.firstname;
					    var mname = pdetail.middlename;
					    var lname = pdetail.lastname;
					    var fax	  = pdetail.fax;
					    var email = pdetail.email;
					    var phone = pdetail.phone;
					    var ext   = pdetail.phext;
					    
					    if(!pdetail || pdetail == null || pdetail == ""){				   
							   $('#perdetails').append('<img src="images/unchecked.gif"/>');
					   }else{
						       $('#perdetails').append('<img src="images/checked.png"/>');
					   }
					    $("#phone").mask("(999) 999-9999");
					    $("#fax").mask("(999) 999-9999");
					    $('#title').val(title);
					    $('#firstname').val(fname);
					    $('#lastname').val(lname);
					    $('#middlename').val(mname);
					    $('#fax').val(fax);
					    $('#unames').val(uname);
					    $('#email').val(email);
					    $('#phone').val(phone);
					    $('#ext').val(ext);
						}else if(errorstatus == "2"){
							alert(msg);
							that.clearCookies();
						}
					}
				});
		}else if(rolecode == "Content User"){
			$.ajax({
				type : "GET",
				data : { id : recid},
				url : "rest/iuser/userdetails",
				success : function(response) {
					  var status = response.responseMessage;
					  var msg	 = status.message;
					  var errorstatus = status.errorStatus;
					  if(errorstatus == "0"){
					   this.template = _.template( $('#internaluser').html()); 
					   $($('#userssection')).html(this.template());
					   $('#perclear').focus();
					   var pdetail = response.personalDetails;
					   	var title = pdetail.title;	
					    var uname = pdetail.username;
					    var fname = pdetail.firstname;
					    var mname = pdetail.middlename;
					    var lname = pdetail.lastname;
					    var email = pdetail.email;
					    var fax	  = pdetail.fax;
					    var phone = pdetail.phone;
					    var ext   = pdetail.phext;
					    					    	
					    if(!pdetail || pdetail == null || pdetail == ""){				   
							   $('#perdetails').append('<img src="images/unchecked.gif"/>');
					   }else{
						       $('#perdetails').append('<img src="images/checked.png"/>');
					   }
					    $("#phone").mask("(999) 999-9999");
					    $("#fax").mask("(999) 999-9999");
					    $('#title').val(title);
					    $('#firstname').val(fname);
					    $('#lastname').val(lname);
					    $('#middlename').val(mname);
					    $('#fax').val(fax);
					    $('#unames').val(uname);
					    $('#email').val(email);
					    $('#phone').val(phone);
					    $('#ext').val(ext);
					}else if(errorstatus == "2"){
						alert(msg);
						that.clearCookies();
					}
				}
			});
		}
		else if(rolecode == "Internal Sales Rep"){
			$.ajax({
				type : "GET",
				data : { id : recid},
				url : "rest/iuser/userdetails",
				success : function(response) {
					  var status = response.responseMessage;
					  var msg	 = status.message;
					  var errorstatus = status.errorStatus;
					  if(errorstatus == "0"){		  
					   this.template = _.template( $('#internaluser').html()); 
					   $($('#userssection')).html(this.template());
					   $('#perclear').focus();
					   var pdetail = response.personalDetails;
					   	var title = pdetail.title;
					    var uname = pdetail.username;
					    var fname = pdetail.firstname;
					    var mname = pdetail.middlename;
					    var lname = pdetail.lastname;
					    var email = pdetail.email;
					    var fax	  = pdetail.fax;
					    var phone = pdetail.phone;
					    var ext   = pdetail.phext;
					    					    	
					    if(!pdetail || pdetail == null || pdetail == ""){				   
							   $('#perdetails').append('<img src="images/unchecked.gif"/>');
					   }else{
						       $('#perdetails').append('<img src="images/checked.png"/>');
					   }
					    $("#phone").mask("(999) 999-9999");
					    $("#fax").mask("(999) 999-9999");
					    $('#title').val(title);
					    $('#firstname').val(fname);
					    $('#lastname').val(lname);
					    $('#middlename').val(mname);
					    $('#fax').val(fax);
					    $('#unames').val(uname);
					    $('#email').val(email);
					    $('#phone').val(phone);
					    $('#ext').val(ext);
					}else if(errorstatus == "2"){
							alert(msg);
							that.clearCookies();
					}
				}
			});
		}
	},
	currentpopulate : function(){
		var types = $('#ccopyfrom').val();
		if(types == "Main"){
			$('#caddress').val($('#maddress').val());
			$('#caddress2').val($('#maddress2').val());
			$('#ccity').val($('#mcity').val());
			$('#cstate').val($('#mstate').val());
			$('#czipcode').val($('#mzipcode').val());
			$('#cphone').val($('#mphone').val());
			$('#cphoneext').val($('#mphoneext').val());
			$('#cfax').val($('#mfax').val());
			$('#ccounty').val($('#mcounty').val());
		}else if(types == "Billing"){
			$('#caddress').val($('#baddress').val());
			$('#caddress2').val($('#baddress2').val());
			$('#ccity').val($('#bcity').val());
			$('#cstate').val($('#bstate').val());
			$('#cphone').val($('#bphone').val());
			$('#cphoneext').val($('#bphoneext').val());
			$('#czipcode').val($('#bzipcode').val());
			$('#cfax').val($('#bfax').val());
			$('#ccounty').val($('#bcounty').val());
		}else{
			$('#caddress').val("");
			$('#caddress2').val("");
			$('#ccity').val("");
			$('#cstate').val("");
			$('#cphone').val("");
			$('#cphoneext').val("");
			$('#czipcode').val("");
			$('#cfax').val("");
			$('#ccounty').val("");
		}
	},

	billingpopulate : function(){
		var types = $('#bcopyfrom').val();
		if(types == "Main"){
			$('#baddress').val($('#maddress').val());
			$('#baddress2').val($('#maddress2').val());
			$('#bcity').val($('#mcity').val());
			$('#bstate').val($('#mstate').val());
			$('#bzipcode').val($('#mzipcode').val());
			$('#bphone').val($('#mphone').val());
			$('#bphoneext').val($('#mphoneext').val());
			$('#bfax').val($('#mfax').val());
			$('#bcounty').val($('#mcounty').val());
		}else if(types == "Current"){
			$('#baddress').val($('#caddress').val());
			$('#baddress2').val($('#caddress2').val());
			$('#bcity').val($('#ccity').val());
			$('#bstate').val($('#cstate').val());
			$('#bzipcode').val($('#czipcode').val());
			$('#bphone').val($('#cphone').val());
			$('#bphoneext').val($('#cphoneext').val());
			$('#bfax').val($('#cfax').val());
			$('#bcounty').val($('#ccounty').val());
		}else{
			$('#baddress').val("");
			$('#baddress2').val("");
			$('#bcity').val("");
			$('#bstate').val("");
			$('#bphone').val("");
			$('#bphoneext').val("");
			$('#bzipcode').val("");
			$('#bfax').val("");
			$('#bcounty').val("");
		}
	},
	mainpopulate : function(){
		var types = $('#mcopyfrom').val();
		if(types == "Billing"){
			$('#maddress').val($('#baddress').val());
			$('#maddress2').val($('#baddress2').val());
			$('#mcity').val($('#bcity').val());
			$('#mstate').val($('#bstate').val());
			$('#mzipcode').val($('#bzipcode').val());
			$('#mfax').val($('#bfax').val());
			$('#mphone').val($('#bphone').val());
			$('#mphoneext').val($('#bphoneext').val());
			$('#mcounty').val($('#bcounty').val());
		}else if(types == "Current"){
			$('#maddress').val($('#caddress').val());
			$('#maddress2').val($('#caddress2').val());
			$('#mcity').val($('#ccity').val());
			$('#mstate').val($('#cstate').val());
			$('#mphone').val($('#cphone').val());
			$('#mphoneext').val($('#cphoneext').val());
			$('#mzipcode').val($('#czipcode').val());
			$('#mfax').val($('#cfax').val());
			$('#mcounty').val($('#ccounty').val());
		}else{
			$('#maddress').val("");
			$('#maddress2').val("");
			$('#mcity').val("");
			$('#mstate').val("");
			$('#mphone').val("");
			$('#mphoneext').val("");
			$('#mzipcode').val("");
			$('#mfax').val("");
			$('#mcounty').val("");
		}
	},
	commentclear : function(){
		$('#ecomment').val("");
		$('#mcomment').val("");
		$('#bcomment').val("");
	},

	closedetails : function(e){
		e.preventDefault();
		var r= confirm("Are you sure?");
		if (r==true) {
			$('#userssection').html("");
  		    $('#errormsgs').html("");
  		    $('#successmsgs').html("");
		}
	},
  	personalclear : function(){
	    $("#unames").val("");
	    $('#firstname').val("");
	    $('#lastname').val("");
	    $('#middlename').val("");
	    $('#fax').val("");
	    $('#email').val("");
	    $('#agencyname').val("");
	    $('#phone').val("");
	    $('#ext').val("");
	},
	addressclear : function(){
		$('#maddress').val("");
		$('#maddress2').val("");
		$('#mcity').val("");
		$('#mstate').val("");
		$('#mzipcode').val("");
		$('#mfax').val("");
		$('#mphone').val("");
		$('#mcounty').val("");
	},
	
	baddressclear : function(){
		$('#baddress').val("");
		$('#baddress2').val("");
		$('#bcity').val("");
		$('#bstate').val("");
		$('#bzipcode').val("");
		$('#bfax').val("");
		$('#bphone').val("");
		$('#bcounty').val("");	
	},
	
	caddressclear : function(){
		$('#caddress').val("");
		$('#caddress2').val("");
		$('#ccity').val("");
		$('#cstate').val("");
		$('#czipcode').val("");
		$('#cfax').val("");
		$('#cphone').val("");
		$('#ccounty').val("");
	},
	
	getstatezip : function(){
		$("#mcity").autocomplete({
		             source: "rest/autosuggest/city",
		             select: function(e, ui) {
		            	 e.preventDefault();
		            	 var city = ui.item.City;
		            	 var state = ui.item.State;
		            	 var zip 	= ui.item.Zipcode;
		            	 var county = ui.item.County;
		            	 $( "#mcity" ).val(city);
		            	 $('#mcounty').val(county);
		            	 $('#mstate option[name='+state+']').prop('selected',true);
		            	 $('#mzipcode').val(zip);
	              }	            
		    }).data("ui-autocomplete")._renderItem = function( ul, item ) {
		    	return $( "<li>" ).append( "<a>" + item.City + "," + item.State +", "+item.Zipcode+", "+item.County+"</a>")
		    	.appendTo(ul);
		    	};
	},

	getcitystate : function(){
		$("#mzipcode").autocomplete({
             source       : "rest/autosuggest/zipcode",
             select: function(e, ui) {
            	 e.preventDefault();
            	 var city = ui.item.City;
            	 var state = ui.item.State;
            	 var zip 	= ui.item.Zipcode;
            	 var county = ui.item.County;
            	 $( "#mcity" ).val(city);
            	 $('#mstate option[name='+state+']').prop('selected',true);
            	 $('#mzipcode').val(zip);
            	 $('#mcounty').val(county);
              }
         }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
    	return $( "<li>" ).append( "<a>" + item.City + "," + item.State +", "+item.Zipcode+", "+item.County+"</a>")
    	.appendTo(ul);
    	};
	},
  	dataGrid:function(collection) {
  		$('#reggrid').empty();
		var grids = this.$("#reggrid");
        var Rcollection = Backbone.PageableCollection.extend({
      	  model : usermanagementModel,
      	  url   : "rest/umgmt/userdetails",
      	  state : {
       		   pageSize: 5,
       		   firstPage: 0,
	           	   currentPage:0,
       		  },
       	  mode  : "client",
        });
        pagecollection = new Rcollection(collection);
        this.pageableGrid = new Backgrid.Grid({
     	  columns: columns,
     	  collection: pagecollection
     });
    grids.append(this.pageableGrid.render().$el);
    var paginator = new Backgrid.Extension.Paginator({
  	  collection: pagecollection
  	});
    grids.append(paginator.render().$el);
    this.$('#searchbox').show();
    $('#statusbuttons').show();
	} 	
});
