/**
 * Created by jss-1 on 2017/10/17.
 */

//1.定义数据(雷达图)

var p1_piedata = [
    [
        {value:1812,name:"20人以下"},
        {value:3362,name:"20-99人"},
        {value:6873,name:"100-499人"},
        {value:7801,name:"500-999人"},
        {value:3889,name:"1000-9999人"},
        {value:2869,name:"10000人以上"}
    ]
];

$(window).resize(function(){
    d3.select('#p_bar').select('svg').remove();
    d3.select('#p1_radar').select('svg').remove();
    drawRect('p_bar',data);
    drawRadar('p1_radar',p1_piedata);
});
