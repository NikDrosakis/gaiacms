/*updated:2020-01-29 20:20:34 chart - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
/*updated:2020-01-01 18:10:19
v.0.52
Author:Nikos Drosakis*/

/*updated:2020-01-01 18:02:14
v.
Author:Nikos Drosakis*/

//2017-11-01 09:29:17

/*
 * G.CHART
 * */
g.chart = {
    pie : function (div, file,vol) {
        var width = $(div).width()-30,
            height = $(div).height()-10,
            radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
            .range(["green", "red","#000","#eee"]);

        var arc = d3.svg.arc()
            .outerRadius(radius - 15)
            .innerRadius(0);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.bsvalue; });

        var svg = d3.select(div).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        d3.json(g.ajaxfile+'?a=chart00', function(error,data) {
            // d3.csv("/gaia/dsh/data.csv", function(error, data) {
            // console.log(data)
            data.forEach(function(d) {
                d.bsvalue = +d.bsvalue; //change that names accordingly
            });

            var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .attr("d", arc)
                .style("fill", function(d) { return color(d.data.name); });

            /*     r = Math.min(width, height) / 2,
             labelr = r + 30, // radius for label anchor
             */
            /*   .attr("transform", function(d) {
             var c = arc.centroid(d),
             x = c[0],
             y = c[1],
             // pythagorean theorem for hypotenuse
             h = Math.sqrt(x*x + y*y);
             return "translate(" + (x/h * labelr)+','+(y/h * labelr)+")";
             }) */

            g.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("dy", "-140px")
                .attr("font-size", "13px")
                .attr("fill", "#023F88")
                .style("text-anchor", "middle")
                .text(function(d) { return d.data.name=='buscat' ? 'name': d.data.name; });

        });
    },
    bar :  function(div){
        var margin = {top: 20, right: 0, bottom: 30, left: 30},
            width = $(div).width()-30,
            // width = 800 - margin.left - margin.right,
            // height = 400 - margin.top - margin.bottom;
            height = $(div).height()-20;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1, .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var svg = d3.select(div).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.json(g.ajaxfile+'?a=chart02', function(error,data) {

            x.domain(data.map(function(d) { return d.name; }));
            y.domain([0, d3.max(data, function(d) { return d.value; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll(".tick text")
                .call(wrap, x.rangeBand());

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.name); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); });
        });

        function wrap(text, width) {
            text.each(function() {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }

        function type(d) {
            d.value = +d.value;
            return d;
        }

    }
};