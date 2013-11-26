var registerManageModel = Backbone.RelationalModel.extend({ 
	//generic model all role types
	/*initialize : function(){
		this.on('change', function(){
			console.log("model changed:"+JSON.stringify(this.changedAttributes()));
		});
	},*/
	defaults  : {
		id			    : null,
		role  		    : "",
		submitteddate   : "",
		actiondate	    : "",
		title			: "",
		firstname		: "",
		lastname		: "",
		middleinitial 	: "",
		address1		: "",
		address2		: "", 
		city			: "",
		phone			: "",
		phext			: "",
		state			: "",
		zipcode			: "",
		county			: "",
		email			: "",
		groupno  		: "",
		taxid    		: "",
		ssn 			: "",
		fax				: "",
		status			: "",
		comments		: "",
		indbroker  		: "",
		agencyname 		: ""
	},
	relations : [{
		type		   : Backbone.HasMany,
		key			   : 'brokerlicense',
		relatedModel   : "brokerLicense",
		collectionType : "brokerLicenseCollection",
		reverseRelation: {
					key: 'blicense',
	   	  includeInJSON: 'id'
		}
		},{
			type		   : Backbone.HasMany,
			key			   : 'brokercompliance',
			relatedModel   : "brokerComplianceModel",
			collectionType : "brokerComplianceCollection",
			reverseRelation: {
						key: 'bcompliance',
			  includeInJSON: 'id'
			}
		}]
});

var brokerLicense 	= Backbone.RelationalModel.extend({ // complex data type 1
	url: "rest/rmgmt",
	initialize : function(){
		this.on('change', function(){
			//console.log("model changed:"+JSON.stringify(this.changedAttributes()));
			//console.log("model changed:"+JSON.stringify(this.previous("license")));
			//console.log("previous attributes"+JSON.stringify(this.previousAttributes()));
		});
	},
	defaults : {
		id			 : null,
		statecode  	 : "",
		license 	 : "",
		dateofexpiry : ""
      }
});

var brokerComplianceModel = Backbone.RelationalModel.extend({ // complex data type 2
	defaults : {
		id			 : null,
		name 		 : "",
		state		 : "",
		doctype		 : "",
		dateuploaded : "",
		statecode	 : "",
		documentcode : ""
	}
});

var operationModel = Backbone.Model.extend({
	  url 	   : "rest/rmgmt/approve",
	  defaults : {
			id 		: "",
			optype	: ""
		}
});

var internaluser = Backbone.Model.extend({
	defaults : {
		title		    : "",
		firstname		: "",
	    lastname 		: "",
		middleinitial	: "",
		email			: "",
		phone			: "",
		ext 			: "",
		rolecode		: ""
	}
});

var passResetModel = Backbone.Model.extend({
	url : "rest/profset/resetpw",
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
