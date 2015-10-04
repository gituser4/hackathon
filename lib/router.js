var feedSubscription;

// Handle for launch screen possibly dismissed from app-body.js
dataReadyHold = null;

// Global subscriptions
if (Meteor.isClient) {
  Meteor.subscribe('news');
  Meteor.subscribe('bookmarkCounts');
  feedSubscription = Meteor.subscribe('feed');
}

Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();
}

HomeController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('latestActivity', function () {
      dataReadyHold.release();
    });
  }
});

FeedController = RouteController.extend({
  onBeforeAction: function () {
    this.feedSubscription = feedSubscription;
  }
});

CampaignsController = RouteController.extend({
  data: function () {
    return _.values(CampaignsData);
  }
});

BookmarksController = RouteController.extend({
  onBeforeAction: function () {
    if (Meteor.user())
      Meteor.subscribe('bookmarks');
    else
      Overlay.open('authOverlay');
  },
  data: function () {
    if (Meteor.user())
      return _.values(_.pick(CampaignsData, Meteor.user().bookmarkedCampaignNames));
  }
});

CampaignController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('campaign', this.params.name);
  },
  data: function () {
    return CampaignsData[this.params.name];
  }
});

AdminController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('news');
  }
});

Router.route('home', {
  path: '/'
});

Router.route('feed');

Router.route('campaigns');

Router.route('bookmarks');

Router.route('about');

Router.route('campaign', {
  path: '/campaigns/:name'
});

Router.route('admin', {
  layoutTemplate: null
});

Router.onBeforeAction('dataNotFound', {
  only: 'campaign'
});
