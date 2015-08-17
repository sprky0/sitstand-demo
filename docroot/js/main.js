(function(document, window){

	var canvas = document.getElementById("timer");
	var context = canvas.getContext("2d");

	var currentSlice = 0;
	var data = [];
	var chartStartAngle = 0;
	var colors = [
		['#FFA69E','#FF776B'],
		['#FAF3DD','#F9E8A9'],
		['#B8F2E6','#87F2DC'],
		['#AED9E0','#82D3E0'],
		['#5E726F','#47726C']
	];
	var colorPointer = Math.floor(colors.length * Math.random());
	var started = new Date().getTime();

	var centerX = Math.floor(canvas.width / 2);
	var centerY = Math.floor(canvas.height / 2);
	var radius = Math.floor(canvas.width / 2);

	function getSetting(key) {
		var r;
		if (window.widget) {
			r = widget.getPreferenceForKey(key);
		} else if (window.localStorage) {
			r = localStorage.getItem(key);
		} else {
			throw 'no storage available';
		}
		r = JSON.parse(r);
		return r;
	}

	function setSetting(key,val) {
		val = JSON.stringify(val);
		if (window.widget) {
			return widget.setPreferenceForKey(key,val);
		} else if (window.localStorage) {
			return localStorage.setItem(key,val);
		} else {
			throw 'no storage available';
		}
	}

	function addSlice(duration,label) {
		var color = colors[colorPointer % colors.length];
		var now = new Date().getTime();
		data.push({
			duration : duration,
			label : label,
			start : 0,
			size : 0,
			percentComplete : 0,
			bgcolor : color[0],
			color : color[1],
			started : now,
			ended : now
		});
		colorPointer++;
		updateCalculatedValues();
		saveData();
	}

	function popSlice() {
		data.pop();
		updateCalculatedValues();
	}

	function shiftSlice() {
		data.shift();
		updateCalculatedValues();
	}

	function saveData() {
		setSetting('timer', data);
	}

	function loadData() {
		data = getSetting('timer');
	}

	function resetData() {
		data = [];
		addSlice(1)
	}

	function drawSegment(canvas, context, item) {

		context.save();

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

	function radiansToDegrees(radians) {
		return radians * (180/Math.PI);
	}

	function degreesToRadians(degrees) {
		return (degrees * Math.PI)/180;
	}

	function draw() {
		clear();
		for (var i = 0; i < data.length; i++) {
			drawSegment(canvas, context, data[i]);
		}
	}

	function updateCalculatedValues() {
		var start = chartStartAngle;
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

	function updateTimeValues() {
		started = new Date().getTime();
		for(var i = 0; i < data.length; i++) {
			data[i].started = started;
			data[i].ended = started;
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

	/**
	 * @note thanks to http://stackoverflow.com/questions/14901593/how-to-add-hover-effect-for-each-slice-html5-canvas
	 */
	function handleClick(clickEvent) {

		// Get the mouse cursor position at the time of the click, relative to the canvas
		var mouseX = clickEvent.pageX - this.offsetLeft;
		var mouseY = clickEvent.pageY - this.offsetTop;

		var centerX = Math.floor(canvas.width / 2);
		var centerY = Math.floor(canvas.height / 2);

		// Was the click inside the pie chart?
		var xFromCenter = mouseX - centerX;
		var yFromCenter = mouseY - centerY;
		var distanceFromCenter = Math.sqrt( Math.pow( Math.abs( xFromCenter ), 2 ) + Math.pow( Math.abs( yFromCenter ), 2 ) );

		if ( distanceFromCenter <= radius ) {

			// You clicked inside the chart.
			// So get the click angle
			var clickAngle = Math.atan2( yFromCenter, xFromCenter ) - chartStartAngle;
			if ( clickAngle < 0 ) {
				clickAngle = 2 * Math.PI + clickAngle;
			}

			var clickAngle = radiansToDegrees(clickAngle);


			for (var i = 0; i < data.length; i++) {
				if ( clickAngle >= data[i].start && clickAngle <= (data[i].start + data[i].size) ) {
					// You clicked on pieData[i]
					return;
				}
			}
		}
	}

	function interval() {

		if (currentSlice > data.length || data.length == 0 || !data) {
			currentSlice = 0;
			return false;
		}

		var now = new Date().getTime();
		var elapsedMS = now - data[currentSlice].started;

		// data[currentSlice].lastReading = now;
		// optionally add a measurement which is not based on started but instead based
		// on elapsed time when the clock was running to allow a "pause" feature

		var elapsedSeconds = elapsedMS / 1000;
		data[currentSlice].percentComplete = elapsedSeconds / data[currentSlice].duration;

		if (data[currentSlice].percentComplete >= 1) {
			data[currentSlice].ended = now;
			data[currentSlice].percentComplete = 0;
			currentSlice++;
			if (currentSlice >= data.length) {
				currentSlice = 0;
			}
			data[currentSlice].started = now;
		}

		draw();
	}

	function run() {

		loadData();

		document.getElementById('timer').addEventListener('click',handleClick);

		document.getElementById('add_slice').addEventListener('click',function(eve){
			eve.preventDefault();
			addSlice(1,(data.length + 1) + ' zone');
		});

		document.getElementById('remove_slice').addEventListener('click',function(eve){
			eve.preventDefault();
			popSlice();
		});

		document.getElementById('load_settings').addEventListener('click',function(eve){
			eve.preventDefault();
			loadData();
		});

		document.getElementById('save_settings').addEventListener('click',function(eve){
			eve.preventDefault();
			saveData();
		});

		document.getElementById('reset_settings').addEventListener('click',function(eve){
			eve.preventDefault();
			resetData();
		});

		setInterval(interval, 1000 / 60);

	}

	run();

	// notes re: widget settungs
	// http://andrew.hedges.name/widgets/dev/

})(document, window);
