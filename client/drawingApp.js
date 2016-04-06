points = new Meteor.Collection('pointsCollection');
var canvas;

// we use these for drawing more interesting shapes
var lastX=0;
var lastY=0;
var strokeWidth = 1;
var thickness=1;
var strokeColor = "black";

Meteor.startup( function() {
  canvas = new Canvas();

  Deps.autorun( function() {
    var data = points.find({}).fetch();

    if (canvas) {
      canvas.draw(data);
    }
  });
});

Template.wall.events({

  "click button.clear": function (event) {
    Meteor.call('clear', function() {
      canvas.clear();
    });
  },

  //choose a color. Initialise the last vals, otherwise a stray line will appear.

  "click button.red": function () {
    lastX=0;
    lastY=0;
    strokeColor = "red";
  },

  "click button.black": function () {
    lastX=0;
    lastY=0;
    strokeColor = "black";
  },

  "click button.white": function () {
    lastX=0;
    lastY=0;
    strokeColor = "white";
  },

  "click button.blue": function () {
    lastX=0;
    lastY=0;
    strokeColor = "blue";
  },

  "click button.green": function () {
    lastX=0;
    lastY=0;
    strokeColor = "green";
  },

  "click button.thicker": function () {

    thickness+=1;

  },

  "click button.thinner": function () {

    if (thickness > 0) {
      thickness-=1;
    }
  },

  "click button.circle": function () {
    Session.set("stroke","circle");
  },

  "click button.line": function () {
    Session.set("stroke","line");
  },

});

var markPoint = function() {

  var offset = $('#canvas').offset();

// In the first frame, lastX and lastY are 0.
// This means the line gets drawn to the top left of the screen
// Which is annoying, so we test for this and stop it happening.

      if (lastX===0) {// check that x was something not top-left. should probably set this to -1
        lastX = (event.pageX - offset.left);
        lastY = (event.pageY - offset.top);
      }
      if (Session.get("stroke") === "circle") {
        points.insert({
          circleX: (event.pageX - offset.left),
          circleY: (event.pageY - offset.top),
          w: thickness,
          c: strokeColor,
        });
      }else if (Session.get("stroke") === "line") {
        points.insert({
          lineX: (event.pageX - offset.left),
          lineY: (event.pageY - offset.top),
          lineX1: lastX,
          lineY1: lastY,
          w: thickness,
          c: strokeColor,
        });
      }


        lastX = (event.pageX - offset.left);
        lastY = (event.pageY - offset.top);

};

Template.canvas.events({
  'click': function (event) {
    markPoint();
  },
  'mousedown': function (event) {
    Session.set('draw', true);
    lastX=0;
    lasyY=0;
  },
  'mouseup': function (event) {
    Session.set('draw', false);
    lastX=0;
    lasyY=0;
  },
  'mousemove': function (event) {
    if (Session.get('draw')) {
      markPoint();
    }
  }
});
