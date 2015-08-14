<html>
<body>

<canvas id="piechart" width="400" height="400"></canvas>
<script>


var currentSlice = 0;
var data = [];
var colors = [
	['#007700','#00aa00'],
	['#007700','#00aa00'],
	['#000077','#0000aa']
];

function addSlice(duration,label) {
	var color = colors.pop();
	data.push({
		duration : duration,
		label : label,
		start : 0,
		size : 0,
		percentComplete : 0,
		bgcolor : color[0],
		color : color[1]
	});
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

canvas = document.getElementById("piechart");
var context = canvas.getContext("2d");

function draw() {
	clear();
	for (var i = 0; i < data.length; i++) {
		drawSegment(canvas, context, data[i]);
	}
}

function update() {
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

function interval() {
	data[currentSlice].percentComplete += .01;
	if (data[currentSlice].percentComplete >= 1) {
		data[currentSlice].percentComplete = 0;
		currentSlice++;
		if (currentSlice >= data.length) {
			currentSlice = 0;
		}
	}

	// data[i].start += .1;
	// data[i].start = data[i].start % 360;

	draw();
}

addSlice(10,'Stand');
addSlice(100,'Sit');
update();
setInterval(interval, 1);

</script>

</body>
</html>
