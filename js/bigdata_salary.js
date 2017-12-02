/**
 * Created by fanyumo on 2017/10/16.
 */
var D3={
    FdrawPie:function FdrawPie(divName,data,title) {
        //容器宽高
        var divWidth = $('#' + divName).width();
        var divHeight = $('#' + divName).height();
        //外围留白
        var gAllPadding = {
            top: divHeight * 0.05,
            bottom: divHeight * 0.05,
            left: divWidth * 0.05,
            right: divWidth * 0.05
        };
        //内部留白
        var gDrawPadding = {
            top: divHeight * 0.05,
            bottom: divHeight * 0.05,
            left: divWidth * 0.05,
            right: divWidth * 0.05
        };
        //标题高度
        var titleHeight = divHeight * 0.2;
        //y轴的高度
        var y_axis_Height = divHeight - gAllPadding.top - gAllPadding.bottom - titleHeight - gDrawPadding.top - gDrawPadding.bottom;
        //x轴宽度
        var x_axis_Width = divWidth - gAllPadding.left - gAllPadding.right - gDrawPadding.left - gDrawPadding.right;
        //内外半径
        var minLength=Math.min(y_axis_Height,x_axis_Width);
        var innerRadius=minLength*0.25;
        var outerRadius=minLength*0.6;
        //svg画布
        var _svg = d3.select('#' + divName).append('svg')
            .attr('width', divWidth)
            .attr('height', divHeight);
        //装全部内容的g层
        var _gAll = _svg.append('g').attr('id', "gAll")
            .attr('transform', 'translate('+gAllPadding.left+','+gAllPadding.top+')');
        //装标题的g层
        var _gTitle = _gAll.append("g").attr("id", "gTitle");
        //标题设置
        _gTitle.append('text')
            .attr('fill', 'white')
            .attr('font-size', '20px')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', x_axis_Width/2)
            .attr('dy', titleHeight/3)
            .attr('text-anchor', 'middle')
            .text(title);
        //装图表内容的g层
        var _gDraw = _gAll.append("g")
            .attr('id', 'gDraw')
            .attr('transform', 'translate(0,' + titleHeight + ')');
        //创建饼图
        var pie=d3.pie().sort(null)
            .value(function (d) {
                return d.percentage
            });
        var arc_data=pie(data);
        var arc=d3.arc()
            .innerRadius(0)
            .outerRadius(outerRadius);
        var _tooltip = d3.select('#' + divName)
            .append('div')
            .attr('class', 'tooltip')
            .style('width', 100)
            .style('height', 'auto')
            .style('position', 'absolute')
            .style('padding', '10px')
            .style('color', 'white')
            .style('z-index',9999)
            .style('opacity',0);
        var total_duration=0;//设置持续时间
        //画饼
        _gDraw.selectAll('path')
            .data(arc_data)
            .enter()
            .each(function (d) {
                d.duration=(d.endAngle-d.startAngle)/(2*Math.PI)*5;
                d.delay=total_duration;
                total_duration+=d.duration;
            })
            .append('path')
            .attr('transform','translate('+x_axis_Width/2+','+y_axis_Height/2+')')
            .attr('fill',function (d,i) {
                return d3.schemeCategory10[i]
            })
            .on('mouseover', function (d) {
                _tooltip
                    .style('opacity', 1)
                    .style('top', d3.event.pageY + 'px')
                    .style('left', d3.event.pageX + 'px')
                    .html(d.data.position+'<br/>占比:'+d.data.percentage)
            })
            .on('mousemove',function () {
                _tooltip
                    .style('top', d3.event.pageY+15 + 'px')
                    .style('left', d3.event.pageX +15+ 'px')
            })
            .on('mouseout',function () {
                _tooltip
                    .style('opacity', 0)
            })
            .transition()
            .duration(function (d) {
                return d.duration*1000
            })
            .delay(function (d) {
                return d.delay*1000
            })
            .tween('path',function (d) {
                var node=this;
                var init_endAngle=d.endAngle;
                return function (t) {
                    d.endAngle=d.startAngle+(init_endAngle-d.startAngle)*t;
                    d3.select(node).attr('d',arc)
                }
            });
        //图例
        _gDraw.selectAll('rect').data(arc_data)
            .enter().append('rect')
            .attr('x',x_axis_Width*3/4)
            .attr('y',function (d,i) {
                return  (y_axis_Height/4)+(y_axis_Height/8)*(i+0)+(y_axis_Height/16)*i
            })
            .attr('width',x_axis_Width/8)
            .attr('height',y_axis_Height/8)
            .attr('fill',function (d,i) {
                return d3.schemeCategory10[i]
            });
        _gDraw.selectAll('.text').data(arc_data)
            .enter()
            .append('text')
            .attr('x',x_axis_Width*3/4+x_axis_Width/8)
            .attr('y',function (d,i) {
                return  (y_axis_Height/4)+(y_axis_Height/8)*(i+0)+(y_axis_Height/16)*i
            })
            .attr('fill','white')
            .text(function(d){
                return   d.data.name+'\t\t'+d.data.percentage
            })
            .style('font-size','10px')
            .attr('dy','1em')
            .attr('dx',x_axis_Width/16)
    },
    FdrawFunnel:function FdrawFunnel(divName,dataset,title) {
        //容器宽高
        var divWidth = $('#' + divName).width();
        var divHeight = $('#' + divName).height();
        //外围留白
        var gAllPadding = {
            top: divHeight * 0.05,
            bottom: divHeight * 0.05,
            left: divWidth * 0.05,
            right: divWidth * 0.05
        };
        //内部留白
        var gDrawPadding = {
            top: divHeight * 0.05,
            bottom: divHeight * 0.05,
            left: divWidth * 0.05,
            right: divWidth * 0.05
        };
        //标题高度
        var titleHeight = divHeight * 0.2;
        //svg画布
        var _svg = d3.select('#' + divName).append('svg')
            .attr('width', divWidth)
            .attr('height', divHeight);
        //装全部内容的g层
        var _gAll = _svg.append('g').attr('id', "gAll")
            .attr('transform', 'translate(' + gAllPadding.left + ',' + gAllPadding.top + ')');
        //装标题的g层
        var _gTitle = _gAll.append("g").attr("id", "gTitle");
        //标题设置
        _gTitle.append('text')
            .attr('fill', 'white')
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', (divWidth - gAllPadding.left - gAllPadding.right) / 2)
            .attr('dy', '1em')
            .text(title);
        //装图表内容的g层
        var _gDraw = _gAll.append("g")
            .attr('id', 'gDraw')
            .attr('transform', 'translate(0,' + titleHeight + ')');
        //y轴的高度
        var y_axis_Height = divHeight - gAllPadding.top - gAllPadding.bottom - titleHeight - gDrawPadding.top
            - gDrawPadding.bottom;
        //x轴宽度
        var x_axis_Width = divWidth - gAllPadding.left - gAllPadding.right - gDrawPadding.left - gDrawPadding.right;
        //定义数据
        var data_set_map = d3.map(dataset, function (d) {
            return d.position
        });
        //将每相邻的两个节点生成一个新数组
        var obj_pairs = d3.pairs(data_set_map.values());
        //计算出所有节点的坐标
        var counter = 0;
        data_set_map.each(function (d) {
            counter++;
            var cot = x_axis_Width / (2 * y_axis_Height);
            var pery = y_axis_Height / data_set_map.size();
            var point1 = (x_axis_Width / 2 + (pery * (counter - 1)) * cot) + ',' + pery * (counter - 1);
            var point2 = (x_axis_Width / 2 - (pery * (counter - 1)) * cot) + ',' + pery * (counter - 1);
            d.point1 = point1;
            d.point2 = point2;
        });
        var _tooltip = d3.select('#' + divName)
            .append('div')
            .attr('class', 'tooltip')
            .style('width', 100)
            .style('height', 'auto')
            .style('position', 'absolute')
            .style('padding', '10px')
            .style('color', 'white')
            .style('opacity',0);
        for (var i = 0; i < obj_pairs.length; i++) {
            _gDraw.append('polygon')
                .attr('points', obj_pairs[i][0].point1 + ' ' + obj_pairs[i][0].point2 + ' ' + obj_pairs[i][1].point2 + ' ' + obj_pairs[i][1].point1)
                .attr('fill', function () {
                    return d3.schemeCategory10[i]
                });
            _gDraw.append('text')
                .attr('x',x_axis_Width/2)
                .attr('y',function () {
                    return (y_axis_Height/data_set_map.size())+(y_axis_Height/data_set_map.size())*i
                })
                .attr('dy','-1em')
                .attr('text-anchor','middle')
                .attr('fill','white')
                .style('font-size',"10px")
                .text(function () {
                    return obj_pairs[obj_pairs.length-1-i][1].position+'\t\t需求量:'+obj_pairs[obj_pairs.length-1-i][1].demand+'\t\t占比:'+obj_pairs[obj_pairs.length-1-i][1].percentage
                });
        }
        //添加最下面的面积
        _gDraw.append('polygon')
            .attr('points', obj_pairs[obj_pairs.length-1][1].point2 + ' ' + obj_pairs[obj_pairs.length-1][1].point1 + ' ' + x_axis_Width+','+y_axis_Height + ' ' +0+','+y_axis_Height)
            .attr('fill', '#ff6428');
        //填最下面的文字
        _gDraw.append('text')
            .attr('x',x_axis_Width/2)
            .attr('y',y_axis_Height)
            .attr('dy','-1em')
            .attr('text-anchor','middle')
            .attr('fill','white')
            .style('font-size',"10px")
            .text(function () {
                return obj_pairs[0][0].position+'\t\t需求量:'+obj_pairs[0][0].demand+'\t\t占比:'+obj_pairs[0][0].percentage
            })
    },
    FdrawLines:function FdrawLines(divName,xData,yData1,yData2,yData3,gridLines,title) {

        //容器宽高
        var divWidth = $('#' + divName).width();
        var divHeight = $('#' + divName).height();
        //外围留白
        var gAllPadding = {
            top: divHeight * 0.05,
            bottom: divHeight * 0.05,
            left: divWidth * 0.05,
            right: divWidth * 0.05
        };
        //内部留白
        var gDrawPadding = {
            top: divHeight * 0.05,
            bottom: divHeight * 0.05,
            left: divWidth * 0.05,
            right: divWidth * 0.05
        };
        //标题高度
        var titleHeight = divHeight * 0.2;
        //y轴的高度
        var y_axis_Height = divHeight - gAllPadding.top - gAllPadding.bottom - titleHeight - gDrawPadding.top - gDrawPadding.bottom;
        //x轴宽度
        var x_axis_Width = divWidth - gAllPadding.left - gAllPadding.right - gDrawPadding.left - gDrawPadding.right;
        //标题高度
        var titleHeight = divHeight * 0.2;
        //svg画布
        var _svg = d3.select('#' + divName).append('svg')
            .attr('width', divWidth)
            .attr('height', divHeight);
        //装全部内容的g层
        var _gAll = _svg.append('g').attr('id', "gAll")
            .attr('transform', 'translate(' + gAllPadding.left + ',' + gAllPadding.top + ')');
        //装标题的g层
        var _gTitle = _gAll.append("g").attr("id", "gTitle");
        //标题设置
        _gTitle.append('text')
            .attr('fill', 'white')
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', (divWidth - gAllPadding.left - gAllPadding.right) / 2)
            .attr('dy', function () {
                return titleHeight*0.5+'px'
            })
            .text(title);
        //装图表内容的g层
        var _gDraw = _gAll.append("g")
            .attr('id', 'gDraw')
            .attr('transform', 'translate(0,' + titleHeight + ')');
        //装坐标轴的g层
        var _gChart_axises= _gDraw.append('g')
            .attr('id', 'gChart')
            .attr('transform', 'translate(' + gDrawPadding.left + ',' + gDrawPadding.top + ')');
        //装x轴的g层
        var _g_x_axis = _gChart_axises.append('g')
            .attr('id', divName + 'g_x_axis')
            .attr('transform', 'translate(0,' + y_axis_Height + ')');
        //装y轴的g层
        var _g_y_axis = _gChart_axises.append('g').attr('id', divName + 'g_y_axis');
        //x轴比例尺
        var _xScale=d3.scaleBand().domain(xData)
            .range([0,x_axis_Width]);
        //创建x轴
        var _xAxis=d3.axisBottom().scale(_xScale);
        _xAxis(_g_x_axis);
        //y轴比例尺
        var
            _yScale=d3.scaleLinear()
                .domain([0,d3.max(yData23)*1.1]).nice()
                .range([y_axis_Height,0]);
        //创建y轴
        var _yAxis=d3.axisLeft()
            .scale(_yScale);
        _yAxis(_g_y_axis);
        d3.select('#'+divName + 'g_x_axis').selectAll("text").attr("fill","#fff");
        d3.select('#'+divName + 'g_y_axis').selectAll("text").attr("fill","#fff");
        //类柱子的宽
        var _rectWidth=_xScale.bandwidth();
        //转换数据
        var data11 = d3.zip(xData, yData1),
            data12 = d3.zip(xData, yData2),
            data13=d3.zip(xData, yData3);
        //使用线段生成器生成路径
        var _line = d3.line()
            .x(function (d) {
                return _xScale(d[0]) + _rectWidth / 2
            })
            .y(function (d) {
                return _yScale(d[1])
            })
            .curve(d3.curveNatural);
        //折线的g层
        var glines = _gChart_axises.append('g');
        //均线
        glines.append('path')
            .attr('d', _line(data11))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        //均线标准差-
        glines.append('path')
            .attr('d', _line(data12))
            .attr('stroke', ' #ff6428')
            .attr('stroke-width', 1)
            .attr('fill', 'none');
        //均线标准差+
        glines.append('path')
            .attr('d', _line(data13))
            .attr('stroke', ' #ff6428')
            .attr('stroke-width', 1)
            .attr('fill', 'none');
        //添加均线的节点
        glines.selectAll('circle').data(yData11)
            .enter().append('circle')
            .attr('cx', function (d, i) {
                return _xScale(xData[i]) + _rectWidth / 2
            })
            .attr('cy', function (d, i) {
                return _yScale(yData1[i])
            })
            .attr('r', 3)
            .attr('fill', '#f1ff7f');
        if (gridLines === true) {
            //水平网格线
            draw_horizontal_lines(divName, x_axis_Width);
            //垂直网格线
            draw_vertical_lines(divName, y_axis_Height);
        }
    }
};
//水平网格线
function draw_horizontal_lines(divName, x_axis_Width) {
    d3.select('#' + divName + 'g_y_axis').selectAll('g')
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x_axis_Width)
        .attr('y2', 0)
        .style('stroke', '#aaa')
        .style('stroke-width', 2);
}
//垂直网格线
function draw_vertical_lines(divName, y_axis_Height) {
    d3.select('#' + divName + 'g_x_axis').selectAll('g')
        .append('line')
        .attr('x1', 0)
        .attr('y1', -y_axis_Height)
        .attr('x2', 0)
        .attr('y2', 0)
        .style('stroke', '#aaa')
        .style('stroke-width', 2);
}


