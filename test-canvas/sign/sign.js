var canvas = document.getElementById("canvas");
var canvasWidth = Math.min(300, $(window).width() - 100);
var cxt = canvas.getContext("2d");
canvas.width = canvasWidth;
canvas.height = canvas.width;
$("#controller").css("width", canvasWidth + "px")
var isMouseDown = false;
var lastLoc = {
	x: 0,
	y: 0
}; //起笔坐标 
var lastTime = 0; //用于计算时间
var lastLineWidth = -1;
var lineColor = "black";
drawGrid(cxt);

function beginStroke(point) {
	isMouseDown = true;
	lastLoc = windowToCanvas(point.x, point.y);
	lastTime = new Date().getTime();
}

function endStroke() {
	isMouseDown = false;
}

function moveStroke(point) {
	var curLoc = windowToCanvas(point.x, point.y);
	var curTime = new Date().getTime();
	var s = calcDistance(curLoc, lastLoc); //获取笔锋经过的距离
	var t = curTime - lastTime; //获取笔锋经过的时间 ，用于计算行笔速度，赋值不同的宽度
	var lineWidth = calcLineWidth(t, s);


	cxt.beginPath();
	cxt.moveTo(lastLoc.x, lastLoc.y);
	cxt.lineTo(curLoc.x, curLoc.y);
	cxt.strokeStyle = lineColor;
	cxt.lineWidth = lineWidth;
	cxt.lineCap = "round";
	cxt.lineJoin = "round";
	cxt.stroke();
	cxt.closePath();

	lastLoc = curLoc;
	lastTime = curTime;
	lastLineWidth = lineWidth;
}
canvas.onmousedown = function (e) {
	e.preventDefault();
	beginStroke({
		x: e.clientX,
		y: e.clientY
	});
}
canvas.onmouseup = function (e) {
	endStroke();
	e.preventDefault();
}
canvas.onmouseout = function (e) {
	endStroke();
	e.preventDefault();
}
canvas.onmousemove = function (e) {
	e.preventDefault();
	if (isMouseDown) {
		moveStroke({
			x: e.clientX,
			y: e.clientY
		});
	}
}
// 触屏事件
canvas.addEventListener("touchstart", function (e) {
	e.preventDefault();
	var touch = e.touches[0];
	beginStroke({
		x: touch.pageX,
		y: touch.pageY
	});
})
canvas.addEventListener("touchmove", function (e) {
	e.preventDefault();
	if (isMouseDown) {
		var touch = e.touches[0];
		moveStroke({
			x: touch.pageX,
			y: touch.pageY
		});
	}
})
canvas.addEventListener("touchend", function (e) {
	e.preventDefault();
	endStroke();
})
// }
var maxLineWidth = 20;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;

function calcLineWidth(t, s) {
	// 计算运笔速度和时间，获取不同得到宽度
	var resultLineWidth = 0;
	var v = s / t;
	if (v <= minStrokeV) {
		resultLineWidth = maxLineWidth;
	} else if (v >= maxStrokeV) {
		resultLineWidth = minLineWidth;
	} else {
		resultLineWidth = maxLineWidth - ((v - minStrokeV) / (maxStrokeV - minStrokeV)) * (maxLineWidth - minLineWidth);
	}
	if (lastLineWidth = -1) {
		return resultLineWidth;
	}
	return lastLineWidth * 2 / 3 + resultLineWidth * 1 / 3;
};

function calcDistance(loc1, loc2) {
	return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y))
};

function windowToCanvas(x, y) {
	var box = canvas.getBoundingClientRect();
	return {
		x: x - box.left,
		y: y - box.top
	};
};

function drawGrid(cxt) {
	cxt.save();
	cxt.beginPath();
	cxt.moveTo(3, 3);
	cxt.lineTo(canvas.width - 3, 3);
	cxt.lineTo(canvas.width - 3, canvas.height - 3);
	cxt.lineTo(3, canvas.height - 3);
	cxt.lineTo(3, 3);
	cxt.lineWidth = 6;
	cxt.strokeStyle = "red";
	cxt.closePath();
	cxt.stroke();
	cxt.restore();
	cxt.save();
	cxt.beginPath();
	cxt.moveTo(3, 3);
	cxt.lineTo(canvas.width, canvas.height);
	cxt.moveTo(canvas.width, 3);
	cxt.lineTo(3, canvas.height);
	cxt.moveTo(canvas.width / 2, 3);
	cxt.lineTo(canvas.width / 2, canvas.height);
	cxt.moveTo(3, canvas.height / 2);
	cxt.lineTo(canvas.width, canvas.height / 2);
	cxt.strokeStyle = "red";
	cxt.lineWidth = 1;
	cxt.stroke();
	cxt.closePath();
	cxt.restore();
}
// 控制代码
// $("#clear_btn").click(function () { 
//     cxt.clearRect(0, 0, canvas.width, canvas.height);
//     drawGrid(cxt);
// })
function reset() {
	cxt.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid(cxt);
}
$(".color_btn").click(function () {
	if (!$(this).hasClass("color_btn_selected")) {
		$(this).addClass("color_btn_selected").siblings().removeClass("color_btn_selected");
	}
	lineColor = $(this).attr("itemColor");
})
$(".width_btn").click(function () {
	if (!$(this).hasClass("width_btn_selected")) {
		$(this).addClass("width_btn_selected").siblings().removeClass("width_btn_selected");
	}
	maxLineWidth = $(this).attr("lineWidth");
})
var oCanvas = document.getElementById("canvas");
var odiv, height
var nextIndex = 0 //下一步点击次数    
var imgUrll = []
$('#signPeo').click(function () {
	imgUrll = []
	nextIndex = 0
	$('.canvas-sign').show()
	$('#article-page').hide()
	var bers = 'next' + nextIndex
	odiv = document.getElementById('mycanvas').getBoundingClientRect().left;
	height = document.getElementById('mycanvas').getBoundingClientRect().top;
	oCanvas.width = document.getElementById('mycanvas').clientWidth;
	oCanvas.height = document.getElementById('mycanvas').clientWidth;
	$('#mycanvas').css('height', document.getElementById('mycanvas').clientWidth)
	$("#next-img").empty()
	$(".next-img").empty()
	$('.next-t').empty()
	$('.next-imgs').empty()
	$("#next-img").append(`<img class="name-block" id="canvas0"></img>`);
	$(".next-img").append(`<img class="name-block btn-name" id="ca0"></img>`);
	$('.next-t').append(`<button type="button" id="next0" onclick="nextClick('0')">确定</button>`)
	for (var i = 1; i < 10; i++) {
		var htmls = `<button type="button"  style="display:none" id="next${i}" onclick="nextClick('${i}')">确定</button>`
		var imga = document.createElement('img'); //系统获取一个空img对象
		var imgb = document.createElement('img'); //系统获取一个空img对象 
		imga.id = 'canvas' + i
		imgb.id = 'ca' + i
		imga.className = 'name-block img-block';
		imgb.className = 'name-block img-block btn-name';
		$("#next-img").append(imga);
		$(".next-img").append(imgb);
		$('.next-t').append(htmls)
	}
	drawGrid(oCanvas.getContext("2d"))
})
$('#comp').click(function () {
	$('#images').show()
	$('.next-imgs').append($('.next-img').clone())
})
$('#submit').click(function () {
	$('.canvas-sign').hide()
	$('#article-page').show()
	$('#images').hide()
})
$('#cancel').click(function () {
	$('#images').hide()
	$('.next-imgs').empty()
})

// 书写下一字
function nextClick(vn) {
	nextIndex++
	var ber = 'next' + vn
	var bers = 'next' + nextIndex
	$('#' + ber).hide()
	var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url 
	imgUrll.push(imgUri)
	var ids = 'canvas' + vn
	var idsa = 'ca' + vn
	$("#" + bers).show();
	$("#" + ids).show();
	$("#" + idsa).show();
	$("#" + ids).attr("src", imgUri);
	$("#" + idsa).attr("src", imgUri);
	reset()
}