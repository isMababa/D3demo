var sDataset={
    name:"中国",
    abc:[
        {
            name:"北京",
            abc:[
                {name:'北京21185人',revenue:21185}
            ]
        },
        {
            name:"上海",
            abc:[
                {name:'上海17460人',revenue:17460}
            ]
        },
        {
            name:"杭州",
            abc:[
                {name:'杭州11858人',revenue:11858}
            ]
        },
        {
            name:"深圳",
            abc:[
                {name:'深圳16642人',revenue:16642}
            ]
        },
        {
            name:"广州",
            abc:[
                {name:'广州10075人',revenue:10075}
            ]
        },          {
            name:"其他",
            abc:[
                {name:'其他城市10075人',revenue:10075}
            ]
        }
    ]
};
drawpack("sCircle",sDataset);
function drawpack(divname,dataset) {
    //1.定义SVG宽及高
    var svgwidth=$("#"+divname).width();
    var svgheight=$("#"+divname).height();
    _root = d3.hierarchy(dataset, function (d) {
        return d.abc;
    })
        .sum(function (d) {
            return d.revenue;
        });
    var _pack = d3.pack()
        .size([svgwidth, svgheight])
        .padding(10);
    var _packdata = _pack(_root);
    var _allnodes = _packdata.descendants();
    console.log(_allnodes);

    var _svg = d3.select("#sCircle")
        .append("svg")
        .attr("width", svgwidth)
        .attr("height", svgheight);
    var _gcircles = _svg.selectAll("g")
        .data(_allnodes)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(" + d.x + "," + d.y + ")"
        });
    _gcircles.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", function (d, i) {
            return d.r
        })
        .attr("class", function (d) {
            return d.height == 0 ? "leaf" : ""
        });
    _gcircles.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text(function (d) {
            return d.children ? "" : d.data.name;
        })
        .style("text-anchor", "middle")
        .attr("fill","#fff");
}