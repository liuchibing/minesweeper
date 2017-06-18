//构建一个Box
function box(isMine, node) {
    this.isMine = isMine;
    this.node = node;
}

function randomPosition(max) {
    return Math.round(Math.random()*max);
}

var map;
var totalCols;
var totalRows;
var totalMines;
var marks = 0;
var correctMarks = 0;
var time = new Date();
var timeout;

function updateFlagCount() {
    $("#flag-count").text(marks + "/" + totalMines);
}

function nextSecond() {
    timeout = setTimeout("nextSecond()", 1000);
    time.setSeconds(time.getSeconds()+1);
    $("#time").text(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
}

//根据设置初始化游戏区域
function init(size, total) {
    //清理
    $(".mines-area").empty();
    clearTimeout(timeout);
    marks = 0;
    correctMarks = 0;
    time = new Date();
    //判断雷区大小
    switch(size) {
    case 0: totalCols = 8;
	totalRows = 8;
	break;
    case 1: totalCols = 16;
	totalRows = 16;
	break;
    }
    //判断总雷数
    switch(total) {
    case 0: totalMines = 10;
	break;
    case 1: totalMines = 40;
	break;
    }
    //生成地图
    map = new Array();
    for(i = 0; i < totalRows; i++) {
	map[i] = new Array();
	var parent = $("<div></div>");
	for(j = 0; j < totalCols; j++) {
	    var node = $("<div></div>");
	    node.addClass("mineBox unkownBox");
	    node.attr("data-x", j);
	    node.attr("data-y", i);
	    if(j == 0) { node.css("clear", "left"); }
	    parent.append(node);
	    map[i][j] = new box(false, node);
	}
	$(".mines-area").append(parent);
    }
    //生成地雷
    for(i = 0; i < totalMines; i++) {
	var x = randomPosition(totalCols);
	var y = randomPosition(totalRows);
	if(!(map[y][x].isMine)) {
	    map[y][x].isMine = true;
	} else {
	    i--;
	    continue;
	}
    }
    //设置计数
    updateFlagCount();
    //设置计时
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    timeout = setTimeout("nextSecond()", 1000);
}

function open(x, y) {
    
}

function mark(x, y) {

}

$(document).ready(function() {
    $("#startGame").click(function() {
	$(".game").hide();
	var size = document.getElementById("size").selectedIndex;
	var total = document.getElementById("total").selectedIndex;
	//alert(size);alert(total);
	init(size, total);
	$(".game").show();
    });
});
