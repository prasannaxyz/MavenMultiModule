(function($) {
    $.fn.flash_message = function(options) {
      
      options = $.extend({
        text: 'Done',
        time:2000,
        how: 'before',
        class_name: ''
      }, options);
      
      return $(this).each(function() {
        if( $(this).parent().find('.flash_message').get(0) )
          return;
        
        var message = $('<span />', {
          'class': 'flash_message ' + options.class_name,
          text: options.text
        }).hide().fadeIn('fast');
        
        $(this)[options.how](message);
        
        message.delay(options.time).fadeOut('normal', function() {
          $(this).remove();
        });
        
      });
    };
})(jQuery);
window.marketingView=Marionette.ItemView.extend({
    initialize:function()
	{ 	
	  this.template = _.template($('#marketingTemplate').html());
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
			        	   
			           		editable : false,
			           	},
			           	{
			       	   		name:'role',
			       	   	    label: "Role",
			       	        cell : Backgrid.Cell.extend({
			       	        template: _.template('<div align="center"><label for="role" class="rolestest" align="left" style="text-align:left;"></label></div>'),
			       	   		
			       	   		    render: function () 
			       	   		    {
			       	   		      this.$el.html(this.template());
			       	   		      var roles=this.model.get("role").toString().split(",");
			       	   		      if (roles.length >1) 
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
			           		  editable : false,
			           	},
			           {
			           		  name : "status",
			           	      label: "Status",
			           	      cell : "string",
			           	      editable : false,
			           		
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
	     			this.$('#iform').ajaxForm({
					success: function(response)
				    {
						if(response.message=="success")
						{	
				    	$("#imageId").val(response.key);
						$("#image").html("<a href='#' id='imagelink'>"+$("#imageFile").val()+"<img  id='testimage' style='width:inherit;height:inherit'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='deletefile'id='remove' src='images/close1.png'>");
						$("#imageFile").val("");
						}
						else
							{
							alert("image not uploaded successfully");
							}
				    },
					complete: function(xhr)
					{
						var imageId=xhr.responseText;
					}
				}); 
	     			this.$('#dform').ajaxForm({
						success: function(response)
					    {
							if(response.message=="success")
							{	
							$("#docId").val(response.key);
							$('#document').html("<a href='#' id='viewdoc'>"+$("#docFile").val()+"</a><img  src='images/pdf.jpeg'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='deletefile'id='remove' src='images/close1.png'>");
							$("#docFile").val("");
							}
							else
								{
								alert("file not uploaded successfully");
								}
					    },
						complete: function(xhr)
						{
						//	var docId=xhr.responseText;
							
			     		}
					});
	     			this.$('.multiselect').multiselect({
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
	   "click #imageremove":"imageremove",
	   "click #docremove":"docremove",
	   "click #clear":"filterdropdowns"
   },
   docremove:function()
   {
	   var r=confirm("Are you sure to delete document..!");
 	   	if (r==true)
 	   	  {
 	   	    // alert("sofor operation not developed");
 	   	  }
 	   	else
 	   	  {
 	   	 
 	   	  }
   },
   imageremove:function()
   {
	   var r=confirm("Are you sure to delete Image..!");
  	   	if (r==true)
  	   	  {
  	   	     //alert("sofor operation not developed");
  	   	  }
  	   	else
  	   	  {
  	   	 
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
	   var validation=dateValidation();
	   var textArray=new Array();
	   textArray.push($("#title").val());
	   textArray.push($("#description").val());
	   textArray.push($("#role1").val());
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
		   var roledesc="";
		   var statusdesc="";
		   for ( var i = 0; i < roles.length; i++) 
		   {
			if (roles[i].roleCode==$("#role1").val())
			{
			   roledesc=roles[i].role;	
			}
	       }
		   for ( var i = 0; i < mstatus.length; i++)
		   {
			if (mstatus[i].statusCode==$("#status1").val())
            {
				statusdesc=mstatus[i].status;
			}
		   }
		  
		   cloneModel=this.model.clone();
		   testModel=this.model;
		   cloneModel.set({
		     contentType:'MRKT',
			 status:$("#status1").val(),
			 role:$("#role1").val(),
			 desc:$("#description").val().toString().trim(), 
			 title:$("#title").val().toString().trim(),
			 docUrl:$("#docId").val(),
			 imageUrl:$("#imageId").val(),
			 effectiveFrom:$("#efdate").val(),
			 effectiveTo:$("#etdate").val(),
			 userId:'1',
           });
	   if(this.model.isNew())
	   {
		  $("#save").attr('disabled', true);
		  cloneModel.save({},{
				 success:function(response)
				 {   
					 var id=cloneModel.get("id");
					 var date=cloneModel.get("dateCreated");
					 $('#status-area').focus();
					 $('#status-area').empty();
					 $('#status-area').flash_message({
					        text: 'Record Saved Successfully',
					        how: 'append'
					    });
					 $("#marketdetails").hide();
					 testModel.set({
						 id:cloneModel.get("id"),
					     contentType:'MRKT',
						 status:statusdesc,
						 role:roledesc,
						 desc:cloneModel.get("desc"), 
						 title:cloneModel.get("title"),
						 docUrl:cloneModel.get("docUrl"),
						 imageUrl:cloneModel.get("imageUrl"),
						 effectiveFrom:cloneModel.get("effectiveFrom"),
						 effectiveTo:cloneModel.get("effectiveTo"),
						 userId:'1',
						 dateCreated:cloneModel.get("dateCreated")
			           });
					 pageablecollection.add(testModel);
					
				 },
				 error:function()
				 {
					 $("#save").attr('disabled', false);
					 $('#status-area').focus();
					 $('#status-area').empty();
					 $('#status-area').flash_message({
					        text: 'Record Not Saved',
					        how: 'append'
					    });
				 }
			 ,wait: true});
	   }
	   else
		   {
		   $("#save").attr('disabled', true);
		   var names=this.model.getAttributeNames().split(",");
		   clone1=this.model.clone();
		   clone1.set({
			     contentType:'MRKT',
				 status:statusdesc,
				 role:roledesc,
				 desc:$("#description").val().toString().trim(), 
				 title:$("#title").val().toString().trim(),
				 docUrl:$("#docId").val(),
				 imageUrl:$("#imageId").val(),
				 effectiveFrom:$("#efdate").val(),
				 effectiveTo:$("#etdate").val(),
				 userId:'1',
	           });
           var vstatus=valueCheck(clone1, names);
           if (vstatus==true)
		   {
			   cloneModel.url="rest/mrktContent/id";
			   cloneModel.save({},{success:function(response)
						 {   
					 testModel.set({
						// id:cloneModel.get("id"),
					     contentType:'MRKT',
						 status:statusdesc,
						 role:roledesc,
						 desc:cloneModel.get("desc"), 
						 title:cloneModel.get("title"),
						 docUrl:cloneModel.get("docUrl"),
						 imageUrl:cloneModel.get("imageUrl"),
						 effectiveFrom:cloneModel.get("effectiveFrom"),
						 effectiveTo:cloneModel.get("effectiveTo"),
						 userId:'1',
						 //dateCreated:cloneModel.get("dateCreated")
			           });
					  $('#status-area').focus();
					   $('#status-area').empty();
					   $('#status-area').flash_message({
					        text: 'Record Updated Successfully',
					        how: 'append'
					    });
					 $("#marketdetails").hide();
				 },
				 error:function()
				 {
					 $("#save").attr('disabled', false);
					 $('#status-area1').focus();
					 $('#status-area1').empty();
					 $('#status-area1').flash_message({
					        text: 'Record Not Saved',
					        how: 'append'
					    });
				 }});
		   }
		   else 
		   {
			$('#status-area').focus();
			$('#status-area').empty();
			$('#status-area').flash_message({
		        text: 'No Records Are Updated',
		        how: 'append'
		    });
			 $("#marketdetails").hide();
		   }
		 }
	 }
   },
   dataPrepapulate:function(e)
   {   
	   e.preventDefault();
	   $("#imageFile").val("");
       $("#docFile").val("");
	   var x=parseInt( $(e.currentTarget).attr("href"));
	   this.model=pageablecollection.get(x);
	   $("#marketdetails").show();
	   $("#save").attr('disabled', false);
	   if (loginrole=="CMGR")
		{
		   $("#status1").attr('disabled', false);
		}
	else
		{
		 $("#status1").attr('disabled', true);
		}	   $("#role1").empty();
	   $("#status1").empty();
	   $("#save").focus();
	   $("#image").empty();
	   $("#document").empty();
	   $("#docId").val("");
	   $("#imageId").val("");
	   for(var i=0 ;i < roles.length; i++ )
	   {
		   if(roles[i].roleType=="E")
			 {
	           if(roles[i].role==this.model.get("role"))
			   {
		        var o1 = new Option(roles[i].role,roles[i].roleCode);
			    o1.setAttribute("selected", "selected");
			   $("#role1").append(o1);
			   }
		   else
			   {
	             $("#role1").append(new Option(roles[i].role,roles[i].roleCode));
			   }
			 }
	   }
	   for(var j=0 ;j < mstatus.length; j++ )
	   {
	       if(mstatus[j].status==this.model.get("status"))
	    	   {
	    	   var o1 = new Option(mstatus[j].status,mstatus[j].statusCode);
			    o1.setAttribute("selected", "selected");
			   $("#status1").append(o1);
	    	   }
	       else
	    	   {
		   $("#status1").append(new Option(mstatus[j].status,mstatus[j].statusCode));
	    	   }
	   }
	   var imageUrl=this.model.get("imageUrl");
	   var docUrl=this.model.get("docUrl");
	   if(imageUrl !="")
		   {
		   $("#imageId").val(imageUrl);
		   $("#image").html("<a href='#' id='imagelink'>"+"imagefile"+"<img  id='testimage'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='deletefile'id='imageremove' src='images/close1.png'>");
		   }
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
	   var rval=$("#role").val();
	   	   if(rval=="select")
		   rval=null;
	   var sval=$("#status").val();
	   if(sval=="select")
		   sval=null;
	   var searchmodel=new marketingSearchModel().set({
		   effectiveFrom:null,
		   effectiveTo:null,
		   role:rval,
		   status:sval,
		   searchTitle:""
	   });
	   var that=this;
	   searchmodel.save(null,{
		   success:function(response){
			   var data=response.toJSON();
			   var resp=data;
			   var mlist = resp.searchDetails;
			   /*if(mlist != "")
					{*/
			        var meslist = new Array();
					for(var i=0;i<mlist.length;i++)
					{
						meslist[i] = mlist[i];
					}
				 $("#datagrid").empty();
				 this.$("#filter").empty();
			     var searchcollection=new marketingDetailsCollection(meslist);
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
						           	model : marketingDetailsModel,
						        	url   : "rest/mrktContent",
						           	state :
						           	      {
						           		   pageSize: 5,
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
						          pageablecollection.on('backgrid:selected', function(model, selected) 
						        	{ 
						        	 
						        	});

						          var serverSideFilter = new Backgrid.Extension.ServerSideFilter({
						           	  collection: pageablecollection,
						           	  name: "Title", 
						              placeholder: "Search on the server",
						             });
						          this.$("#filter").append(serverSideFilter.render().el);
						          grids.append(paginator.render().$el);
						          that.filterdropdowns();
				/* }
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
	      $("#marketdetails").hide();
   },
   newcontent:function()
   {
	   $("#marketdetails").show();
	   $("#save").attr('disabled', false);
	   $("#imageFile").val("");
       $("#docFile").val("");
	   $("#role1").empty();
	   $("#status1").empty();
	   $("#status1").append(new Option("Pending","PND"));
	   $("#status1").attr('disabled', true);
	   $("#save").focus();
	   $("#image").empty();
	   $("#document").empty();
	   $("#docId").val("");
	   $("#imageId").val("");
	   this.model=new marketingDetailsModel();
	   this.dropdown();
	   $("#title").val(this.model.get("title"));
	   $("#description").val(this.model.get("description"));
	   $("#efdate").val(effectiveFrom);
	   $("#etdate").val(effectiveTo);
   },
   dropdown:function()
   {
	   for(var i=0 ;i < roles.length; i++ )
	   {
		 if(roles[i].roleType=="E")
			 {
	     $("#role1").append(new Option(roles[i].role,roles[i].roleCode));
			 }
	   }
	   for(var j=0 ;j < mstatus.length; j++ )
	   {
	     $("#status1").append(new Option(mstatus[j].status,mstatus[j].statusCode));
	   }
   },
   viewdoc:function(e)
   {
	 e.preventDefault();
	 var id=$("#docId").val();  
  	 window.open("rest/download?fileId="+id);
   },
   imageFile:function(e)
   {
	   var type=e.target.files[0].type;
	   if (type=="image/jpeg"||type=="image/png"||type=="image/jpeg"||type=="image/zip") 
	   {
		   if(e.target.files[0].size<=1024 * 1024 * 2)
	    	 {
	    	 
	    	 }
	     else
	     {
	      alert("file size not allowed");
	      $("#imageFile").focus();
		  $("#imageFile").val("");
	      return;
	     }
       }
   else {
	   alert("only images are allowed");
	   $("#imageFile").focus();
	   $("#imageFile").val("");
	 return ;	
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
		  if(e.target.files[0].size<=1024*1024*2)
		  	 {
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
   imagelink:function(e)
   {
	   e.preventDefault();
	   var id=$("#imageId").val();
	   $('#testimage').attr('src',"http://portal.srinergitech.cloudbees.net/rest/download?fileId="+id);
	   $("#testimage").dialog({
			   closeOnEscape: true,
			   //title:"COMMON CONTROL HELP",
			   modal: true,
			   height: 600, 
			   width: 800,
			   open: function(event, ui) { $(".ui-dialog-titlebar-close", ui.dialog || ui).hide();
			   }
			 });
	   
	 /*    e.preventDefault();
	     var id=$("#imageId").val();
	  	 window.open("rest/download?fileId="+id,'','width=500,height=500');
	   */
	   
	 /*  var id=$("#imageId").val();
	   $.ajax({
		    url:'rest/download',
	        type: 'GET', 
	        data: { fileId:id },
	        dataType:'json',
	        success: function(data) 
	        {
	        	
	        },
	        complete: function(xhr)
			{
	        	//$("#testimage").attr('src',"images/indiaa.jpg");
	            data=xhr.responseText;
			  $('#testimage').attr('src',"data:;base64,"+data);
				$("#testimage").dialog({
		  			   closeOnEscape: true,
		  			   //title:"COMMON CONTROL HELP",
		  			   modal: true,
		  			   height: 600, 
		  			   width: 800,
		  			   open: function(event, ui) { $(".ui-dialog-titlebar-close", ui.dialog || ui).hide();
		  			   }
		  			 });
			}
	    });*/
   },
   dataGrid:function(collection)
   {
                        var grids = this.$("#datagrid");
		                var pgcollection = Backbone.PageableCollection.extend({
			           	model : marketingDetailsModel,
			        	url   : "rest/mrktContent",
			           	state :
			           	      {
			           		   pageSize: 5,
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
			          var serverSideFilter = new Backgrid.Extension.ServerSideFilter({
			           	  collection: pageablecollection,
			           	  name: "Title", 
			              placeholder: "Search on the server",
			             });
			          this.$("#filter").append(serverSideFilter.render().el);
			          grids.append(paginator.render().$el);
			          },
			          	 filterdropdowns:function()
			          	 {
			          	   this.$("#role").empty();
			          	   this.$("#status").empty();
			          	   this.$("#role").append(new Option("select",null));
			         	   for(var i=0 ;i < roles.length; i++ )
			         	   {
			         		 if(roles[i].roleType=="E")
			         			 {
			         	     this.$("#role").append(new Option(roles[i].role,roles[i].roleCode));
			         			 }
			         	   }
			         	   this.$("#status").append(new Option("select",null));
			         	   for(var j=0 ;j < mstatus.length; j++ )
			         	   {
			         	     this.$("#status").append(new Option(mstatus[j].status,mstatus[j].statusCode));
			         	   }
			          	 }

});
function dateValidation()
{
 
    var date1=this.$("#efdate").val();
	var date2=this.$("#etdate").val();
    	var d1=date1.split("-");
		var d2=date2.split("-");
		var d1m=parseInt(d1[1]);
		var d1y=parseInt(d1[0]);
		var d2m=parseInt(d2[1]);
		var d2y=parseInt(d2[0]);
		var d1d=parseInt(d1[2]);
		var d2d=parseInt(d2[2]);
		if(d2y>=d1y)
		{
			if(d2m>=d1m)
			{ 
				
				if(d1d<=d2d)
					{
					return true;
					}
				else
					{
		        	alert("to date must greater than the from date");
		        	$("#etdate").focus();
					return false;
					}
				
			
			}
			else
			{
				alert("to month must greater than the from month");
	        	$("#etdate").focus();
				return false;
			}
			
			return true;
		}
		else
		{
			alert("to year must greater than the from year");
        	$("#etdate").focus();
			return false;
	    }
		
	}
function Datavalidation(text)
{
	var iChars = "@#%^&*()+=-[]\\\';/{}|\":<>?";
	for ( var i = 0; i < text.length; i++)
	{
		if (text[i] ==null || text[i] =="" || text[i] =="select")
		{
		 alert("please enter required fields");
		 return false;
		}
		else
		{
			for (var j = 0; j < text[i].length; j++) 
			   {
			     if (iChars.indexOf(text[i].charAt(j)) != -1)
			     {
			     alert ("Your data has special characters. \nThese are not allowed.\n Please remove them and try again.");
			     return false;
			     }
			   }
		}
	}
}

