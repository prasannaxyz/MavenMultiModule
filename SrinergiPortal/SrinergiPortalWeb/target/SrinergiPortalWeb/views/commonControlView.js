/*var pageableGrid;
var pccollection;
*/window.commonControlView=Backbone.View.extend({
	initialize:function(attrs)
	{ 	
	  this.options=attrs;
	  this.template = _.template($('#commoncontrol').html());
	},
   render:function()
   { 
	   $(this.el).html(this.template());
	   if(this.options.buttonstatus=="show")
		   {
		   this.$("#addnew").show();
		   }
	   else
		   {
		   this.$("#addnew").hide();
		   }
		   
	   this.grid(this.collection,this.options.columns);
       return this;
   },
   events:
   {
	   "click #addnew":"addnew",
	   "click #close":"close",
   },
   close:function()
   {
    $("#commonctrol").dialog('close');
	this.destroy_view();
   },
   addnew:function()
   {   this.model=new commonControlModel();
	   pageableGrid.insertRow(this.model);
   },
   destroy_view: function() 
	{
 		//COMPLETELY UNBIND THE VIEW
	    this.undelegateEvents();
	    this.$el.removeData().unbind(); 
	    //Remove view from DOM
	    this.remove();  
	    Backbone.View.prototype.remove.call(this);
   },
   grid:function(controlcol,columns)
   {
	   				    //$("#pagegrid").empty();
		                var grids = this.$("#datagrid");
		                var pgcollection = Backbone.PageableCollection.extend({
			           	model : commonControlModel,
			        	url   : "rest/commonControlhelp",
			           	state :
			           	      {
			           		   pageSize: 5,
			           		   /*firstPage: 0,
				           	   currentPage:0,*/			   
			           		   },
			           	mode  : "client",
		                });
		                pccollection = new pgcollection(controlcol.toJSON());
			              pageableGrid = new Backgrid.Grid({
			           	  columns:columns,
			           	  collection: pccollection
			           });
			              var paginator = new Backgrid.Extension.Paginator({
				        	  collection: pccollection
				        	});
			              var serverSideFilter = new Backgrid.Extension.ServerSideFilter({
				           	  collection: pccollection,
				           	  name: "Title", 
				              placeholder: "Search on the server",
				           	});
				          grids.prepend(serverSideFilter.render().el);       
			          //this.pageableGrid.listenTo(pageablecollection, "change", function(){alert("majji's"+pageablecollection.pluck('id'));});
	     	          grids.append(pageableGrid.render().$el);
	     	         grids.append(paginator.render().$el);
   }
   });
