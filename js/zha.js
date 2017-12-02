/**
 * Created by Administrator on 2017/10/17.
 */
function drawBar(divname,ydata,xdata){
    //1.定义SVG宽及高
    var svgwidth=$("#"+divname).width();
    var svgheight=$("#"+divname).height();
    //2.定义整体svg
    var _svg=d3.select("#"+divname)
        .append('svg')
        .attr("width",svgwidth)
        .attr("height",svgheight);
    //3.真正画图可能要与画框之间都有一个边距,我们定义margin(即实现绘图区与SVG四边有距离)
    var _margin={top:10,left:30,right:10,bottom:30};
    //4.定义G组，实现绘图区
    var _gdraw1=_svg.append("g")
        .attr("transform","translate("+_margin.left+","+_margin.top+")")
        .attr("id","gdraw1")
    //5.定义title，给其设高
    var _titleHeight=30;
    //6.定义G组，实现绘图区（去标题高度之后）
    var _gdraw2=_gdraw1.append("g")
        .attr("transform","translate(0,"+_titleHeight+")")
        .attr("id","gdraw2");
    //7.定义核心绘图区与周边距离：
    var _chartmargin={top:20,left:20,right:20,bottom:20};
    //8.计算出绘图区的宽与高;
    var chartheight=svgheight-_margin.top-_margin.bottom-_titleHeight;
    var chartwidth=svgwidth-_margin.left-_margin.right;
    //9.计算出核心绘图区的宽与高（x轴和y轴）
    var yaxisheight=chartheight-_chartmargin.bottom-_chartmargin.top;
    var xaxiswidth=chartwidth-_chartmargin.left-_chartmargin.right;
    //10.定义G组，绘制核心绘图区以添加y轴
    var gyaxis=_gdraw2.append("g")
        .attr("class",divname+"yaxis");
    //11.定义G组：以存X轴
    var gxaxis=_gdraw2.append("g")
        .attr("class",divname+"xaxis")
        .attr("transform","translate(0,"+yaxisheight+")");
    //12.定义x轴：
    var _bandscale=d3.scaleBand()
        .padding(0.4)
        .domain(xdata)
        .range([0,chartwidth-_chartmargin.left-_chartmargin.right]);
    //13.生成x轴
    var xaxis=d3.axisBottom()
        .scale(_bandscale);
    xaxis(gxaxis);
    gxaxis.selectAll("text")
        .attr("fill","rgba(255,255,255,.8)");
    gxaxis.selectAll("path")
        .attr("stroke","rgba(255,255,255,.8)");
    gxaxis.selectAll("line")
        .attr("stroke","rgba(255,255,255,.8)");
    //14.定义y轴
    var _linescale=d3.scaleLinear()
        .domain([0,d3.max(ydata)])
        .range([yaxisheight,0]);
    //15.生成y轴
    var yaxis=d3.axisLeft()
        .scale(_linescale);
    //16。绘制Y轴
    yaxis(gyaxis);
    gyaxis.selectAll("text")
        .attr("fill","rgba(255,255,255,.8)");
    gyaxis.selectAll("path")
        .attr("stroke","rgba(255,255,255,.8)");
    gyaxis.selectAll("line")
        .attr("stroke","rgba(255,255,255,.8)");
    //以下画柱形图：
    //以下画柱形图：
    /*  //1.定义数据：
     var dataset=[200,130,220,345,456,432,280];
     var xlabel=['0~50','50~100','100~200','200~500','500~1000','1000~2000','>2000'];*/
    var _tooltipdiv=d3.select("#"+divname)
        .append("div")
        .attr("class","ztooltip");
    //2.定义G组，存放柱形图：
    var gbar=_gdraw2.append("g")
        .attr("class","rectParent")
        .selectAll("rect")
        .data(ydata)
        .enter()
        .append("rect")
        .attr("class","rectG")
        .attr("x",function(d,i){
            return _bandscale(xdata[i])
        })
        .attr("width",_bandscale.bandwidth())
        .attr("fill","steelblue")
        .attr("height",0)
        .attr("y",yaxisheight)
        .on("mouseover",function(d,i){
            _tooltipdiv.style("top",d3.event.offsetY+'px')
                .style("left",d3.event.offsetX+'px')
                .style("opacity",1)
                .html(xdata[i]+"<br />岗位需求:"+d);
            $(this).attr("fill","green");
            console.log(d3.event)
            clearInterval(myset)

        })
        .on("mousemove",function(d){
            _tooltipdiv.style("top",d3.event.offsetY+'px')
                .style("left",d3.event.offsetX+"px");
        })
        .on("mouseout",function(d,i){
            _tooltipdiv.style("opacity",0);
          $(this).attr("fill","steelblue");
            myset=setInterval(start,5000);

        })
        .transition()
        .duration(1*1000)
        .attr("y",function(d,i){
            return _linescale(d);
        })
        .attr("height",function(d,i){
            return yaxisheight-_linescale(d);
        });
    //以下在柱形图上添加文本
    //1.定义G组，存放添加的文本
    var gtext=_gdraw2.append("g")
        .selectAll("text")
        .data(ydata)
        .enter()
        .append("text")
        .attr("class","text")
        .attr("x",function(d,i){
            return _bandscale(xdata[i]);
        })
        .attr("text-anchor","middle")
        .attr("dx",_bandscale.bandwidth()/2)
        .attr("dy","1em")
        .style("fill","red")
        .transition()
        .duration(1*1000)
        .tween("text",function(d){
            var node=this;
            return function(t){
                node.textContent=Math.round(t*d);
                node.setAttribute("y",_linescale(t*d));
            }
        });
    //添加文字
    var _textdiv=d3.select("#"+divname)
        .append("div")
        .attr("id","textdiv")
        .text("2017年各大城市大数据职位需求");

    //以下为在柱形图上添加网络线：
    //1.添加Y轴方向的分割线，即背景网格线
    if(bool){
        d3.select("#"+divname+"yaxis")
            .selectAll("g")
            .append("line")
            .attr("x1",0)
            .attr("y1",0)
            .attr("x2",xaxiswidth)
            .attr("y2",0)
            .attr("stroke","#cccccc")
            .attr("stroke-width",1);
        //2.添加x轴方向的分割线：
        d3.select("#"+divname+"xaxis")
            .selectAll("g")
            .append("line")
            .attr("x1",0)
            .attr("y1",-yaxisheight)
            .attr("x2",0)
            .attr("y2",0)
            .attr("stroke","#cccccc")
            .attr("stroke-width",1)
    }
}
function drawpie(datas,values) {
    var flag=1;
    var flag1=1;
    d3.select("#wrapSvg")
        .append('defs')
        .style("opacity", 0)
        .html('<filter id="f1" x="-1" y="-1" width="2" height="2">\
                    <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />\
                    <feColorMatrix result = "matrixOut" in = "offOut" type = "matrix" values = "0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0"/>\
                    <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2" />\
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />\
                    </filter>');
    var www=d3.select("#wrapSvg")._groups[0][0].clientWidth;
    //饼状数据
    var pieD = d3.pie()
        .padAngle(0.005 * Math.PI);
    var _arc = d3.arc()
        .outerRadius(100)
        .innerRadius(0);
    var _arc1 = d3.arc()
        .outerRadius(130)
        .innerRadius(100);
    //添加组，组内包括path，折线，和名称text
    var pathA = d3.select("#wrapSvg")
        .selectAll(".pie")
        .data(datas)
        .enter()
        .append("g")
        .on("mouseenter", function (d, i) {
            //鼠标坐标
            var x = d3.event.offsetX;
            var y = d3.event.offsetY;
            //百分比
            var pre =(d[1] / d3.sum(values) * 100).toFixed(2) + "%";
            var pre1=d[1]+"个";
            //添加提示框

            d3.select("#wrap")
                .append("div")
                .style("position", "absolute")
                .style("top", y + 15 + "px")
                .style("right", x + 15 + "px")
                .attr("class", "tipTool")
                .html(d[0] + "<br/>职位需求：" + d[1] + "<br/>占比：" + pre);
            //更改环中心文本
            d3.select("#wrapSvg").select("#showName")
                .text(d[0])
                .style("fill","rgba(255,255,255,.8)");
            d3.select("#wrapSvg").select("#showValue")
                .text(pre1)
                .style("fill","rgba(255,255,255,.8)");
            //更改图例颜色
            d3.select("#wrapSvg").selectAll(".tools")
                .attr("fill", function (d, i) {
                    return d3.selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
                });
            d3.select(d3.select("#wrapSvg").selectAll(".tools")._groups[0][i])
                .attr("fill", "rgba(255,0,0,.8)");
            //更改滤镜阴影的偏移
            d3.select("#wrapSvg").selectAll("feOffset")
                .attr("dx", function () {
                    return (_arc.centroid(pieD(values)[i])[0] / 15).toFixed(0);
                })
                .attr("dy", function (d) {
                    return (_arc.centroid(pieD(values)[i])[1] / 15).toFixed(0);
                });
            //更改滤镜阴影的生成范围
            d3.select("#wrapSvg").select("filter")
                .attr("x", function () {
                    if ((_arc.centroid(pieD(values)[i])[0] / 15) >= 0) {
                        return "0";
                    } else {
                        return "-0.3";
                    }
                })
                .attr("y", function () {
                    if ((_arc.centroid(pieD(values)[i])[1] / 15) >= 0) {
                        return "0";
                    } else {
                        return "-0.3";
                    }
                });
            //path圆环的动态效果，过渡
            d3.select("#wrapSvg").selectAll("path")
                .transition()
                .duration(500)
                .attr("transform", "translate(250,250) scale(1)")//还原所有path圆环的大小
                .transition()
                .attr("filter", "");//删除滤镜链接
            d3.select(this).select("path")
                .transition()
                .duration(600)
                .attr("transform", "translate(250,250) scale(1.08)")//path圆环的放大
                .attr("filter", "url(#f1)");//链接滤镜阴影
            //动态过渡滤镜阴影的透明度
            d3.select("#wrapSvg").select("feColorMatrix")
                .transition()
                .duration(200)
                .attrTween("values", function () {
                    return function (t) {
                        return "0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 " + t + " 0";
                    }
                });
            clearInterval(myset);
            //点击标记
            if (flag == 0) {
                flag = 1;
                flag1 = 0;
            } else {
                flag = 1;
                flag1 = 1;
            }
        })
        .on("mousemove", function (d, i) {
            var x = d3.event.offsetX;
            var y = d3.event.offsetY;
            //提示框的移动
            d3.select(".tipTool")
                .style("top", y + 15 + "px")
                .style("left", x + 15 + "px")
        })
        .on("mouseleave", function (d, i) {
            //删除提示框
            d3.select(".tipTool").remove();
            //判断点击事件
            if (flag == 1 && flag1 == 1) {
                //动态过渡滤镜阴影的透明度
                d3.select("#wrapSvg").select("feColorMatrix")
                    .transition()
                    .duration(500)
                    .attrTween("values", function () {
                        return function (t) {
                            return "0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 " + (1 - t) + " 0";
                        }
                    });
                //还原圆环状态
                d3.select(this)
                    .select("path")
                    .transition()
                    .duration(500)
                    .attr("transform", "translate(250,250) scale(1)")//还原大小
                    .transition()
                    .attr("filter", "");//删除滤镜链接
                //还原图例颜色
                d3.select("#wrapSvg").selectAll(".tools")
                    .attr("fill", function (d, i) {
                        return d3.selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
                    });
                myset=setInterval(start,5000);
            }
        })
        .on("click", function (d, i) {
            flag = 0;
            if (flag1 == 1) {
                flag1 = 0;
            } else {
                flag1 = 1;
            }
        });
    //生成path圆环
    pathA.append("path")
        .attr("class", "arcs")
        .attr("transform", "translate(250,250)")
        .attr("fill", function (d, i) {
            return d3.schemeCategory20[i];//随机颜色
        })
        .transition()
        .duration(500)
        //生成时的动态效果
        .attrTween("path", function (d, i) {
            var mm = pieD(values)[i];
            var ts = this;
            var endA = mm.endAngle;
            return function (t) {
                mm.endAngle = mm.startAngle + (endA - mm.startAngle) * t;
                d3.select(ts)
                    .attr("d", _arc(mm))
            }
        });
    //生成折线
    pathA.append("polyline")
        .attr("transform", "translate(250,250)")
        .transition()
        .delay(500)
        .attr("points", function (d, i) {
            //70,130尺寸下的起始点，折线
            var x1 = _arc.centroid(pieD(values)[i])[0];
            var y1 = _arc.centroid(pieD(values)[i])[1];
            //130,170尺寸下的第二个点，折线
            var x2 = _arc1.centroid(pieD(values)[i])[0];
            var y2 = _arc1.centroid(pieD(values)[i])[1];
            //判断path相对于圆环中心点的位置,并生成第三个折线点
            if (x2 >= 0) {
                //右侧
                var x3 = _arc1.centroid(pieD(values)[i])[0] + 20;
                var y3 = _arc1.centroid(pieD(values)[i])[1];
            } else {
                //左侧
                var x3 = _arc1.centroid(pieD(values)[i])[0] - 20;
                var y3 = _arc1.centroid(pieD(values)[i])[1];
            }
            return x1 + "," + y1 + " " + x2 + "," + y2 + " " + x3 + "," + y3
        })
        .attr("stroke", function (d, i) {
            console.log(d3.selectAll(".arcs"));
            return d3.selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
        })
        .attr("stroke-width", 1)
        .attr("fill", "none");
    //生成折线旁的path名称文本
    pathA.append("text")
        .attr("transform", "translate(250,250)")
        .attr("x", function (d, i) {
            //相对应折线的第三个点
            var x3 = _arc1.centroid(pieD(values)[i])[0];
            if (x3 >= 0) {
                x3 = _arc1.centroid(pieD(values)[i])[0] + 24;
            } else {
                x3 = _arc1.centroid(pieD(values)[i])[0] - 24;
            }
            return x3;
        })
        .attr("y", function (d, i) {
            //相对应折线的第三个点
            var y2 = _arc1.centroid(pieD(values)[i])[1];
            return y2 + 5;
        })
        .attr("text-anchor", function (d, i) {
            //判断path相对于圆环中心点的位置,并设置文本对齐方式
            var x3 = _arc1.centroid(pieD(values)[i])[0];
            if (x3 >= 0) {
                return "start";
            } else {
                return "end";
            }
        })
        .attr("font-size", "12px")
        .attr("fill", function (d, i) {
            return d3.selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
        })
        .transition()
        .delay(500)
        .text(function (d) {
            return d[0];
        });

    //生成圆环中心文本
    d3.select("#wrapSvg").append("text")
        .attr("id", "showName")
        .attr("x", 250)
        .attr("y", 375)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(function () {
            //初始文本为最大值信息
            var i = d3.scan(datas, function (a, b) {
                return b[1] - a[1];
            });
            return datas[i][0];
        })
        .style("fill","rgba(255,255,255,.8)");
    d3.select("#wrapSvg").append("text")
        .attr("id", "showValue")
        .attr("x",250)
        .attr("y", 405)
        .attr("text-anchor", "middle")
        .style("font-size", "26px")
        .text(function () {
            //初始文本为最大值信息
            var i = d3.scan(datas, function (a, b) {
                return b[1] - a[1];
            });
            return datas[i][1]+"个";
        })
        .style("fill","rgba(255,255,255,.8)");
    //生成图的标题
    d3.select("#wrapSvg").append("text")
        .attr("id", "title")
        .attr("x", www-10)
        .attr("y", 50)
        .style("fill","rgba(255,255,255,.8)")
        .style("font-size", "20px")
        .attr("text-anchor", "end")
        .attr("fill", "#fff")
        .text(""+_dataset11[0][k]+"市大数据岗位需求前五名");

    //添加图例
    var g = d3.select("#wrapSvg").append("g")//图例总的组
        .attr("id", "tool")
        .selectAll(".tools")
        .data(datas)
        .enter()
        .append("g")//图例各个分组
        .attr("cursor", "pointer")
        .attr("class", "tools")
        .attr("transform", function (d, i) {
            a = 10;
            b = 30 + i *18;
            return "translate(" + a + "," + b + ")"
        })
        .attr("fill", function (d, i) {
            return d3.selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
        })
        //图例的点击事件
        .on("click", function (d, i) {
            var pre = (d[1] / d3.sum(values) * 100).toFixed(2) + "%";
            //更改滤镜的阴影偏移
            d3.select("#wrapSvg").selectAll("feOffset")
                .attr("dx", function () {
                    return (_arc.centroid(pieD(values)[i])[0] / 15).toFixed(0);
                })
                .attr("dy", function (d) {
                    return (_arc.centroid(pieD(values)[i])[1] / 15).toFixed(0);
                });
            //更改滤镜的透明度
            d3.select("#wrapSvg").select("feColorMatrix")
                .transition()
                .duration(200)
                .attrTween("values", function () {
                    return function (t) {
                        return "0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 " + t + " 0";
                    }
                });
            //更改滤镜的阴影的范围
            d3.select("#wrapSvg").select("filter")
                .attr("x", function () {
                    if ((_arc.centroid(pieD(values)[i])[0] / 15) >= 0) {
                        return "0";
                    } else {
                        return "-0.3";
                    }
                })
                .attr("y", function () {
                    if ((_arc.centroid(pieD(values)[i])[1] / 15) >= 0) {
                        return "0";
                    } else {
                        return "-0.3";
                    }
                });
            //还原所有图例颜色
            d3.select("#wrapSvg").selectAll(".tools")
                .attr("fill", function (d, i) {
                    return d3.selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
                });
            //改变图例颜色
            d3.select(this)
                .attr("fill", "rgba(255,0,0,.8)");
            //path的动态过度
            d3.select("#wrapSvg").selectAll("path")
                .transition()
                .duration(500)
                .attr("transform", "translate(250,250) scale(1)")//还原所有path大小
                .transition()
                .attr("filter", "");//删除滤镜链接
            d3.select(d3.select("#wrapSvg").selectAll("path")._groups[0][i])
                .transition()
                .duration(500)
                .attr("transform", "translate(250,250) scale(1.08)")//放大path
                .attr("filter", "url(#f1)");//链接滤镜
            //更改圆环中心文本
            d3.select("#wrapSvg").select("#showName")
                .text(d[0]);
            d3.select("#wrapSvg").select("#showValue")
                .text(pre);
            //点击标记
            if (flag1 == 1) {
                flag1 = 0;
                clearInterval(myset);
            } else {
                flag1 = 1;
                myset=setInterval(start,5000);
            }
        });
    //图例添加颜色框，和文本
    g.append("text")
        .text(function (d) {
            return d[0];
        })
        .attr("transform", "translate(20,5)");
    g.append("circle")
        .text(function (d) {
            return d[0];
        })
        .attr("cx", 10)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", function (d, i) {
            return d3.selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
        });
}
function start(){
    var p=d3.selectAll(".rectG")
        .style("fill","steelblue");
    d3.select(p._groups[0][k])
        .style("fill","green");
    d3.select("#wrapSvg").remove();
    d3.select("#wrap")
        .append("svg")
        .attr("id","wrapSvg");
    console.log(_dataset11[0][k]);
    values=d3.transpose(dataset12[_dataset11[0][k]])[1];
    console.log(values);
    datas=dataset12[_dataset11[0][k]];
    console.log(datas);
    drawpie(datas,values);
    k++;
    if(k>4){
        k=0
    }
}