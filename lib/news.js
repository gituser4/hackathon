News = new Mongo.Collection('news');

News.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return user && user.admin;
  }
});

News.latest = function() {
  return News.findOne({}, {sort: {date: -1}, limit: 1});
}

if (Meteor.isServer && News.find().count() === 0) {
  Meteor.startup(function() {
    News.insert({
      text: 'We have newly started the ability to start and create campaignss for donors! Check out all the latest campaigns, activities and share with your friends!',
      date: new Date
    });
  });
}
