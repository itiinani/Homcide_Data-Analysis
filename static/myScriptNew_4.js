
w=700
h=500
padding = 50

drawScreePlots("../static/random_scree_plot.csv");
makePlots("../static/random_pca.csv","pink","#PCA");
makePlots("../static/random_mds_euclidean.csv","blue","#mdsE");
drawBarChart("../static/pcaLoading_random_pca.csv");
//drawScatterPlotMatrix("../static/feature_random_pca.csv");

function makePlots(filename,color,ID) {
    d3.selectAll('svg > g > *').remove();
    d3.csv(filename, function(error, data) {

		  if (error) throw error;


    var svg = d3.select("body").select(ID).selectAll("svg"),
    margin = {top: 30, right: 30, bottom: 30,left:60},

    width = 900
    height = 600
    var svg = d3.select("body").select(ID).selectAll("svg")
    g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.style("height",600)
  svg.style("width",600)
  svg.style("padding-left",45)
    data.forEach(function(d) {
      d.Component1 = +d.Component1;

      d.Component2 = +d.Component2;

  });

  var max_value_x = d3.max(data, function(d) {
        return d.Component1;
      });
var min_value_x = d3.min(data, function(d) {
        return d.Component1;
      });
var max_value_y = d3.max(data, function(d) {
        return d.Component2;
      });
var min_value_y = d3.min(data, function(d) {
        return d.Component2;
      });

var x_scale = d3.scaleLinear().domain([(min_value_x), (max_value_x) ]).rangeRound([padding,w -padding]);
var y_scale = d3.scaleLinear().domain([(min_value_y), (max_value_y) ]).rangeRound([h-padding,padding])

    var x = d3.scaleLinear().range([0, 700]).domain([d3.min(data, function(d) { return d.Component1; }),d3.max(data, function(d) { return d.Component1; })]);
    var y = d3.scaleLinear().range([500, 0]).domain([d3.min(data, function(d) { return d.Component2; }),d3.max(data, function(d) { return d.Component2; })]);


  //var color = d3.scaleOrdinal(d3.schemeCategory20b);
  // Add the scatterplot
  g.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 2)
      .attr("cx", function(d) {
          return x_scale(d.Component2); })
      .attr("cy", function(d) {
          debugger;
          return y_scale(d.Component1); })
   .style("fill", color);
   //.style ("stroke", #fff;"stroke-width",1.5px;")

  // Add the X Axis
  g.append("g")
      .attr("transform", "translate(-55," + y(0) + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  g.append("g")
       .attr("transform", "translate(" + x(0) + ",0)")
      .call(d3.axisLeft(y));


    g.append("text")
			  .attr("x", x(0) )
			  .attr("y",  y(max_value_y) )
			  .style("text-anchor", "middle")
			  .text("Component 1");

    g.append("text")
			  .attr("y", y(0)+10)
			  .attr("x",x(max_value_x)- 100)
			  .attr("dy", "1em")
			  .style("text-anchor", "middle")
			  .text("Component 2");


        });


}

function makePlotsRandom_Stratified(filename1,filename2) {
    d3.selectAll('svg > g > *').remove();
    d3.csv(filename1, function(error, data) {

		  if (error) throw error;


    var svg = d3.select("svg"),
    margin = {top: 30, right: 30, bottom: 30,left:60},

    width = 700
    height = 500
    g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
      d.Component1 = +d.Component1;

      d.Component2 = +d.Component2;

  });

  var max_value_x = d3.max(data, function(d) {
        return d.Component1;
      });
var min_value_x = d3.min(data, function(d) {
        return d.Component1;
      });
var max_value_y = d3.max(data, function(d) {
        return d.Component2;
      });
var min_value_y = d3.min(data, function(d) {
        return d.Component2;
      });

var x_scale = d3.scaleLinear().domain([(min_value_x), (max_value_x) ]).rangeRound([padding,w -padding]);
var y_scale = d3.scaleLinear().domain([(min_value_y), (max_value_y) ]).rangeRound([h-padding,padding])

    var x = d3.scaleLinear().range([0, 900]).domain([d3.min(data, function(d) { return d.Component1; }),d3.max(data, function(d) { return d.Component1; })]);
    var y = d3.scaleLinear().range([600, 0]).domain([d3.min(data, function(d) { return d.Component2; }),d3.max(data, function(d) { return d.Component2; })]);


  var color = d3.scaleOrdinal(d3.schemeCategory20b);
  // Add the scatterplot
  g.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function(d) {
          return x_scale(d.Component2); })
      .attr("cy", function(d) {
          debugger;
          return y_scale(d.Component1); })
   .style("fill", "steelblue");
   //.style ("stroke", #fff;"stroke-width",1.5px;")

  // Add the X Axis
  g.append("g")
      .attr("transform", "translate(-55," + y(0) + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  g.append("g")
       .attr("transform", "translate(" + x(0) + ",0)")
      .call(d3.axisLeft(y));


    g.append("text")
			  .attr("x", x(0) )
			  .attr("y",  y(max_value_y) )
			  .style("text-anchor", "middle")
			  .text("Component 1");

    g.append("text")
			  .attr("y", y(0)+10)
			  .attr("x",x(max_value_x)- 100)
			  .attr("dy", "1em")
			  .style("text-anchor", "middle")
			  .text("Component 2");


        });
    d3.csv(filename2, function(error, data) {

		  if (error) throw error;


    var svg = d3.select("svg"),
    margin = {top: 30, right: 30, bottom: 30,left:60},

    width = 700
    height = 500
    g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
      d.Component1 = +d.Component1;

      d.Component2 = +d.Component2;

  });

  var max_value_x = d3.max(data, function(d) {
        return d.Component1;
      });
var min_value_x = d3.min(data, function(d) {
        return d.Component1;
      });
var max_value_y = d3.max(data, function(d) {
        return d.Component2;
      });
var min_value_y = d3.min(data, function(d) {
        return d.Component2;
      });

var x_scale = d3.scaleLinear().domain([(min_value_x), (max_value_x) ]).rangeRound([padding,w -padding]);
var y_scale = d3.scaleLinear().domain([(min_value_y), (max_value_y) ]).rangeRound([h-padding,padding])

    var x = d3.scaleLinear().range([0, 900]).domain([d3.min(data, function(d) { return d.Component1; }),d3.max(data, function(d) { return d.Component1; })]);
    var y = d3.scaleLinear().range([600, 0]).domain([d3.min(data, function(d) { return d.Component2; }),d3.max(data, function(d) { return d.Component2; })]);


  var color = d3.scaleOrdinal(d3.schemeCategory20b);
  // Add the scatterplot
  g.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function(d) {
          return x_scale(d.Component2); })
      .attr("cy", function(d) {
          debugger;
          return y_scale(d.Component1); })
   .style("fill", "pink");
   //.style ("stroke", #fff;"stroke-width",1.5px;")




        });


}
function drawScatterPlotMatrix(filename) {
    d3.selectAll('svg > g > *').remove();
    var width = 1050,
    size = 230,
    padding = 20;


var x = d3.scaleLinear()
    .range([padding / 2, size - padding / 2]);

var y = d3.scaleLinear()
    .range([size - padding / 2, padding / 2]);

var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(6);

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(6);

var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv(filename, function(error, data) {
  if (error) throw error;

  var domainByTrait = {},
      traits = d3.keys(data[0]).filter(function(d) { return d !== "species"; }),
      n = traits.length;

  traits.forEach(function(trait) {
    domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
  });

  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  var brush = d3.brush()
      .on("start", brushstart)
      .on("brush", brushmove)
      .on("end", brushend)
      .extent([[0,0],[size,size]]);

  var svg = d3.select("body").select("#scatterPlotMatrix").selectAll("svg")
      .attr("width", 1050)
      .attr("height", 750)
    .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

  svg.selectAll(".x.axis")
      .data(traits)
    .enter().append("g")
      .attr("class", "x axis")
      .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
      .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

  svg.selectAll(".y.axis")
      .data(traits)
    .enter().append("g")
      .attr("class", "y axis")
      .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
      .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

  var cell = svg.selectAll(".cell")
      .data(cross(traits, traits))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

  // Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; }).append("text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(function(d) { return d.x; });

  cell.call(brush);

  function plot(p) {
    var cell = d3.select(this);

    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) {
            if (d[p.x]<0){
                d[p.x]=-d[p.x]
            }
            return x(d[p.x]); })
        .attr("cy", function(d) {
            if (d[p.y]<0){
                d[p.y]=-d[p.y]
            }
            return y(d[p.y]); })
        .attr("r", 4)
        .style("fill", function(d) { return color((p.i+p.j)*500); });
  }

  var brushCell;

  // Clear the previously-active brush, if any.
  function brushstart(p) {
    if (brushCell !== this) {
      d3.select(brushCell).call(brush.move, null);
      brushCell = this;
    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);
    }
  }

  // Highlight the selected circles.
  function brushmove(p) {
    var e = d3.brushSelection(this);
    svg.selectAll("circle").classed("hidden", function(d) {
      return !e
        ? false
        : (
          e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0]
          || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]
        );
    });
  }

  // If the brush is empty, select all circles.
  function brushend() {
    var e = d3.brushSelection(this);
    if (e === null) svg.selectAll(".hidden").classed("hidden", false);
  }
});

function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
  return c;
}
}
 function drawBarChart(filename){
    d3.selectAll('svg > g > *').remove();
     // set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 475 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([350, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").select("pcaLoadingsChart").selectAll("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv(filename, function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    d.SumSquareLoading = +d.SumSquareLoading;
  });

  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.Feature; }));
  y.domain([0, d3.max(data, function(d) { return d.SumSquareLoading; })]);
 var svg = d3.select("body").select("#pcaLoadingsChart").selectAll("svg");
  // append the rectangles for the bar chart
  svg.style("height",475)
  svg.style("width",600)
  svg.style("padding-left",45)
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Feature); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.SumSquareLoading); })
      .attr("height", function(d) { return 350 - y(d.SumSquareLoading); });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + 350 + ")")
      .call(d3.axisBottom(x))
        .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
    .attr("dy", ".35em")
      .attr("style","font-size:12px;")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");


  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
  svg.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y",-45)
			  .attr("x",-175)
			  .attr("dy", "1em")
			  .style("text-anchor", "middle")
			  .text("Sum of Squared Loadings");

});
}

function drawScreePlots(filename){

     // set the dimensions and margins of the graph
var margin = {top: 0, right: 20, bottom: 30, left: 100},
    width = 600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").select("#screePlot").selectAll("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv(filename, function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.x = +d.x;
      d.y = +(d.y*10);
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.x; }));
  y.domain([0, d3.max(data, function(d) { return d.y; })]);
var svg = d3.select("body").select("#screePlot").selectAll("svg");
svg.style("height",475)
  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline)
      .attr("transform", "translate(40,0)");

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
       .attr("transform", "translate(40,0)");

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(40," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .attr("transform", "translate(40,0)")
      .call(d3.axisLeft(y));
  var linePosition = 373;
if(filename=="../static/random_scree_plot.csv"){
    linePosition = 373
}
if(filename=="../static/stratified_scree_plot.csv"){
    linePosition = 398
}
var xAxis = d3.axisBottom(x)
            .ticks(0);


  svg.append("text")
			  .attr("x", 200 )
			  .attr("y",  350 )
			  .style("text-anchor", "middle")
			  .text("No. of Components");

    svg.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y",-5)
			  .attr("x",-175)
			  .attr("dy", "1em")
			  .style("text-anchor", "middle")
			  .text("Eigen Values");


});
}
function drawElbowPlot(filename){
     d3.selectAll('svg > g > *').remove();
     // set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([500, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.clusters); })
    .y(function(d) { return y(d.avgdist); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv(filename, function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.clusters = +d.clusters;
      d.avgdist = +d.avgdist;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.clusters; }));
  y.domain([d3.min(data, function(d) { return d.avgdist; })-0.2, d3.max(data, function(d) { return d.avgdist; })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.clusters); })
      .attr("cy", function(d) { return y(d.avgdist); });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + 500 + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
  svg.append("text")
			  .attr("x", 480 )
			  .attr("y",  550 )
			  .style("text-anchor", "middle")
			  .text("No. of Clusters");

    svg.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y",-50)
			  .attr("x",0 - (240))
			  .attr("dy", "1em")
			  .style("text-anchor", "middle")
			  .text("Average Distance");

});
}
function draw_BarChart(filename){
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(error, data) {

  data.forEach(function(d) {
    d.frequency = +d.frequency;
  });

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); });

  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.frequency - a.frequency; }
        : function(a, b) { return d3.ascending(a.letter, b.letter); })
        .map(function(d) { return d.letter; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.letter); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
});
}
"%Y-%m-%d"
function drawAnimatedLineChart(filename){
d3.selectAll('svg > g > *').remove();
     // set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var parseTime = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Incident); });

d3.csv(filename, function(d) {
  d.Date = parseTime(d.Date);
  d.Incident = +d.Incident;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.Date; }));
  y.domain(d3.extent(data, function(d) { return d.Incident; }));

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .select(".domain")


  svg.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Count");

  var path =svg.append("g").append("path").classed("line",true)
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", line)
      .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
      .attr("stroke-dashoffset", function(d){ return this.getTotalLength() });
  //var totalLength = path.node().getTotalLength();
var t = d3.transition()
            .duration(6000)
            .ease(d3.easeLinear)
            .on("start", function(d){ console.log("transiton start") })
            .on("end", function(d){ console.log("transiton end") })

svg.selectAll(".line").transition(t)
            .attr("stroke-dashoffset", 0)




});


}

function drawHeatMap(filename){
d3.selectAll('svg > g > *').remove();
     // set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


          gridSize = Math.floor(width / 24),
          legendElementWidth = gridSize*2,
          buckets = 9,
          colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          sex = ["Female", "Male", "Unknown"],
          weapons = ["Blunt Object", "Drowning", "Drugs", "Explosives", "Fall", "Fire", "Firearm", "Gun", "Handgun", "Knife", "Poison", "Rifle", "Shotgun", "Strangulation", "Suffocation", "Unknown"];
          datasets = [filename, filename];

    var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


      var dayLabels = svg.selectAll(".dayLabel")
          .data(sex)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = svg.selectAll(".timeLabel")
          .data(weapons)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x",150)
            .attr("y", function(d, i) { return (-i * gridSize)-10; })
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("transform","rotate(90)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

      var heatmapChart = function(filename) {
        d3.csv(filename,
        function(d) {
          return {
            Perpetrator_Sex: +d.Perpetrator_Sex,
            Weapon: +d.Weapon,
            pc: +d.pc
          };
        },
        function(error, data) {
          var colorScale = d3.scaleQuantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.pc; })])
              .range(colors);

          var cards = svg.selectAll(".hour")
              .data(data, function(d) {return d.Perpetrator_Sex+':'+d.Weapon;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.Weapon) * gridSize; })
              .attr("y", function(d) { return (d.Perpetrator_Sex) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .attr("fill",function(d) { return colorScale(d.pc); });

          cards.transition().duration(1000)
              .attr("fill", function(d) { return colorScale(d.pc); });

          cards.select("title").text(function(d) { return d.pc; });

         // cards.exit().remove();

          var legend = svg.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend");

          legend.enter().append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height-300)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .attr("fill", function(d, i) { return colors[i]; });

          legend.enter().append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize-300);

          //legend.exit().remove();

        });
      };

      heatmapChart(datasets[0]);

      var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
        .data(datasets);

      datasetpicker.enter()
        .append("input")
        .attr("value", function(d){ return "Dataset " + d })
        .attr("type", "button")
        .attr("class", "dataset-button")
        .on("click", function(d) {
          heatmapChart(d);
        });

}

function drawPieChart(filename){
d3.selectAll('svg > g > *').remove();
     // set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  g=svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var radius = Math.min(width, height) / 2;

var color = d3.scaleOrdinal(["#7b6888","#d0743c", "#6b486b", "#a05d56", "#ff8c00"]);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.list; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

d3.csv(filename, function(d) {
  d.list = +d.list;
  return d;
}, function(error, data) {
  if (error) throw error;

  var arc = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.index); });

  arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.index; });
});
}
