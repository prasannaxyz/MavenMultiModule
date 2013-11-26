/*var pageablecollection;
var pageableGrid;
*/window.pageView=Backbone.View.extend({
    initialize:function()
	{ 	
	  this.template = _.template($('#pagetemplate').html());
	},
   render:function()
   { 
	   Backbone.Validation.bind(this,{
   		valid: function(view, attr) {
   		      	      },
   	      invalid: function(view, attr, error) {
   	       alert(error);
   	      }
   	});
	   columns = [
			           	{
			           	  	name : "title",
			           		label: "Title",
			           		cell :  Backgrid.UriCell.extend({
			         			render: function() {
			         				Backgrid.UriCell.prototype.render.call(this);
			             		    this.$('a').attr('href',this.model.get("id"));
			             		    this.$('a').attr('id',"datalink");
			             		    return this;
			             		           }
			             		}),
			           		editable : false,
			           	},
			           	{
			           	  	name : "portal",
			           		label: "Portal",
			           		cell : "string",
			           		editable : false,
			           	},
			           	{
			       	   		name : "module",
		           		    label: "Module",
			       	        cell : Backgrid.Cell.extend({
			       	        template: _.template('<div align="center"><label for="role" class="rolestest" style="text-align:left;"></label></div>'),
			       	   		
			       	   		    render: function () 
			       	   		    {
			       	   		      this.$el.html(this.template());
			       	   		      var roles=this.model.get("module").toString().split(",");
			       	   		      if (roles.length >1) 
			       	   		      {
			       	   		       this.$(".rolestest").text("more modules...");
			       	   		       this.$(".rolestest").attr("title",this.model.get("module"));
								  }
			       	   		      else
			       	   		    	  {
			       	   		           this.$(".rolestest").text(this.model.get("module"));
			       	   		    	  }
			       	   		      this.delegateEvents();
			       	   		      return this;
			       	   		    }
			       	        }),
			       	 	 editable : false,
			       	       },
			           	{
			       	   		name : "page",
	           		        label: "Page",
			       	        cell : Backgrid.Cell.extend({
			       	        template: _.template('<div align="center"><label for="role" class="rolestest" style="text-align:left;"></label></div>'),
			       	   		
			       	   		    render: function () 
			       	   		    {
			       	   		      this.$el.html(this.template());
			       	   		      var roles=this.model.get("page").toString().split(",");
			       	   		      if (roles.length >1) 
			       	   		      {
			       	   		       this.$(".rolestest").text("more pages...");
			       	   		       this.$(".rolestest").attr("title",this.model.get("page"));
								  }
			       	   		      else
			       	   		    	  {
			       	   		           this.$(".rolestest").text(this.model.get("page"));
			       	   		    	  }
			       	   		      this.delegateEvents();
			       	   		      return this;
			       	   		    }
			       	        }),
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
			               

	   $(this.el).html(this.template());
	   			this.$('#dform').ajaxForm({
    				success: function(response)
    			    {
    					if(response.message=="success")
    					{
    					$("#docId").val(response.key);
    					$('#document').html("<a href='#' id='viewdoc'>"+$("#docFile").val()+"</a><img  src='images/pdf.jpeg'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='deletefile'id='docremove' src='images/close1.png'><br/>");
    					$("#docFile").val("");
    					}
    					else
    						{
    						alert("file not uploaded successfully");
    						}
    			    },
    				complete: function(xhr)
    				{
    					var docId=xhr.responseText;
    					
    	     		}
    			});
	   			loginrole= $.cookie("role");
      			if (loginrole=="CMGR")
      			{
      				columns=[{
           		 	    name: "checkbox",
           		 	    cell: "select-row",
           		 	    headerCell: "select-all",
           		  }].concat(columns),
	 				this.$("#active").show();
					this.$("#deactive").show();
					this.$("#reject").show();
				}
	 			else
	 				{
	 				
					this.$("#active").hide();
					this.$("#deactive").hide();
					this.$("#reject").hide();
	 				}
      			
	     			marketData=app.loadlist;
	     			Portals=marketData.portals;
	     		    Modules=marketData.modules;
	     		    Pages=marketData.pages;
	     		    Statuses=marketData.status;
	     		    PMrelation=marketData.portalAndMod;
	                this.dataGrid(app.test);
	                this.filterdropdowns();
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
	   "click #docremove":"docremove",
	   "click #clear":"filterdropdowns"
  },
  docremove:function()
  {
	   var r=confirm("Are you sure to delete document..!");
	   	if (r==true)
	   	  {
	   	     //alert("sofor operation not developed");
	   	  }
	   	else
	   	  {
	   	 
	   	  }
  },
   portal:function()
   {
	   $("#module").empty();
	   $("#module").append(new Option("select","null"));
	   var pval=$("#portal").val();
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
	   $("#page").append(new Option("select","null"));
	   for ( var i = 0; i < Pages.length; i++) 
	   {
		 if(Pages[i].moduleCode==$("#module").val())
			 {
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
			 $("#page1").append(new Option(Pages[i].pageDesc,Pages[i].pageCode));
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
	   var textArray=new Array();
	   textArray.push($("#title").val());
	   textArray.push($("#description").val());
	   //textArray.push($("#role1").val());
	   var textlengthvalidation1=false;
	   var textlengthvalidation2=false;
	   var textValidation=Datavalidation(textArray);
	   if (textValidation !=false || textValidation=="undefined")
	   {
		if ($("#title").val().trim().length > 50)
			{
			alert("title length allowed upto 50 chars only");
			textlengthvalidation1=false;
			}
		else
			{
			textlengthvalidation1=true;
			}

		 if ($("#description").val().trim().length > 2000) 
			 {
		       alert("description length allowed upto 2000 chars only");
			  textlengthvalidation2=false;
			 }
		 else
			 {
			  textlengthvalidation2=true;
			 }
	   }
 if (textlengthvalidation1 == true && textlengthvalidation2 == true)
 {
	 if($("#portal1").val()==""||$("#portal1").val()=="null"||$('#module1').val()=="null"||$('#module1').val()=="")
	   {
	   alert("portal,module are required");
	   return;
	   }
	 var pagec=""
	 if ($("#page1").val()==""||$("#page1").val()=="select")
	 {
		 pagec=null;
	 }
	 else
		 {
		 pagec=$("#page1").val();
		 }
	   var moduledesc='';
	   var portaldesc='';
	   var pagedesc='';
	   var statusdesc='';
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
	   for ( var i = 0; i < Pages.length; i++) 
	   {
		 if(Pages[i].pageCode==$("#page1").val())
			 {
			 pagedesc=Pages[i].pageDesc;
			 }
	   }
	   for(var j=0 ;j < Statuses.length; j++ )
	   {
		   if (Statuses[j].statusCode==$("#status1").val()) 
		   {
			statusdesc=Statuses[j].statusDesc;
		   }
	   }
	   
	   if(this.model.isNew())
	   {
		   $("#save").attr('disabled',true);
		   clonedmodel=this.model.clone();
		   testmodel=this.model;
		   clonedmodel.set({
		        title:$("#title").val(),
				desc:$("#description").val(),
				docUrl:$("#docId").val(),
				status:$("#status1").val(),
				page:pagec,
				module:$("#module1").val(),
				portal:$("#portal1").val(),
				contentType:'PHLP'
		        });
		   clonedmodel.save({},{
				 success:function(response)
				 {
					 var id=clonedmodel.get("id");
					 var date=clonedmodel.get("dateCreated");
					 testmodel.set({
						    id:id,
					        title:$("#title").val(),
							desc:$("#description").val(),
							docUrl:$("#docId").val(),
							status:$("#status1").val(),
							page:pagedesc,
							module:moduledesc,
							portal:portaldesc,
							contentType:'PHLP',
							dateCreated:date
					        });
					 $("#adetails").hide();
					 $('#status-area').flash_message({
					        text: 'Record Saved Successfully',
					        how: 'append'
					    });
					 pageablecollection.add(testmodel);
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
		   this.model.url="rest/pageHelp/id";
		   var testmodel=this.model;
		   var clone1=this.model.clone();
			var clonedModel1=this.model.clone();
			clonedModel1.set({
		        title:$("#title").val(),
				desc:$("#description").val(),
				docUrl:$("#docId").val(),
				status:$("#status1").val(),
				page:pagec,
				module:$("#module1").val(),
				portal:$("#portal1").val(),
				contentType:'PHLP'
		        });
			clone1.set({
		        title:$("#title").val(),
				desc:$("#description").val(),
				docUrl:$("#docId").val(),
				status:statusdesc,
				page:pagedesc,
				module:moduledesc,
				portal:portaldesc,
				contentType:'PHLP'
		        });
		   var names=this.model.getAttributeNames().split(",");
		   if (valueCheck(clone1, names))
		   {
			   clonedModel1.save(
					    {}, {
						    success: function()
	                        {
						    	testmodel.set({
							        title:$("#title").val(),
									desc:$("#description").val(),
									docUrl:$("#docId").val(),
									status:statusdesc,
									page:pagedesc,
									module:moduledesc,
									portal:portaldesc,
									contentType:'PHLP'
							        });
						    	$('#status-area').flash_message({
							        text: 'Record Updated Successfully',
							        how: 'append'
							    });
						    	 $("#adetails").hide();
						    },
						    error: function() 
						    {
						    	$("#save").attr('disabled',false);
						    	$('#status-area1').flash_message({
							        text: 'No Record Updated',
							        how: 'append'
							    });
						    }
						    ,wait:true,reset:true});
              }
		   else {
			   $("#adetails").hide();
			   $('#status-area').flash_message({
			        text: 'No Record Updated',
			        how: 'append'
			    });
	        	}
		   }
 }
 },
   dataPrepapulate:function(e)
   {   
	   e.preventDefault();
	   var x=parseInt( $(e.currentTarget).attr("href"));
	   this.model=pageablecollection.get(x);
	   $("#docFile").val("");
	   $("#adetails").show();
	   $("#save").attr('disabled',false);
	   $("#status1").empty();
	   $("#portal1").empty();
	   $("#module1").empty();
	   $("#page1").empty();
	   $("#save").focus();
	   $("#document").empty();
	   $("#docId").val("");
	   $("#imageId").val("");
	   if (loginrole=="CMGR")
		{
		   $("#status1").attr('disabled', false);
		}
	else
		{
		 $("#status1").attr('disabled', true);
		}
	   $("#status1").append(new Option("select","null"));
	   $("#module1").append(new Option("select","null"));
	   $("#page1").append(new Option("select","null"));
	   $("#portal1").append(new Option("select","null"));
	   for(var j=0 ;j < Statuses.length; j++ )
	   {
	      if(Statuses[j].statusDesc==this.model.get("status"))
	    	  {
	    	  var o1 = new Option(Statuses[j].statusDesc,Statuses[j].statusCode);
			    o1.setAttribute("selected", "selected");
			   $("#status1").append(o1);
	    	  }
	      else
	    	  {
	    	  $("#status1").append(new Option(Statuses[j].statusDesc,Statuses[j].statusCode));  
	    	  }
	   }
	  
	   for(var j=0 ;j < Portals.length; j++ )
	   {
		   if(Portals[j].portalDesc==this.model.get("portal"))
			   {
			   var o1 = new Option(Portals[j].portalDesc,Portals[j].portalCode);
			    o1.setAttribute("selected", "selected");
			   $("#portal1").append(o1);
			   for ( var i = 0; i < PMrelation.length; i++) 
			   {
				   if(PMrelation[i].portalCode==Portals[j].portalCode)
					   {
					   for ( var k = 0; k < Modules.length; k++)
					   {
						   if(Modules[k].moduleCode==PMrelation[i].modCode)
						   {
							    if(Modules[k].moduleDesc==this.model.get("module"))
							    	{
							    	var o1 = new Option(Modules[k].moduleDesc,Modules[k].moduleCode);
								    o1.setAttribute("selected", "selected");
								    $("#module1").append(o1);
								    for ( var l = 0; l < Pages.length; l++) 
									   {
										 if(Pages[l].moduleCode==Modules[k].moduleCode)
											 {
											     if(Pages[l].pageDesc==this.model.get("page"))
											    	 {
											    	 var o1 = new Option(Pages[l].pageDesc,Pages[l].pageCode);
													    o1.setAttribute("selected", "selected");
													    $("#page1").append(o1);
											    	 }
											     else
											    	 {
												 $("#page1").append(new Option(Pages[l].pageDesc,Pages[l].pageCode));
											    	 }
											 }
									   }
							    	}
							    else
							    	{
							    	$("#module1").append(new Option(Modules[k].moduleDesc,Modules[k].moduleCode));	
							    	}
						   }
					   }
					   }
     			}
  }
		   else
			   {
			   $("#portal1").append(new Option(Portals[j].portalDesc,Portals[j].portalCode));	   
			   }
	   }
	   var docUrl=this.model.get("docUrl");
	   if(docUrl !="")
		   {
		   $('#document').html("<a href='#' id='viewdoc'>"+"document"+"</a><img  src='images/pdf.jpeg'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='deletefile'id='docremove' src='images/close1.png'>");
		   $("#docId").val(docUrl);
		   }
	   $("#title").val(this.model.get("title"));
	   $("#description").val(this.model.get("desc"));
   },
   search:function()
   { 
	   /*var portal,module,page,statuss;
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
    	   }*/
	   var searchmodel=new pageSearchModel().set({
		    status:$("#status").val(),
			portal:$("#portal").val(),
			module:$("#module").val(),
			page:$("#page").val(),
			searchTitle:""
	   });
	   var that=this;
	   searchmodel.save(null,{
		   success:function(response){
			   var data=response.toJSON();
			   var resp=data;
			   var mlist = resp.searchDetails;
			  /* if(mlist != "")
					{
				*/	 this.$("#datagrid").empty();
					 this.$("#filter").empty();
					 var meslist = new Array();
						for(var i=0;i<mlist.length;i++)
						{
							meslist[i] = mlist[i];
						}
						$('.dropdownwrap').hide();
				     var searchcollection=new pageDetailsCollection(meslist);
				     if (searchcollection.size()==0)
				     {
				    	 $('#status-area1').focus();
							$('#status-area1').empty();
							$('#status-area1').flash_message({
							        text: 'No Records Found & Try Again',
							        how: 'append'
							    });
					 }
				               var grids = this.$("#datagrid");
					                var pgcollection = Backbone.PageableCollection.extend({
						           	model : pageDetailsModel,
						        	url   : "rest/pageHelp",
						           	state :
						           	      {
						           		   pageSize: 5,
						           		   /*firstPage: 0,
			     			           	   currentPage:0,*/
						           		  },
						           	mode  : "client",
					        });
					                   pageablecollection = new pgcollection(searchcollection.toJSON());
						              pageableGrid = new Backgrid.Grid({
						           	  columns:columns,
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
						          that.filterdropdowns();
			/*		}
				else{
					
					$('#status-area1').focus();
					$('#status-area1').empty();
					$('#status-area1').flash_message({
					        text: 'No Matches Found & Try Again',
					        how: 'append'
					    });

				    }
*/		   }
	   });
	 
   },
   cancel:function()
   {
	      $("#adetails").hide();
   },
   newhelp:function()
   {
	   $("#adetails").show();
	   $("#save").attr('disabled',false);
	   this.model=new pageDetailsModel();
	   $("#docFile").val("");
	   $("#status1").empty();
	   $("#portal1").empty();
	   $("#module1").empty();
	   $("#page1").empty();
	   $("#save").focus();
	   $("#document").empty();
	   $("#docId").val("");
	   $("#imageId").val("");
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
	   $("#title").val(this.model.get("title"));
	   $("#description").val(this.model.get("description"));
   },
   viewdoc:function(e)
   {
	 e.preventDefault();
	 var id=$("#docId").val(); 
 	 window.open("rest/download?fileId="+id);
   },
   documentFile:function(e)
   {
		  var type=e.target.files[0].type;
		  if (type=="application/pdf")
		  {
			  if(e.target.files[0].size/1024<=1024)
			  	 {
			  	 }
			   else
			   {
			    alert("file size not allowed");
			    $("#docFile").val("");
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
		           var grids = this.$("#datagrid");
		                var pgcollection = Backbone.PageableCollection.extend({
			           	model : pageDetailsModel,
			        	url   : "rest/pageHelp",
			           	state :
			           	      {
			           		   pageSize: 5,
			           		 /*  firstPage: 0,
     			           	   currentPage:0,*/
			           		  },
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
			          pageablecollection.on('backgrid:selected', function(model, selected) 
			        	{ 
			        	 
			        	});

			          var serverSideFilter = new Backgrid.Extension.ServerSideFilter({
			           	  collection: pageablecollection,
			           	  name: "Title", 
			              placeholder: "Search on the server" 
			           	});
			          this.$("#filter").append(serverSideFilter.render().el);
			          grids.append(paginator.render().$el);
			          	   },
			          	 filterdropdowns:function()
			          	 {
			          	   this.$("#status").empty();
			          	   this.$("#portal").empty();
			          	   this.$("#module").empty();
			          	   this.$("#page").empty();
			          	   this.$("#status").append(new Option("select","null"));
			          	   this.$("#module").append(new Option("select","null"));
			          	   this.$("#page").append(new Option("select","null"));
			         	   for(var j=0 ;j < Statuses.length; j++ )
			         	   {
			         	     this.$("#status").append(new Option(Statuses[j].statusDesc,Statuses[j].statusCode));
			         	   }
			         	   this.$("#portal").append(new Option("select","null"));
			         	   for(var j=0 ;j < Portals.length; j++ )
			         	   {
			         	     this.$("#portal").append(new Option(Portals[j].portalDesc,Portals[j].portalCode));
			         	   }
			          	 }
});
