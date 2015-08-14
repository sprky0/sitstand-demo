

var currentSlice = 0;
var data = [];
var colorPointer = 0;
var colors = [
	['#FFA69E','#FF776B'],
	['#FAF3DD','#F9E8A9'],
	['#B8F2E6','#87F2DC'],
	['#AED9E0','#82D3E0'],
	['#5E726F','#47726C']
];
var started = new Date().getTime();

function addSlice(duration,label) {
	var color = colors[colorPointer % colors.length];
	data.push({
		duration : duration,
		label : label,
		start : 0,
		size : 0,
		percentComplete : 0,
		bgcolor : color[0],
		color : color[1]
	});
	colorPointer++;
}

function drawSegment(canvas, context, item) {

	context.save();

	var centerX = Math.floor(canvas.width / 2);
	var centerY = Math.floor(canvas.height / 2);
	radius = Math.floor(canvas.width / 2);

	// background
	var startingAngle = degreesToRadians(item.start);
	var arcSize = degreesToRadians(item.size);
	var endingAngle = startingAngle + arcSize;
	context.beginPath();
	context.moveTo(centerX, centerY);
	context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
	context.closePath();

	context.fillStyle = item.bgcolor;
	context.fill();

	// amount complete
	var startingAngle = degreesToRadians(item.start);
	var arcSize = degreesToRadians(item.size * item.percentComplete);
	var endingAngle = startingAngle + arcSize;
	context.beginPath();
	context.moveTo(centerX, centerY);
	context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
	context.closePath();

	context.fillStyle = item.color;
	context.fill();

	context.restore();

}

function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function degreesToRadians(degrees) {
	return (degrees * Math.PI)/180;
}

canvas = document.getElementById("timer");
var context = canvas.getContext("2d");

function draw() {
	clear();
	for (var i = 0; i < data.length; i++) {
		drawSegment(canvas, context, data[i]);
	}
}

function updateCalculatedValues() {
	var start = 90;
	var totalDuration = 0;
	for(var i = 0; i < data.length; i++) {
		totalDuration += data[i].duration;
	}
	for(var i = 0; i < data.length; i++) {
		data[i].start = start;
		data[i].size = (data[i].duration / totalDuration) * 360;
		start += data[i].size;
		start = start % 360;
	}
}

function findCurrentPeriod(offset) {
	var periodStart = 0;
	var periodEnd = 0;
	for(var i = 0; i < data.length; i++) {
		var periodEnd = periodStart + data[i].duration;
		if (offset >= periodStart && offset < periodEnd){
			return i;
		}
		periodStart = periodEnd;
	}
	// exhausted all options and didn't find it
	return false;
}

function interval() {
	data[currentSlice].percentComplete += .01;
	if (data[currentSlice].percentComplete >= 1) {
		data[currentSlice].percentComplete = 0;
		currentSlice++;
		if (currentSlice >= data.length) {
			currentSlice = 0;
		}
	}

	draw();
}

addSlice(45,'Sit');
addSlice(10,'Stand');

updateCalculatedValues();

setInterval(interval, 1000 / 60);
