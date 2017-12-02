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
var data = [
    {
        "letter": "上市公司",
        "child": {
            "category": "0",
            "value": "915.00"
        }
    }, {
        "letter": "初创型(不需要融资)",
        "child": {
            "category": "0",
            "value": "239.00"
        }
    }, {
        "letter": "初创型(天使轮)",
        "child": {
            "category": "0",
            "value": "278.00"
        }
    }, {
        "letter": "初创型(未融资)",
        "child": {
            "category": "0",
            "value": "531.00"
        }
    }, {
        "letter": "初创型(未融资)",
        "child": {
            "category": "0",
            "value": "419.00"
        }
    }, {
        "letter": "成熟型(D轮及以上)",
        "child": {
            "category": "0",
            "value": "461.00"
        }
    }, {
        "letter": "成熟型(不需要融资)",
        "child": {
            "category": "0",
            "value": "487.00"
        }
    }, {
        "letter": "成长型(A轮)",
        "child": {
            "category": "0",
            "value": "646.00"
        }
    }, {
        "letter": "成长型(B轮)",
        "child": {
            "category": "0",
            "value": "549.00"
        }
    }];


var datas=[
    ['D3.js',33.33],
    ['Echarts',29.63],
    ['Tableau',11.11],
    ['webGL',9.26],
    ['HighCharts',9.26],
    ['Three.js',7.41]
];


var dataset11=[["北京","707"],
    ["上海","390"],
    ["深圳","228"],
    ["杭州","169"],
    ["广州","110"]
];
var dataset12={
    "北京": [
        ["数据分析师",124],
        ["数据挖掘工程师",83],
        ["DBA",32],
        ["大数据开发工程师",26],
        ["数据挖掘",24]
    ],
    "上海": [
        ["数据分析师",52],
        ["数据挖掘工程师",41],
        ["DBA",34],
        ["大数据开发工程师",19],
        ["大数据工程师",16]
    ],
    "广州": [
        ["数据分析师",20],
        ["数据挖掘工程师",12],
        ["大数据开发工程师",7],
        ["高级数据分析师",4],
        ["大数据研发工程师",4]
    ],
    "深圳": [
        ["数据挖掘工程师",24],
        ["数据分析师",19],
        ["DBA",17],
        ["大数据开发工程师",17],
        ["数据挖掘",5]
    ],
    "杭州": [
        ["数据分析师",24],
        ["DBA",20],
        ["数据挖掘工程师",12],
        ["大数据开发工程师",12],
        ["资深数据分析师",8]

    ]};

var _dataset11=d3.transpose(dataset11);
var values=d3.transpose(dataset12["北京"])[1];
var datass=dataset12["北京"];
var k=0;
var  myset;
myset=setInterval(start,5000);


var countT=1;
//窗口尺寸改变重新生成饼图

var ydataTt=[6625,7723,9912,14252,19842,19236,10767];
var xdataTt=['无经验','1年以下','1-3年','3-5年','5-10年','10年以上','不限'];
//开发数据
var ydataTtdep=[4280,8013,11379,15214,21189,30153,12946];
//定义柱图过渡方式数组
var easeArrayT=[d3.easeLinear,d3.easeCubic,d3.easeElastic,d3.easeBounce];
//设置定时器,间隔时间修改柱图过渡方式
var counterT=0;
var numT;
setInterval(addCounterT,5000);
function addCounterT(){
    counterT++;
    if(counterT>3){
        counterT=0;
    }
}
function setIndexT(){
    return easeArrayT[counterT];
}
function changeEase(){
    d3.select("#MyChart1Tt").select("svg").remove();
    d3.select(".tooltipTt").remove();
    drawBarTt('MyChart1Tt',xdataTt,ydataTt,ydataTtdep,true);
    //改变柱形图过渡方式
    numT=setIndexT();
    _rectT.ease(numT);
}


var changeTxtInterval=setInterval(function(){lbpieTt();},5000);
var changeEaseInterval=setInterval(changeEase,5000);


$(function (){
    heights();
    gmap1();
    drawRect('p_bar',data);
    drawRadar('p1_radar',p1_piedata);
    pieTt('chart2Tt',datas);
    drawBarTt('MyChart1Tt',xdataTt,ydataTt,ydataTtdep,true);
    drawBar("Zmycharts",_dataset11[1],_dataset11[0] ,bool=false);
    drawpie(datass,values);
    drawP("pppt");
});
/*动态高度*/
function heights() {
    var h1=d3.select(".gheader")._groups[0][0].clientHeight;
    var h2=d3.select(".gnav")._groups[0][0].clientHeight;
    var h3=d3.select("body")._groups[0][0].clientHeight;
    var h=h3-h2-h1+"px";
    d3.selectAll(".gmain")
        .style("height",h);
}
/*改变窗口大小*/
$(window).resize(function () {
    heights();
    d3.select('#p_bar').select('svg').remove();
    d3.select('#p1_radar').select('svg').remove();
    drawRect('p_bar',data);
    drawRadar('p1_radar',p1_piedata);
    d3.select("#chart2Tt").select("svg").remove();
    pieTt('chart2Tt',datas);
    d3.select("#MyChart1Tt").select("svg").remove();
    d3.select("#MyChart1Tt").select(".legendT").remove();
    drawBarTt('MyChart1Tt',xdataTt,ydataTt,ydataTtdep,true);
    d3.select("#wrap").select("svg").remove();
    d3.select("#Zmycharts").select("svg").remove();
    drawBar("Zmycharts",_dataset11[1],_dataset11[0] ,bool=false);
    drawpie(datass,values);
    d3.select("#gmap1").select("svg").remove();
    gmap1();
    d3.select("#sSankey").select("iframe").attr("src","");
    d3.select("#sPack").select("iframe").attr("src","");
    d3.select("#sSankey").select("iframe").attr("src","sankey_city.html");
    d3.select("#sPack").select("iframe").attr("src","drawpack_city.html");
});
/*点击改变边框色*/
var flag=1;
var flagcli=1;
$(".gicon").click(function () {
    if(flag==1){
        $(".gall").css("display","block");
        flag=0;
    }else{
        $(".gall").css("display","none");
        flag=1;
    }

});
/*点击切换页面*/
$(".gevery").click(function () {
    $(".gevery").css("border-color","#ffe325");
    $(this).css("border-color","#ff1030");
    var i=$(this).index();
    console.log($(this));
    $(".gmain").removeClass("gf0");
    //$(".gmain").eq(i).css("left","-100%");
    $(".gmain").eq(i).addClass("gf0");
});
/*以上*/
function gmap1() {
    var dataset = [
        {name:'安徽',value:460},
        {name:'澳门',value:421},
        {name:'北京',value:1024},
        {name:'重庆',value:583},
        {name:'福建',value:421},
        {name:'广东',value:564},
        {name:'甘肃',value:130},
        {name:'广西',value:369},
        {name:'贵州',value:582},
        {name:'河北',value:375},
        {name:'黑龙江',value:120},
        {name:'河南',value:230},
        {name:'海南',value:615},
        {name:'湖北',value:620},
        {name:'湖南',value:564},
        {name:'江苏',value:580},
        {name:'江西',value:345},
        {name:'吉林',value:110},
        {name:'辽宁',value:90},
        {name:'内蒙古',value:40},
        {name:'宁夏',value:43},
        {name:'青海',value:111},
        {name:'山西',value:261},
        {name:'陕西',value:187},
        {name:'山东',value:389},
        {name:'上海',value:993},
        {name:'四川',value:472},
        {name:'天津',value:658},
        {name:'台湾',value:340},
        {name:'香港',value:361},
        {name:'西藏',value:113},
        {name:'新疆',value:80},
        {name:'云南',value:124},
        {name:'浙江',value:742}];
    var max=d3.max(dataset,function (d) {
        return d.value;
    });
    var mapDataset=d3.map(dataset,function (d) {
        return d.name;
    });
    /*色域范围*/
    var a=d3.rgb(11,180,174);
    var b=d3.rgb(202,105,10);
    var interCol = d3.interpolateRgb(a,b);

    d3.json("../json/china.json",function (error, data) {
        /*设置宽高*/
        var g_geoJson=data;
        var h1=d3.select("#gmap1")._groups[0][0].clientHeight;
        var w1=d3.select("#gmap1")._groups[0][0].clientWidth;
        var sca=(w1/960)*800+"";
        /*生成地图数据*/
        var g_geoMe=d3.geoMercator()
            .center([116.3906729221344,39.91875118949147])
            .fitExtent([[0,0],[w1,h1]],g_geoJson)
            .scale(sca);
        var g_geoPath=d3.geoPath()
            .projection(g_geoMe);
        /*添加path*/
        var gmap=d3.select("#gmap1")
            .append("svg")
            .attr("id", "gmapsvg")
            .append("g");
        for(var n=0;n<46;n++){
            gmap.append("g")
                .attr("transform","translate("+(-n/3)+","+(-n/3)+")")
                .selectAll("path")
                .data(g_geoJson.features)
                .enter()
                .append("path")
                .attr("class",function (d) {
                    return "g"+d.properties.id;
                })
                .attr("d",g_geoPath)
                .attr("fill",function (d) {
                    var gnames=d.properties.name;
                    var gproData=mapDataset.get(gnames);
                    return interCol(gproData.value/max);
                })
                .attr("stroke",function (d) {
                    var interCol1 = d3.interpolateRgb(d3.rgb(118,55,4),d3.rgb(247,204,169));
                    return interCol1(1/n);
                })
                .attr("stroke-width",1)
                .on("click",function (d, i) {
                    if(flagcli==1){
                        var cgname="g"+d.properties.id;
                        d3.select("#gmapsvg").selectAll("."+cgname)
                            .attr("transform","translate(-20,-20)");
                        flagcli=0;
                    }else{
                        var cgname="g"+d.properties.id;
                        d3.select("#gmapsvg").selectAll("."+cgname)
                            .attr("transform","translate(0,0)");
                        flagcli=1;
                    }
                });
        }

        /*显示文本*/
        gmap.append("g")
            .selectAll("text")
            .data(g_geoJson.features)
            .enter()
            .append("text")
            .attr("class",function (d) {
                return "g"+d.properties.id;
            })
            .attr("x",function (d) {
                var gproD=g_geoPath.centroid(d);
                return gproD=g_geoPath.centroid(d)[0]-15;
            })
            .attr("y",function (d) {
                var gproD=g_geoPath.centroid(d);
                return gproD=g_geoPath.centroid(d)[1]-15;
            })
            .text(function (d) {
                return d.properties.name;
            })
            .attr("fill","#fff")
            .attr("text-anchor", "middle")
            .attr("font-size", "8px")
            .on("click",function (d, i) {
                if (flagcli == 1) {
                    var cgname = "g" + d.properties.id;
                    d3.select("#gmapsvg").selectAll("." + cgname)
                        .attr("transform", "translate(-20,-20)");
                    flagcli = 0;
                } else {
                    var cgname = "g" + d.properties.id;
                    d3.select("#gmapsvg").selectAll("." + cgname)
                        .attr("transform", "translate(0,0)");
                    flagcli = 1;
                }
            });
        var gy;
        gmap.call(d3.drag()
                .on("start",function () {
                    d3.select(this).style("transform","perspective(500px) rotate3d(1,1,0,"+(-gy/5)+"deg)");
                })
                .on("drag",function () {
                    y=d3.event.y-d3.event.subject.y;
                    d3.select(this).style("transform","perspective(500px) rotate3d(1,1,0,"+(-y/5)+"deg)");
                })
                .on("end",function () {
                    gy=d3.event.y-d3.event.subject.y;
                })
            );
        /*值域标识*/
        var linearGradient=d3.select("#gmapsvg")
            .append("defs")
            .append("linearGradient")
            .attr("id","glinearcolor")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","100%")
            .attr("y2","100%");
        var stop1=linearGradient.append("stop")
            .attr("offset","0%")
            .style("stop-color",a.toString());
        var stop2=linearGradient.append("stop")
            .attr("offset","100%")
            .style("stop-color",b.toString());
        var colorg=d3.select("#gmapsvg")
            .append("rect")
            .attr("x",50)
            .attr("y",h1-130)
            .attr("width",140)
            .attr("height",30)
            .style("fill","url(#"+linearGradient.attr("id")+")");
        /*值域文本*/
        d3.select("#gmapsvg")
            .append("text")
            .attr("x",50)
            .attr("y",h1-131)
            .attr("text-anchor","start")
            .attr("fill",a)
            .text(0);
        d3.select("#gmapsvg")
            .append("text")
            .attr("x",190)
            .attr("y",h1-131)
            .attr("text-anchor","end")
            .attr("fill",b)
            .text(max);
    });
}
function gmapcity() {
    /*色域范围*/
    var a=d3.rgb(11,180,174);
    var b=d3.rgb(202,105,10);
    var interCol = d3.interpolateRgb(a,b);

    d3.json("../json/11.json",function (error, data) {
        /*设置宽高*/
        var g_geoJson=data;
        var h1=d3.select("#gmap1")._groups[0][0].clientHeight;
        var w1=d3.select("#gmap1")._groups[0][0].clientWidth;
        var sca=(w1/960)*800+"";
        /*生成地图数据*/
        var g_geoMe=d3.geoMercator()
            .center([116.3906729221344,39.91875118949147])
            .scale(sca);
        var g_geoPath=d3.geoPath()
            .projection(g_geoMe);
        /*添加path*/
        d3.select("#gmap1")
            .append("svg")
            .attr("id", "gbeijing")
            .append("g")
            .selectAll("path")
            .data(g_geoJson.features)
            .enter()
            .append("path")
            .attr("d",g_geoPath)
            .attr("fill","#7a1313")
            .attr("stroke","#e0e0e0")
            .attr("stroke-width",1);
        /*显示文本*/
        d3.select("#gbeijing")
            .append("g")
            .selectAll("text")
            .data(g_geoJson.features)
            .enter()
            .append("text")
            .attr("x",function (d) {
                var gproD=g_geoPath.centroid(d);
                return gproD=g_geoPath.centroid(d)[0];
            })
            .attr("y",function (d) {
                var gproD=g_geoPath.centroid(d);
                return gproD=g_geoPath.centroid(d)[1];
            })
            .text(function (d) {
                return d.properties.name;
            })
            .attr("fill","#fff")
            .attr("text-anchor", "middle")
            .attr("font-size", "8px");
    });
}
