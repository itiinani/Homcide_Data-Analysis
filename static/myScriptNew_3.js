drawAnimatedLineChart();

function drawAnimatedLineChart(){

     // set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("#homicideCountChart").selectAll("svg")
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

d3.csv("../static/HomicideCount.csv", function(d) {
  d.Date = parseTime(d.Date);
  d.Incident = +d.Incident;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.Date; }));
  y.domain(d3.extent(data, function(d) { return d.Incident; }));
 var svg = d3.select("body").select("#homicideCountChart").selectAll("svg");
 svg.style("height",600);
 svg.style("width",900);
 svg.style("padding-left",100);
 svg.attr("transform","translate(100,0)");
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

drawHeatMap();

drawHeatMap2();

}
function drawHeatMap(){
d3.select("body").select("#victimPerpetratorRadioButton").selectAll("input")
	.on("change", selectDataset);
	function selectDataset(){
     var value = this.value;
     if(value=="victim"){
     heatmapChart("../static/HeatMapVictim.csv");
     }
     if(value=="perpetrator"){
     heatMapChart1("../static/HeatMap.csv");
     }
     }
	var filename = "../static/HeatMap.csv"
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
         // datasets = [filename, filename];

    var svg = d3.select("body").select("#heatMap").selectAll("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
   svg.append("g");

      var dayLabels = svg.selectAll(".dayLabel")
          .data(sex)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? " dayLabel mono axis axis-workweek" : " dayLabel mono axis"); });

      var timeLabels = svg.selectAll(".timeLabel")
          .data(weapons)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x",150)
            .attr("y", function(d, i) { return (-i * gridSize)-10; })
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("transform","rotate(90)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? " timeLabel mono axis axis-worktime" : " timeLabel mono axis"); });

      var heatmapChart1 = function(filename) {
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
                              var svg = d3.select("body").select("#heatMap").selectAll("svg");
                              svg.style("width",900)
                              svg.style("height",600)

                               var svg = d3.select("body").select("#heatMap").selectAll("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
   svg.append("g");

      var dayLabels = svg.selectAll(".dayLabel")
          .data(sex)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? " dayLabel mono axis axis-workweek" : " dayLabel mono axis"); });

      var timeLabels = svg.selectAll(".timeLabel")
          .data(weapons)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x",150)
            .attr("y", function(d, i) { return (-i * gridSize)-10; })
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("transform","rotate(90)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? " timeLabel mono axis axis-worktime" : " timeLabel mono axis"); });
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
                              var svg = d3.select("body").select("#heatMap").selectAll("svg");
                              svg.style("width",900)
                              svg.style("height",600)
                               var svg = d3.select("body").select("#heatMap").selectAll("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
   svg.append("g");

      var dayLabels = svg.selectAll(".dayLabel")
          .data(sex)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? " dayLabel mono axis axis-workweek" : " dayLabel mono axis"); });

      var timeLabels = svg.selectAll(".timeLabel")
          .data(weapons)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x",150)
            .attr("y", function(d, i) { return (-i * gridSize)-10; })
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("transform","rotate(90)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? " timeLabel mono axis axis-worktime" : " timeLabel mono axis"); });

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
      heatmapChart("../static/HeatMap.csv");





}
function drawHeatMap2(){

	function selectDataset(){
     var value = this.value;
     if(value=="victim"){
     heatmapChart1("../static/HeatMapVictim.csv");
     }
     if(value=="perpetrator"){
     heatMapChart1("../static/HeatMap.csv");
     }
     }
	var filename = "../static/HeatMap.csv"
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
         // datasets = [filename, filename];

    var svg = d3.select("body").select("#heatMap2").selectAll("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
   svg.append("g");

      var dayLabels = svg.selectAll(".dayLabel")
          .data(sex)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? " dayLabel mono axis axis-workweek" : " dayLabel mono axis"); });

      var timeLabels = svg.selectAll(".timeLabel")
          .data(weapons)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x",150)
            .attr("y", function(d, i) { return (-i * gridSize)-10; })
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("transform","rotate(90)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? " timeLabel mono axis axis-worktime" : " timeLabel mono axis"); });

      var heatmapChart1 = function(filename) {
        d3.csv(filename,
        function(d) {
          return {
            Victim_Sex: +d.Victim_Sex,
            Weapon: +d.Weapon,
            pc: +d.pc
          };
        },
        function(error, data) {
          var colorScale = d3.scaleQuantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.pc; })])
              .range(colors);
                              var svg = d3.select("body").select("#heatMap2").selectAll("svg");
                              svg.style("width",900)
                              svg.style("height",600)

                               var svg = d3.select("body").select("#heatMap2").selectAll("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
   svg.append("g");

      var dayLabels = svg.selectAll(".dayLabel")
          .data(sex)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? " dayLabel mono axis axis-workweek" : " dayLabel mono axis"); });

      var timeLabels = svg.selectAll(".timeLabel")
          .data(weapons)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x",150)
            .attr("y", function(d, i) { return (-i * gridSize)-10; })
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("transform","rotate(90)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? " timeLabel mono axis axis-worktime" : " timeLabel mono axis"); });
          var cards = svg.selectAll(".hour")
              .data(data, function(d) {return d.Victim_Sex+':'+d.Weapon;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.Weapon) * gridSize; })
              .attr("y", function(d) { return (d.Victim_Sex) * gridSize; })
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
                              var svg = d3.select("body").select("#heatMap").selectAll("svg");
                              svg.style("width",900)
                              svg.style("height",600)
                               var svg = d3.select("body").select("#heatMap").selectAll("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
   svg.append("g");

      var dayLabels = svg.selectAll(".dayLabel")
          .data(sex)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? " dayLabel mono axis axis-workweek" : " dayLabel mono axis"); });

      var timeLabels = svg.selectAll(".timeLabel")
          .data(weapons)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x",150)
            .attr("y", function(d, i) { return (-i * gridSize)-10; })
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("transform","rotate(90)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? " timeLabel mono axis axis-worktime" : " timeLabel mono axis"); });

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
      heatmapChart1("../static/HeatMapVictim.csv");





}