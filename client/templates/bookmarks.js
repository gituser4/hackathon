Template.bookmarks.helpers({
  campaignCount: function() {
    return pluralize(this.length, 'campaign');
  }
});
