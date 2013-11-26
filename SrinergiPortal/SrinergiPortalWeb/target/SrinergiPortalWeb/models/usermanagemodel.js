var usermanagementModel = Backbone.Model.extend({
	defaults : {
		id		 : null,
		username : "",
		name     : "",
		role	 : "",
		lastlogin: "",
		status   : "",
		resetpass: "",
		unlock	 : ""
	}
});

var employeemanageModel = Backbone.RelationalModel.extend({
	defaults :{
		id		   : null,
		recid	   : null,
		title	   : "",
		firstname  : "",
		lastname   : "",
		middlename : "",
		email	   : "",
		groupno	   : "",
		taxid	   : "",
		phone	   : "",
		fax		   : ""
	  },
	   relations: [{
			type		: Backbone.HasMany,
			key			: 'addressDetails',
			relatedModel: "userAddressModel",
		 reverseRelation: {
					 key: 'eusermanagement',
		   includeInJSON: 'id'
			}
		}]
});

var membermanageModel = Backbone.RelationalModel.extend({
	defaults : {
		id			: null,
		recid		: null,
		title		: "",
		firstname	: "",
		lastname	: "",
		middlename	: "",
		groupno		: "",
		ssn			: ""
	},
	relations: [{
		type		: Backbone.HasMany,
		key			: 'addressDetails',
		relatedModel: "userAddressModel",
	 reverseRelation: {
				 key: 'musermanagement',
	   includeInJSON: 'id'
		}
	}]
});

var brokermanageModel = Backbone.RelationalModel.extend({
	defaults : {
		id			: null,
		recid		: null,
		title		: "",
		firstname	: "",
		lastname	: "",
		middlename	: "",
		email		: "",
		phone		: "",
		fax			: "",
		indbroker	: "",
		agencyname	: "",
		url			: "",
	},
	relations: [{
		type		: Backbone.HasMany,
		key			: 'addressDetails',
		relatedModel: "userAddressModel",
	 reverseRelation: {
				 key: 'busermanagement',
	   includeInJSON: 'id'
		}
	}]
});

var internalusermanage = Backbone.Model.extend({
	defaults : {
		id				: null,
		title			: "",
		firstname		: "",
	    lastname 		: "",
		middleinitial	: "",
		email			: "",
		fax				: "",
		phone			: "",
		ext 			: ""
	}
});

var userAddressModel = Backbone.RelationalModel.extend({
	defaults : {
		id 				: null,
		recid			: null,
		type			: "",
		address1		: "",
		address2		: "",
		fax				: "",
		phone			: "",
		city			: "",
		state			: "",
		zipcode			: "",
		county			: "",
		phoneext		: ""
	}
});
