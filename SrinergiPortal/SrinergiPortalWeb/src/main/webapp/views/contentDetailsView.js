window.ContentDetailsView=Backbone.View.extend({
	val:null,
	initialize:function()
	{ 	
	  	  this.template = _.template($('#contentdetails').html());
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
	   (function()
				 {
		            this.$('form').ajaxForm({
					clearForm: true,
					resetForm: true, 
					dataType:'json',
					beforeSend: function()
				    {
				    	
				    },
				    success: function()
				    {
				    	var percentVal = '100%';
				        bar.width(percentVal);
				        percent.html(percentVal);
				    },
					complete: function(xhr)
					{
						//this.val=xhr.responseText;
					}
				}); 
				})();    
	   return this;
	  
   },
   events:
	   {
	   "change #imageFile":"imageFile",
	   "click #fileupload":"fileupload",
	   "click #imagelink":"imagelink",
	   "change #docFile":"documentFile",
	   "click #docupload":"docupload",
	   "click #save":"save",
	   "click #reviewcontent":"reviewcontent",
	   "click #cancel":"cancel"
	   },
	   cancel:function()
	   {
		   alert("cancel clicked");
	   },
	   reviewcontent:function()
	   {
		   alert("reviewcontent clicked");
	   },
	   save:function()
	   {
		   var count=window.history.length;
		   alert("count variable size is   :"+count);
		   var model=this.model;
		   model.set({
			     title:$("#title").val(),
				 description:$("#description").val(),
				 imageurl:"nothing",
				 documenturl:"nothing",
				 effectivefrom:$("#efdate").val(),
				 effectiveto:$("#etdate").val(),
				 role:$("#role").val(),
				 module:$("#module").val(),
				 page:$("#page").val(),
				 status:$("#status").val(),
			    });
		   model.save();
	   },
	   imageFile:function(e)
	   {
		   var ft=e.target.files[0].type;
		   console.log("file name is :"+e.target.files[0].name);
           if(ft=="image/jpeg"||ft=="image/jpg"|| ft=="image/gif"||ft=="image/png")
			   {
        	         if(e.target.files[0].size/1024<=1024)
        	    	  {
        	    	  console.log("ok boss file size allowed  :"+e.target.files[0].size/1024+"kbs");
        	    	  }
        	       else 
        	       {
					 $("#imageFile").val("");
				     $("#imageFile").focus();
				   }
			   }
			 else 
			 {
			     alert("image type is not allowed");
			     $("#imageFile").val("");
			     $("#imageFile").focus();
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
		 if(e.target.files[0].type=="application/pdf")
		 {
		    if(e.target.files[0].size/1024<=1024)
		      	 {
		      	 console.log("file is ok and size is  :"+e.target.files[0].size/1024+"kbs");
		      	 }
		    else {
			      alert("file size not allowed");	
			      $("#docFile").val("");
			      $("#docFile").focus();
		     	 }
		 }
	   else
       {
        alert("only pdf files are allowed");
        $("#docFile").val("");
	    $("#docFile").focus();
       }
	   },
	   docupload:function()
	   {
		 if($('#docFile').val() !="")
		   {
	   $("#dlink").show();
	   $('#dlink').html("<a href='#' id='imagelink'>"+"viewdocument"+"</a>");
	      return true;
		   }
	   else{
		   alert("select document to upload");
		   return false;
	       }
	   },
	   imagelink:function()
	   {
		  $.ajax({
			    url:'api/wines',
		        type: 'POST', 
		        data: { image:this.val },
		        success: function(data) 
		        {
		             $('#testing').attr('src',"data:;base64,"+data);
		        	//window.open("pics/sample.pdf");   
		        }
		    });
	   }
});