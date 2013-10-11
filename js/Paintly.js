// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
	window.addEventListener('load', function () {
	var canvas, context, pencilColor, pencilWidth;
	//Responsivity
	window.onresize=function(){
		if(window.innerWidth<1001){
			canvas.width=window.innerWidth-20;
		}
		else if(canvas.width!=1000){
			canvas.width=1000;
		}
		
		if(window.innerHeight<601+44){
			canvas.height=window.innerHeight-44-20;
		}
		else if(canvas.height!=600){
			//canvas.height=600;
		}
	}
	
	pencilWidth = document.getElementById('pencil-size').value;
	pencilColor = document.getElementById('color-picker').value;
	
	//Changing colors
	var color_picker = document.getElementById('color-picker');
	color_picker.addEventListener('change', change_color, false);
	function change_color(){
		pencilColor = document.getElementById('color-picker').value;
	}
	
	//Changing pencil size
	var size_picker = document.getElementById('pencil-size');
	size_picker.addEventListener('change', change_size, false);
	function change_size(){
		pencilWidth = document.getElementById('pencil-size').value;
	}
	
	var newButton = document.getElementById('new');
	newButton.addEventListener('mouseup', newCanvas, false);
	function newCanvas() {
		var canvas = document.getElementById('paint-canvas');
		canvas.width = canvas.width;
		localStorage.canvas = null;
		var audio = document.getElementById('player');
		audio.play();
	}
	
	var downloadButton = document.getElementById('download');
	downloadButton.addEventListener('mouseup', downloadImage, false);
	function downloadImage() {
		if (localStorage.canvas != null) {
			var dataUrl = localStorage.canvas;
			window.open(dataUrl, "toDataURL() image", "width=" + localStorage.width + ", height=" + localStorage.height);
		}
		else {
			console.log("Your localStorage is empty.");
		}
	}
	
	function saveToLocalStorage(canvas) {	 
		// Get canvas contents as a data URL
		var data = canvas.toDataURL("image/png");
		// Save image into localStorage
		try {
			localStorage.canvas = data;
			localStorage.width = canvas.width;
			localStorage.height = canvas.height;
			console.log("Storage successful: " + data);
		}
		catch (e) {
			console.log("Storage failed: " + e);
		}
	}
	//Touch handler
	function touchHandler(event)
	{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
         switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }
    event.preventDefault();
	}

	
	//Initialize
	function init () {
		// Find the canvas element.
		canvas = document.getElementById('paint-canvas');
		if (!canvas) {
			alert('Error: I cannot find the canvas element!');
			return;
		}

		if (!canvas.getContext) {
			alert('Error: no canvas.getContext!');
			return;
		}

		// Get the 2D canvas context.
		context = canvas.getContext('2d');
		if (!context) {
			alert('Error: failed to getContext!');
			return;
		}

		if(window.innerWidth<1001){
			canvas.width=window.innerWidth-20;
		}
		else if(canvas.width!=1000){
			canvas.width=1000;
		}
		if(window.innerHeight<601+44+44){
			canvas.height=window.innerHeight-44-20;
		}
		else if(canvas.height!=600){
			canvas.height=600;
		}
		
		// load
		if (localStorage.canvas != null && document.getElementById('paint-canvas').width == localStorage.width && document.getElementById('paint-canvas').height == localStorage.height) {
			var img = new Image;
			img.onload = function(){
			  context.drawImage(img,0,0);
			};
			img.src = localStorage.canvas;
			console.log("Load successful");	
		}
		
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			x.innerHTML="Geolocation is not supported by this browser.";
		}
		function showPosition(position) {
			$.ajax({ url:'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=true',
				success: function(data){
				alert('Du är i ' + data.results[3].address_components[0].long_name);
				/*or you could iterate the components for only the city and state*/
				}
			});
		}

		// The pencil tool instance.
		tool = new tool_pencil();

		// Attach the mousedown, mousemove, mouseup and mouseout event listeners.
		// Attach touch-event listeners
		canvas.addEventListener('mousedown', ev_canvas, false);
		canvas.addEventListener('mousemove', ev_canvas, false);
		canvas.addEventListener('mouseup', ev_canvas, false);
		canvas.addEventListener('mouseout', ev_canvas, false);
		canvas.addEventListener('mouseover', ev_canvas, false);

		canvas.addEventListener("touchstart", ev_canvas, true);
    canvas.addEventListener("touchmove", ev_canvas, true);
    canvas.addEventListener("touchend", ev_canvas, true);
		//Clear canvas
		function clear_canvas(){
			context.save();
			// Use the identity matrix while clearing the canvas
			context.setTransform(1, 0, 0, 1, 0, 0);
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Restore the transform
			context.restore();
			//Get rid of the "line-from-right-bug"
			context.beginPath();
		}
		//Runs to clear canvas onload and to get rid of bug
		clear_canvas();
	}
	function tool_pencil () {
		var tool = this;
		this.started = false;
		window.addEventListener('mouseup', cancel_draw, false);
		function cancel_draw(){
			tool.started=false;
		}
		// This is called when you start holding down the mouse button.
		// This starts the pencil drawing.
		this.mousedown = function (ev) {
			context.beginPath();
			context.moveTo(ev._x, ev._y);
			tool.started = true;
		};

		// This function is called every time you move the mouse. Obviously, it only 
		// draws if the tool.started state is set to true (when you are holding down 
		// the mouse button).
		this.mousemove = function (ev) {
			if (tool.started) {
			context.lineTo(ev._x, ev._y);
			context.lineWidth = pencilWidth;
			context.strokeStyle = pencilColor;
			context.stroke();
			}
		};

		// This is called when you release the mouse button.
		this.mouseup = function (ev) {
			if (tool.started) {
				tool.mousemove(ev);
				tool.started = false;
			}
			saveToLocalStorage(canvas);
		};
		this.touchstart = function (ev) {
			context.beginPath();
			context.moveTo(ev._x, ev._y);
			tool.started = true;
		};

		// This function is called every time you move the mouse. Obviously, it only 
		// draws if the tool.started state is set to true (when you are holding down 
		// the mouse button).
		this.touchmove = function (ev) {
			if (tool.started) {
			context.lineTo(ev._x, ev._y);
			context.lineWidth = pencilWidth;
			context.strokeStyle = pencilColor;
			context.stroke();
			}
		};

		// This is called when you release the mouse button.
		this.touchend = function (ev) {
			if (tool.started) {
				tool.started = false;
			}
			saveToLocalStorage(canvas);
		};
		this.mouseout = function (ev) {
			if (tool.started) {
			tool.mousemove(ev);
			}
			saveToLocalStorage(canvas);
		};
		this.mouseover = function (ev){
				if(tool.started){
					context.beginPath();
				}
		}
	}
	
	// The mousemove event handler.
	function ev_canvas (ev) {
		if (ev.layerX || ev.layerX == 0) { // Firefox
			ev._x = ev.layerX;
			ev._y = ev.layerY;
		} else if (ev.offsetX || ev.offsetX == 0) { // Opera
			ev._x = ev.offsetX;
			ev._y = ev.offsetY;
		}

		// Call the event handler of the tool.
		var func = tool[ev.type];
		if (func) {
			func(ev);
		}
	}



	init();
	}, false);
}