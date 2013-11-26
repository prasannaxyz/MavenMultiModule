/*var pageablecollection;
var pageableGrid;
*/window.announcementsView=Backbone.View.extend({
	initialize:function()
	{ 	
	  this.template = _.template($('#announcementsTemplate').html());
	},
   render:function()
   { 
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
			           		editable :false,
			           	},
			           	{
			           	  	name : "roleType",
			           		label: "Role Type",
			           		cell : "string",
			           		editable : false,
			           	},
			           	{
			       	   		name:'role',
			       	   	    label: "Role",
			       	        cell : Backgrid.Cell.extend({
			       	        template: _.template('<div align="center"><label for="role" class="rolestest" style="text-align:left;"></label></div>'),
			       	   		    render: function () 
			       	   		    {
			       	   		      this.$el.html(this.template());
			       	   		      var roles=this.model.get("role").toString().split(",");
			       	   		      if(roles.length >1) 
			       	   		      {
			       	   		       this.$(".rolestest").text("more roles...");
			       	   		       this.$(".rolestest").attr("title",this.model.get("role"));
								  }
			       	   		      else
			       	   		    	  {
			       	   		           this.$(".rolestest").text(this.model.get("role"));
			       	   		    	  }
			       	   		      this.delegateEvents();
			       	   		      return this;
			       	   		    }
			       	        }),
			       	 	 editable : false,
			       	       },
			           	{
			           		  name : "dateCreated",
			           		  label: "Date Created",
			           		  cell : "string",
			           		  editable:false
			           	},
			            {
			           		  name : "status",
			           	      label: "Status",
			           	      cell : "string",
			           	      editable:false
      		         },
			      ];
	   $(this.el).html(this.template());
	  this.$("#ef1date").datepicker({
	   		dateFormat : 'yy-mm-dd',
			changeMonth: true,
	        changeYear: true,
	   	});
	  this.$("#et1date").datepicker({
	   		dateFormat : 'yy-mm-dd',
			changeMonth: true,
	        changeYear: true,
	   	});
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
	  
			this.$('#dform').ajaxForm({
				success: function(response)
			    {
					if(response.message=="success")
					{
					$("#docId").val(response.key);
					$('#document').html("<a href='#' id='viewdoc'>"+$("#docFile").val()+"</a><img  src='images/pdf.jpeg'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='deletefile'id='docremove' src='images/close1.png'>");
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
			this.$('.multiselect').multiselect({
				  buttonClass: 'btn',
				  buttonWidth: 'auto',
				  buttonContainer: '<div class="btn-group"/>',
				  maxHeight: false,
				  buttonText: function(options) {
				  if (options.length == 0) {
				  return 'None selected <b class="caret"></b>';
				  }
				  else if (options.length > 3) {
				  return options.length + ' selected <b class="caret"></b>';
				  }
				  else {
				  var selected = '';
				  options.each(function()
				  {
				  selected += $(this).text() + ',';
				  });
				  return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
				  }
				  }
				  });
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
	 				{
	 				this.$("#active").hide();
					this.$("#deactive").hide();
					this.$("#reject").hide();
	 				}
	     			marketData=app.loadlist;
	     		    roles= marketData.roles;
	     		    mstatus=marketData.status;
	     		    roleTypes=marketData.roleTypes;
	     		    dates=marketData.dates;
	     		    effectiveFrom=dates.effectiveFrom;
	     		    effectiveTo=dates.effectiveTo;
	     		   this.dataGrid(app.test);
	     		   this.filterdropdowns();
	     		   return this;
   },
   events:
   {
	   "click #newcontent":"newcontent",
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
	   "change #roletype":"roletype",
	   "change #roletype1":"roletype1",
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
   roletype:function()
   {
	   this.$("#role").empty();
	   for(var i=0 ;i < roles.length; i++ )
	   {
		   if(roles[i].roleType == $("#roletype").val())
			   {
			    this.$("#role").append(new Option(roles[i].role,roles[i].roleCode));
			   }
	   }
	   $('#role').multiselect("rebuild");   
  },
   roletype1:function()
   {
	  
	   this.$("#role1").empty();
	   for(var i=0 ;i < roles.length; i++ )
	   {
		   if(roles[i].roleType == $("#roletype1").val())
			   {
			    $("#role1").append(new Option(roles[i].role,roles[i].roleCode));
			   }
	   }
	   $('#role1').multiselect("rebuild");
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
	   var validation=dateValidation();
	   var textArray=new Array();
	   textArray.push($("#title").val());
	   textArray.push($("#description").val());
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
	   if(validation == true && textlengthvalidation1 == true && textlengthvalidation2 == true)
	   {
		   if ($("#role1").val()==null) 
		   {
			alert("please select role");
			return;
		   }	   
	   var roletypedesc="";
	   var roledesc="";
	   var statusdesc="";
	   if($("#roletype1").val()=="E")
		   roletypedesc="External";
       else
    	   roletypedesc="Internal";
	   var nroles=$("#role1").val().toString().split(",");
	   var nnroles=new Array();
	   for ( var k = 0; k < nroles.length; k++)
	   { 
	  for(var i=0 ;i < roles.length; i++ )
 	   {
		  if(nroles[k]==roles[i].roleCode)
			  {
			  nnroles.push(roles[i].role);
			  }
 	   }
	   }
	   for(var i=0 ;i < roles.length; i++ )
 	   {
		  if(roles[i].roleCode==$("#role1").val())
			  {
			  roledesc=roles[i].role;
			  }
 	   }
	   for(var j=0 ;j < mstatus.length; j++ )
	   {
		   if (mstatus[j].statusCode==$("#status1").val())
		   {
			statusdesc=mstatus[j].statusDesc;
		   }
	   }

	   if(this.model.isNew())
	   {
		   $("#save").attr('disabled', true);
		   cloneModel=this.model.clone();
		   testModel=this.model;
    	   cloneModel.set({
			     contentType:'ANNO',
				 status:$("#status1").val(),
				 role:$("#role1").val(),
				 roleType:$("#roletype1").val(),
				 desc:$("#description").val().trim(),
				 title:$("#title").val().trim(),
				 docUrl:$("#docId").val(),
				 effectiveFrom:$("#efdate").val(),
				 effectiveTo:$("#etdate").val(),
				 userId:'1',
			        });
    	   cloneModel.save({},{
				 success:function(response)
				 {
					/* var id=cloneModel.get("id");
					 var date=cloneModel.get("dateCreated");*/
					 testModel.set({
						 id:cloneModel.get("id"),
					     contentType:'ANNO',
						 status:statusdesc,
						 role:nnroles,
						 roleType:roletypedesc,
						 desc:cloneModel.get("desc"),
						 title:cloneModel.get("title"),
						 docUrl:cloneModel.get("docUrl"),
						 effectiveFrom:cloneModel.get("effectiveFrom"),
						 effectiveTo:cloneModel.get("effectiveTo"),
						 userId:'1',	
						 dateCreated:cloneModel.get("dateCreated")
					        });
					 $("#adetails").hide();
					 $('#status-area').flash_message({
					        text: 'Record Saved Successfully',
					        how: 'append'
					    });
					 pageablecollection.add(testModel);
					
				 },
				 error:function()
				 {
					 $("#save").attr('disabled', false);
					 $('#status-area').flash_message({
					        text: 'Record Not Saved',
					        how: 'append'
					    });
				 },
				 wait: true});
		   }
	   else
		   {
		   $("#save").attr('disabled', true);
		   function inArray(array, el) {
			   for ( var i = array.length; i--; ) {
			     if ( array[i] === el ) return true;
			   }
			   return false;
			 }
		   
		   function isEqArrays(arr1, arr2) {
			   if ( arr1.length !== arr2.length ) {
			     return false;
			   }
			   for ( var i = arr1.length; i--; ) {
			     if ( !inArray( arr2, arr1[i] ) ) {
			       return false;
			     }
			   }
			   return true;
			 }
		   
		  var existingroles=this.model.get("role").toString().split(",");
		  var newroles=$("#role1").val();
		  this.model.url="rest/announcement/id";
		  var clone1=this.model.clone();
		  var clonedModel=this.model.clone();
		  clone1.set({
			     contentType:'ANNO',
				 status:statusdesc,
				 role:nnroles,
				 roleType:roletypedesc,
				 desc:$("#description").val(),
				 title:$("#title").val(),
				 docUrl:$("#docId").val(),
				 effectiveFrom:$("#efdate").val(),
				 effectiveTo:$("#etdate").val(),
				 userId:'1',
			        });
		  clonedModel.set({
			     contentType:'ANNO',
				 status:$("#status1").val(),
				 role:newroles,
				 roleType:$("#roletype1").val(),
				 desc:$("#description").val(),
				 title:$("#title").val(),
				 docUrl:$("#docId").val(),
				 effectiveFrom:$("#efdate").val(),
				 effectiveTo:$("#etdate").val(),
				 userId:'1',
			        });
		  var testModel=this.model;
		   var names=this.model.getAttributeNames().split(",");
		   var valcom=valueCheck(clone1, names);
		   var compareboth=isEqArrays(existingroles,nnroles);
		   if (valcom==true||compareboth==false)
		   {
			   clonedModel.save(
					    {}, {
					    success: function()
                        {
					    	testModel.set({
							     contentType:'ANNO',
								 status:statusdesc,
								 role:nnroles,
								 roleType:roletypedesc,
								 desc:clonedModel.get("desc"),
								 title:clonedModel.get("title"),
								 docUrl:clonedModel.get("docUrl"),
								 effectiveFrom:clonedModel.get("effectiveFrom"),
								 effectiveTo:clonedModel.get("effectiveTo"),
								 userId:'1',	
							        });
					    	 $("#adetails").hide();
					    	$('#status-area').flash_message({
						        text: 'Record Updated Successfully',
						        how: 'append'
						    });
					    },
					    error: function() 
					    {
					    	$("#save").attr('disabled', false);
					    	$('#status-area1').empty();
							$('#status-area1').focus();
							$('#status-area1').flash_message({
						        text: 'No Records Are Updated',
						        how: 'append'
						    });
					    }
					    ,wait:true,reset:true});
	       }
		   else 
		   {
			$('#status-area').empty();
			$('#status-area').focus();
			$('#status-area').flash_message({
		        text: 'No Records Are Updated',
		        how: 'append'
		    });
			 $("#adetails").hide();
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
	   $("#save").attr('disabled', false);
	   $("#roletype1").empty();
	   $("#status1").empty();
	   $("#role1").empty();
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
	   $("#roletype1").append(new Option("select","null"));
	   for(var i=0 ;i < roleTypes.length; i++ )
	   { 
		   if(roleTypes[i].roleTypeDesc==this.model.get("roleType"))
			   {
			   var o1 = new Option(roleTypes[i].roleTypeDesc,roleTypes[i].roleTypeCode);
			    o1.setAttribute("selected", "selected");
			   $("#roletype1").append(o1);
			   }
		   else
			   {
			   $("#roletype1").append(new Option(roleTypes[i].roleTypeDesc,roleTypes[i].roleTypeCode));	   
			   }
	   }
	  var rtype;
	   if(this.model.get("roleType")=="Internal")
		   rtype="I";
	   else
		   rtype="E";
	  
	   var elroles=new Array();
	   
	   for ( var i = 0; i < roles.length; i++) 
	   {
		   if(roles[i].roleType ==rtype)
			   {
			   elroles.push(roles[i]);
			   }
	   }
	 var proles=this.model.get("role").toString().split(",");
	   for (var i = 0; i < elroles.length; i++) 
	   {
		   var option=new Option(elroles[i].role,elroles[i].roleCode);          
		   for (var j = 0; j < proles.length; j++) 
		   {
			   if (elroles[i].role == proles[j])//both are matched  
			   {  
			    option.setAttribute("selected","selected");
			    break;
			   //remove this element from gridroles array, so we do not have to check for this item in remaining outer iterations.
			   }
		   }         
		          this.$("#role1").append(option);
		              
	   }	
       $('#role1').multiselect("rebuild");
       $("#status1").append(new Option("select","null"));
	   for(var j=0 ;j < mstatus.length; j++ )
	   {
	       if(mstatus[j].statusDesc==this.model.get("status"))
	    	   {
	    	   var o1 = new Option(mstatus[j].statusDesc,mstatus[j].statusCode);
			    o1.setAttribute("selected", "selected");
			   $("#status1").append(o1);
	    	   }
	       else
	    	   {
		     $("#status1").append(new Option(mstatus[j].statusDesc,mstatus[j].statusCode));
	    	   }
	   }
	   
	  /* this.$('#status1').multiselect({
			  buttonClass: 'btn',
			  buttonWidth: 'auto',
			  buttonContainer: '<div class="btn-group" />',
			  maxHeight: false,
			  buttonText: function(options) {
			  if (options.length == 0) {
			  return 'None selected <b class="caret"></b>';
			  }
			  else if (options.length > 3) {
			  return options.length + ' selected <b class="caret"></b>';
			  }
			  else {
			  var selected = '';
			  options.each(function()
			  {
			  selected += $(this).text() + ', ';
			  });
			  return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
			  }
			  }
			  });
	   $('#status1').multiselect("rebuild");
*/	   var docUrl=this.model.get("docUrl");
	   if(docUrl !="")
		   {
		   $('#document').html("<a href='#' id='viewdoc'>"+"document"+"</a><img  src='images/pdf.jpeg'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='deletefile'id='docremove' src='images/close1.png'>");
		   $("#docId").val(docUrl);
		   }
	   $("#title").val(this.model.get("title"));
	   $("#description").val(this.model.get("desc"));
	   $("#efdate").val(this.model.get("effectiveFrom"));
	   $("#etdate").val(this.model.get("effectiveTo"));
   },
   search:function()
   {
	       var roleType;
	       if($("#roletype").val()=="E")
	    	  roleType="External";
	       else
	    	   roleType="Internal";
	       var searchmodel=new announcementsSearchModel().set({
		   effectiveFrom:null,
		   effectiveTo:null,
		   role: $("#role").val(),
		   roleType:$("#roletype").val(),
		   status:$("#status").val(),
		   searchTitle:""
	   });
	       var that=this;
	   searchmodel.save(null,{
		   success:function(response){
			   var data=response.toJSON();
			   var resp=data;
			   var mlist = resp.searchDetails;
	/*		   if(mlist != "")
					{
	*/			 $("#datagrid").empty();
				 $("#filter").empty();
					 var meslist = new Array();
						for(var i=0;i<mlist.length;i++)
						{
							meslist[i] = mlist[i];
						}
						$('.dropdownwrap').hide();
				     var searchcollection=new annoncementsDetailsCollection(meslist);
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
						           	model : announcementsDetailsModel,
						        	url   : "rest/announcement",
						           	state :
						           	      {
						           		   pageSize: 5,
						           		  /* firstPage: 0,
			     			           	   currentPage:0,
						           */		  },
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
						          that.filterdropdowns();
/*					}
				else
				{
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
   newcontent:function()
   {
	   $('#role1').empty();
	   $("#adetails").show();
	   $("#save").attr('disabled',false);
	   $("#docFile").val("");
	   this.model=new announcementsDetailsModel();
	   $("#role1").empty();
	   $("#status1").empty();
	   $("#roletype1").empty();
	   $("#status1").append(new Option("Pending","PND"));
	   $("#status1").attr('disabled', true);
	  // $("#status1").multiselect("rebuild");
	   $("#save").focus();
	   $("#document").empty();
	   $("#docId").val("");
	   $("#imageId").val("");
	   $("#roletype1").append(new Option("select","null"));
	   for(var i=0 ;i < roleTypes.length; i++ )
	   {
	     $("#roletype1").append(new Option(roleTypes[i].roleTypeDesc,roleTypes[i].roleTypeCode));
	   }
	   $('#role1').multiselect("rebuild");
	 /*  for(var i=0 ;i < roles.length; i++ )
 	   {
			    this.$("#role1").append(new Option(roles[i].role,roles[i].roleCode));
	   }
	   $('#role1').multiselect("rebuild");
*/	   for(var j=0 ;j < mstatus.length; j++ )
	   {
	     $("#status1").append(new Option(mstatus[j].statusDesc,mstatus[j].statusCode));
	   }
	   $("#title").val(this.model.get("title"));
	   $("#description").val(this.model.get("description"));
	   $("#efdate").val(effectiveFrom);
	   $("#etdate").val(effectiveTo);
   },
   viewdoc:function(e)
   {
	 e.preventDefault();
     var id=$("#docId").val();
 	 window.open("rest/download?fileId="+id);
   },
   imageFile:function(e)
   {
	     if(e.target.files[0].size/1024<=1024)
    	 {
    	 
    	 }
     else
     {
      alert("file size not allowed");	 
     }
   },
   fileupload:function()
   {
	  if($('#imageFile').val() !="")
		   {
	   $("#flink").show();
	   $('#flink').html("<a href='#' id='imagelink'>"+"view image"+"</a>");
	      return true;
		   }
	   else{
		   alert("select file to upload");
		   return false;
	       }
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
			    $("#docFile").focus();
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
			           	model : announcementsDetailsModel,
			        	url   : "rest/announcement",
			           	state :
			           	      {
			           		   pageSize: 5,
			           		  /* firstPage: 0,
     			           	   currentPage:0,*/
			           		  },
			           	mode  : "client",
		        });
		                   pageablecollection = new pgcollection(collection.toJSON());
			              pageableGrid = new Backgrid.Grid({
			           	  columns: columns,
			           	  collection: pageablecollection
			           });
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
			          		this.$("#roletype").empty();
			          		this.$('#role').empty();
			          		this.$('#status').empty();
			          		this.$("#roletype").append(new Option("select","null"));
			            	for(var i=0 ;i < roleTypes.length; i++ )
			        		   {
			        		     this.$("#roletype").append(new Option(roleTypes[i].roleTypeDesc,roleTypes[i].roleTypeCode));
			        		   }
			            	this.$('#roletype').multiselect("rebuild");
			            	this.$('#role').multiselect("rebuild");
			            	/*  for(var i=0 ;i < roles.length; i++ )
			        	 	   {
			        	  			    this.$("#role").append(new Option(roles[i].role,roles[i].roleCode));
			        	 	   }
			            	  this.$('#role').multiselect("rebuild");
			            	*/  this.$("#status").append(new Option("select","null"));
			            	   for(var j=0 ;j < mstatus.length; j++ )
			        		   {
			        		     this.$("#status").append(new Option(mstatus[j].statusDesc,mstatus[j].statusCode));
			        		   }
			             this.$('#status').multiselect("rebuild");
			            	   this.$('.mutliselect').multiselect({
			         			  buttonClass: 'btn',
			         			  buttonWidth: 'auto',
			         			  buttonContainer: '<div class="btn-group"/>',
			         			  maxHeight: false,
			         			  buttonText: function(options) {
			         			  if (options.length == 0) {
			         			  return 'None selected <b class="caret"></b>';
			         			  }
			         			  else if (options.length > 3) {
			         			  return options.length + ' selected <b class="caret"></b>';
			         			  }
			         			  else {
			         			  var selected = '';
			         			  options.each(function()
			         			  {
			         			  selected += $(this).text() + ', ';
			         			  });
			         			  return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
			         			  }
			         			  }
			         			  });
			        		   
			          	 }
});
function valueCheck(model,attributeNames)
{  
		for( var i = 0; i < attributeNames.length; i++)
		  {
			if(model.hasChanged(attributeNames[i])) 
			{
				return true;
			}
			
		  }
}
