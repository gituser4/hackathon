var FEATURED_COUNT = 4;

Template.home.helpers({
  // selects FEATURED_COUNT number of campaigns at random
  featuredCampaigns: function() {
    var campaigns = _.values(CampaignsData);
    var selection = [];
    
    for (var i = 0;i < FEATURED_COUNT;i++)
      selection.push(campaigns.splice(_.random(campaigns.length - 1), 1)[0]);

    return selection;
  },
  
  activities: function() {
    return Activities.latest();
  },
  
  latestNews: function() {
    return News.latest();
  }
});
