var resetPassView = Backbone.View.extend({
	template : _.template($('#passwordreset').html()),
	initialize : function(){
		this.render();
	},
	render : function()
	{
		$(this.el).html(this.template());
		return this;
	},
	events: {
		"click #savepass" : "savepass",
		"focus :input" : "clear",
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
	savepass : function(){
		var that = this;
		var opass = $('#oldpass').val();
		var npass = $('#newpass').val();
		var cpass = $('#cnewpass').val();
		if(!opass){
			$('#errmessage').text("Password should not be blank");
		}else if(!isPasswordValid(npass)){
			$('#errmessage').text("Invalid password Type");
		}else if(!cpass){
			$('#errmessage').text("Password should not be blank");
		}else if(npass != cpass){
			$('#errmessage').text("Passwords doesn't match");
		}else{
		
		this.model.set({
			oldPassword : opass,
			newPassword : npass
		});
		this.model.save({}, {
			success : function(model, result, xhr){
				var status = result.responseMessage;
				var errorstatus = status.errorStatus;
				var msg    = status.message;
				if(errorstatus == "0"){
					$('#smessage').text("Password Changed Successfully");						
				 }else if(errorstatus == "1"){
					 $('#errmessage').text(msg);
				 }else if(errorstatus == "2"){
					 alert(msg);
					 that.clearCookies();
				 }
				}
			});
		}
		function isPasswordValid(password){
			var pattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20})");
			return pattern.test(password);
		}
		this.reset();
	},
	clear : function(){
		$('#errmessage').text("");
	},
	reset : function() {
		$('#oldpass').val('');
		$('#newpass').val('');
		$('#cnewpass').val('');
	}
	
});