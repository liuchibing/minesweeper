//构建一个Box
function box(isMine, node) {
    this.isMine = isMine;
    this.node = node;
}

function randomPosition(max) {
    return Math.round(Math.random()*max);
}

var map;

//根据设置初始化游戏区域
function init(size, total) {
    //判断雷区大小
    var totalCols;
    var totalRows;
    switch(size) {
    case 0: totalCols = 8;
	totalRows = 8;
	break;
    case 1: totalCols = 16;
	totalRows = 16;
	break;
    }
    //判断总雷数
    var totalMines;
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
	    node.attr("data-x", i);
	    node.attr("data-y", j);
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
	}
    }
}

$(document).ready(function() {
    $("#startGame").click(function() {
	var size = document.getElementById("size").selectedIndex;
	var total = document.getElementById("total").selectedIndex;
	//alert(size);alert(total);
	init(size, total);
	$(".game").show();
    });
});
