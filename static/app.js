
globals = {
    data : [],
    data_per_ip : []

}
var websitesIP;
$(function() {
    $("#upload-file").submit(function(e) {
        e.preventDefault();
        var form_data = new FormData($('#upload-file')[0]);
        $.ajax({
            type: 'POST',
            url: request,
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: false,
            success: function(data) {
                data = JSON.parse(data);
                globals.data_per_ip = combine_ports(data);
                globals.ports_per_ip = get_ports_per_ip(data);
                globals.data = data;
                populate_websites(globals.data_per_ip);
                plot();
                $('html, body').stop().animate({
                   scrollTop: 150
                }, 1000);
            },
        });
        return false;
    });
});

function populate_websites(websites){
    var $websites = $("#websites");
		$websites.empty();
		$.each(websites, function(key, value) {
			$websites.append("<option>" + key + "</option>");
		});

}

function combine_ports(data){
    cdata = {};
    $.each( data, function( protocol, ips ) {
        $.each( ips, function( ip, ports ) {
            if(!cdata[ip]){
                cdata[ip] = {};
            }
            cdata[ip][protocol] = [];
            $.each( ports, function( port, packets ) {
                cdata[ip][protocol] = cdata[ip][protocol].concat(data[protocol][ip][port]);
            });
            cdata[ip][protocol].sort(function(a, b) {
                return a.time_stamp_source - b.time_stamp_source;
            });
        });
    });
    return cdata;
}

function get_ports_per_ip(data){
    cdata = {};
    $.each( data, function( protocol, ips ) {
        $.each( ips, function( ip, ports ) {
            if(!cdata[ip]){
                cdata[ip] = {};
            }
            cdata[ip][protocol] = Object.keys(data[protocol][ip]).length;
        });
    });
    return cdata;
}

function plot_throughput(website){
    data = globals.data_per_ip[website];
    throughput = process_throughput(data,website);
    plot_linechart(throughput,"","#lineChart");
}

function plot_goodput(website){
    data = globals.data_per_ip[website];
    goodput = process_goodput(data);
    plot_linechart(goodput);
}

function plot_pageloadtime(website){
    data = globals.data_per_ip[website];
    pageloadtime = process_pageloadtime(data);
    plot_barchart(pageloadtime,"#pageLoadTimeChart");
}

function plot_avgpacketlen(website){
    data = globals.data_per_ip[website];
    avgpacklen = avg_packetlenght(data);
    plot_barchart(avgpacklen,"#pageLoadTimeChart");
}

function plot_tcpconns(website){
    data = globals.ports_per_ip[website];
    tcpconns = process_tcpconns(data);
    plot_barchart(tcpconns,"#pageLoadTimeChart");
}

function plot_avgtcpconntime(){
    data = globals.data;
    avgtcpconntime = process_avgtcpconntime(data);
    plot_barchart(avgtcpconntime ,"#pageLoadTimeChart");
}

function plot_cwds(website){
    data = globals.data_per_ip[website];
    cwds = process_cwds(data, website);
    plot_linechart(cwds, "Window size","#lineChart");
}

function plot_sentAndReceivedBytes(website,value){
    data = globals.data_per_ip[website];
    packetData = process_totalBytes(data,website);
    plot_pieChartHttp(packetData,value);
    plot_pieChartHttp2(packetData,value);
    console.log(packetData);
}
function process_totalBytes(data,website){
   packetData =[];
   var sentBytes=0;
   var sentPackets=0;
   var receivedBytes=0;
   var receivedPackets=0;
    $.each( data, function( protocol, packets ) {

        key = protocol;
        obj = {};
        obj['name'] = key;
        obj['values'] = [];
        timegap = 100, total_bytes = 0, counter = 0, diff = 0;
        packet_start = packets[0].time_stamp_source;
        for(i=1; i< packets.length; i++){
            diff = (packets[i].time_stamp_source - packet_start) * 1000;
            //if(packets[i].source_ip === "")
            total_bytes += packets[i].data_len;
            if(packets[i].source_ip == "172.24.20.167" && packets[i].dest_ip == website){
              receivedBytes += packets[i].data_len;
              receivedPackets++;
            }
            if(packets[i].source_ip == website && packets[i].dest_ip == "172.24.20.167"){
              sentBytes += packets[i].data_len;
              sentPackets++;
            }
        }
        obj['values'].push({'sentBytes' :sentBytes, 'sentPackets':sentPackets, 'receivedBytes':receivedBytes,'receivedPackets':receivedPackets });
        packetData.push(obj);
    });
    return packetData;
}
function process_throughput(data,website){
    throughput = [];
    $.each( data, function( protocol, packets ) {

        key = protocol;
        obj = {};
        obj['name'] = key;
        obj['values'] = [];
        timegap = 100, total_bytes = 0, counter = 0, diff = 0;
        packet_start = packets[0].time_stamp_source;
        for(i=1; i< packets.length; i++){
           if((packets[i].source_ip == website && packets[i].dest_ip == "172.24.20.167")||
                 (packets[i].dest_ip ==website && packets[i].source_ip == "172.24.20.167")){
            diff = (packets[i].time_stamp_source - packet_start) * 1000;
            total_bytes += packets[i].data_len;
            if(diff > timegap){
                obj['values'].push({'time' :timegap*counter, 'bytes': total_bytes});
                total_bytes = 0;
                packet_start = packets[i].time_stamp_source;
                counter++;
            }
           }
        }
        throughput.push(obj);
    });
    return throughput;
}

function process_goodput(data){
    throughput = [];
    $.each( data, function( protocol, packets ) {

        key = protocol;
        obj = {};
        obj['name'] = key;
        obj['values'] = [];
        timegap = 100, total_bytes = 0, counter = 0, diff = 0;
        packet_start = packets[0].time_stamp_source;
        for(i=1; i< packets.length; i++){
            diff = (packets[i].time_stamp_source - packet_start) * 1000;
            total_bytes += packets[i].data_len;
            if(diff > timegap){
                obj['values'].push({'time' :timegap*counter, 'bytes': total_bytes});
                total_bytes = 0;
                packet_start = packets[i].time_stamp_source;
                counter++;
            }
        }
        throughput.push(obj);
    });
    return throughput;
}

function process_pageloadtime(data){
    pageload = [];
    $.each( data, function( protocol, packets ) {

        key = protocol;
        obj = {};
        obj['Name'] = key;
        obj['pageloadtime'] = 0;
        timegap = 100, counter = 0, diff = 0;
        packet_start = packets[0].time_stamp_source;
        for(i=1; i< packets.length; i++){
            diff = (packets[i].time_stamp_source - packet_start) * 1000;
            if(diff > timegap){
                packet_start = packets[i].time_stamp_source;
                obj['pageloadtime'] += timegap;
            }
        }
        pageload.push(obj);
    });
    return pageload;
}

function avg_packetlenght(data){
    pageload = [];
    $.each( data, function( protocol, packets ) {

        key = protocol;
        obj = {};
        obj['Name'] = key;
        obj['Avg packet length'] = 0;
        for(i=1; i< packets.length; i++){
            obj['Avg packet length'] += packets[i].data_len;
        }
        obj['Avg packet length'] = obj['Avg packet length']/ packets.length;
        pageload.push(obj);
    });
    return pageload;
}

function process_tcpconns(data){
    tcpconn = [];
    $.each( data, function( protocol, num ) {
        no_of_connections = 0;
        obj = {};
        obj['Name'] = protocol;
        obj['NoOfTCPConnections'] = num;
        tcpconn.push(obj);
    });
    return tcpconn;
}

function process_avgtcpconntime(data){
    tcpconn = [];
    $.each( data, function( protocol, ips ) {
        obj = {};
        obj['Name'] = protocol;
        conns = [];
        $.each( ips, function( ip, ports ) {
            $.each( ports, function( port, packets ) {
                tcpconntime = packets[packets.length-1].time_stamp_source - packets[0].time_stamp_source;
                conns.push(tcpconntime);
            });
        });
        var sum = conns.reduce(function(a, b) { return a + b; });
        var avg = sum / conns.length;

        obj['AvgTCPConnTime'] = avg;
        tcpconn.push(obj);
    });
    return tcpconn;
}

function process_cwds(data, website){
    throughput = [];
    $.each( data, function( protocol, packets ) {
        outflow = packets.filter(function(d){
            return d.dest_ip == website;
        });
        inflow = packets.filter(function(d){
            return d.dest_ip != website;
        });
        key = protocol;
        obj = {};
        obj['name'] = key;
        obj['values'] = [];
        cwindow = 0, inflow_counter = 0; counter = 0;
        for(i=0;  i < outflow.length && inflow_counter < inflow.length; i++){
            if(outflow[i].time_stamp_source < inflow[inflow_counter].time_stamp_source){
                cwindow++;
                obj['values'].push({'time' : counter++, 'bytes': Math.abs(cwindow)});
                console.log(cwindow);
            } else{
                cwindow--;
                inflow_counter++;
            }
        }
        throughput.push(obj);
    });
    return throughput;
}

function plot_linechart(data, yname ='Bytes',ID){

    var margin = {top: 10, right: 30, bottom: 30, left: 300},
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
    .range(["#0099c6", "#dd4477"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.bytes); });

    d3.select("body").select("#lineChart").select("svg").remove();
    var svg = d3.select("body").select("#lineChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    x.domain([
    d3.min(data, function(c) { return d3.min(c.values, function(v) { return v.time; }); }),
    d3.max(data, function(c) { return d3.max(c.values, function(v) { return v.time; }); })
    ])
    //x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
    d3.min(data, function(c) { return d3.min(c.values, function(v) { return v.bytes; }); }),
    d3.max(data, function(c) { return d3.max(c.values, function(v) { return v.bytes; }); })
    ]);

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
      .text(yname);

    var stream = svg.selectAll(".city")
      .data(data)
    .enter().append("g")
      .attr("class", "city");

    var path = stream.append("path")
      .attr("d", function(d) {
          return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

  //var totalLength = path.node().getTotalLength();
  var totalLength = [path[0][0].getTotalLength(), path[0][1].getTotalLength()];

console.log(totalLength);


   d3.select(path[0][0])
      .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0] )
      .attr("stroke-dashoffset", totalLength[0])
      .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

   d3.select(path[0][1])
      .attr("stroke-dasharray", totalLength[1] + " " + totalLength[1] )
      .attr("stroke-dashoffset", totalLength[1])
      .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);



    stream.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.bytes) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
}

function plot_barchart(data,ID){
    //var data=[{"Name":"Katte","ExamCount":"30"},{"Name":"Borsh","ExamCount":"130"},{"Name":"Broer","ExamCount":"320"},{"Name":"John","ExamCount":"60"}];

  var margin = {top: 10, right: 30, bottom: 30, left: 300},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["rgba(0, 167, 188, 0.8)", "rgba(223, 40, 35, 0.8)", "rgba(153, 44, 150, 0.8)", "rgba(124, 189, 42, 0.8)", "rgba(37, 47, 71, 0.8)","rgba(153, 0, 51, 0.8)", "rgba(153, 51, 51, 0.8)", "rgba(92, 0, 92, 0.8)"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    d3.select("body").select(ID).select("svg").remove();
    var svg = d3.select("body").select(ID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      var months = d3.keys(data[0]).filter(function(key) { return key !== "Name"; });
    console.log(months);
      data.forEach(function(d) {
        d.month = months.map(function(name) { return {name: name, value: +d[name]}; });
      });

      x.domain(data.map(function(d) { return d.Name; }));
      max = d3.max(data, function(d) { return d3.max(d.month, function(d) { return d.value; }); });
      y.domain([0, max*(1.3)]);

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
          .text(months[0]);

      var person = svg.selectAll(".person")
          .data(data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + x(d.Name) + ",0)"; });

      person.selectAll("rect")
          .data(function(d) { return d.month; })
        .enter().append("rect")
          .attr("width", x.rangeBand())
          .attr("x", function(d) { return x(d.name); })
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .style("fill", function(d) { return color(d.name); });

         // person.exit().remove();
        // updated data:
        person
                .transition()
                .duration(750)
                 .delay(function (d, i) { return i*100; })
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); });

          var legend = svg.selectAll(".legend")
          .data(months.slice().reverse())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width/5 - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", width/5 - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d.Name; });
}

function plot_pieChartHttp(data,value){


d3.select("body").select("#piechartHttp").select("svg").remove();
var svg = d3.select("body").select("#piechartHttp")
	.append("svg")
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

var width = 600,
    height = 350,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

var legendRectSize = (radius * 0.05);
var legendSpacing = radius * 0.02;


var div = d3.select("body").append("div").attr("class", "toolTip");
svg.attr("height",350);
svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var colorRange = d3.scale.category20();
var color = d3.scale.ordinal()
	.range(colorRange.range());


	  datasetHttpBytes = [{label:"Sent Bytes http",value:data[0].values[0].sentBytes},{label:"Received Bytes http",value:data[0].values[0].receivedBytes}];
	  datasetHttpPackets = [{label:"Sent Packets http",value:data[0].values[0].sentPackets},{label:"Received Packets http",value:data[0].values[0].receivedPackets}];
     if(data.length > 1){
	 datasetHttp2Bytes = [{label:"Sent Bytes http2",value:data[1].values[0].sentBytes},{label:"Received Bytes http2",value:data[1].values[0].receivedBytes}];
	  datasetHttp2Packets = [{label:"Sent Packets http2",value:data[1].values[0].sentPackets},{label:"Received Packets http2",value:data[1].values[0].receivedPackets}];
	  }




selectDatasetForPie(value);




function selectDatasetForPie(value)
{

	if (value == "bytes")
	{
		change(datasetHttpBytes);
	}
	else if (value == "packets")
	{
		change(datasetHttpPackets);
	}

}

function change(data) {

	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.label });

    slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
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
            div.html((d.data.label)+"<br>"+(d.data.value));
        });
    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
        .remove();

    var legend = svg.selectAll('.legend')
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
        .data(pie(data), function(d){ return d.data.label });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return (d.data.label+": "+d.value);
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
            return (d.data.label+": "+d.value);
        });


    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), function(d){ return d.data.label });

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
};

}
function plot_pieChartHttp2(data,value){


d3.select("body").select("#piechartHttp2").select("svg").remove();
var svg = d3.select("body").select("#piechartHttp2")
	.append("svg")
     .attr("height",350)
	.append("g");

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labelName");
svg.append("g")
	.attr("class", "labelValue");
svg.append("g")
	.attr("class", "lines");

var width = 600,
    height = 350,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

var legendRectSize = (radius * 0.05);
var legendSpacing = radius * 0.02;


var div = d3.select("body").append("div").attr("class", "toolTip");
svg.attr("height",350);
svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var colorRange = d3.scale.category20();
var color = d3.scale.ordinal()
	.range(colorRange.range());


	datasetHttpBytes = [{label:"Sent Bytes ",value:data[0].values[0].sentBytes},{label:"Received Bytes ",value:data[0].values[0].receivedBytes}];
	  datasetHttpPackets = [{label:"Sent Packets ",value:data[0].values[0].sentPackets},{label:"Received Packets ",value:data[0].values[0].receivedPackets}];
     if(data.length > 1){
	 datasetHttp2Bytes = [{label:"Sent Bytes ",value:data[1].values[0].sentBytes},{label:"Received Bytes ",value:data[1].values[0].receivedBytes}];
	  datasetHttp2Packets = [{label:"Sent Packets ",value:data[1].values[0].sentPackets},{label:"Received Packets ",value:data[1].values[0].receivedPackets}];
	  }



selectDatasetForPie(value);




function selectDatasetForPie(value)
{

	if (value == "bytes")
	{
		change(datasetHttp2Bytes);
	}
	else if (value == "packets")
	{
		change(datasetHttp2Packets);
	}

}

function change(data) {

	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.label });

    slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
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
            div.html((d.data.label)+"<br>"+(d.data.value));
        });
    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
        .remove();

    var legend = svg.selectAll('.legend')
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
        .data(pie(data), function(d){ return d.data.label });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return (d.data.label+": "+d.value);
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
            return (d.data.label+": "+d.value);
        });


    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), function(d){ return d.data.label });

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
};

}
function plot(){
  //  measure = $("#measure").text().trim();
    website = $("#websites").val();
      //  plot_throughput(website);
    //option = $("#dataset").val();


         d3.select("#lineCharts").select("input[value=\"throughput\"]").property("checked", true);
         d3.select("#lineCharts").selectAll("input").on("change", selectDataset1);

        d3.select("#barcharts").select("input[value=\"pageLoadTime\"]").property("checked", true);

        d3.select("#barcharts").selectAll("input").on("change", selectDataset);
        d3.select("#dataInput").selectAll("input").on("change",passValuetoFunction);

}
function passValuetoFunction(){

plot_sentAndReceivedBytes(website,this.value);

}
function selectDataset1()
    {
        var value = this.value;
        website = $("#websites").val();
        if(value=="")
        {
        plot_throughput(website);

        }
        else if (value == "throughput")
        {
         plot_throughput(website);


        }
        else if (value == "goodput")
        {
         plot_goodput(website);
        }
        else if (value == "congestionWindow")
        {
          plot_cwds(website);
        }

    }
 function selectDataset()
    {
        var value = this.value;
        website = $("#websites").val();
        if(value=="")
        {
        plot_pageloadtime(website);
        plot_sentAndReceivedBytes(website);
        }
        else if (value == "pageLoadTime")
        {
        plot_pageloadtime(website);
        plot_sentAndReceivedBytes(website);
        }
        else if (value == "TCPConnections")
        {
           plot_tcpconns(website);
        }
        else if (value == "AvgTCPConnTime")
        {
            plot_avgtcpconntime(website);
        }
        else if (value == "AvgPacketLength")
        {
            plot_avgpacketlen(website);
        }

    }
$( document ).ready(function() {
    $(".dropdown-menu li a").click(function(){
        var selText = $(this).text();
        $(this).parents('.dropdown').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
        plot();
    });


    $("#websites").on("change", function() {
        plot();
    });
});






