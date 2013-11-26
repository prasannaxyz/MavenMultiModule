var loginRouter = Backbone.Router.extend({
	initialize:function()
	{	
		var self=this;
	},
	routes: 
	{
		""				   : "load",
		"employeereg"	   : "employeeregister",
		"memberreg"		   : "memberregister",	
		"brokerreg"		   : "brokerregister",
		"forgotpass"	   : "forgotpassword",
	},
		 
    load : function(){
       	$('#content').html(new loginView({model:new loginModel()}).render().el);
    },
    
    forgotpassword : function(){
    	$('#content').html(new forgotPassView({model:new forgotPassword()}).render().el);
    	$('#rusername').focus();
    },
    
    employeeregister : function(){
    	$('#content').html(new employeeRegisterView({model:new employeeRegister()}).render().el);
    	$('#uname').focus();
    },
    memberregister : function(){
    	$('#content').html(new memberRegisterView({model:new memberRegister()}).render().el);
    	$('#uname').focus();
    },
    brokerregister : function(){
    	$('#content').html(new brokerRegisterView({model:new brokerRegister()}).render().el);
    	$('#uname').focus();
    }
    
});

route=new loginRouter();
Backbone.history.start();