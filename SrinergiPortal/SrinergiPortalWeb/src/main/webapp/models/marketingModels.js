window.marketingSearchModel=Backbone.Model.extend({
	urlRoot:"rest/mrktContent/search",
	defauts:{
		effectiveFrom:'',
		effectiveTo:'',
		role:'',
		status:'',
		searchTitle:''
    	}
});
window.pageSearchModel=Backbone.Model.extend({
	urlRoot:"rest/pageHelp/search",
	defauts:{
		status:'',
		portal:'',
		module:'',
		page:'',
		searchTitle:''
    	}
});
window.controlSearchModel=Backbone.Model.extend({
	urlRoot:"rest/controlhelp/search",
	defauts:{
		status:'',
		portal:'',
		module:'',
		page:'',
		searchTitle:''
    	}
});
 window.controlModel=Backbone.Model.extend({
	 defaults:
		 {
		 controlName:'',
		 controlHelp:'',
		 },
 });
 window.commonControlModel=Backbone.Model.extend({
	     urlRoot:"rest/commonControlhelp",
		 defaults:
			 {
			 id:null,
			 controlName:'',
			 controlHelp:'',
		     status:''
			 },
			 getAttributeNames:function()
		        {
		        	return "controlName,controlHelp,status";
		        }

	 });
 
 
 window.commonControlCollection=Backbone.Collection.extend({
	    url:"rest/commonControlhelp",
		model:commonControlModel
	});
 
window.controlCollection=Backbone.Collection.extend({
	model:controlModel
});

window.announcementsSearchModel=Backbone.Model.extend({
	urlRoot:"rest/announcement/search",
	defauts:{
		effectiveFrom:'',
		effectiveTo:'',
		role:'',
		roleType:'',
		status:'',
		searchTitle:''
    	}
});
window.newsSearchModel=Backbone.Model.extend({
	urlRoot:"rest/news/search",
	defauts:{
		effectiveFrom:'',
		effectiveTo:'',
		role:'',
		roleType:'',
		status:'',
		searchTitle:''
    	}
});
window.marketingDetailsModel=Backbone.Model.extend({
	initialize:function()
	{
		this.bind("backgrid:selected",this.select,this);
		this.bind("change",this.change,this)
	},
	change:function()
	{
		console.log("change in model"+JSON.stringify(this));
	},
	select:function()
	{
		console.log("selected model is   :"+JSON.stringify(this));
	},
	urlRoot:"rest/mrktContent",
	defaults:
		{
		 contentType:'',
		 status:'',
		 role:'',
		 desc:'',
		 title:'',
		 docUrl:'',
		 imageUrl:'',
		 effectiveFrom:'',
		 effectiveTo:'',
		 userId:null,
		 id:null,
		},
		getAttributeNames:function()
		{
			return "status,role,desc,title,docUrl,imageUrl,effectiveFrom,effectiveTo";
		},
		});
window.announcementsDetailsModel=Backbone.Model.extend({
	urlRoot:"rest/announcement",
	defaults:
		{
		 contentType:'',
		 status:'',
		 role:'',
		 roleType:'',
		 desc:'',
		 title:'new title',
		 docUrl:'',
		 effectiveFrom:'',
		 effectiveTo:'',
		 userId:null,
		 id:null,
		},
		getAttributeNames:function()
		{
			return "status,desc,title,docUrl,effectiveFrom,effectiveTo";
		}
});
window.newsDetailsModel=Backbone.Model.extend({
	urlRoot:"rest/news",
	defaults:
		{
		 contentType:'',
		 status:'',
		 role:'',
		 roleType:'',
		 desc:'',
		 title:'news title',
		 docUrl:'',
		 effectiveFrom:'',
		 effectiveTo:'',
		 userId:null,
		 id:null,
		},
		getAttributeNames:function()
		{
			return "status,roleType,desc,title,docUrl,effectiveFrom,effectiveTo";
		}
		
});
window.pageDetailsModel=Backbone.Model.extend({
	urlRoot:"rest/pageHelp",
	defaults:
		{
		title:null,
		desc:null,
		docUrl:'',
		status:'',
		page:'',
		module:'',
		portal:'',
		contentType:'',
		id:null
        },
        getAttributeNames:function()
        {
        	return "title,desc,docUrl,status,page,module,portal";
        }
		});
window.pageHelpModel=Backbone.Model.extend({
	urlRoot:"rest/controlhelp",
	defaults:
		{
		title:null,
		desc:null,
		status:'',
		page:'',
		module:'',
		portal:'',
		contentType:'',
		id:null
	  },
});

window.marketingDetailsCollection=Backbone.Collection.extend({
	url:"rest/mrktContent",
	model:marketingDetailsModel
});
window.pageDetailsCollection=Backbone.Collection.extend({
	url:"rest/pageHelp",
	model:pageDetailsModel
});
window.annoncementsDetailsCollection=Backbone.Collection.extend({
	url:"rest/announcement",
	model:announcementsDetailsModel
});
window.newsDetailsCollection=Backbone.Collection.extend({
	url:"rest/news",
	model:newsDetailsModel
});
window.pageHelpCollection=Backbone.Collection.extend({
	url:"rest/controlhelp",
	model:pageHelpModel
});
var gridModel=Backbone.Model.extend({
	url : "rest/mrktContent/statusUpdate",
	defaults:
	{
		id:null,
		button:''
	}
});