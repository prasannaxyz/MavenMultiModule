var appRegion = new Marionette.Region({
	  el: '#applicationRegion'
	});
ApplactionLayout = Backbone.Marionette.Layout.extend({
	  template: "#maincontainer",
	  regions: {
		header:"#header",
	    sidebar : "#sidebarcontainer",
	    content: "#content",
	    footer:"#footer"
	           }
	});

SideBarLayout = Backbone.Marionette.Layout.extend({
	  template: "#sidebarlayout",
	  regions: {
		  marketingmessages:"#marketingmessages",
		  todos:"#todos",
		  contactus:"#contactus",
		  help:"#help",
	           }
	          });
appLayout=new ApplactionLayout();
appRegion.show(appLayout);
DashboardLayout = Backbone.Marionette.Layout.extend({
	  template: "#dashboardLayout",
	  regions: {
		  myreviews:"#myreviews",
		  quicklinks:"#quicklinks",
		  myalerts:"#myalerts",
		  mynews:"#mynews",
		  calender:"#calender",
		  otherinformation:"#otherinformation"
	           }
	});
var AppRouter=Backbone.Router.extend({
	initialize:function()
	{
    	this.menusbefore(function()
			    {
	    	 sidebarLayout=new SideBarLayout();
			 appLayout.sidebar.show(sidebarLayout);
		     appLayout.footer.show(new footerTemplateView());
	     	 sidebarLayout.marketingmessages.show(new marketingMessagesView());
			 sidebarLayout.todos.show(new todosView());
			 sidebarLayout.contactus.show(new contactUsView());
			 sidebarLayout.help.show(new helpView());
			 appLayout.header.show( new headerView({collection:app.menulist}));
				});
	},
	routes:
	{   
		""				  		 :"dashboard",
		"content/marketing"		 :"marketing",
		"content/pagecontrolhelp":"pagehelp",
		"content/announce"		 :"announcements",
		"content/news"    		 :"news",
		"content/pages"   		 :"page",
		"dashboard"		  		 :"dashboard",
		"usermanagement"  		 : "usermanagement",
		"registration"    		 : "registrationmanagement",
		"logout"          		 : "logout",
		"resetpass"		  		 : "passwordreset"
	},
	
	dashboard:function()
	{
	
		 appLayout.content.close();
		 dashboardLayout=new DashboardLayout();
		 appLayout.content.show(dashboardLayout);
		 dashboardLayout.myreviews.show(new MyRevenuesView());
		 dashboardLayout.quicklinks.show(new QuickLinksView());
		 dashboardLayout.myalerts.show(new MyAlertsView());
		 dashboardLayout.mynews.show(new NewsView());
		 dashboardLayout.calender.show(new CalendarView());
		 dashboardLayout.otherinformation.show(new OtherInformationView());
	},
	
	usermanagement : function(){
		appLayout.content.close();
		$.ajax({
			type : "GET",
			url : "rest/umgmt/userdetails",
			success : function(response) {
 			var usercollection = new usermanagementCollection(response);
			var userview = new userManagementView({collection : usercollection});
			appLayout.content.show(userview);
			}
		});
	},
	
  registrationmanagement : function(){
	appLayout.content.close();
	$.ajax({
			type : "GET",
			url : "rest/rmgmt/registrationDetails",
			success : function(response) {
				var regcollection = new registerCollection(response);
				var regview = new registrationManagementView({collection: regcollection});
			    appLayout.content.show(regview);
			   }
			});
	 },
	 
		logout: function(){
			$.ajax({
				type : "POST",
				url : "rest/profset/signout",
				success : function(response) {
						$.removeCookie("authtoken");
						$.removeCookie("firstName");
						$.removeCookie("lastName");
						$.removeCookie("lastLogin");
						$.removeCookie("role");
				    	window.location = "login.html";
				},
				error : function(){
					$.removeCookie("authtoken");
					$.removeCookie("firstName");
					$.removeCookie("lastName");
					$.removeCookie("lastLogin");
					$.removeCookie("role");
			    	window.location = "login.html";
				}
			});
		},
		
	passwordreset : function(){
		appLayout.content.show(new resetPassView({model:new passResetModel()}));
	},
	
	pagehelp:function()
	{
	    	$("#docId").val("");
    		$("#imageId").val("");
			this.before4(function()
				{
				
					 	 var view1=new pageHelpView({collection:app.test,collction:app.loadlist});
					 	 appLayout.content.close();
						 appLayout.content.show(view1);
     		   });
	},
	page:function(){
		$("#docId").val("");
		$("#imageId").val("");
		this.before3(function()
				{
						 var view1=new pageView({collection:app.test,collction:app.loadlist,model:new pageDetailsModel()});
						 appLayout.content.close();
			 			 appLayout.content.show(view1);
			    });
	},
	news:function()
	{
		$("#docId").val("");
		$("#imageId").val("");
		this.before2(function()
				{
				   var view1=new newsView({collection:app.test,collction:app.loadlist});
				   appLayout.content.close();
			       appLayout.content.show(view1);
			   	});
	},
	announcements:function()
	{
		$("#docId").val("");
		$("#imageId").val("");
		this.before1(function()
				{
				  var view1=new announcementsView({collection:app.test,collction:app.loadlist});
				  appLayout.content.close();
				  appLayout.content.show(view1);
				});
	},
	marketing:function()
	{
		$("#docId").val("");
		$("#imageId").val("");
		this.before(function()
				{
			           var view1=new marketingView({collection:app.test,collction:app.loadlist, model:new marketingDetailsModel()});
			           appLayout.content.close();
					   appLayout.content.show(view1);
				});
   },
    menusbefore: function(callback)
   {
		$.ajaxSetup({
			beforeSend : function(xhr) {
			xhr.setRequestHeader("token", $.cookie("authtoken"));
		}
		});
   	if (this.wineList)
       {
           if (callback) callback();
       }
       else 
       {
       	this.menulist=new MenuCollection();
       	this.menulist.url="rest/menus?userId=1";
       	this.menulist.fetch({success: function(response) 
      		{
       	              if (callback) callback();
           },
   		error:function()
   		{
   			//alert("error boss");
   		}
       	});
       }
      },
	    before: function(callback)
	    {
	    	
	    	$.ajax({
				type : "GET",
				url	 : "rest/onLoadCont?userId=1&contentType=MARK",
				//data : {Role : roletype},
				success : function(response)
				{
					app.loadlist = response;
				   	var resp =app.loadlist;
					var mlist = resp.contentInfo;
					var meslist = new Array();
					for(var i=0;i<mlist.length;i++)
					{
						meslist[i] = mlist[i];
					}
				    app.test=new marketingDetailsCollection(meslist);
					if (callback) callback();
				},
				error:function(error)
	    		{
	    			alert("error");
	    		}
			});
	   },
	   before3: function(callback)
	    {
		   
		   $.ajax({
				type : "GET",
				url	 : "rest/onLoadCont?userId=1&contentType=PAGEHELP",
				//data : {Role : roletype},
				success : function(response)
				{
					app.loadlist = response;
				   	var resp =app.loadlist;
					var mlist = resp.contentInfo;
					var meslist = new Array();
					for(var i=0;i<mlist.length;i++)
					{
						meslist[i] = mlist[i];
					}
				    app.test=new pageDetailsCollection(meslist);
					if (callback) callback();
				},
				error:function(error)
	    		{
	    			alert("error");
	    		}
			});
	   },
	   before4: function(callback)
	    {
	    	
	    	$.ajax({
				type : "GET",
				url	 : "rest/onLoadCont?userId=1&contentType=CONTROLHELP",
				//data : {Role : roletype},
				success : function(response)
				{
					app.loadlist = response;
				   	var resp =app.loadlist;
					var mlist = resp.contentInfo;
					var meslist = new Array();
					for(var i=0;i<mlist.length;i++)
					{
						meslist[i] = mlist[i];
					}
				    app.test=new pageHelpCollection(meslist);
					if (callback) callback();
				},
				error:function(error)
	    		{
	    			alert("error");
	    		}
			});
	   },
	   before1: function(callback)
	    {
		   $.ajax({
				type : "GET",
				url	 : "rest/onLoadCont?userId=1&contentType=ANNOUNCE",
				//data : {Role : roletype},
				success : function(response)
				{
     				app.loadlist = response;
				   	var resp =app.loadlist;
					var mlist = resp.contentInfo;
					var meslist = new Array();
					for(var i=0;i<mlist.length;i++)
					{
						meslist[i] = mlist[i];
					}
				    app.test=new annoncementsDetailsCollection(meslist);
					if (callback) callback();
				},
				error:function(error)
	    		{
	    			alert("error");
	    		}
			});
	     },
	     before2: function(callback)
		    {
	    	 $.ajax({
					type : "GET",
					url	 : "rest/onLoadCont?userId=1&contentType=NEWS",
					//data : {Role : roletype},
					success : function(response)
					{
						app.loadlist = response;
					   	var resp =app.loadlist;
						var mlist = resp.contentInfo;
						var meslist = new Array();
						for(var i=0;i<mlist.length;i++)
						{
							meslist[i] = mlist[i];
						}
					    app.test=new newsDetailsCollection(meslist);
						if (callback) callback();
					},
					error:function(error)
		    		{
		    			alert("error");
		    		}
				});
		     }
});
app = new AppRouter();
Backbone.history.start({pushState: false});