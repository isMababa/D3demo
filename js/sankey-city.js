
    var smargin = {top: 10, right: 30, bottom: 60, left: 30},
        width = $("#sChart").width() - smargin.left - smargin.right,
        height = $("#sChart").height() - smargin.top - smargin.bottom;

    var formatNumber = d3.format(",.0f"),
        color = d3.scale.category20();

    var svg = d3.select("#sChart").append("svg")
        .attr("width", width + smargin.left + smargin.right)
        .attr("height", height + smargin.top + smargin.bottom)
        .append("g")
        .attr("transform", "translate(" + smargin.left + "," + smargin.top + ")");

    var sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([width, height]);

    var path = sankey.link();

    d3.json("../json/energy.json", function(energy) {

        sankey
            .nodes(energy.nodes)
            .links(energy.links)
            .layout(32);

        var link = svg.append("g").selectAll(".link")
            .data(energy.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; });

        link.append("title")
            .text(function(d) {
                return d.source.name + " → " + d.target.name + "\n人次：" + d.value;
            });


        var node = svg.append("g").selectAll(".node")
            .data(energy.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.behavior.drag()
                .origin(function(d) { return d; })
                .on("dragstart", function() { this.parentNode.appendChild(this); })
                .on("drag", dragmove));

        node.append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
            .append("title")
            .text(function(d) { return d.name + "\n" + d.value; });

        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("fill","#fff")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.name; })
            .filter(function(d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start")
            .attr("fill","#fff");

        function dragmove(d) {
            d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
            sankey.relayout();
            link.attr("d", path);
        }
    });
