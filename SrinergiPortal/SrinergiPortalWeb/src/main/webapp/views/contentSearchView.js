window.ContentSearchView=Backbone.View.extend({
	initialize:function()
	{ 	
	  	  this.template = _.template($('#contentSearch').html());
	  	  
	},
   render:function()
   { 
	   $(this.el).html(this.template());
	   this.$("#efdate").datepicker({
	   		dateFormat : 'yy-mm-dd',
			changeMonth: true,
	        changeYear: true,
	   	});
	  this.$("#etdate").datepicker({
	   		dateFormat : 'yy-mm-dd',
			changeMonth: true,
	        changeYear: true,
	   	});
	   return this;
   },
   events:
   {
	   "click #search":"search"
   },
   search:function()
   {
	   contentsearchmodel=new CotentSearchModel();
	   contentsearchmodel.set({
		    effectivefrom:$("#efdate").val(),
			effectiveto:$("#etdate").val(),
			role:$("#role").val(),
			module:$("#module").val(),
			page:$("#page").val(),
			status:$("#status").val()
	   });
	   contentsearchmodel.save();
   }
});