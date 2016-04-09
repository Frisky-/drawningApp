points = new Meteor.Collection('pointsCollection');
var canvas;

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});
Router.route('/',function () {
  this.render("home");
});
Router.route("/drawing",function () {
  this.render("wall");
});
// we use these for drawing more interesting shapes
var lastX = 0;
var lastY = 0;
var strokeWidth = 1;
var thickness = 5;
var strokeColor = "black";

Meteor.startup(function() {
    canvas = new Canvas();

    Deps.autorun(function() {
        var data = points.find().fetch();

        if (canvas) {
            canvas.draw(data);
        }
    });
});

Template.wall.rendered = function() {
    $("#cp2").colorpicker();
    $("#cp2").colorpicker("setValue", "#000000");
    $("#cp2").colorpicker().on('changeColor', function(ev) {
        strokeColor = $("#cp2").colorpicker('getValue');
    });
    $("#ex1").slider();
    $("#ex1").slider().on('slide',function (ev) {
      thickness = ev.value;
    });
    document.getElementsByClassName("clear")[0].click();
    document.getElementsByClassName("line")[0].click();
};

Template.wall.events({
    "click button.clear": function(event) {
        Meteor.call('clear', function() {
            canvas.clear();
        });
    },"click button.save":function (event) {
      Meteor.call('save',function () {
        canvas.save();
      });
    },

    //choose a color. Initialise the last vals, otherwise a stray line will appear.

    "click button.circle": function(event) {
        Session.set("stroke", "circle");
    },

    "click button.line": function(event) {
        Session.set("stroke", "line");
    }
});

var markPoint = function() {

    var offset = $('#canvas').offset();

    // In the first frame, lastX and lastY are 0.
    // This means the line gets drawn to the top left of the screen
    // Which is annoying, so we test for this and stop it happening.

    if (lastX === 0) { // check that x was something not top-left. should probably set this to -1
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
    } else if (Session.get("stroke") === "line") {
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
    'click': function(event) {
        markPoint();
    },
    'mousedown': function(event) {
        Session.set('draw', true);
        lastX = 0;
        lasyY = 0;
    },
    'mouseup': function(event) {
        Session.set('draw', false);
        lastX = 0;
        lasyY = 0;
    },
    'mousemove': function(event) {
        if (Session.get('draw')) {
            markPoint();
        }
    }
});
