/*var ValidateModel = Backbone.Model.extend({
	 validation: {
		    name: 'validateName',
		    pass: 'validatepass',
	  },
	  validateName: function(value, attr, computedState) {
		   if(!value || value == "") {
			   return "Username cannot be null";
		   }
	 },
	 validatepass: function(value, attr, computedState) {
		    if(!value || value == "") {
		       	return "Password cannot be null";
		    }
	 }	 
});
var RValidationModel = Backbone.RelationalModel.extend({
	validation : {
		username : "validatename",
		password : "validatepass",
		groupno	 : "validategroup"
	},
	  validatename: function(value, attr, computedState) {
		   if(!value || value == "") {
		      return "Username cannot be null";
		   }
	 },
	 validatepass: function(value, attr, computedState){
		 if(!value || value == "") {
		      return "Password cannot be null";
		   }
	 },
	 validategroup : function(value,attr,computedState){
		if(!value || value == ""){
				 return 'Groupno cannot be null';
		 }
	 }	 
});

*/
var loginModel  = Backbone.Model.extend({	
	url : "rest/login",
	validation: {
		username : {
			required : true,
		},
		password : {
			required : true,
		}
	},
	defaults : {
		username : '',
		password : ''
	}	
});


var registerDetailModel = Backbone.RelationalModel.extend({
	defaults : {
		roletype		: "",
		username 		: "",
		password 		: "",
		questionid1		: "",
		answer1			: "",
		questionid2		: "",
		answer2			: "",
		firstname		: "",
		lastname		: "",
		middleinitial 	: "",
		address1		: "",
		address2		: "",
		city			: "",
		state			: "",
		zipcode			: "",
		county			: "",
		email			: "",
		phone	   		: "",
		fax				: "",
		terms			: "",
		title			: "",
		url				: "",
		ext				: ""
	}
});
var employeeRegister = Backbone.RelationalModel.extend({
	url     	 	: "rest/employee",
	validation :{
	  groupno :{
			required : true
		},
		taxid  :{
			required : true
		},
		group_name :{
			required : true
		}
    },
	defaults 	 	:{
		groupno  	: "",
		taxid    	: "",
		group_name  : ""
	     },	   
	relations: [{
		type		: Backbone.HasOne,
		key			: 'registerdetail',
		relatedModel: "registerDetailModel",
		reverseRelation: {
					key: 'euserdetail',
					includeInJSON: 'id'
		}
	}]
});
var memberRegister = Backbone.RelationalModel.extend({
	url         	: "rest/member",
	validation      :{
		
		groupno:{
				required : true
		},
		ssn :{
				required : true
		}
	}, 		
	defaults    	: {
		groupno 	: "",
		ssn	    	: ""
	},
	relations: [{
		type		: Backbone.HasOne,
		key			: 'registerdetail',
		relatedModel: "registerDetailModel",
		reverseRelation: {
			key: 'muserdetail',
			includeInJSON: 'id'
		}
			
	}]
});
var brokerRegister = Backbone.RelationalModel.extend({
	url 		   : "rest/broker",
	validation : {
			indbroker : {
				required : true
			},
			agencyname : {
				required : true
			}
	},

	defaults 	   : {
		indbroker  : "",
		agencyname : "",
		taxid	   : ""
	}, 
	relations: [{
	type		   : Backbone.HasMany,
	key			   : 'brokerlicensedetail',
	relatedModel   : "brokerLicense",
	collectionType : "brokerLicenseCollection",
	reverseRelation: {
		key: 'livesIn',
		includeInJSON: 'id'
	}
	},
	{
		type		   : Backbone.HasOne,
		key			   : 'registerdetail',
		relatedModel   : "registerDetailModel",
		reverseRelation: {
				key: 'register11',
				includeInJSON: 'id'
	}
	}]
});

var brokerLicense = Backbone.RelationalModel.extend({
	validation : {
		statecode :{
			required : true	
		},
		license :{
			required : true
		},
		dateofexpiry :{
			required : true
		}
	},
	defaults : {
		statecode  	 : "",
		license 	 : "",
		dateofexpiry : ""
	      }
});

var forgotPassword = Backbone.Model.extend({
	url : "rest/forgotpw",
	validation : {
		answer1 :{
			required : true,
		},
		answer2 :{
			required : true,
		}
	},
	defaults : {
		questionid1		: "",
		answer1			: "",
		questionid2		: "",
		answer2			: "",
	}
});

var registerModel = Backbone.Model.extend({
	url : "rest/register"	
});

