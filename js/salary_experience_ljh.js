/**
 * Created by Administrator on 2017/10/16.
 */
//可视化数据
function drawBarTt(divName,xdata,ydata,ydataT,bool){
    //定义鼠标悬停提示信息
    var _tooltipArea=d3.select("#"+divName)
        .append("g")
        .attr("class","tooltipTt");
    //1.定义svg宽高
    var svgwidth=$("#"+divName).width();
    var svgheight=$("#"+divName).height();
    //2.定义整体svg
    var _svg=d3.select("#"+divName)
        .append('svg')
        .attr('width',svgwidth)
        .attr('height',svgheight);
    //.style('background-color','gray');
    //3.真正画图可能要与画框之间都有一个边距,我们定义外边距(即实现绘图区与svg四边有距离)
    var _margin={top:10,left:50,right:10,bottom:30};
    //4.定义G组,实现绘图区域
    var _gdraw1=_svg.append('g')
        .attr('transform','translate('+_margin.left+','+_margin.top+')')
        .attr('id','gdraw1');
    //5.定义title，给其设定高度
    var _titleHeight=50;
    //6.定义G组，实现绘图区（去标题高度之后）
    var _gdraw2=_gdraw1.append("g")
        .attr('transform','translate(0,'+_titleHeight+')')
        .attr('id','gdraw2');
    //7.定义核心绘图区与周边距离
    var _chartmargin={top:20,left:20,right:20,bottom:20};
    //8.计算出绘图区的宽与高
    var chartwidth=svgwidth-_margin.left-_margin.right;
    var chartheight=svgheight-_margin.top-_margin.bottom-_titleHeight;
    //9.计算出核心绘图区的宽和高(x轴和y轴)
    var xaxiswidth=chartwidth-_chartmargin.left-_chartmargin.right;
    var yaxisheight=chartheight-_chartmargin.top-_chartmargin.bottom;
    //10.定义G组,以添加x轴
    var gxaxis=_gdraw2.append('g')
        .attr('id',divName+'xaxis')
        .attr('transform','translate(0,'+yaxisheight+')');
    //11.定义x轴
    var _bandscale=d3.scaleBand()
        .padding(0.2)
        .domain(xdata)
        .range([0,xaxiswidth]);
    //12.生成x轴
    var xaxis=d3.axisBottom()
        .scale(_bandscale);
    //13.定义G组以添加y轴
    //左侧y轴
    var gyaxis=_gdraw2.append('g')
        .attr('id',divName+'yaxis');
    //右侧y轴(折线图)
    var gyaxisT=_gdraw2.append('g')
        .attr('id',divName+'yaxisT')
        .attr('transform','translate('+xaxiswidth+',0)');
    //14.定义y轴
    var _linescale=d3.scaleLinear()
        .domain([0,(d3.max(ydata)+10)]).nice()
        .range([yaxisheight,0]);
    var _linescaleT=d3.scaleLinear()
        .domain([0,(d3.max(ydataT)+10)]).nice()
        .range([yaxisheight,0]);
    //15.生成y轴
    var yaxis=d3.axisLeft()
        .scale(_linescale);
    var yaxisT=d3.axisRight()
        .scale(_linescaleT);
    //16.绘制y轴
    yaxis(gyaxis);
    yaxisT(gyaxisT);
    //17.绘制x轴
    xaxis(gxaxis);
    //18.设置图形经过互动的g组
    var _rectHover=_gdraw2.append("g");
    //19.定义坐标轴相关颜色
    //定义X轴
    d3.select('#'+divName+'xaxis')
        .selectAll('line')
        .attr('stroke', 'none');//x轴刻度线颜色
    d3.select('#'+divName+'xaxis')
        .selectAll('text')
        .attr('fill', '#fff')//x轴文字颜色
        .attr("font-size",'12px')
        .attr("transform","translate(-10,18) rotate(-60)");
    d3.select('#'+divName+'xaxis')
        .selectAll('path')
        .attr('stroke', '#fff');//x轴颜色
    //定义左侧Y轴
    d3.select('#'+divName+'yaxis')
        .selectAll('line')
        .attr('stroke', 'none');//y轴刻度线颜色
    d3.select('#'+divName+'yaxis')
        .selectAll('text')
        .attr('fill', '#fff');//y轴文字颜色
    d3.select('#'+divName+'yaxis')
        .selectAll('path')
        .attr('stroke', '#fff');//y轴颜色
    //定义右侧Y轴
    d3.select('#'+divName+'yaxisT')
        .selectAll('line')
        .attr('stroke', 'none');//y轴刻度线颜色
    d3.select('#'+divName+'yaxisT')
        .selectAll('text')
        .attr('fill', '#fff');//y轴文字颜色
    d3.select('#'+divName+'yaxisT')
        .selectAll('path')
        .attr('stroke', '#fff');//y轴颜色
    //设置渐变色
    var _g = _gdraw2.append('defs')
        .append('linearGradient')
        .attr('id', 'barTt')
        .attr('x1', '0')
        .attr('y1', '0')
        .attr('x2', '0')
        .attr('y2', '100%');
    _g.append('stop')
        .attr('offset', '0%')
        .style('stop-color', '#fff')
        .style('stop-opacity', '0.8');
    _g.append('stop')
        .attr('offset', '100%')
        .style('stop-color', '#336699')
        .style('stop-opacity', '0.9');
    //19.添加柱形图
    var rectwidth=_bandscale.bandwidth();
    //定义数据
    _group1=_gdraw2.append('g')
        .attr('class','rects');
    _rectT=_group1.selectAll("rect")
        .data(ydata)
        .enter()
        .append("rect")
        .attr("id","allRectT")
        .attr("x",function(d,i){
            return _bandscale(xdata[i]);
        })
        .attr("y",yaxisheight)
        .attr('width',rectwidth)
        .attr("height",0)
        .style('fill','url(#barTt)')
        .on("click",function(){
            d3.select(this.parentNode)
                .selectAll("rect")
                .style("fill","url(#barTt)");
            d3.select(this).style("fill","steelblue");
        })
        .on("mouseover",function(d,i){
            //设置文本框提示内容
            _tooltipArea.style("top",d3.event.clientY+5+'px')
                .style("left",d3.event.clientX+5+'px')
                .style("display","block")
                .html(xdata[i]+"<br/>薪资："+d);
            //设置鼠标经过显示的柱形图
            _rectHover.append('rect')
                .attr('x', function () {
                    return _bandscale(xdata[i]) - 0.1 * rectwidth;
                })
                .attr('y', 0)
                .attr('width', 1.2 * rectwidth)
                .attr('height', yaxisheight)
                .attr('fill', 'rgba(255,255,255,.2)');
        })
        .on("mousemove",function(d){
            _tooltipArea.style("top",d3.event.pageY+5+'px')
                .style("left",d3.event.pageX+5+'px')
        })
        .on("mouseout",function(){
            //鼠标离开柱图提示框消失
            _tooltipArea.style("display","none");
            //鼠标离开柱图新建柱图效果消失
            _rectHover.select("rect").remove();
        })
        .transition()
        .duration(1500)
        .ease(d3.easeBounce)
        .attr("y",function(d,i){
            return _linescale(d);
        })
        .attr("height",function(d){
            return yaxisheight-_linescale(d);
        });
    //19.柱形图添加文字
    _text=_group1.selectAll("text")
        .data(ydata)
        .enter()
        .append("text")
        .attr("x",function(data,i){
            return _bandscale(xdata[i]);
        })
        /*.attr('y',function(d){
         return _linescale(d);
         })*/
        .attr('font-size','14px')
        .attr('fill','#000000')
        .attr('text-anchor','middle')
        .attr('dx',rectwidth/2)
        .attr('dy','1em')
        .transition()
        .duration(1500)
        .tween("text",function(d){
            var node=this;
            return function(t){
                node.textContent=Math.round(t*d);
                node.setAttribute("y",_linescale(t*d))
            }
        });
    //20.以下使用线段生成器生成path,添加折线图
    var _line=d3.line()
        .x(function(d){
            return _bandscale(d[0])+_bandscale.bandwidth()/2
        })
        .y(function(d){
            return _linescaleT(d[1])
        })
        .curve(d3.curveNatural);//生成带弧度的曲线
    var datasetT=d3.zip(xdata,ydataT);
    //console.log(_line(dataset));//生成的路径
    _gdraw2.append("g")
        .append("path")
        .attr("class","g_zx")
        .attr("d",_line(datasetT))
        .on("mouseover",function(){
            d3.select(this).style("stroke","green");
        })
        .on("mouseout",function(){
            d3.select(this).style("stroke","blue");
        })
        .style("stroke","blue")
        .style("stroke-width","2px")
        .style("fill","none");
    //21.添加每个折线的节点
    _gdraw2.append("g")
        .attr("id","g_zxjd")
        .selectAll("circle")
        .data(xdata)
        .enter()
        .append("circle")
        .attr("cx",0)
        .attr("cy",yaxisheight)
        .transition()
        .duration(1000)
        .attr("cx",function(d,i){
            return _bandscale(xdata[i])+_bandscale.bandwidth()/2;
        })
        .attr("cy",function(d,i){
            return _linescaleT(ydataT[i]);
        })
        .attr("r",5)
        .attr("fill","green");
    //折线图添加文字
    _group2=_gdraw2.append('g')
        .attr('class','zxT');
    _text=_group2.selectAll("text")
        .data(ydataT)
        .enter()
        .append("text")
        .attr("x",function(data,i){
            return _bandscale(xdata[i]);
        })
        .attr('font-size','14px')
        .attr('fill','#000000')
        .attr('text-anchor','middle')
        .attr('dx',rectwidth)
        .attr('dy','0.4em')
        .transition()
        .duration(1500)
        .tween("text",function(d){
            var node=this;
            return function(t){
                node.textContent=Math.round(t*d);
                node.setAttribute("y",_linescaleT(t*d))
            }
        });
    //给折线生成添加动画。
    var path = document.getElementsByClassName('g_zx');  //获取class标签为line的元素
    var length = path[0].getTotalLength();               //获取第一个折线的总共的长度
    d3.select('.g_zx')
        .style('stroke-dasharray', length)//stroke-dasharray设置线段间隔长度
        .style('stroke-dashoffset',length)//stroke-dashoffset线段的偏移量
        .transition()
        .duration(1400)
        .ease(d3.easeCubic)
        .delay(600)
        .style('stroke-dashoffset',0);
    //添加标题
    _group3=_gdraw1.append('g')
        .attr('class','legendT');
    var txt=["薪资与工作经验"];
    _title=_group3.selectAll("text")
        .attr("class","titleT")
        .data(txt)
        .enter()
        .append("text")
        .attr("x",0)
        .attr('y',30)
        .attr('font-size','20px')
        .attr('fill','#ffffff')
        .text(["薪资与工作经验"]);
    //添加区分柱形图和折线图的图例
    var arrayT=[0];//设置任意值的长度为1的数组
    _group3.append("g")
        .selectAll("rect")
        .data(arrayT)
        .enter()
        .append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr('width',30)
        .attr("height",20)
        .style('fill','url(#barTt)')
        .attr("transform","translate("+(xaxiswidth-165)+",15)");
    _group3.append("g")
        .selectAll("text")
        .data(txt)
        .enter()
        .append("text")
        .attr("x",xaxiswidth-130)
        .attr('y',30)
        .attr('font-size','14px')
        .attr('fill','#ffffff')
        .text(["可视化"]);
    _group3.append("g")
        .selectAll("line")
        .data(txt)
        .enter()
        .append("line")
        .attr("x1",xaxiswidth-75)
        .attr('y1',25)
        .attr("x2",xaxiswidth-45)
        .attr('y2',25)
        .attr("stroke-width","2px")
        .attr("stroke","blue");
    _group3.append("g")
        .selectAll("text")
        .data(txt)
        .enter()
        .append("text")
        .attr("x",xaxiswidth-40)
        .attr('y',30)
        .attr('font-size','14px')
        .attr('fill','#ffffff')
        .text(["开发"]);
    //根据形参判断是否添加网格线
    if(bool==true){
        drawXGridLineTt(divName,xaxiswidth);
        drawYGridLineTt(divName,yaxisheight);
    }
}
//添加网格线
function drawXGridLineTt(divName,xaxiswidth){
    //添加Y轴分割线
    d3.select("#"+divName+"yaxis")
        .selectAll('g')
        .append("line")
        .attr('x1',0)
        .attr('y1',0)
        .attr('x2',xaxiswidth)
        .attr('y2','0')
        .attr('stroke','#cccccc')
        .attr('stoke-width','1');
}
function drawYGridLineTt(divName,yaxisheight) {
    //添加X轴分割线
    d3.select("#" + divName + "xaxis")
        .selectAll('g')
        .append("line")
        .attr('x1', '0')
        .attr('y1', -yaxisheight)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', '#cccccc')
        .attr('stoke-width', '1');
}