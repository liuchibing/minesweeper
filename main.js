$(document).ready(function() {
    $("#startGame").click(function() {
	var size = document.getElementById("size").selectedIndex;
	var total = document.getElementById("total").selectedIndex;
	//alert(size);alert(total);
	init(size, total);
	$(".game").show();
    });
});

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
    
}
