Canvas = function () {
  var self = this;
  var svg;

  var createSvg = function() {
    svg = d3.select('#canvas').append('svg')
      .attr('width', 800)
      .attr('height',600);
  };
  createSvg();

  self.clear = function() {
    d3.select('svg').remove();
    createSvg();
  };

  self.draw = function(data) {
    if (data.length < 1) {
      self.clear();
      return;
    }
    if (svg) {

        // Remember to format the data properly in markPoints

        // to draw a circle -
        if(Session.get('stroke') === 'circle'){
          svg.selectAll('circle').data(data, function(d) { return d._id; })
          .enter().append('circle')
          .attr('r', function (d) { return d.w; })
          .attr('fill', function (d) {return d.c; })
          .attr('cx', function (d) { return d.circleX; })
          .attr('cy', function (d) { return d.circleY; });
        }else if (Session.get('stroke') === 'line') {
          //to draw a line
          svg.selectAll('line').data(data, function(d) { return d._id; })
          .enter().append('line')
          .attr('x1', function (d) { return d.lineX; })
          .attr('y1', function (d) { return d.lineY; })
          .attr('x2', function (d) { return d.lineX1; })
          .attr('y2', function (d) { return d.lineY1; })
          .attr("stroke-width", function (d) { return d.w; })
          .attr("stroke", function (d) { return d.c; })
          .attr("fill", function (d) { return d.c})
          .attr("stroke-linejoin", "round");
        }

    } // end of the if(svg) statement
  }; // end of the canvas.draw function
}; //end of the canvas function
