/**
 * Created by jss-1 on 2017/10/14.
 */




/********雷达图公司发展阶段*************/

//封装函数
function drawRadar(p1_divname,p1_dataset){

    var p1_svgwidth = $("#" + p1_divname).width();
    var p1_svgheight = $("#" + p1_divname).height();
    var p1_svg = d3.select("#" + p1_divname)
        .append('svg')
        .attr("width", p1_svgwidth)
        .attr("height", p1_svgheight);
    var p1_margin = {top: 10, left: 30, right: 10, bottom: 0};
    var p1_gdraw1 = p1_svg.append("g")
        .attr("transform", "translate(" + p1_margin.left + "," + p1_margin.top + ") scale(1.4)")
        .attr("id", "p1_gdraw1");
    var p1_titleHeight = 50;
    var p1_gdraw2 = p1_gdraw1.append("g")
        .attr("transform", "translate(0," + p1_titleHeight + ")")
        .attr("id", "p1_gdraw2");
    var p1_chartmargin = {top: 20, left: 20, right: 20, bottom: 20};
    var p1_chartheight = p1_svgheight - p1_margin.top - p1_margin.bottom - p1_titleHeight;
    var p1_chartwidth = p1_svgwidth - p1_margin.left - p1_margin.right;
    var p1_yaxisheight = p1_chartheight - p1_chartmargin.bottom - p1_chartmargin.top;
    var p1_xaxiswidth = p1_chartwidth - p1_chartmargin.left - p1_chartmargin.right;
    /*###############################################################*/
    //以下才是真正实现雷达图：
    /*1.生成几根轴线，且是平分的*/
    //以下添加值相同的数组

    var p1_outpie_data = [];
    for(var i=0;i<p1_dataset[0].length;i++){
        p1_outpie_data.push(1);//饼图的数据  都是1
    }
    var p1_pie = d3.pie();//饼图生成器
    var p1_arcpie = p1_pie(p1_outpie_data);//转化饼图的数据
    var p1_arc =d3.arc()
        .innerRadius(p1_xaxiswidth/5)
        .outerRadius(p1_xaxiswidth/5);

    //2.画线（弧线中心点）
    p1_gdraw2.append('g')
        .attr('transform','translate('+p1_xaxiswidth / 3+','+p1_yaxisheight / 3+')')
        .attr('class','inner_line')
        .selectAll('line')
        .data(p1_arcpie)
        .enter()
        .append('line')
        .attr('x1',0)
        .attr('y1',0)
        .attr('x2',function(d){
            return p1_arc.centroid(d)[0]
        })
        .attr('y2',function(d){
            return p1_arc.centroid(d)[1]
        })
        .attr('stroke','gray')

    //3.添加最外层文字
    p1_gdraw2.select('.inner_line')
        .selectAll('text')
        .data(p1_arcpie)
        .enter()
        .append('g')
        .attr('transform',function(d,i){
            //360除以整体数据的长度个数即，每一份是多少度， （2*i+1）/2 当为0是1/2 是1时是 3/2
            var p1_textangle = 360 / p1_dataset[0].length * (2 * i + 1) / 2; //每个字的角度
            return 'translate(' + p1_arc.centroid(d)[0] * 1.2 + ','
                + p1_arc.centroid(d)[1] * 1.2 + ') rotate(' + p1_textangle + ')';
        })
        .append('text')
        .attr('text-anchor','middle')
        .text(function(d,i){
            return p1_dataset[0][i].name;
        })
        .attr('fill','#fff')
        .style("font-size","0.8em");


    //4.蜘蛛网
    var p1_fengequality =5; //每个轴线分5段
    var p1_fengenum = 1 / p1_fengequality;//每份占1/5

     //循环画出区域
    for (var k = 0; k < p1_fengequality; k++) {
        p1_gdraw2.append('g')
            .attr("transform", "translate(" + p1_xaxiswidth / 3 + "," + p1_yaxisheight / 3 + ")")
            .attr('class', 'p1_out_line' + k)
            .selectAll('line')
            .data(p1_arcpie)
            .enter()
            .append('g')
            .attr('class', 'p1_line')
            .append('line')
            .attr('x1', function (d, i) {return p1_arc.centroid(d)[0] * p1_fengenum * (k + 1);})
            .attr('y1', function (d, i) {return p1_arc.centroid(d)[1] * p1_fengenum * (k + 1);})
            .attr('x2', function (d, i) {
                if (i == p1_dataset[0].length - 1) {
                    return p1_arc.centroid(p1_arcpie[0])[0] * p1_fengenum * (k + 1);
                } else {
                    return p1_arc.centroid(p1_arcpie[i + 1])[0] * p1_fengenum * (k + 1);
                }
            })
            .attr('y2', function (d, i) {
                if (i == p1_dataset[0].length - 1) {
                    return p1_arc.centroid(p1_arcpie[0])[1] * p1_fengenum * (k + 1);
                } else {
                    return p1_arc.centroid(p1_arcpie[i + 1])[1] * p1_fengenum * (k + 1);
                }
            })
            .style('stroke', 'gray');



    //6.线上的文字
    //定义比例尺
    var p1_maxarr = [];
    for (var i = 0; i < p1_dataset.length; i++) {
        p1_maxarr.push(d3.max(p1_dataset[i], function (d) {return d.value;}));
    }

        var num=10000;
    var p1_maxnum = 10000;//d3.max(maxarr);
    //刻度上的值
    p1_gdraw2.select('.p1_out_line' + k)
        .selectAll('.p1_line')
        .append('text')
        .attr('x', function (d, i) {return p1_arc.centroid(d)[0] * p1_fengenum * (k + 1);})
        .attr('y', function (d, i) {return p1_arc.centroid(d)[1] * p1_fengenum * (k + 1);})
        .text(function (d, i) {return (p1_maxnum / p1_fengequality * (k + 1))/1000+'k';})
        .style('font-size', '0.6em')
        .attr('text-anchor', 'middle')
        .style('fill', '#fff')
        .attr('transform','rotate(0)');

    }

    //提示框
    var p1_tooltip=d3.select("#"+p1_divname).append('div')
        .attr('width','auto')
        .attr('height','auto')
        .attr('padding','5px 10px')
        .style('background-color','rgba(0,0,0,0.6)')
        .attr("id","p_tooltip");



    //以下生成多边形：
 for(var t=0;t<p1_dataset.length;t++){
        //以下为生成多边形的线
        p1_gdraw2.append('g')
            .attr("transform", "translate(" + p1_xaxiswidth / 3 + "," + p1_yaxisheight / 3 + ")")
            .attr('class','data')
            .append('polygon')
            .style('fill','rgba(36,96,172,.6)')
            .style('stroke','#000')
            .attr('points',function(d,i){
                var p1_points='';
                for(var i=0;i<p1_dataset[t].length;i++){
                    console.log(p1_arcpie[i]);
                    var p1_x=p1_arc.centroid(p1_arcpie[i])[0]/p1_maxnum*(p1_dataset[t][i].value);
                    var p1_y=p1_arc.centroid(p1_arcpie[i])[1]/p1_maxnum*(p1_dataset[t][i].value);
                    var p1_pointarr = p1_x+','+p1_y+' ';
                     p1_points+=p1_pointarr;
                }
                return p1_points;
            });
        //多边行顶点的圆
        p1_gdraw2.append('g')
            .attr("transform", "translate(" + p1_xaxiswidth / 3 + "," + p1_yaxisheight / 3 + ")")
            .attr('class','p1_datacircle')
            .selectAll('circle')
            .data(p1_arcpie)
            .enter()
            .append('circle')
            .attr('cx',function(d,i){return p1_arc.centroid(d)[0]/p1_maxnum*(p1_dataset[t][i].value);})
            .attr('cy',function(d,i){return p1_arc.centroid(d)[1]/p1_maxnum*(p1_dataset[t][i].value);})
            .attr('r',5)
            .style('fill','#2460AC')
            .on("mouseover",function(d,i){
                p1_tooltip.style('top',d3.event.y+15+'px')
                          .style('left',d3.event.x+15+'px')
                          .style('display','block')
                          .html("公司规模："+p1_dataset[0][i].name+'<br/>数量：'+p1_dataset[0][i].value+'家');
            })
            .on("mouseout",function(d,i){p1_tooltip.style('display','none');})

    }

    //添加标题
    var p1_title = p1_svg.append('g')
        .append('text')
        .attr('x',30)
        .attr('y',40)
        .text('公司规模')
        .attr("fill","#fff")
        .attr('font-size','2em');

 }
