// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
window.addEventListener('load', function () {
  var canvas, context;
  //Init
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

     // The pencil tool instance.
     tool = new tool_pencil();

      // Attach the mousedown, mousemove, mouseup and mouseout event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup', ev_canvas, false);
    canvas.addEventListener('mouseout', ev_canvas, false);
    //Clear canvas
    function clear_canvas(){
      context.save();
      // Use the identity matrix while clearing the canvas
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Restore the transform
      context.restore();
    }
  }
  function tool_pencil () {
    var tool = this;
    this.started = false;

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
        context.stroke();
      }
    };

    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
      }
    };
    this.mouseout = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
      }
    };
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
}, false); }