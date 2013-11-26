var passResetModel = Backbone.Model.extend({
	url : "rest/resetpw",
	validation: {
		oldPassword : {
			required : true,
			pattern : 'password',
		},
		newPassword : {
			required : true,
			pattern: 'password'
		}
	},
	defaults : {
		oldPassword: "",
		newPassword: ""
	}
});

var MessageModel = Backbone.Model.extend({
		url : "rest/messageinsertupdate",
		defaults :
		{
		id			  : null,
		effectivefrom : '',
		effectiveto   : '',
		type 		  : 'select',
		role          : 'select',
		title		  : '',
		status 		  : 'Pending',
		description   : '',
		},
		 validation : {
		title : {
			required : true,
			minLength : 6,
			maxLength : 20
		},
		description : {
			required : true,
			minLength : 10,
			maxLength : 100
		},
		role : function(value)
		    {
				if (value == 'select' || value==null || value=="") {
				return 'role is required';
			}
		},
		type : function(value) {
			if (value == 'select') {
				return 'type is required';
			}
		}
	}
	});
var searchModel=Backbone.Model.extend({
	url : "rest/messagesearch",
	defaults:
	{
		effectiveFrom:"",
	    effectiveTo  :"",
	    role          :"",
	    status        :"",
	    type          :"",
	    titlesearch	  :""
	},
	validation: {
		 	   type:
			   {
				   required: true,
			   },
			   role:
			   {
				   required: true,
			   },
			   status:
			   {
				   required: true,
			   },
			   
	 }
});
var pageModel=Backbone.Model.extend({
	url : "rest/message",
});
var gridModel=Backbone.Model.extend({
	url : "rest/message",
	defaults:
	{
		id:null,
		button:''
	}
});