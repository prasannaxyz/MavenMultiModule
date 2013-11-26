var pageablecollection;
var ccollection;
var pageableGrid;
window.pageHelpView=Backbone.View.extend({
	columns:null,
	Portals:null,
    Modules:null,
    Pages:null,
    Statuses:null,
    PMrelation:null,
    Pagecontrols:null,
    PCrelation:null,
    initialize:function()
	{ 	
	  this.template = _.template($('#pagecontrolhelp').html());
	},
   render:function()
   { 
	   Backbone.Validation.bind(this,{
   		valid: function(view, attr) {
   			//alert("valid");
   	          	      },
   	      invalid: function(view, attr, error) {
   	       alert(error);
   	      }
   	});
	   columns = [
			           	{
			           		name : "page",
			           		label: "Page",
			           		cell :  Backgrid.UriCell.extend({
			         			render: function() {
			         				Backgrid.UriCell.prototype.render.call(this);
			             		    this.$('a').attr('href',this.model.get("id"));
			             		    this.$('a').attr('id',"datalink");
			             		    console.log("the id value is   :"+this.model.get("id"));
			             		    return this;
			             		           }
			             		}),
			           		editable : false,
			           	},
			           	{
			           		name : "module",
			           		label: "Module",
			           		cell : "string",
			           		editable : false,
			           	},
			         	{
			           	  	name : "portal",
			           		label: "Portal",
			           		cell : "string",
			           		editable : false
			           	},
			           	{
			           		  name : "dateCreated",
			           		  label: "Date Created",
			           		  cell : "string",
			           		  editable : false
			           	},
			           {
			           		  name : "status",
			           	      label: "Status",
			           	      cell : "string",
			           	      editable : false
			           		
			          },
			      ];

	   $(function() {
		   $( "#dialog-form" ).dialog({
		   autoOpen: false,
		   height:700,
		   width:700,
		   modal: true,
		   buttons: {
		   },
		   close: function() {
		   }
		   });
		   $( "#save")
		   .button()
		   .click(function() {
		   $( "#dialog-form" ).dialog( "open" );
		   });
		   });
        	   $(this.el).html(this.template());
        	   loginrole= $.cookie("role");
     			if (loginrole=="CMGR")
     			{
     			        columns=[{
     			 	    name: "radio",
     			 	    cell: "select-row",
     			 	    headerCell: "select-all",
     			             }].concat(columns),
     				this.$("#active").show();
   					this.$("#deactive").show();
   					this.$("#reject").show();
     				
   				}
     			else
     				{this.$("#active").hide();
   					this.$("#deactive").hide();
   					this.$("#reject").hide();
   					}
	   				marketData=app.loadlist;
	     			Portals=marketData.portals;
	     		    Modules=marketData.modules;
	     		    Pages=marketData.pages;
	     		    Statuses=marketData.status;
	     		    PMrelation=marketData.portalAndMod;
	     		    Pagecontrols=marketData.controlCodeInfo;
	     		    PCrelation=marketData.pageAndControl;
	     		    this.dataGrid(app.test);
	     		    return this;
   },
   events:
   {
	   "click #newcontent":"newhelp",
	   "click #search":"search",
	   "change #imageFile":"imageFile",
	   "click #fileupload":"fileupload",
	   "click #imagelink":"imagelink",
	   "change #docFile":"documentFile",
	   "click #docupload":"docupload",
	   "click #pdflink":"pdflink",
	   "click #viewdoc":"viewdoc",
	   "click #cancel":"cancel",
	   "click #datalink":"dataPrepapulate",
	   "click #save":"save",
	   "click #active":"active",
	   "click #deactive":"deactive",
	   "click #reject":"reject",
	   "change #portal":"portal",
	   "change #module":"module",
	   "change #portal1":"portal1",
	   "change #module1":"module1",
	   "change #page1":"pagecontrols",
	   "click .commoncontrol":"commoncontrol",
	   "click .search":"TitleSearch"
   },
   commoncontrol:function(e)
   {
	   e.preventDefault();
	   var controlData=new commonControlCollection();
	    controlData.url="rest/commonControlhelp/default";
	    var buttonstatus="show";
	   var columns = [
			           	{
			           	  	name : "controlName",
			           		label: "Control Name",
			           		cell : "string",
			           		editable : true,
			           	},
			           	{
			           	  	name : "controlHelp",
			           		label: "Control Help",
			           		cell : "string",
			           		editable : true,
			           	},
			           	{
			           	  	name : "status",
			           		label: "Status",
			           		cell : "string",
			           		editable : false,
			           	},
			           	
			            {
			       	   		name:'Delete',
			       	        cell : Backgrid.Cell.extend({
			       	        template: _.template('<div align="left"><img id="remove" src="images/close1.png" align="left"></div>'),
			       	   		events: {
			       	   		      "click #remove": "deleteRow"
			       	   		        },
			       	   		    deleteRow: function (e)
			       	   		    {
				       	   	    e.preventDefault();
				       	   		var r=confirm("Are you sure to delete record..!");
					       	   	if (r==true)
					       	   	  {
					       	   	     this.model.destroy();
					       	   	  }
					       	   	else
					       	   	  {
					       	   	 
					       	   	  }
			       	   		      
			       	   		    },
			       	   		    render: function () {
			       	   		      this.$el.html(this.template());
			       	   		      this.delegateEvents();
			       	   		      return this;
			       	   		    }
			       	        })
			       	       },
			       	        {
				       	   		name:'Save',
				       	        cell : Backgrid.Cell.extend({
				       	        template: _.template('<div align="left"><input type="button" value="Save" class="btn btn-mini btn-success" id="nsave" align="left"></div>'),
				       	   		events: {
				       	   		      "click #nsave": "saveRow"
				       	   		        },
				       	   		  saveRow: function (e)
				       	   		    {
				       	   		      e.preventDefault();
				       	   		      if(this.model.isNew())
				       	   		    	  {
				       	   		    	  this.model.save({status:"Act"});
				       	   		    	   }
				       	   		           else
				       	   		    		  {
				       	   		    		  console.log("this is not a new model");
				       	   		    		  var names=this.model.getAttributeNames().split(",");
				       	   		    		  if(valueCheck(this.model, names))
				       	   		    		  this.model.save({wait: true});
				       	   		    		  else
				       	   		    		  console.log("No Record Updated");
				       	   		    		  }
				       	   		    },
				       	   		    render: function () {
				       	   		      this.$el.html(this.template());
				       	   		      this.delegateEvents();
				       	   		      return this;
				       	   		    }
				       	        })
				       	       } 
			          ];
	  controlData.fetch({success:function(response)
			  {    
				  var result=response.toJSON();
				  data=result.onloadData;  
		   $("#commonctrol").dialog({
			   closeOnEscape: true,
			   title:"COMMON CONTROL HELP",
			   modal: true,
			   height: 600, 
			   width: 800,
			   open: function(event, ui) { $(".ui-dialog-titlebar-close", ui.dialog || ui).hide();
			   }
			 });
	     $('#commonctrol').html(new commonControlView({collection:controlData,columns:columns,buttonstatus:buttonstatus}).render().el );
			  },
			  error:function()
			  {
				  alert("Server Not Respond");
			  }
		  });
  },
   pagecontrols:function()
   {
	   var myview=null;
	   var parentModel=null;
	   var pcolumns = [ {
  	   		name:'Select',
   	        cell : Backgrid.UriCell.extend({
   	        template: _.template('<a id="pselect" href="#" style="text-decoration: underline;">select</a>'),
   	   		events: {
   	   		         "click #pselect": "select"
   	   		        },
   	   		  select: function (e)
   	   		  {
   	   		                      e.preventDefault();
   	   			   	   			  parentModel.set({controlHelp:this.model.get("controlHelp")});
   	   			   	              $("#commonctrol").dialog('close');
   	   	      },
   	   		    render: function () {
   	   		      this.$el.html(this.template());
   	   		      this.delegateEvents();
   	   		      return this;
   	   		    }
   	        })
   	       },
			           	{
			           	  	name : "controlName",
			           		label: "Control Name",
			           		cell : "string",
			           		editable : false,
			           	},
			           	{
			           	  	name : "controlHelp",
			           		label: "Control Help",
			           		cell : "string",
			           		editable : false,
			           	},
			           	{
			           	  	name : "status",
			           		label: "Status",
			           		cell : "string",
			           		editable : false,
			           	},
			          ];
	 var pval=$("#page1").val();
	 controlcol=new controlCollection();
	 for ( var i = 0; i < PCrelation.length; i++) 
	 {
		if(PCrelation[i].pageCode==pval)
			{
			    for ( var j = 0; j < Pagecontrols.length; j++) {
				if(Pagecontrols[j].controlCode==PCrelation[i].controlCode)
					{
					controlcol.add(new controlModel({
						 controlName:Pagecontrols[i].description,
						 controlHelp:''
					}));
					console.log("loop repeated times  is  :"+i);
					}
			    }
			}
	 }
	 if (controlcol.size()>0) {
	 var columns = [
		           	{
		           	  	name : "controlName",
		           		label: "Control Name",
		           		cell : "string",
		           		editable : false,
		           	},
		           	{
		           	  	name : "controlHelp",
		           		label: "Help Text",
		           		cell : "string",
		           		editable : true,
		           	},
		           	{
		       	   		name:'Select',
		       	        cell : Backgrid.Cell.extend({
		       	        template: _.template('<div align="left"><a id="select" href="#" style="font: bold;font-family: cursive;color: red;font-size: large;text-decoration:underline;text-align:left" align="left">select</a></div>'),
		       	   		events: {
		       	   		         "click #select": "select"
		       	   		        },
		       	   		  select: function (e){
		       	   	          e.preventDefault();
		       	   			 // console.log("this is parentModel"+JSON.stringify(this.model));
		       	   			  parentModel=this.model;
		       	   		   var controlData=new commonControlCollection();
		       	   		controlData.url="rest/commonControlhelp/default";
		       	  	  controlData.fetch({success:function(response)
		       	  			  {    
		       	  				  /*var result=response.toJSON();
		       	  				  data=result.onloadData;  */
		       	  		   $("#commonctrol").dialog({
		       	  			   closeOnEscape: true,
		       	  			   title:"COMMON CONTROL HELP",
		       	  			   modal: true,
		       	  			   height: 600, 
		       	  			   width: 800,
		       	  			   open: function(event, ui) { $(".ui-dialog-titlebar-close", ui.dialog || ui).hide();
		       	  			   }
		       	  			 });
		       	  		myview=new commonControlView({collection:controlData,columns:pcolumns}).render().el; 
		       	  	     $('#commonctrol').html(myview);
		       	  			  },
		       	  			  error:function()
		       	  			  {
		       	  				  alert("Server Not Respond");
		       	  			  }
		       	  		  });
		       	     },
		       	   		    render: function () {
		       	   		      this.$el.html(this.template());
		       	   		      this.delegateEvents();
		       	   		      return this;
		       	   		    }
		       	        })
		       	       }
		      ];
   				$("#pagegrid").empty();
	           var grids = this.$("#pagegrid");
	                var pgcollection = Backbone.PageableCollection.extend({
		           	model : controlModel,
		        	url   : "rest/pageHelp",
		           	state :
		           	      {
		           		   pageSize: 5,
		           		 /*  firstPage: 0,
			           	   currentPage:0,
		           		 */ },
		           	mode  : "client",
	        });
	                   ccollection = new pgcollection(controlcol.toJSON());
	                   $("#save").show();
	                   
		              pageableGrid11 = new Backgrid.Grid({
		           	  columns:columns,
		           	  collection: ccollection
		           });
     	          grids.append(pageableGrid11.render().$el);
	 }
	 else 
	{
		$("#save").hide();
		$('#pagegrid').css("align","center");
		$('#pagegrid').focus();
		$('#pagegrid').empty();
		$('#pagegrid').flash_message({
		        text: 'Sorry No Controls Are There For This Page',
		        how: 'append'
		    });
	}
   },
   portal:function()
   {
	   $("#module").empty();
	   $("#module").append(new Option("select"));
	   var pval=$("#portal").val();
	   console.log("portal code is   :"+pval);
	   for ( var i = 0; i <PMrelation.length; i++) 
	   {
		if(PMrelation[i].portalCode==pval)
			{
			   for ( var j = 0; j < Modules.length; j++)
			   {
				   if(Modules[j].moduleCode==PMrelation[i].modCode)
				   {
				   		$("#module").append(new Option(Modules[j].moduleDesc,Modules[j].moduleCode));
				   }

			   }
		}
	   }
   },
   module:function()
   {
	   $("#page").empty();
	   $("#page").append(new Option("select"));
	   for ( var i = 0; i < Pages.length; i++) 
	   {
		 if(Pages[i].moduleCode==$("#module").val())
			 {
			// console.log("the related pages are  :"+Pages[i].pageDesc);
			 $("#page").append(new Option(Pages[i].pageDesc,Pages[i].pageCode));
			 }
	   }
   },
   portal1:function()	
   {
	   $("#module1").empty();
	   $("#module1").append(new Option("select"));
	   var pval=$("#portal1").val();
		   for ( var i = 0; i <PMrelation.length; i++) 
	   {
		if(PMrelation[i].portalCode==pval)
			{
			   for ( var j = 0; j < Modules.length; j++)
			   {
				   if(Modules[j].moduleCode==PMrelation[i].modCode)
				   {
				   		$("#module1").append(new Option(Modules[j].moduleDesc,Modules[j].moduleCode));
				   }

			   }
		}
	   }
   },
   module1:function()
   {
	   $("#page1").empty();
	   $("#page1").append(new Option("select"));
	   for ( var i = 0; i < Pages.length; i++) 
	   {
		 if(Pages[i].moduleCode==$("#module1").val())
			 {
			   if(app.test.where({page :Pages[i].pageDesc}).length==0) 
			   {
				$("#page1").append(new Option(Pages[i].pageDesc,Pages[i].pageCode));
			   }
  	 }
	   }
  },
   active:function()
   { 
	   var i=0;
	   var j=0;
       var selectedRows=new Array();
       var applicableRows=new Array();
	   var selectedModels=pageableGrid.getSelectedModels();
	     _.each(selectedModels, function (model)
		 {    
		   selectedRows[i]=model.toJSON().id;
		     i++;
		     if(model.toJSON().status=="Pending")
		    	 {
		    	 applicableRows[j]=model.toJSON().id;
		    	 j++;
		    	 }
		 });
	   if(selectedRows.length==applicableRows.length)
		   {
	        this.changeStatus(applicableRows,"Active");
		   }
	   else
		   {
             $('#status-area1').focus();
			 $('#status-area1').empty();
			 $('#status-area1').flash_message({
			        text: 'Only Pending Records are allowed',
			        how: 'append'
			    });
		   _.each(selectedModels, function (model)
					 {   
			           model.trigger("backgrid:select", model, false);
					 });
		   
		   return;
		   }
   },
   deactive:function()
   { 
	   var i=0;
	   var j=0;
       var selectedRows=new Array();
       var applicableRows=new Array();
	   var selectedModels=pageableGrid.getSelectedModels();
	   _.each(selectedModels, function (model)
		 {    
		    selectedRows[i]=model.toJSON().id;
		     i++;
		     if(model.toJSON().status=="Active")
		    	 {
		    	 applicableRows[j]=model.toJSON().id;
		    	 j++;
		    	 }
		 });
	   
	   if(selectedRows.length==applicableRows.length)
		   {
	        this.changeStatus(applicableRows,"Inactive");
		   }
	   else
		   {
             $('#status-area1').focus();
			 $('#status-area1').empty();
			 $('#status-area1').flash_message({
			        text: 'Only Active Records are allowed',
			        how: 'append'
			    });
		   _.each(selectedModels, function (model)
					 {   
			           model.trigger("backgrid:select", model, false);
					 });
		   
		   return;
		   
		   }
   
   },
   reject:function()
   { 
	   var i=0;
	   var j=0;
       var selectedRows=new Array();
       var applicableRows=new Array();
	   var selectedModels=pageableGrid.getSelectedModels();
	      _.each(selectedModels, function (model)
		 {    
		   selectedRows[i]=model.toJSON().id;
		     i++;
		     if(model.toJSON().status=="Pending")
		    	 {
		    	 applicableRows[j]=model.toJSON().id;
		    	 j++;
		    	 }
		 });
	   if(selectedRows.length==applicableRows.length)
		   {
	        this.changeStatus(applicableRows,"Reject");
		   }
	   else
		   {
		     $('#status-area1').focus();
			 $('#status-area1').empty();
			 $('#status-area1').flash_message({
			        text: 'Only Pending Records are allowed',
			        how: 'append'
			    });
		   _.each(selectedModels, function (model)
					 {   
			           model.trigger("backgrid:select", model, false);
					 });
		   return;
		   }
   
   
   },
   changeStatus:function(ids,operationType)
   {
	  if(ids.length !=0)
		  {
	   var gridmodel=new gridModel();
	   gridmodel.set({
           id:ids,
	       button:operationType
           });
      gridmodel.save({}, {success:function(response) 
		   {
    	          if(response.toJSON().response=="success")
    	        	  {
    	        	  pageablecollection.off('backgrid:selected', function(model, selected) 
  				        	{ 
  				        	 
  				        	});
    	           for(var i=0;i < ids.length;i++)
				   {
				          var contentModel=pageablecollection.get(ids[i]);
				          contentModel.set({
				        	  status:operationType
				          });
				          contentModel.trigger("backgrid:select", contentModel, false);
                   }
    	           $('#status-area').flash_message({
				        text: 'Status Updated Successfully',
				        how: 'append'
				    });
    	        	  }
    	          else 
    	          {
                     $('#status-area1').focus();
					 $('#status-area1').empty();
					 $('#status-area1').flash_message({
					        text: 'Status Not Updated Successfully',
					        how: 'append'
					    });

				  }
		 	    } 
      });
    	 
      }
	  else
		  {
		     $('#status-area1').focus();
			 $('#status-area1').empty();
			 $('#status-area1').flash_message({
			        text: 'Please Select At Least One Row',
			        how: 'append'
			    });
		   return;
		   
		  }
},
   save:function()
   {
	   var moduledesc='';
	   var portaldesc='';
	   var pagedesc='';
	   
	   for ( var i = 0; i < Pages.length; i++)
	   {
		   if(Pages[i].pageCode==$("#page1").val())
		   {
			   pagedesc=Pages[i].pageDesc;
		   }
	   }
	   for ( var i = 0; i < Modules.length; i++)
	   {
		   if(Modules[i].moduleCode==$("#module1").val())
		   {
			    moduledesc=Modules[i].moduleDesc;
		    }
	   }
	   for ( var i = 0; i < Portals.length; i++)
	   {
		   if(Portals[i].portalCode==$("#portal1").val())
		   {
		   	   portaldesc=Portals[i].portalDesc;
		   }
	   }
	   
	   if(this.model.isNew())
	   {
		 $("#save").attr('disabled',true);		   
     	 var text=JSON.stringify(ccollection);
     	 if (text.trim().length > 2000) 
		 {
	       alert("control help text is too long");
		  return;
		 }
		   this.model.set({
				title:null,
				desc:text,
				status:$("#status1").val(),
				page:$("#page1").val(),
				module:$("#module1").val(),
				portal:$("#portal1").val(),
				contentType:'CHLP',
	      });
		 pageablecollection.create(this.model,{
			 success:function(response)
			 {
				 $("#adetails").hide();
				 ccollection="";
				 $('#status-area').flash_message({
				        text: 'Record Saved Successfully',
				        how: 'append'
				    });
			 },
			 error:function()
			 {
				 $("#save").attr('disabled',false);
				 $('#status-area').flash_message({
				        text: 'Record Not Saved',
				        how: 'append'
				    });
			 },
			 wait: true});
	   }
	   else
		   {
		   $("#save").attr('disabled',true);
		   var text=JSON.stringify(ccollection);
	     	 if (text.trim().length > 2000) 
			 {
		       alert("control help text is too long");
			  return;
			 }
		   testmodel1=this.model;
		   testmodel1.set({
				title:null,
				desc:text,
				status:this.model.get("status"),
				page:this.model.get("page"),
				module:this.model.get("module"),
				portal:this.model.get("portal"),
				contentType:'CHELP',
	      });
		   if(testmodel1.hasChanged("desc")){
			   for ( var i = 0; i < Pages.length; i++)
			   {
				   if(Pages[i].pageDesc==this.model.get("page"))
				   {
					   pagedesc=Pages[i].pageCode;
				   }
			   }
			   for ( var i = 0; i < Modules.length; i++)
			   {
				   if(Modules[i].moduleDesc==this.model.get("module"))
				   {
					    moduledesc=Modules[i].moduleCode;
				    }
			   }
			   for ( var i = 0; i < Portals.length; i++)
			   {
				   if(Portals[i].portalDesc==this.model.get("portal"))
				   {
				   	   portaldesc=Portals[i].portalCode;
				   }
			   }
			   var statusdesc="";
			   for(var j=0 ;j < Statuses.length; j++ )
			   {
			     if(Statuses[j].statusDesc==this.model.get("status"))
			    	 {
			    	 statusdesc=Statuses[j].statusCode;
			    	 }
			   }
		   this.model.url="rest/controlhelp/id";
		   cloneModel=this.model.clone();
		   cloneModel.set({
				title:null,
				desc:text,
				status:statusdesc,
				page:pagedesc,
				module:moduledesc,
				portal:portaldesc,
				contentType:'CHELP',
	      });
		   cloneModel.save({},{success:function()
			   {
			   ccollection="";
			   $("#adetails").hide();
			   $('#status-area').flash_message({
			        text: 'Record Updated Successfully',
			        how: 'append'
			    });
			   },
			   error:function()
			   {
				   $("#save").attr('disabled',false);
				   $('#status-area1').flash_message({
				        text: 'No Record Updated',
				        how: 'append'
				    });
		       }
			    });
		   }
		   else {
			   $("#adetails").hide();
			   $('#status-area').flash_message({
			        text: 'No Record Updated',
			        how: 'append'
			    });
		        }
		   }
   },
   dataPrepapulate:function(e)
   {
	   $("#save").show();
	   e.preventDefault();
	   $("#save").focus();
	   this.$('#row-fluid').hide();
	   $("#save").attr('disabled',false);
	   var parentModel=null;
	   var pcolumns = [ {
  	   		name:'Select',
   	        cell : Backgrid.Cell.extend({
   	        template: _.template('<div align="left"><a id="pselect" href="#" style="text-decoration: underline;">select</a></div>'),
   	   		events: {
   	   		         "click #pselect": "select"
   	   		        },
   	   		  select: function (e)
   	   		  {
   	   			  console.log("this is pselect");
   	   		      e.preventDefault();
   	   		      parentModel.set({controlHelp:this.model.get("controlHelp")});
   	   		      $("#commonctrol").dialog('close');
   	   	      },
   	   		    render: function () {
   	   		      this.$el.html(this.template());
   	   		      this.delegateEvents();
   	   		      return this;
   	   		    }
   	        })
   	       },
			           	{
			           	  	name : "controlName",
			           		label: "Control Name",
			           		cell : "string",
			           		editable : false,
			           	},
			           	{
			           	  	name : "controlHelp",
			           		label: "Control Help",
			           		cell : "string",
			           		editable : false,
			           	},
			           	{
			           	  	name : "status",
			           		label: "Status",
			           		cell : "string",
			           		editable : false,
			           	}
			          ];
	   $("#pagegrid").empty();
	   var x=parseInt( $(e.currentTarget).attr("href"));
	   console.log("id value   :"+x);
	   this.model=pageablecollection.get(x);
	   $("#adetails").show();
	   this.$("#row1").hide();
	   this.$("#row2").hide();
	   var desc=this.model.get("desc");
	   var result = JSON.parse(desc);
	   var collection=new controlCollection(result);
	   if (collection.size()>0){
	   var columns = [
			           	{
			           	  	name : "controlName",
			           		label: "Control Name",
			           		cell : "string",
			           		editable : false,
			           	},
			           	{
			           	  	name : "controlHelp",
			           		label: "Help Text",
			           		cell : "string",
			           		editable : true,
			           	},
			           	{
			       	   		name:'Select',
			       	        cell : Backgrid.Cell.extend({
			       	        template: _.template('<div align="left"><a id="select" href="#" style="font: bold;font-family: cursive;text-decoration: underline;color: red;font-size: large;">select</a></div>'),
			       	   		events: {
			       	   		         "click #select": "select"
			       	   		        },
			       	   		  select: function (e){
			       	   		          e.preventDefault();
				       	   			 // console.log("this is parentModel"+JSON.stringify(this.model));
				       	   			  parentModel=this.model;
				       	   		   var controlData=new commonControlCollection();
				       	   		controlData.url="rest/commonControlhelp/default";
				       	  	  controlData.fetch({success:function(response)
				       	  			  {    
				       	  				  /*var result=response.toJSON();
				       	  				  data=result.onloadData;  */
				       	  		   $("#commonctrol").dialog({
				       	  			   closeOnEscape: true,
				       	  			   title:"COMMON CONTROL HELP",
				       	  			   modal: true,
				       	  			   height: 600, 
				       	  			   width: 800,
				       	  			   open: function(event, ui) { $(".ui-dialog-titlebar-close", ui.dialog || ui).hide();
				       	  			   }
				       	  			 });
				       	  	     $('#commonctrol').html(new commonControlView({collection:controlData,columns:pcolumns}).render().el );
				       	  			  },
				       	  			  error:function()
				       	  			  {
				       	  				  alert("Server Not Respond");
				       	  			  }
				       	  		  });
				       	     },
			       	   		    render: function () {
			       	   		      this.$el.html(this.template());
			       	   		      this.delegateEvents();
			       	   		      return this;
			       	   		    }
			       	        })
			       	       }
			      ];
	   			        var grids = this.$("#pagegrid");
		                var pgcollection = Backbone.PageableCollection.extend({
			           	model : controlModel,
			        	url   : "rest/pageHelp",
			           	state :
			           	      {
			           		   pageSize: 5,
			           		/*   firstPage: 0,
				           	   currentPage:0,
			           		*/  },
			           	mode  : "client",
		        });
		                   ccollection = new pgcollection(collection.toJSON());
			              pageableGrid11 = new Backgrid.Grid({
			           	  columns:columns,
			           	  collection: ccollection
			           });
			          var details='<div align="center" style="font-size:15px;">'+this.model.get("portal")+'&nbsp; &rarr;&nbsp;'+ this.model.get("module")+
			          '&nbsp;&rarr; '+this.model.get("page")+'&nbsp;&rarr; '+this.model.get("status") +'<br></div>';
			       //grids.prepend('<a href="#" class="commoncontrol" style="float: right;font: bold;font-family: cursive;color: blue;font-size: large;">CommonHelp</a><br>');
			          grids.append(details);
	     	          grids.append(pageableGrid11.render().$el);
	   }
	   else
	   {
		    $("#save").hide();
			$('#pagegrid').css("align","center");
			$('#pagegrid').focus();
			$('#pagegrid').empty();
			$('#pagegrid').flash_message({
			        text: 'Sorry No Controls Are There For This Page',
			        how: 'append'
			    });
	   }
   },
   search:function()
   { /*
	   if($("#module").val()==""||$("#module").val()=="select"||$("#status").val()==""||$("#status").val()=="select")
        {
	      alert("module,status is required");
	      return;
	    }
	   
	   var moduledesc='';
	   var portaldesc='';
	   var mval=$("#module").val();
	   var pval=$("#portal").val();
	   for ( var i = 0; i < Modules.length; i++)
	   {
		   //console.log("mforloop"+Modules[i].moduleCode+"getcode"+mval);
		   if(Modules[i].moduleCode == mval)
		   {
			   console.log("mif");
		   	   moduledesc=Modules[i].moduleDesc;
			   console.log("mdesc"+Modules[i].moduleDesc);
		   }
	   }
	   for ( var i = 0; i < Portals.length; i++)
	   {
		   console.log("pforloop");
		   console.log("mforloop"+Portals[i].portalCode+"getcode"+pval);
		    if(Portals[i].portalCode==pval)
		   {
		   		//$("#module1").append(new Option(Modules[i].moduleDesc,Modules[i].moduleCode));
			   portaldesc=Portals[i].portalDesc;
		   }
	   }
	   var searchmodel=new controlSearchModel().set({
		    status:$("#status").val(),
			portal:$("#portal").val(),
			module:$("#module").val(),
			page:$("#page").val(),
			searchTitle:""
	   });
*/	   var portal,module,page,statuss;
if ($("#portal").val()=="select") 
{
	portal=null;
}
else
	   {
	   portal=$("#portal").val();
	   }
if ($("#module").val()=="select") 
{
	module=null;
}
else
	   {
	   module=$("#module").val();
	   }
if ($("#page").val()=="select") 
{
	page=null;
}
else
	   {
	   page=$("#page").val();
	   }
if ($("#status").val()=="select")
{
	statuss=null;
}
else
	   {
	   statuss=$("#status").val();
	   }
var searchmodel=new controlSearchModel().set({
    status:statuss,
	portal:portal,
	module:module,
	page:page,
	searchTitle:""
});
	   searchmodel.save(null,{
		   success:function(response){
			   var data=response.toJSON();
			   var resp=data;
			   var mlist = resp.searchDetails;
			   if(mlist != "")
					{
					 $("#datagrid").empty();
					 $("#filter").empty();
					// $("#filter").empty();
					 var meslist = new Array();
						for(var i=0;i<mlist.length;i++)
						{
							meslist[i] = mlist[i];
						}
						$('.dropdownwrap').hide();
				     var searchcollection=new pageDetailsCollection(meslist);
				               var grids = this.$("#datagrid");
					                var pgcollection = Backbone.PageableCollection.extend({
						           	model : pageHelpModel,
						        	url   : "rest/controlhelp",
						           	state :
						           	      {
						           		   pageSize: 5,
						           		  /* firstPage: 0,
			     			           	   currentPage:0,
						           		  */},
						           	mode  : "client",
					        });
					                   pageablecollection = new pgcollection(searchcollection.toJSON());
						              pageableGrid = new Backgrid.Grid({
						           	  columns: columns,
						           	  collection: pageablecollection
						           });
						          grids.append(pageableGrid.render().$el);
						          var paginator = new Backgrid.Extension.Paginator({
						        	  collection: pageablecollection
						        	});
						         var serverSideFilter = new Backgrid.Extension.ServerSideFilter({
						        	  collection: pageablecollection,
						           	  name: "Title", 
						              placeholder: "Search on the server"
						         });
						         this.$("#filter").append(serverSideFilter.render().el);
						          grids.append(paginator.render().$el);
					}
				else{
					$('#status-area1').focus();
					$('#status-area1').empty();
					$('#status-area1').flash_message({
					        text: 'No Matches Found & Try Again',
					        how: 'append'
					    });
				    }
		   }
	   });
	 
   },
   cancel:function()
   {
	   $( "#dialog-form" ).dialog( "open" );
	   $("#adetails").hide();
   },
   newhelp:function()
   {
	   $('#row-fluid').show();
	   $("#adetails").show();
	   $("#save").attr('disabled',false);
	   $("#save").hide();
	   $("#cancel").focus();
	   $("#row1").show();
	   $("#row2").show();
	   this.model=new pageHelpModel();
	   $("#status1").empty();
	   $("#portal1").empty();
	   $("#module1").empty();
	   $("#page1").empty();
	   $("#pagegrid").empty();
	   $("#save").focus();
	   $("#status1").append(new Option("Pending","PND"));
	   $("#status1").attr('disabled', true);
	   $("#module1").append(new Option("select","null"));
	   $("#page1").append(new Option("select","null"));
	   $("#portal1").append(new Option("select","null"));
	   for(var j=0 ;j < Statuses.length; j++ )
	   {
	     $("#status1").append(new Option(Statuses[j].statusDesc,Statuses[j].statusCode));
	   }
	   for(var j=0 ;j < Portals.length; j++ )
	   {
	     $("#portal1").append(new Option(Portals[j].portalDesc,Portals[j].portalCode));
	   }
},
   viewdoc:function()
   {
 	// window.open(window.location.href ="rest/download?fileId="+docId); 
 	 window.open("rest/download?fileId="+docId);
   },
   documentFile:function(e)
   {
		  var type=e.target.files[0].type;
		  console.log("type of the file is   :"+type);
		  if (type=="application/pdf")
		  {
			  if(e.target.files[0].size/1024<=1024)
			  	 {
			  	 console.log("file is ok");
			  	 }
			   else
			   {
			    alert("file size not allowed");	
			    return;
			   }
		}else
			{
			alert("only pdf files are allowed");
			$("#docFile").focus();
			$("#docFile").val("");
			}
		
	   },
   docupload:function()
   {
	 
	 if($('#docFile').val() !="")
	   {
       return true;
	   }
   else{
	   alert("select document to upload");
	   return false;
       }
   },
   dataGrid:function(collection)
   {
	   for(var j=0 ;j < Portals.length; j++ )
	   {
	     this.$("#portal").append(new Option(Portals[j].portalDesc,Portals[j].portalCode));
	   }
	   for(var j=0 ;j < Statuses.length; j++ )
	   {
	     this.$("#status").append(new Option(Statuses[j].statusDesc,Statuses[j].statusCode));
	   }
		           var grids = this.$("#datagrid");
		                var pgcollection = Backbone.PageableCollection.extend({
			           	model : pageHelpModel,
			        	url   : "rest/controlhelp",
			           	state :
			           	      {
			           		   pageSize: 5,
			     /*      		   firstPage: 0,
     			           	   currentPage:0,
			     */      		  },
			              	mode  : "client",
		                     });
		                   pageablecollection = new pgcollection(collection.toJSON());
			              pageableGrid = new Backgrid.Grid({
			           	  columns:columns,
			           	  collection: pageablecollection
			           });
			          //this.pageableGrid.listenTo(pageablecollection, "change", function(){alert("majji's"+pageablecollection.pluck('id'));});
	     	          grids.append(pageableGrid.render().$el);
			          var paginator = new Backgrid.Extension.Paginator({
			        	  collection: pageablecollection
			        	});
			         var serverSideFilter = new Backgrid.Extension.ServerSideFilter({
			        	  collection: pageablecollection,
			           	  name: "Title", 
			              placeholder: "Search on the server"
			         });
			         this.$("#filter").append(serverSideFilter.render().el);
			          grids.append(paginator.render().$el);
			          	   }
});
