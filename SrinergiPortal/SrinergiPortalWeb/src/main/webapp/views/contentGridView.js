window.ContentGridView=Backbone.View.extend({
	initialize:function()
	{ 	
	  	  this.template = _.template($('#contentGrid').html());
	},
   render:function()
   { 
	   $(this.el).html(this.template());
	   return this;
   },
   events:
   {
	   "click #active":"active",
	   "click #deactive":"deactive",
	   "click #reject":"reject",
	   "click #newcontent":"newcontent"
   },
   reject:function()
   {
	   alert("rejected clicked");
   },
   deactive:function()
   {
	   alert("deactive clicked");
   },
   active:function()
   {
	   alert("active clicked");
   },
   newcontent:function()
   {
	   app.navigate("#content/new",true);
   }
});