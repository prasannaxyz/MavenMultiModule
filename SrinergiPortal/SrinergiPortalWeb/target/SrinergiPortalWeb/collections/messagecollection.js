var MessageCollection = Backbone.Collection.extend({
	    model : MessageModel,
		url : 'rest/messageinsertupdate',
});
