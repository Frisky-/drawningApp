Canvas = function () {
  var self = this;
  var svg;

  var createSvg = function() {
    svg = d3.select('#canvas').append('svg')
    .attr("width","980")
    .attr("height","500px");
  };
  createSvg();

  self.clear = function() {
    d3.select('svg').remove();
    createSvg();
  };

  self.save = function () {
      var html = d3.select("svg")
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node().parentNode.innerHTML;
      // console.log(html
      var width = $(svg)[0][0].getBoundingClientRect().width;
      var height = $(svg)[0][0].getBoundingClientRect().height;
      var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
      var img = '<img src="'+imgsrc+'">';
      var canvas = document.querySelector("canvas");
      canvas.width = width;
      canvas.height = height;
	    var context = canvas.getContext("2d");
      var image = new Image;
      image.src = imgsrc;


  	  var canvasdata = canvas.toDataURL("image/png");

  	  var pngimg = '<img src="'+canvasdata+'">';
      context.drawImage(image,0,0,width,height);
  	  var a = document.createElement("a");
  	  a.download = "sample.png";
  	  a.href = canvasdata;
  	  a.click();
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
          .attr("fill", function (d) { return d.c;})
          .attr("stroke-linejoin", "round");
        }

    } // end of the if(svg) statement
  }; // end of the canvas.draw function
}; //end of the canvas function
