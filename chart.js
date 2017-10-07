
var data = blank;

//width and height of svg element
var width = window.innerWidth;
var height = window.innerHeight;
//radius of the donut chart
var radius = Math.min(width, height) / 3.25;
var colour = d3.scaleOrdinal()
    .range(["#F44336", "#B71C1C", "#009688", "#64FFDA", "#03A9F4", "#01579B", "#4CAF50", "#1B5E20", "#FF9800", "#FFEB3B", "#795548", "#A1887F", "#9E9E9E", "#546E7A", "#F06292"]);
var svg = d3.select("#pieChart")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("align", "center")
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

var innerSpace = radius / 2;
var arc = d3.arc().innerRadius(radius - innerSpace).outerRadius(radius);
var pie = d3.pie().value(function (d) { return d.value; }).sort(null);

var path = svg.selectAll("path")
	.data(pie(data))
	.enter()
	.append("path")
	.attr("d", arc)
	.attr("fill", function (d, i) { return colour(d.data.action); })
    .each(function (d) { this._current = d; });

var legendRectSize = radius / 9;
var legendSpacing = radius / 45;

var legend = svg.selectAll(".legend")
    .data(colour.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = radius;
        var horizontal = radius + (legendRectSize * 3);
        var vertical = i * height - offset;
        return "translate(" + horizontal + "," + vertical + ")";
    });

legend.append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", colour)
    .style("stroke", colour);

legend.append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize / 1.5)
    .style("fill", "#c9d0d4")
    .style("font-family", "'Verdana', sans-serif")
    .style("font-size", "15")
    .text(function (d) { return d; });

var selection = svg.selectAll(".selection")
    .data(situations)
    .enter()
    .append("g")
    .attr("class", "selection")
    .attr("transform", function (d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = radius;
        var horizontal = (radius + (legendRectSize * 7.5)) * -1;
        var vertical = i * height - offset;
        return "translate(" + horizontal + "," + vertical + ")";
    });

selection.append("circle")
    .attr("cx", (legendRectSize / 2))
    .attr("cy", (legendRectSize / 2))
    .attr("r", (legendRectSize / 2))
    .attr("class", "disabled")
    .attr("name", function (d) { return d; })
    .on("click", function (action) {
        var circle = d3.select(this);
        var items = document.querySelectorAll(".selection");
        for (var i = 0; i < items.length; i++) {
            if (items[i].firstChild.getAttribute("class") == "enabled")
                items[i].firstChild.setAttribute("class", "disabled");
         }
        
        if (circle.attr("class") == "disabled") {
            circle.attr("class", "enabled");
        }
        if (circle.attr("name") == "Class")
            data = school;
        else if (circle.attr("name") == "Date")
            data = date;
        else if (circle.attr("name") == "Bus")
            data = bus;
        else if (circle.attr("name") == "Family Dinner")
            data = familyDinner;
        else if (circle.attr("name") == "Park")
            data = park;
        else if (circle.attr("name") == "Church")
            data = church;
        else if (circle.attr("name") == "Job Interview")
            data = jobInterview;
        else if (circle.attr("name") == "Sidewalk")
            data = sidewalk;
        else if (circle.attr("name") == "Movies")
            data = movies;
        else if (circle.attr("name") == "Bar")
            data = bar;
        else if (circle.attr("name") == "Elevator")
            data = elevator;
        else if (circle.attr("name") == "Restroom")
            data = restroom;
        else if (circle.attr("name") == "Own Room")
            data = ownRoom;
        else if (circle.attr("name") == "Dorm Lounge")
            data = dorm;
        else if (circle.attr("name") == "Football Game")
            data = footballGame;
        else
            data = blank;
            

        path = path.data(pie(data));

        path.transition()
            .duration(600)
            .attrTween("d", function (d) {
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) { return arc(interpolate(t)); };
            });
    });


selection.append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize / 1.5)
    .style("fill", "#c9d0d4")
    .style("font-family", "'Verdana', sans-serif")
    .style("font-size", "15")
    .text(function (d) { return d; });


var tip = d3.select("#chart")
    .data(data)
    .enter()
    .append("div")
    .attr("class", "tip");
tip.append("div")
    .attr("class", "action");
tip.append("div")
    .attr("class", "value");
path.on("mouseover", function (d) {
    tip.select(".action").html(d.data.action);
    tip.select(".value").html(d.data.value);
    tip.style("display", "block");
});
path.on("mouseout", function (d) {
    tip.style("display", "none");
});
path.on("mousemove", function (d) {
    tip.style("top", (d3.event.layerY + 95) + "px")
       .style("left", (d3.event.layerX + 10) + "px");
});

