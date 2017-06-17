//构建一个Box
function box(isMine, node) {
    this.isMine = isMine;
    this.node = node;
}

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
    var map = new Array();
    for(i = 0; i < totalRows; i++) {
	map[i] = new Array();
	var parent = $("<div></div>");
	parent.addClass("row");
	for(j = 0; j < totalCols; j++) {
	    var node = $("<div></div>");
	    node.addClass("col-xs-1 mineBox unkownBox");
	    parent.append(node);
	    map[i][j] = new box(false, node);
	}
	$(".mines-area").append(parent);
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
