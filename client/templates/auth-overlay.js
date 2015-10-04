// If the auth overlay is on the screen but the user is logged in,
//   then we have come back from the loginWithTwitter flow,
//   and the user has successfully signed in.
//
// We have to use an autorun for this as callbacks get lost in the
//   redirect flow.
Template.authOverlay.onCreated(function() {
  this.autorun(function() {
    if (Meteor.userId() && Overlay.template() === 'authOverlay')
      Overlay.close();
  });
});

Template.authOverlay.events({
  'click .btn-twitter': function() {
    Meteor.loginWithTwitter({}, function(err){
      if (err) {
        throw new Meteor.Error("Twitter login failed");
      }
    });
  },

  'click .btn-google': function() {
    Meteor.loginWithGoogle({}, function(err){
      if (err) {
        throw new Meteor.Error("Google login failed");
      }
    });
  },

  'click .btn-facebook': function() {
    Meteor.loginWithFacebook({}, function(err){
      if (err) {
        throw new Meteor.Error("Facebook login failed");
      }
    });
  }
});
