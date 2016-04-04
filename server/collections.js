points = new Mongo.Collection("pointsCollection");

Meteor.methods({
  'clear': function () {
    points.remove({});
  }
});
