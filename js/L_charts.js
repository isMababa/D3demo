/**
 * Created by jss-1 on 2017/10/14.
 */

//柱形图

//定义所需的数据

var p_ydata2 = ["915","239","278","531","419","461","487","646","549","616"];
var p_xdata2 = [" 上市公司"," 初创型(不需要融资)"," 初创型(天使轮)"," 初创型(未融资)"," 成熟型(C轮)"," 成熟型(D轮及以上)"," 成熟型(不需要融资)"," 成长型(A轮)"," 成长型(B轮)"," 成长型(不需要融资)"];

var p_svg;

/*
 * bool是是否显示网络，默认都不显示,如果想显示
 * drawBar("mychart1",ydata1,xdatal,true);
 * */
drawBar("p_bar",p_ydata2,p_xdata2);
function drawBar(p_divname,p_ydata,p_xdata) {

    var p_svgHeight = $('#'+p_divname).height();
    var p_svgWidth = $('#'+p_divname).width();
    p_svg = d3.select('#'+p_divname)
        .append('svg')
        .attr('width', p_svgWidth)
        .attr('height', p_svgHeight)
        .style('background-color', '#ccc');
    /******坐标****************/
    var p_margin = {top: 30, right: 10, bottom: 10, left: 50};
    var p_g1 = p_svg.append('g')
        .attr('transform', 'translate(' + p_margin.left + ',' + p_margin.top + ')')
        .attr('id', 'p_g1');
    var p_titleHeight = 50;
    var p_g2 = p_g1.append('g')
        .attr('transform', 'translate(0,' + p_titleHeight + ')')
        .attr('id', 'p_g2');
    var p_charmargin = {top: 20, right: 20, bottom: 20, left: 20};

    var p_charHeight = p_svgHeight - p_margin.top - p_margin.bottom - p_titleHeight;
    var p_charWidth = p_svgWidth - p_margin.left - p_margin.right;
    var p_xaxisWidth = p_charWidth - p_charmargin.left - p_charmargin.right;
    var p_yaxisHeight = p_charHeight - p_charmargin.top - p_charmargin.bottom;
    var p_gxaxis = p_g2.append('g').attr('id',p_divname+ 'p_xaxis')
        .attr('transform', 'translate(0,' + p_yaxisHeight + ')');
    var p_gyaxis = p_g2.append('g')
        .attr('id', p_divname+'p_yaxis');
    var p_bandScale = d3.scaleBand().padding(0.2).domain(p_xdata)
        .range([0, p_charWidth -p_charmargin.left - p_charmargin.right]);
    var p_lineScale = d3.scaleLinear().domain([0, d3.max(p_ydata)])
        .range([p_yaxisHeight, 0]);
    var p_xaxis = d3.axisBottom().scale(p_bandScale);
    p_xaxis(p_gxaxis);
    var p_yaxis = d3.axisLeft().scale(p_lineScale);
    p_yaxis(p_gyaxis);

    //提示框
    var p_tooltipdiv=d3.select("#"+p_divname)
        .append("div")
        .attr("id","p_tooltip");

     //x轴坐标文字
    d3.select('#p_barp_xaxis')
        .selectAll('text')
        .attr('y','15');

    /***********定义径向渐进颜色**********************/
    // 定义径向渐进颜色
    var _gcolor=p_svg.append("g")
        .attr("class","gcolor");
    var _defs=_gcolor.append("defs");
    var b = d3.rgb(7,79,168);
    var a = d3.rgb(94,201,239);
    var _colorGradient = _defs.append("linearGradient")
        .attr("x1","0%")
        .attr("y1","0%")
        .attr("x2","0%")
        .attr("y2","100%")
        .attr("id","linearColor_1");
    var stop1 = _colorGradient.append("stop")
        .attr("offset","0%")
        .style("stop-color",a.toString());
    var stop2 = _colorGradient.append("stop")
        .attr("offset","100%")
        .style("stop-color",b.toString());

    //定义G组存放柱形图
    var p_gbar = p_g2.append('g')
        .selectAll('rect')
        .data(p_ydata)
        .enter()
        .append('rect')
        .attr('width', p_bandScale.bandwidth())
        .attr('x', function (d, i) {return p_bandScale(p_xdata[i]);})
        .attr('y',p_yaxisHeight)
        .attr('height',0)
        .style('fill', 'url(#'+_colorGradient.attr("id")+')')
        //鼠标经过经过
        .on("mouseover",function(d,i){
            p_tooltipdiv.style("top",d3.event.y+25+'px')
                .style("left",d3.event.x+25+"px")
                .style("display",'block')
                .html(p_xdata[i]+"<br />招聘数量:"+d);
        })

        .on("mousemove",function(d){
            p_tooltipdiv.style("top",d3.event.y+25+'px')
                .style("left",d3.event.x+25+"px")
        })
        //鼠标移动
        .on("mouseout",function(d,i){p_tooltipdiv.style("display",'none')})

        //过渡效果
        .transition()
        .duration(1000) //过渡时间
        .attr('y', function (d, i) {
            return p_lineScale(d);
        })
        .attr('height', function (d, i) {
            return p_yaxisHeight - p_lineScale(d);
        });


    //为柱形图添加文本
    //定义G组，存放文本
    var p_gtext = p_g2.append('g')
        .selectAll('text')
        .data(p_ydata)
        .enter()
        .append('text')
        .attr('x', function (d, i) {
            return p_bandScale(p_xdata[i]);
        })
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .attr('dx', p_bandScale.bandwidth() / 2)
        .style('fill', '#ffffff')
        .transition()
        .duration(1000)
        .tween("text",function(d){
            var node=this;
            return function(t){
                node.textContent=Math.round(t*d);
                node.setAttribute("y",p_lineScale(t*d));
            }
        });
        p_drawYaxisGrid(p_divname,p_xaxisWidth);
        p_drawXaxisGrid(p_divname,p_yaxisHeight);

}

    //图表标题
    var p_title =p_svg.append('g')
        .attr('transform','translate(30,50)')
        .append('text')
        .attr('x',30)
        .attr('y',40)
        .text('公司发展阶段')
        .attr('font-size','2em')
        .attr('text-align','center');

    function p_drawXaxisGrid(p_divname,p_yaxisheight){
    //给X轴加网格
    d3.select('#'+p_divname+'p_xaxis')
        .selectAll('g')
        .append('line')
        .attr('x1', 0)
        .attr('y1', -p_yaxisheight)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', '#000000')
        .attr('stroke-width', 1);
    }

    function p_drawYaxisGrid(p_divname,p_xaxiswidth){
    //给Y轴加网格
    d3.select('#'+p_divname+'p_yaxis')
        .selectAll('g')
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', p_xaxiswidth)
        .attr('y2', 0)
        .attr('stroke', '#000000')
        .attr('stroke-width', 1)
    }



