BookmarkCounts = new Mongo.Collection('bookmarkCounts');

Meteor.methods({
  'bookmarkCampaign': function(campaignName) {
    check(this.userId, String);
    check(campaignName, String);

    var affected = Meteor.users.update({
      _id: this.userId,
      bookmarkedCampaignNames: {$ne: campaignName}
    }, {
      $addToSet: {bookmarkedCampaignNames: campaignName}
    });

    if (affected)
      BookmarkCounts.update({campaignName: campaignName}, {$inc: {count: 1}});
  },

  'unbookmarkCampaign': function(campaignName) {
    check(this.userId, String);
    check(campaignName, String);

    var affected = Meteor.users.update({
      _id: this.userId,
      bookmarkedCampaignNames: campaignName
    }, {
      $pull: {bookmarkedCampaignNames: campaignName}
    });

    if (affected)
      BookmarkCounts.update({campaignName: campaignName}, {$inc: {count: -1}});
  }
});

// Initialize bookmark counts. We could use upsert instead.
if (Meteor.isServer && BookmarkCounts.find().count() === 0) {
  Meteor.startup(function() {
    _.each(CampaignsData, function(campaign, campaignName) {
      BookmarkCounts.insert({campaignName: campaignName, count: 0});
    });
  });
}
