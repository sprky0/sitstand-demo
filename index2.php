<html>
<body>

<canvas id="piechart" width="400" height="400"></canvas>
<script>

var data = [
	{
		start : 0,
		size : 180,
		percentComplete : 0,
		color : '#FFDAB9'
	},
	{
		start : 180,
		size : 180,
		percentComplete : 0,
		color : '#E6E6FA'
	}
];

function drawSegment(canvas, context, item) {

	context.save();

	var centerX = Math.floor(canvas.width / 2);
	var centerY = Math.floor(canvas.height / 2);
	radius = Math.floor(canvas.width / 2);

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

function interval() {
	// do math here
	for (var i = 0; i < data.length; i++) {
		data[i].percentComplete += .01;
		data[i].percentComplete = data[i].percentComplete % 1;
		}
		data[i].start += .1;
		data[i].start = data[i].start % 360;
	}
	draw();
}

setInterval(interval, 1);

</script>

</body>
</html>
