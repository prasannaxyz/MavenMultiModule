window.letterTemplateView=Marionette.ItemView.extend({
	initialize:function()
	{ 	
	  this.template = _.template($('#letterTemplate').html());
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
	   var images= '<li><a href="#">Common</a><ul id="commonimages"><li class="dropaccept" title="{{commonimage1}}">commonimage1</li>'+
		  '<li class="dropaccept" title="{{commonimage2}}">commonimage2</li>'+
			'<li class="dropaccept" title="{{commonimage3}}">commonimage3</li>'+
			'<li class="dropaccept" title="{{commonimage4}}">commonimage4</li></ul></li>';
	   $(this.el).html(this.template());
	   this.$("#co").append(images);
	   this.$("#templates").treeview({
			collapsed: true,
			unique: true,
			persist: "location"
		});
		this.$("#entity").treeview({
			collapsed: true,
			unique: true,
			persist: "location"
		});
		this.$("#letterimages").treeview({
			collapsed: true,
			unique: true,
			persist: "location"
		});
		this.$("#newimage").treeview({
			collapsed: true,
			unique: true,
			persist: "location"
		});
		this.$('#newimage').ajaxForm({
			dataType:'text',
			success: function()
		    {
		    	alert("image uploaded successfully11");
		    },
			complete: function(xhr)
			{
				var imageId=xhr.responseText;
				
				/*$("#imageId").val(imageId);
				$("#image").html("<a href='#' id='imagelink'>"+$("#imageFile").val()+"<img  id='testimage'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='deletefile'id='remove' src='images/close1.png'>");
				$("#imageFile").val("");*/
				
			}
		}); 
 			this.$('#myimage').ajaxForm({
 				dataType:'text',
				success: function()
			    {
					alert("image uploaded successfully");
			    },
				complete: function(xhr)
				{
					var docId=xhr.responseText;
					/*$("#docId").val(docId);
					$('#document').html("<a href='#' id='viewdoc'>"+$("#docFile").val()+"</a><img  src='images/pdf.jpeg'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='deletefile'id='remove' src='images/close1.png'>");
					$("#docFile").val("");*/
	     		}
			});
			
			this.$('#member li').Draggable(
 					{
 						zIndex: 	1000,
 						ghosting:	true,
 						revert:	true,
 						opacity: 	0.7
 					}
 					); 
			this.$('#groups li').Draggable(
 					{
 						zIndex: 	1000,
 						ghosting:	true,
 						revert:	true,
 						opacity: 	0.7
 					}
 					); 
 			this.$('#commonimages li').Draggable(
 					{
 						zIndex: 	1000,
 						ghosting:	true,
 						revert:	true,
 						opacity: 	0.7
 					}
 					); 

 					this.$('#myimages li').Draggable(
 							{
 								zIndex: 	1000,
 								ghosting:	true,
 								revert:	true,
 								opacity: 	0.7
 							}
 							); 
 					this.$('#header').Droppable(
 					    	{
 					    		accept : 'dropaccept',
 					    		tolerance:'intersect',
 					    		ondrop:	function (drag)
 					    				{
 					    			   //   alert("header event");
 					    			      //  $(this).val($(this).val()+$(drag).attr ("title"));
 					    					arr1['header'].set_content(arr1['header'].get_content()+$(drag).attr ("title"));
 					    					
 					    				}
 					    	}
 					    );
	   return this;
   },
   events:
   {
	   "change #cfile":"commonimage",
	   "change #mfile":"myimage",
	   "click #btn-get":"save"
   },
   save:function()
   {
	 //   alert("save called boss");
	    alert("header value   :"+arr1['header'].get_content());
		alert("body value     :"+arr2['body'].get_content());
		alert("footer value     :"+arr3['footer'].get_content());
   },
   myimage:function(e)
   {
	   var type=e.target.files[0].type;
	   if (type=="image/jpeg"||type=="image/png"||type=="image/jpeg"||type=="image/zip") 
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
       }
   else {
	   alert("only images are allowed");
	   $("#mfile").focus();
	   $("#mfile").val("");
	 return ;	
	}
   },
   commonimage:function(e)
   {

	   var type=e.target.files[0].type;
	   if (type=="image/jpeg"||type=="image/png"||type=="image/jpeg"||type=="image/zip") 
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
       }
   else {
	   alert("only images are allowed");
	   $("#cfile").focus();
	   $("#cfile").val("");
	 return ;	
	}
  }
});

