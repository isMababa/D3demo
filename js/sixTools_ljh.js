/**
 * Created by Administrator on 2017/10/16.
 */
function lbpieTt(){
    var datas=[
        ['D3.js',33.33],
        ['Echarts',29.63],
        ['Tableau',11.11],
        ['webGL',9.26],
        ['HighCharts',9.26],
        ['Three.js',7.41]
    ];
    var flag=1;//点击标记
    var flag1=1;//点击标记
    d3.select("#chart2Tt").select("svg").remove();
    d3.select("#chart2Tt").select(".tipToolT").remove();
    pieTt('chart2Tt',datas);
    //定时器改变环内文本
    if(countT>4){
        countT=0;
    }
    d3.select("#chart2Tt").select("#showNameT").text(datas[countT][0]);
    d3.select("#chart2Tt").select("#showValueT").text(datas[countT][1]+"%");
    countT++;
}

function pieTt(divName,datas){
    //datas的value值组成的数组
    var values=d3.transpose(datas)[1];
//设置svg画布宽高
    var _svgwidth=$("#"+divName).width();
    var _svgheight=$("#"+divName).height();
    //定义整体svg
    var _svg=d3.select("#"+divName)
        .append('svg')
        .attr('width',_svgwidth)
        .attr('height',_svgheight);
//添加滤镜
    d3.select("#"+divName).select("svg")
        .append('defs')
        .style("opacity",0)
        .html('<filter id="f1T" x="-1" y="-1" width="2" height="2">\
                    <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />\
                    <feColorMatrix result = "matrixOut" in = "offOut" type = "matrix" values = "0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0"/>\
                    <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2" />\
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />\
                    </filter>');

//饼状数据
    var pieD=d3.pie()
        .padAngle(0.005*Math.PI);
    var _arc=d3.arc()
        .outerRadius(_svgwidth/5)
        .innerRadius(_svgwidth/10);
    var _arc1=d3.arc()
        .outerRadius(_svgwidth/4)
        .innerRadius(_svgwidth/5);
//添加组，组内包括path，折线，和名称text
    var pathA=d3.select("#"+divName).select("svg").selectAll(".pie")
        .data(datas)
        .enter()
        .append("g")
        .on("mouseenter",function (d,i) {
            //鼠标坐标
            var x=d3.event.offsetX;
            var y=d3.event.offsetY;
            //百分比
            var pre=(d[1]/d3.sum(values)*100).toFixed(2)+"%";
            //添加提示框
            d3.select("#"+divName)
                .append("div")
                .style("position","absolute")
                .style("top",y+15+"px")
                .style("left",x+15+"px")
                .attr("class","tipToolT")
                .html(d[0]+"<br/>占比："+pre);
            //更改环中心文本
            d3.select("#showNameT")
                .text(d[0]);
            d3.select("#showValueT")
                .text(pre);
            //清除改变环内文字的定时器
            clearInterval(changeTxtInterval);
            //更改图例文字颜色
            d3.select("#"+divName).selectAll(".toolsT")
                .attr("fill",function (d,i) {
                    return d3.select("#"+divName).selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
                });
            d3.select(d3.select("#"+divName).selectAll(".toolsT")._groups[0][i])
                .attr("fill","rgba(0,0,0,.3)");
            //更改滤镜阴影的偏移
            d3.select("#"+divName).selectAll("feOffset")
                .attr("dx",function () {
                    return (_arc .centroid(pieD(values)[i])[0]/15).toFixed(0);
                })
                .attr("dy",function (d) {
                    return (_arc .centroid(pieD(values)[i])[1]/15).toFixed(0);
                });
            //更改滤镜阴影的生成范围
            d3.select("#"+divName).select("filter")
                .attr("x",function () {
                    if((_arc .centroid(pieD(values)[i])[0]/15)>=0){
                        return "0";
                    }else{
                        return "-0.3";
                    }
                })
                .attr("y",function () {
                    if((_arc .centroid(pieD(values)[i])[1]/15)>=0){
                        return "0";
                    }else{
                        return "-0.3";
                    }
                });
            //path圆环的动态效果，过渡
            d3.select("#"+divName).selectAll("path")
                .transition()
                .duration(500)
                .attr("transform","translate("+_svgwidth/2+","+_svgheight/2+") scale(1)")//还原所有path圆环的大小
                .transition()
                .attr("filter","");//删除滤镜链接
            d3.select(this).select("path")
                .transition()
                .duration(600)
                .attr("transform","translate("+_svgwidth/2+","+_svgheight/2+") scale(1.08)")//path圆环的放大
                .attr("filter","url(#f1T)");//链接滤镜阴影
            //动态过渡滤镜阴影的透明度
            d3.select("#"+divName).select("feColorMatrix")
                .transition()
                .duration(200)
                .attrTween("values",function () {
                    return function (t) {
                        return "0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 "+t+" 0";
                    }
                });
            //点击标记
            if(flag==0){
                flag=1;
                flag1=0;
            }else{
                flag=1;
                flag1=1;
            }
        })
        .on("mousemove",function (d,i) {
            var x=d3.event.offsetX;
            var y=d3.event.offsetY;
            //提示框的移动
            d3.select("#"+divName).select(".tipToolT")
                .style("top",y+15+"px")
                .style("left",x+15+"px")
        })
        .on("mouseleave",function (d,i) {
            //删除提示框
            d3.select("#"+divName).select(".tipToolT").remove();
            //重新启动修改环内文字定时器
            changeTxtInterval=setInterval(lbpieTt,5000);
            //判断点击事件
            if(flag==1&&flag1==1) {
                //动态过渡滤镜阴影的透明度
                d3.select("#"+divName).select("feColorMatrix")
                    .transition()
                    .duration(500)
                    .attrTween("values",function () {
                        return function (t) {
                            return "0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 "+(1-t)+" 0";
                        }
                    });
                //还原圆环状态
                d3.select(this).select("path")
                    .transition()
                    .duration(500)
                    .attr("transform", "translate("+_svgwidth/2+","+_svgheight/2+") scale(1)")//还原大小
                    .transition()
                    .attr("filter","");//删除滤镜链接
                //还原图例颜色
                d3.select("#"+divName).selectAll(".toolsT")
                    .attr("fill",function (d,i) {
                        return d3.select("#"+divName).selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
                    });
            }
        })
        .on("click",function (d,i) {
            flag=0;
            if(flag1==1){
                flag1=0;
            }else{
                flag1=1;
            }
        });
//生成path圆环
    pathA.append("path")
        .attr("class","arcs")
        .attr("transform","translate("+_svgwidth/2+","+_svgheight/2+")")
        .attr("fill",function (d,i) {
            return d3.schemeCategory20[i];//随机颜色
        })
        .transition()
        .duration(500)
        //生成时的动态效果
        .attrTween("path",function (d,i) {
            var mm=pieD(values)[i];
            var ts=this;
            var endA=mm.endAngle;
            return function (t) {
                mm.endAngle=mm.startAngle+(endA-mm.startAngle)*t;
                d3.select(ts).attr("d",_arc(mm))
            }
        });
//生成折线
    pathA.append("polyline")
        .attr("transform","translate("+_svgwidth/2+","+_svgheight/2+")")
        .transition()
        .delay(500)
        .attr("points",function(d,i){
            //70,130尺寸下的起始点，折线
            var x1=_arc .centroid(pieD(values)[i])[0];
            var y1=_arc .centroid(pieD(values)[i])[1];
            //130,170尺寸下的第二个点，折线
            var x2=_arc1 .centroid(pieD(values)[i])[0];
            var y2=_arc1 .centroid(pieD(values)[i])[1];
            //判断path相对于圆环中心点的位置,并生成第三个折线点
            var x3,y3;
            if(x2>=0){
                //右侧
                x3=_arc1 .centroid(pieD(values)[i])[0]+20;
                y3=_arc1 .centroid(pieD(values)[i])[1];
            }else {
                //左侧
                x3 = _arc1.centroid(pieD(values)[i])[0]-20;
                y3 = _arc1.centroid(pieD(values)[i])[1];
            }
            return x1+","+y1+" "+x2+","+y2+" "+x3+","+y3
        })
        .attr("stroke",function (d,i) {
            //console.log(d3.selectAll(".arcs"));
            return d3.select("#"+divName).selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
        })
        .attr("stroke-width",1)
        .attr("fill","none");
//生成折线旁的path名称文本
    pathA.append("text")
        .attr("transform","translate("+_svgwidth/2+","+_svgheight/2+")")
        .attr("x",function (d,i) {
            //相对应折线的第三个点
            var x3=_arc1 .centroid(pieD(values)[i])[0];
            if(x3>=0){
                x3=_arc1 .centroid(pieD(values)[i])[0]+24;
            }else {
                x3 = _arc1.centroid(pieD(values)[i])[0]-24;
            }
            return x3;
        })
        .attr("y",function (d,i) {
            //相对应折线的第三个点
            var y2=_arc1 .centroid(pieD(values)[i])[1];
            return y2+5;
        })
        .attr("text-anchor",function (d,i) {
            //判断path相对于圆环中心点的位置,并设置文本对齐方式
            var x3=_arc1 .centroid(pieD(values)[i])[0];
            if(x3>=0){
                return "start";
            }else {
                return "end";
            }
        })
        .attr("font-size","12px")
        .attr("fill",function (d,i) {
            return d3.select("#"+divName).selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
        })
        .transition()
        .delay(500)
        .text(function (d) {
            return d[0];
        });

//生成圆环中心文本
    d3.select("#"+divName).select("svg").append("text")
        .attr("id","showNameT")
        .attr("x",_svgwidth/2)
        .attr("y",_svgheight/2)
        .attr("text-anchor", "middle")
        .attr("fill","white")
        .style("font-size", "12px")
        .text(function () {
            //初始文本为最大值信息
            var i=d3.scan(datas,function(a,b){
                return b[1]-a[1];
            });
            return datas[i][0];
        });
    d3.select("#"+divName).select("svg").append("text")
        .attr("id","showValueT")
        .attr("x",_svgwidth/2)
        .attr("y",_svgheight/2+30)
        .attr("text-anchor", "middle")
        .attr("fill","white")
        .style("font-size", "16px")
        .text(function () {
            //初始文本为最大值信息
            var i=d3.scan(datas,function(a,b){
                return b[1]-a[1];
            });
            return (datas[i][1]/d3.sum(values)*100).toFixed(2)+"%";
        });

//生成图的标题
    d3.select("#"+divName).select("svg").append("text")
        .attr("id","titleT")
        .attr("x",_svgwidth/3)
        .attr("y",50)
        .style("font-size", "24px")
        .attr("fill","#fff")
        .text("可视化六大工具");

//添加图例
    var g=d3.select("#"+divName).select("svg").append("g")//图例总的组
        .attr("id","toolT")
        .attr("transform","translate("+_svgwidth*3/4+",10)")
        .selectAll(".toolsT")
        .data(datas)
        .enter()
        .append("g")//图例各个分组
        .attr("cursor","pointer")
        .attr("class","toolsT")
        .attr("transform",function(d,i){
            a=10; b=30+i*30;
            return "translate("+a+","+b+")"
        })
        //图例的点击事件
        .on("click",function(d,i){
            var pre=(d[1]/d3.sum(values)*100).toFixed(2)+"%";
            //更改滤镜的阴影偏移
            d3.select("#"+divName).selectAll("feOffset")
                .attr("dx",function () {
                    return (_arc .centroid(pieD(values)[i])[0]/15).toFixed(0);
                })
                .attr("dy",function (d) {
                    return (_arc .centroid(pieD(values)[i])[1]/15).toFixed(0);
                });
            //更改滤镜的透明度
            d3.select("#"+divName).select("feColorMatrix")
                .transition()
                .duration(200)
                .attrTween("values",function () {
                    return function (t) {
                        return "0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 "+t+" 0";
                    }
                });
            //更改滤镜的阴影的范围
            d3.select("#"+divName).select("filter")
                .attr("x",function () {
                    if((_arc .centroid(pieD(values)[i])[0]/15)>=0){
                        return "0";
                    }else{
                        return "-0.3";
                    }
                })
                .attr("y",function () {
                    if((_arc .centroid(pieD(values)[i])[1]/15)>=0){
                        return "0";
                    }else{
                        return "-0.3";
                    }
                });
            //还原所有图例颜色
            d3.select("#"+divName).selectAll(".toolsT")
                .attr("fill",function (d,i) {
                    return d3.select("#"+divName).selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
                });
            //改变图例颜色
            d3.select("#"+divName).select(this)
                .attr("fill","rgba(0,0,0,.3)");
            //path的动态过度
            d3.select("#"+divName).selectAll("path")
                .transition()
                .duration(500)
                .attr("transform","translate("+_svgwidth/2+","+_svgheight/2+") scale(1)")//还原所有path大小
                .transition()
                .attr("filter","");//删除滤镜链接
            d3.select(d3.select("#"+divName).selectAll("path")._groups[0][i])
                .transition()
                .duration(500)
                .attr("transform","translate("+_svgwidth/2+","+_svgheight/2+") scale(1.08)")//放大path
                .attr("filter","url(#f1T)");//链接滤镜
            //更改圆环中心文本
            d3.select("#"+divName).select("#showName")
                .text(d[0]);
            d3.select("#"+divName).select("#showValue")
                .text(pre);
            //点击标记
            if(flag1==1){
                flag1=0;
            }else{
                flag1=1;
            }
        });
//图例添加颜色框，和文本
    g.append("text")
        .text(function (d) {
            return d[0];
        })
        .attr("transform","translate(20,5)")
        .attr("fill",function (d,i) {
            return d3.select("#"+divName).selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
        });
    g.append("circle")
        .text(function (d) {
            return d[0];
        })
        .attr("cx",10)
        .attr("cy",0)
        .attr("r",5)
        .attr("fill",function (d,i) {
            return d3.select("#"+divName).selectAll(".arcs")._groups[0][i].attributes[2].value;//获取相对应path的颜色数据
        });
}
