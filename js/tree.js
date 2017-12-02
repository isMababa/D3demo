/**
 * Created by Administrator on 2017/10/17.
 */
function drawP(divname){

    var svgWidth=d3.select("#"+divname)._groups[0][0].clientWidth;
    var svgHeight=d3.select("#"+divname)._groups[0][0].clientHeight;

    var datasetp={
        name:"城市",
        abc:[
            {name:"北京",
                abc:[
                    {name:"数据分析师",revenue:124},
                    {name:"数据挖掘工程师",revenue:83},
                    {name:"DBA",revenue:32},
                    {name:"大数据开发工程师",revenue:26},
                    {name:"数据挖掘",revenue:24}
                ]}

        ]
    };
//   console.log(dataset);
    _root=d3.hierarchy(datasetp,function(d){
        return d.abc;
    })
        .sum(function(d){
            return d.revenue;
        })
//定义柜形树图生成器：
    var _treemap=d3.treemap()
        .tile(d3.treemapBinary)
        .size([svgWidth-20,svgHeight-20])
        .paddingInner(2)
    var _treedata=_treemap(_root)
        .leaves();
    console.log(_treedata)
    var _svg=d3.select("#"+divname)
        .append("svg")
        .attr("width","100%")
        .attr("height","100%");
    _svg.selectAll("rect")
        .data(_treedata)
        .enter()
        .append("rect")
        .attr("x",function(d){
            return d.x0;
        })
        .attr("y",function(d){
            return d.y0;
        })
        .attr("width",function(d,i){
            return d.x1- d.x0
        })
        .attr("height",function(d){
            return d.y1- d.y0
        })
        .style("fill",function(d,i){
            return d3.schemeCategory10[i]
        })
    _svg.selectAll("text")
        .data(_treedata)
        .enter()
        .append("text")
        .attr("x",function(d){
            return d.x0
        })
        .attr("y",function(d){
            return d.y0
        })
        .style("fill","#ffffff")
        .text(function(d){
            return d.data.name

                ;
        })
        .attr("dy","1em")
}