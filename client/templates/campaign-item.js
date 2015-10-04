Template.campaignItem.helpers({
  path: function () {
    return Router.path('campaign', this.campaign);
  },
  
  highlightedClass: function () {
    if (this.size === 'large')
      return 'highlighted';
  },
  
  bookmarkCount: function () {
    var count = BookmarkCounts.findOne({campaignName: this.name});
    return count && count.count;
  }
});
