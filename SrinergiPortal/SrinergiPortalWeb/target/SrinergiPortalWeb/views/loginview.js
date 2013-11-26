var loginView = Backbone.View.extend({
	template : _.template($('#logintemplate').html()),
	initialize : function(){
		this.render();
	},
	render : function(){
		$(this.el).html(this.template());
		this.checktoken();
		Backbone.Validation.bind(this, {
			  valid: function(view, attr) {},
		      invalid: function(view, attr, error) {
		    	   var div = $("<div>").html(error);
		           $("#errormsg").append(div);
		      	 }
		       });
		return this;
	},	
	checktoken : function(){
		var tokn = $.cookie("authtoken");
		if(tokn != null){
			window.location = "index.html";
		}
	},
	
	events :{
		"click #signin"           : "login",
		"click #brokerregister"   : "brokerreg",
		"click #employeeregister" : "employeereg",
		"click #memberregister"	  : "memberreg",
		"click #forgotpass"       : "forgotpassword",
		"keyup #password"		  : "getlogin",
		"keyup #username"         : "getlogin",  
 	},

	getlogin : function(event){
		if (event.which == 13 || event.keyCode == 13) {
	        this.login();
	        return false;
	    }
	},
	
	reset : function() {
		$('#password').val('');
	},

	forgotpassword : function(){
		this.remove();
		this.unbind();
		route.navigate("forgotpass",{trigger:true});
	},
	
	brokerreg : function (){
		this.remove();
		this.unbind();
		$.cookie("roletype","BREG");
		route.navigate("brokerreg",{trigger:true});
    },
	employeereg : function(){
		this.remove();
		this.unbind();
		$.cookie("roletype","EREG");
		route.navigate("employeereg",{trigger:true});
	},
	memberreg : function(){
		this.remove();
		this.unbind();
		$.cookie("roletype","MREG");
		route.navigate("memberreg",{trigger:true});
	},	
	login : function() {
		this.model.set({
				username : $('#username').val(),
				password : $("#password").val()
			});
		$('#errormsg').empty();
		this.model.save(null, {
				success : function(model, result, xhr){
						var cont 	 = model.toJSON();
						var msg 	= cont.message;
						var status  = cont.errorStatus;
						var token    = cont.token;
						var fname   = cont.firstName;
						var lname   = cont.lastName;
						var llogin  = cont.lastLogin;
						var role	= cont.role;
			if(status == "0"){
							var date = new Date();
							 var minutes = 20;
						 	date.setTime(date.getTime() + (minutes * 60 * 1000));
					 		 $.cookie("authtoken",token,{ expires: date});
								$('#uname').val(username);
								$('#authtoken').val(token);
								$.cookie("firstName",fname);
						 		 $.cookie("lastName",lname);
						 		 $.cookie("role",role);
						 		 $.cookie("lastLogin",llogin);
								window.location = "index.html";
						}else if(status == "1"){
							 $('#errormsg').show();
						     $("#errormsg").text(msg);
						}
					}
					
				});
			this.reset();
		}
	});
$(document).ready(function(){
 $("#username").focus();
});



