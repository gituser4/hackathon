var TAB_KEY = 'campaignShowTab';

Template.campaign.onCreated(function() {
  if (Router.current().params.activityId)
    Template.campaign.setTab('feed');
  else
    Template.campaign.setTab('campaign');
});

Template.campaign.onRendered(function () {
  this.$('.campaign').touchwipe({
    wipeDown: function () {
      if (Session.equals(TAB_KEY, 'campaign'))
        Template.campaign.setTab('make')
    },
    preventDefaultEvents: false
  });
  this.$('.attribution-campaign').touchwipe({
    wipeUp: function () {
      if (! Session.equals(TAB_KEY, 'campaign'))
        Template.campaign.setTab('campaign')
    },
    preventDefaultEvents: false
  });
});

// CSS transitions can't tell the difference between e.g. reaching
//   the "make" tab from the expanded state or the "feed" tab
//   so we need to help the transition out by attaching another
//   class that indicates if the feed tab should slide out of the
//   way smoothly, right away, or after the transition is over
Template.campaign.setTab = function(tab) {
  var lastTab = Session.get(TAB_KEY);
  Session.set(TAB_KEY, tab);
  
  var fromCampaign = (lastTab === 'campaign') && (tab !== 'campaign');
  $('.feed-scrollable').toggleClass('instant', fromCampaign);

  var toCampaign = (lastTab !== 'campaign') && (tab === 'campaign');
  $('.feed-scrollable').toggleClass('delayed', toCampaign);
}

Template.campaign.helpers({
  isActiveTab: function(name) {
    return Session.equals(TAB_KEY, name);
  },
  activeTabClass: function() {
    return Session.get(TAB_KEY);
  },
  bookmarked: function() {
    return Meteor.user() && _.include(Meteor.user().bookmarkedCampaignNames, this.name);
  },
  activities: function() {
    return Activities.find({campaignName: this.name}, {sort: {date: -1}});
  }
});

Template.campaign.events({
  'click .js-add-bookmark': function(event) {
    event.preventDefault();

    if (! Meteor.userId())
      return Overlay.open('authOverlay');
    
    Meteor.call('bookmarkCampaign', this.name);
  },

  'click .js-remove-bookmark': function(event) {
    event.preventDefault();

    Meteor.call('unbookmarkCampaign', this.name);
  },
  
  'click .js-show-campaign': function(event) {
    event.stopPropagation();
    Template.campaign.setTab('make')
  },
  
  'click .js-show-feed': function(event) {
    event.stopPropagation();
    Template.campaign.setTab('feed')
  },
  
  'click .js-uncollapse': function() {
    Template.campaign.setTab('campaign')
  },

  'click .js-share': function() {
    Overlay.open('shareOverlay', this);
  }
});
