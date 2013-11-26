var registerCollection = Backbone.Collection.extend({
	url : "rest/rmgmt",
	model : registerManageModel
});

var brokerComplianceCollection = Backbone.Collection.extend({
    model : brokerComplianceModel	    
});

var brokerLicenseCollection = Backbone.Collection.extend({
	model : brokerLicense
});
