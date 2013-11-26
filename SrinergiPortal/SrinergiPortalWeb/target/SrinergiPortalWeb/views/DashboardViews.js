window.MenuCollection=Backbone.Collection.extend({});
window.headerView=Backbone.View.extend({
   initialize: function() 
    {
    	  this.template = _.template($('#headertemplate').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	this.menus2();
    	this.$('#uname').append("Welcome,"+" "+$.cookie("firstName")+" "+$.cookie("lastName")+"<b class='caret'></b>");
       	return this;
   	},
   	events:
   	{
   	"click #announce":"announcements"	
   	},
   	announcements:function()
   	{
   	$('.dropdownwrap').slideToggle();
   	},
menus2:function()
{
	    var menus="";
	   	 var root1=new MenuCollection(this.collection.where({levelId: 0}));
	   	 var first=new MenuCollection();
	   	 for(var i=1;i<=root1.size();i++)
	   		 {
              first.add(root1.where({menuPostion: i}));
             }
        for(var i=1;i<=first.size();i++)
        	{
        	    var temp=first.where({menuPostion: i});
        	    if(temp[0].toJSON().url !="NULL")
        	    	{
        	      	menus=menus+"<li><a href=#"+temp[0].toJSON().url+">"+temp[0].toJSON().categoryDesc+"</a></li>";
        	        }
        	    else
        	    	{
        	    	menus=menus+"<li><a href='#'>"+temp[0].toJSON().categoryDesc+"&nbsp;&dArr;</a><ul>";
        	    	var subroot=new MenuCollection(this.collection.where({parent_Category:temp[0].toJSON().categoryCode}));
        	    	var second=new MenuCollection();
        	    	for(var k=1;k<=subroot.size();k++)
        	    		{
        	    		second.add(subroot.where({menuPostion:k}));
        	    		}
        	    	for(var j=1;j<=second.size();j++)
        	    	{
         	        	var temp1=second.where({menuPostion: j});
        	    		if(temp1[0].toJSON().url !="NULL")
        	    			{
        	    			
        	    	      	 menus=menus+"<li><a href=#"+temp1[0].toJSON().url+">"+temp1[0].toJSON().categoryDesc+"</a></li>";
        	    			}
        	    		else
        	    		{
        	    			
        	    			menus=menus+"<li><a href='#'>"+temp1[0].toJSON().categoryDesc+"&nbsp;&rArr;</a><ul>";
        	    			var thirdroot=new MenuCollection(this.collection.where({parent_Category:temp1[0].toJSON().categoryCode}));
        	    			var third=new MenuCollection();
        	    			for(var n=1;n<=thirdroot.size();n++)
            	    		{
        	    			 third.add(thirdroot.where({menuPostion:n}));
            	    		}
        	        		  for(var m=1;m<=third.size();m++)
        	    				{
        	    				var temp2=third.where({menuPostion:m});
        	    				menus=menus+"<li><a href=#"+temp2[0].toJSON().url+">"+temp2[0].toJSON().categoryDesc+"</a></li>";
        	    				}
        	    			menus=menus+"</ul></li>";
        	    		}
        	    	}
        	    	menus=menus+"</ul></li>";
                  }
        	}
	   	this.$('#nav').append(menus);
	    
}
});
window.MyRevenuesView=Backbone.View.extend({
    initialize: function() 
    {
    	  this.template = _.template($('#MyRevenues').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	return this;
   	},
});
window.QuickLinksView=Backbone.View.extend({
    initialize: function() 
    {
    	  this.template = _.template($('#QuickLinks').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	return this;
   	},
});
window.MyAlertsView=Backbone.View.extend({
    initialize: function() 
    {
    	  this.template = _.template($('#MyAlerts').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	return this;
   	},
});

window.NewsView=Backbone.View.extend({
    initialize: function() 
    {
    	  this.template = _.template($('#News').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	return this;
   	},
});

window.CalendarView=Backbone.View.extend({
    initialize: function() 
    {
    	  this.template = _.template($('#Calendar').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	return this;
   	},
});

window.OtherInformationView=Backbone.View.extend({
    initialize: function() 
    {
    	  this.template = _.template($('#OtherInformation').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	return this;
   	},
});
/*Side bar views start here*/
window.marketingMessagesView=Backbone.View.extend({
    initialize: function() 
    {
    	  this.template = _.template($('#marketingMessages').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	return this;
   	},
});

window.todosView=Backbone.View.extend({
    initialize: function() 
    {
    	  this.template = _.template($('#todos').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	return this;
   	},
});

window.contactUsView=Backbone.View.extend({
    initialize: function() 
    {
    	  this.template = _.template($('#contactUs').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	return this;
   	},
});
window.helpView=Backbone.View.extend({
    initialize: function() 
    {
    	  this.template = _.template($('#help').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	return this;
   	},
});
window.footerTemplateView=Backbone.View.extend({
    initialize: function() 
    {
    	  this.template = _.template($('#footerTemplate').html());
    },
    render: function(eventName)
    {
    	$(this.el).html(this.template());
    	return this;
   	},
});


























