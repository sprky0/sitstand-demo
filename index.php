<!DOCTYPE html>
<html>
<head>
	<style>
	html,body,canvas{
		margin:0;padding:0;
	}
	</style>
</head>
<body>

	<div id="main">
		<canvas width="400" height="400" id="canvas"></canvas>
	</div>

	<script>

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	var centerX = canvas.width / 2;
	var centerY = canvas.height / 2;
	var lineWidth = 100;
	var radius = (canvas.width - lineWidth * 2) / 2;

	var start1 = 0;
	var end1 = 2;
	var stroke1Color = '#003300';
	var stroke1OnColor = '#ffff00';
	var stroke1OffColor = '#00ff00';

	var start2 = 2;
	var end2 = 0;
	var stroke2Color = '#003300';
	var stroke2OnColor = '#ff00ff';
	var stroke2OffColor = '#00ffff';

	function draw() {

		startr1 = start1 * Math.PI;
		endr1 = end1 * Math.PI;

		context.beginPath();
		context.arc(centerX, centerY, radius, startr1, endr1, false);
		context.lineWidth = lineWidth;
		context.strokeStyle = stroke1Color;
		context.stroke();

		startr2 = start2 * Math.PI;
		endr2 = end2 * Math.PI;

		context.beginPath();
		context.arc(centerX, centerY, radius, startr2, endr2, false);
		context.lineWidth = lineWidth;
		context.strokeStyle = stroke2Color;
		context.stroke();

	}

	function interval() {
		if (end1 > 2) {
			end1 = 0;
			stroke1Color = stroke1Color === stroke1OnColor ? stroke1OffColor : stroke1OnColor;
		}
		if (end2 > 2) {
			end2 = 0;
			stroke2Color = stroke2Color === stroke2OnColor ? stroke2OffColor : stroke2OnColor;
		}
		draw();
		end1 += .01;
		end2 += .01;
	}

	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}

	interval();
	setInterval(interval,10);

	</script>
</body>
</html>
