var Victim_Age = [];
var Victim_Race = [];
var Victim_Sex = [];
var Victim_Ethnicity=[];
var Perpetrator_Age=[];
var Perpetrator_Race = [];
var Perpetrator_Sex = [];
var Perpetrator_Ethnicity = [];

function passDataToArrays(){
d3.csv("../static/database.csv", function(data) {

  data.map(function(d) {
    Victim_Age.push(d.Victim_Age);
    Perpetrator_Age.push(d.Perpetrator_Age);

});
drawHistogramNew(Victim_Age,"#ageBarChart");
});
d3.csv("../static/Victim_Race.csv", function(data) {
  Victim_Race = data;
  initPieCharts(Victim_Race,"#racePieChart",0);
  });
  d3.csv("../static/Victim_Ethnicity.csv", function(data) {
  Victim_Ethnicity = data;
  initPieCharts(Victim_Ethnicity,"#ethnicityPieChart",0);
  });
d3.csv("../static/Victim_Sex.csv", function(data) {
  Victim_Sex = data;
  drawBarChart(Victim_Sex,"#sexBarChart",0);
  });

  d3.csv("../static/Perpetrator_Ethnicity.csv", function(data) {
  Perpetrator_Ethnicity = data;
  });
  d3.csv("../static/Perpetrator_Sex.csv", function(data) {
  Perpetrator_Sex = data;
  });
   d3.csv("../static/Perpetrator_Race.csv", function(data) {
  Perpetrator_Race = data;
});

}

function init(){



d3.select("#victimPerpetratorRadioButton").select("input[value=\"victim\"]").property("checked", true);

}



function initPieCharts(data,ID,flag){
var width = 600,
    height = 350,
	radius = Math.min(width, height) / 2;
if(flag!=1){

 var svg = d3.select("body").select(ID)
	.select("svg")
	.attr("height",350)
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labelName");
svg.append("g")
	.attr("class", "labelValue");
svg.append("g")
	.attr("class", "lines");
var div = d3.select("body").select(ID).append("div").attr("class", "toolTip");

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
svg.attr("height",350);
}

var div = d3.select("body").select(ID).select("div").attr("class", "toolTip");
var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.count;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

var legendRectSize = (radius * 0.05);
var legendSpacing = radius * 0.02;





var colorRange = d3.scale.category20();
var color = d3.scale.ordinal()
	.range(colorRange.range());

change(data,ID);

function change(data,ID) {

	/* ------- PIE SLICES -------*/
	var svg = d3.select("body").select(ID).select("svg");
	var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.index });

    slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.index); })
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })
    slice
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.index)+"<br>"+(d.data.count)+"%");
        });
    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
        .remove();

    var legend = svg.select("body").select(ID).selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -3 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });

    /* ------- TEXT LABELS -------*/

    var text = svg.select(".labelName").selectAll("text")
        .data(pie(data), function(d){ return d.data.index });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return (d.data.index+": "+d.data.count);
        });

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text
        .transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
        .text(function(d) {
            return (d.data.index+": "+d.data.count);
        });


    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), function(d){ return d.data.index });

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();
}
function selectDataset()
{
	var value = this.value;
	if (value == "victim")
	{
		change(Victim_Race,"#racePieChart");
		change(Victim_Ethnicity,"#ethnicityPieChart");
	}
	else if (value == "perpetrator")
	{
		change(Perpetrator_Race,"#racePieChart");
		change(Perpetrator_Ethnicity,"#ethnicityPieChart");
	}
}


}

passDataToArrays();
init();

function drawHistogramNew(values,ID,flag){
if(flag!=1){
var color = "steelblue";

d3.select("#victimPerpetratorRadioButton").selectAll("input")
	.on("change", selectDataset);
		  //since attribute can be changed so passing columnName as variable
var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

 var max = 100;
 var min = d3.min(values);
// A formatter for counts.
var formatCount = d3.format(",.0f");
var x = d3.scale.linear()
      .domain([min, max])
      .range([0, width]);

// Generate a histogram using twenty uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins(x.ticks(50))
    (values);

var yMax = d3.max(data, function(d){return d.length});
var yMin = d3.min(data, function(d){return d.length});
var colorScale = d3.scale.linear()
            .domain([yMin, yMax])
            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

var y = d3.scale.linear()
    .domain([0, yMax])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var svg = d3.select("body").select(ID).select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

bar.append("rect")
    .attr("x", 1)
    .attr("width", (x(data[0].dx) - x(0)) - 1)
    .attr("height", function(d) { return height - y(d.y); })
    .attr("fill", function(d) { return colorScale(d.y) });

bar.append("text")
    .attr("dy", ".75em")
    .attr("y", -12)
    .attr("x", (x(data[0].dx) - x(0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
}
refresh(values,ID);
/*
* Adding refresh method to reload new data
*/
function refresh(values,ID){
  // var values = d3.range(1000).map(d3.random.normal(20, 5));
  var data = d3.layout.histogram()
    .bins(x.ticks(20))
    (values);

  // Reset y domain using new data
  var yMax = d3.max(data, function(d){return d.length});
  var yMin = d3.min(data, function(d){return d.length});
  y.domain([0, yMax]);
  var colorScale = d3.scale.linear()
              .domain([yMin, yMax])
              .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

  var bar = svg.selectAll(".bar").data(data);

  // Remove object with data
  bar.exit().remove();

  bar.transition()
    .duration(1000)
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  bar.select("rect")
      .transition()
      .duration(1000)
      .attr("height", function(d) { return height - y(d.y); })
      .attr("fill", function(d) { return colorScale(d.y) });

  bar.select("text")
      .transition()
      .duration(1000)
      .text(function(d) { return formatCount(d.y); });

}
var flag;
var selectedValue;
function selectDataset()
{
    flag=1;
   var value = this.value;
	selectedValue = this.value;

    if (selectedValue == "victim")
	{
		initPieCharts(Victim_Race,"#racePieChart",flag);
		initPieCharts(Victim_Ethnicity,"#ethnicityPieChart",flag);
	}
	else if (selectedValue == "perpetrator")
	{
		initPieCharts(Perpetrator_Race,"#racePieChart",flag);
		initPieCharts(Perpetrator_Ethnicity,"#ethnicityPieChart",flag);
	}


	if (value == "victim")
	{
		refresh(Victim_Age,"#ageBarChart");
		drawBarChart(Victim_Sex,"#sexBarChart",1)

	}
	else if (value == "perpetrator")
	{
		refresh(Perpetrator_Age,"#ageBarChart");
		drawBarChart(Perpetrator_Sex,"#sexBarChart",1)

	}
}


}

function drawBarChart2(data,ID,flag){
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

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

var svg = d3.select("body").select("#sexBarChart").selectAll("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  data.forEach(function(d) {
    d.count = +d.count;
  });

  x.domain(data.map(function(d) { return d.index; }));
  y.domain([0, d3.max(data, function(d) { return d.count; })]);

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
      .text("Count");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.index); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.count); })
      .attr("height", function(d) { return height - y(d.count); });

  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.count - a.count; }
        : function(a, b) { return d3.ascending(a.index, b.index); })
        .map(function(d) { return d.index; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.index) - x0(b.index); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.index); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }


}
function drawBarChart(data,ID,flag){
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var svg = d3.select("body").select(ID).select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")

svg.append("g")
    .attr("class", "y axis")
  .append("text") // just for the title (ticks are automatic)
    .attr("transform", "rotate(-90)") // rotate the text!
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Count");



 var yMax = d3.max(data, function(d){return d.count/1000});
  var yMin = d3.min(data, function(d){return d.count/1000});

// D3 scales = just math
// x is a function that transforms from "domain" (data) into "range" (usual pixels)
// domain gets set after the data loads
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// D3 Axis - renders a d3 scale in SVG
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

// create an SVG element (appended to body)
// set size
// add a "g" element (think "group")
// annoying d3 gotcha - the 'svg' variable here is a 'g' element
// the final line sets the transform on <g>, not on <svg>


// d3.tsv is a wrapper around XMLHTTPRequest, returns array of arrays (?) for a TSV file
// type function transforms strings to numbers, dates, etc.

  replay(data);


function type(d) {
  // + coerces to a Number from a String (or anything)
  d.count = +d.count;
  return d;
}

function replay(data) {
  var slices = [];
  for (var i = 0; i < data.length; i++) {
    slices.push(data.slice(0, i+1));
  }
  slices.forEach(function(slice, index){
    setTimeout(function(){
      draw(slice);
    }, index * 300);
  });
}

function draw(data) {
  // measure the domain (for x, unique letters) (for y [0,maxFrequency])
  // now the scales are finished and usable
  x.domain(data.map(function(d) { return d.index; }));
  y.domain([0, d3.max(data, function(d) { return d.count/1000; })]);

  // another g element, this time to move the origin to the bottom of the svg element
  // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
  //   for everything in the selection\
  // the end result is g populated with text and lines!
  var svg = d3.select("body").select("#sexBarChart").select("svg");
  svg.select('.x.axis').transition().duration(300).call(xAxis);

  // same for yAxis but with more transform and a title
  svg.select(".y.axis").transition().duration(300).call(yAxis)

  // THIS IS THE ACTUAL WORK!
  var bars = svg.selectAll(".bar").data(data, function(d) { return d.index; }) // (data) is an array/iterable thing, second argument is an ID generator function

  bars.exit()
    .transition()
      .duration(300)
    .attr("y", y(0))
    .attr("height", height - y(0))
    //.style('fill-opacity', 1e-6)
    .remove();

  // data that needs DOM = enter() (a set/selection, not an event!)
  bars.enter().append("rect")
    .attr("class", "bar")
    .attr("y", y(0))
    .attr("transform", "translate(52,20)")
    .style("fill-opacity",10)
    .attr("height", (height - y(0))/1000);


  // the "UPDATE" set:
  bars.transition().duration(300).attr("x", function(d) { return x(d.index); }) // (d) is one item from the data array, x is the scale object from above
    .attr("width", x.rangeBand()) // constant, so no callback function(d) here
    .attr("y", function(d) { return y(d.count/1000); })
    .attr("height", function(d) { return height - y(d.count/1000); }); // flip the height, because y's domain is bottom up, but SVG renders top down

}
}


