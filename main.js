//构建一个Box
function box(isMine, node) {
    this.isMine = isMine;
    this.node = node;
    this.status = 0;//0:normal 1:opened -1:marked
}

function randomPosition(max) {
    //if(max <= 2) {
    return Math.round(Math.random()*(max-1));
    //} else {
	//return Math.floor(Math.random()*(max-1));
    //}
}

var map;
var totalCols;
var totalRows;
var totalMines;
var marks = 0;
var correctMarks = 0;
var time = new Date();
var timeout;
var markMode = false;
var totalBoxes;
var openedBoxes = 0;
var firstTap = true;

function updateFlagCount() {
    $("#flag-count").text(marks + "/" + totalMines);
}

function nextSecond() {
    timeout = setTimeout("nextSecond()", 1000);
    time.setSeconds(time.getSeconds()+1);
    $("#time").text(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
}

//根据设置初始化游戏区域
function init() {
    //清理
    $(".congr").remove();
    $(".mines-area").empty();
    clearTimeout(timeout);
    timeout = null;
    marks = 0;
    correctMarks = 0;
    openedBoxes = 0;
    $("#toggleMode").text("翻开模式");
    markMode = false;
    time = new Date();
    firstTap = true;    
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
	    //node.text(" ");
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
	    //map[y][x].node.css("background-color", "red");
	} else {
	    i--;
	    continue;
	}
    }
    //设置计数
    updateFlagCount();
    //设置计时
    $("#time").text("0:0:0");
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    timeout = setTimeout("nextSecond()", 1000);
    //绑定点击事件
    $(".mineBox").on("click", function() {
	var x = parseInt($(this).attr("data-x"));
	var y = parseInt($(this).attr("data-y"));
	if (markMode) {
	    mark(x, y);
	} else {
	    open(x, y);
	}
	if (openedBoxes == (totalBoxes - totalMines)) win();
    });
}

function boom(x, y) {
    var box = map[y][x];
    box.node.css("color", "red");
    for(var i = 0; i < totalRows; i++) {
	for(var j = 0; j < totalCols; j++) {
	    if(map[i][j].status == -1 &&!(map[i][j].isMine)) map[i][j].node.empty().append($("<span></span>").addClass("glyphicon glyphicon-ban-circle"));
	    if(map[i][j].isMine && map[i][j].status != -1) map[i][j].node.append($("<span></span>").addClass("glyphicon glyphicon-certificate"));
	}
    }
    var p = $("<p></p>");
    p.text("Game over!").css("color", "red").addClass("congr");
    $(".scoreboard").append(p);
    finish();
}

function win() {
    var p = $("<p></p>");
    p.text("Congratulations!").css("color", "red").addClass("congr");
    $(".scoreboard").append(p);
    finish();
}

function finish() {
    $(".mineBox").off("click");
    clearTimeout(timeout);
}

function open(x, y) {
    var box = map[y][x];
    if (box.isMine && box.status == 0) {
	//防止一开始就失败
	if(firstTap) {
	    box.isMine = false;
	    while(true) {
		var nx = randomPosition(totalCols);
		var ny = randomPosition(totalRows);
		if(!(map[ny][nx].isMine) && map[ny][nx] !== box) {
		    map[ny][nx].isMine = true;
		    //map[ny][nx].node.css("background-color", "red");
		    //alert("new mine: " + nx + ","+ ny);
		    break;
		}
	    }
	} else {
	    boom(x, y);
	    return;
	}
    }
    if (firstTap) firstTap = false; 
    if (box.status == 0) {
	box.node.addClass("openedBox");
	box.status = 1;
	openedBoxes++;
	//查找周围的雷
	var mineCount = 0;
	var countMine = function(o) {
	    if (o.isMine) mineCount++;
	};
	if (y != 0) {
	    if (x != 0) countMine(map[y-1][x-1]);
	    countMine(map[y-1][x]);
	    if (x != (totalCols - 1)) countMine(map[y-1][x+1]);
	}
	if (x != 0) countMine(map[y][x-1]);
	if (x != (totalCols - 1)) countMine(map[y][x+1]);
	if (y != (totalRows - 1)) {
	    if (x != 0) countMine(map[y+1][x-1]);
	    countMine(map[y+1][x]);
	    if (x != (totalCols - 1)) countMine(map[y+1][x+1]);
	}
	if (mineCount == 0) {
	    //自动翻开周围一圈
	    if (y != 0) {
		if (x != 0) open(x-1, y-1);
		open(x, y-1);
		if (x != (totalCols - 1)) open(x+1, y-1);
	    }
	    if (x != 0) open(x-1, y);
	    if (x != (totalCols - 1)) open(x+1, y);
	    if (y != (totalRows - 1)) {
		if (x != 0) open(x-1, y+1);
		open(x, y+1);
		if (x != (totalCols - 1)) open(x+1, y+1);
	    }
	} else {
	    //标记数字
	    box.node.text(mineCount);
	}
    }
}

function mark(x, y) {
    var box = map[y][x];
    switch (box.status) {
    case -1:
	box.node.empty();
	box.status = 0;
	if (box.isMine) correctMarks--;
	marks--;
	break;
    case 0:
	var flag = $("<span></span>");
	flag.addClass("glyphicon glyphicon-flag");
	box.node.append(flag);
	box.status = -1;
	if (box.isMine) correctMarks++;
	marks++;
	break;
    }
    updateFlagCount();
}

function sizeChange(obj) {
    if(obj.selectedIndex == 3) {
	$("#modifying").show();
    } else {
	$("#modifying").hide();
    }
}

$(document).ready(function() {
    $("#startGame").click(function() {
	$(".game").hide();
	var size = document.getElementById("size").selectedIndex;
	var total = document.getElementById("size").selectedIndex;
	//判断雷区大小
	switch(size) {
	case 0: totalCols = 8;
	    totalRows = 8;
	    break;
	case 1: totalCols = 16;
	    totalRows = 16;
	    if((window.innerWidth < window.innerHeight) && window.innerWidth < 768) {
		$("#settings").append($('<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>建议横屏尝试</div>'));
	    }
	    break;
	case 2: totalCols = 16;
	    totalRows = 30;
	    if((window.innerWidth < window.innerHeight) && window.innerWidth < 768) {
		$("#settings").append($('<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>建议横屏尝试</div>'));
	    }
	    break;
	case 3: totalCols = parseInt($("#cols").val());
	    totalRows = parseInt($("#rows").val());
	    totalMines = parseInt($("#mines").val());
	    if(totalCols > 10 && (window.innerWidth < window.innerHeight) && window.innerWidth < 768) {
		$("#settings").append($('<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>建议横屏尝试</div>'));
	    }
	}
	//判断总雷数
	switch(total) {
	case 0: totalMines = 10;
	    break;
	case 1: totalMines = 40;
	    break;
	case 2: totalMines = 99;
	    break;
	}
	totalBoxes = totalCols*totalRows;
	//security check
	if(totalBoxes <= totalMines) {
	    alert("雷的数量必须比总格数少");
	    return;
	}
	//alert(size);alert(total);
	try {
	    init();
	} catch (e) {
	    alert(e);
	    alert(e.stack)
	}
	$(".game").show();
    });
    $("#toggleMode").click(function() {
	if (markMode) {
	    markMode = false;
	    $(this).text("翻开模式");
	} else {
	    markMode = true;
	    $(this).text("标记模式");
	}
    });
    $(".scoreboard").on("affixed.bs.affix", function() {
	if (window.innerWidth < 768) {
	    $(".mines-area").css("margin-top", "95px");
	};
    });
    $(".scoreboard").on("affixed-top.bs.affix", function() {
	if (window.innerWidth < 768) {
	    $(".mines-area").css("margin-top", "0");
	}
    });
});
