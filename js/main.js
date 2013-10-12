d = document;

var TO_RADIANS = Math.PI / 180;

function drawRotatedImage(image, x, y, angle) {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  // save the current co-ordinate system 
  // before we screw with it
  ctx.save();

  // move to the middle of where we want to draw our image
  ctx.translate((10 * x) + 5, (10 * y) + 5);

  // rotate around that point, converting our 
  // angle from degrees to radians 
  ctx.rotate(angle * TO_RADIANS);

  // draw it up and to the left by half the width
  // and height of the image 
  ctx.drawImage(image, -(image.width / 2), -(image.height / 2));

  // and restore the co-ords to how they were when we began
  ctx.restore();
}

function drawbox(x, y, color) {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(10 * x, 10 * y, 10, 10);
}

function undrawbox(x, y) {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(10 * x - 1, 10 * y - 1, 12, 12);
}

function drawbigbox(x, y, color) {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(10 * x, 10 * y, 100, 100);
}

function drawterrain() {

  //draw terrain here


  drawbox(tankX, tankY, "#a1f3a1");


}

function shotsfired() {
  startX = tankX + (2 * Math.cos(angle * TO_RADIANS));
  startY = tankY + (2 * Math.sin(angle * TO_RADIANS));
  shotT = 0;
  shotA = angle;
  oldshotX = -15;
  oldshotY = -15;
  apower = .1 * power;
  console.log('boom');
  firing = 1;
  shotsfiring();
}

function shotsfiring() {
  var TO_RADIANS = Math.PI / 180;


  shotX = (startX) - (.03 * shotT * shotT * apower) + (shotT * apower * Math.cos(shotA * TO_RADIANS));
  shotX = Math.max(shotX, oldshotX);
  shotY = (startY) + (shotT * apower * Math.sin(shotA * TO_RADIANS) + (4.9 * shotT * shotT));
  shotT += .02;




  drawbox(tankX + (2 * Math.cos(angle * TO_RADIANS)), tankY + (2 * Math.sin(angle * TO_RADIANS)), "#ff0000");

  undrawbox(oldshotX, oldshotY);
  drawbox(shotX, shotY, "#abcdef");
  oldshotX = shotX;
  oldshotY = shotY;

  if (shotY < tankY) {
    //console.log(shotY + " " + tankY);
    var t = setTimeout(function () {
      shotsfiring()
    }, 5)
  } else {
    firing = 0
  }
}

document.onkeydown = checkKey; //arrow keypress handler
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    power += 1; //north
  } else if (e.keyCode == '40' && power >= 0) {
    power -= 1; //south
  } else if (e.keyCode == '37' && angle > -180) {
    angle -= 1; //west    
  } else if (e.keyCode == '39' && angle < 0) {
    angle += 1; //east
  } else if (e.keyCode == '32' && firing == 0) {
    shotsfired();
  } else {
    return 0;
  }


  //  console.log(e.keyCode); //for checking keycodes doi
  mainloop();
}

d.addEventListener("DOMContentLoaded", function () { // Initial setup on page load
  d.removeEventListener("DOMContentLoaded", arguments.callee, false);
  nowPlaying = 0;
  img = new Image();
  initPlay();
});

initPlay = function () {
  if (nowPlaying == 0) { //initialize variables for a new game if we're not playing
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");


    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 810, 510); //clear the canvas


    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext('2d');

    canvas.addEventListener('mousedown', function (evt) {
      if (firing == 0) {
        shotsfired();
      }
    }, false);
    canvas.addEventListener('mousemove', function (evt) {
      var mousePos = getMousePos(canvas, evt);
      canMouseX = mousePos.x
      canMouseY = mousePos.y;



      slope = (canMouseY - ((10 * tankY) + 5)) / (canMouseX - ((10 * tankX) + 5))

      distance = Math.sqrt(Math.pow((canMouseY - (10 * tankY)), 2) + Math.pow((canMouseX - (10 * tankX)), 2));
      distance = distance.toFixed(0);
      power = distance;
      angle = 57.2957795 * Math.atan(slope);
      angle = angle.toFixed(0);
      angle = Math.min(angle, 0);

      mainloop();


    }, false);



    dead = 0; //we start off alive!
    angle = -45;
    old_angle = angle;
    power = 145;
    tankX = 2;
    tankY = 50;
    firing = 0;
    nowPlaying = 1;
    document.body.className = "alive";
    img.src = 'res/tank.gif'; //and with a living head
    drawterrain();
    mainloop();
  }
}
mainloop = function () {
  var TO_RADIANS = Math.PI / 180;
  document.getElementById('power').innerHTML = "power: " + power;
  document.getElementById('angle').innerHTML = "angle: " + (0 - angle);

  undrawbox(tankX + (2 * Math.cos(old_angle * TO_RADIANS)), tankY + (2 * Math.sin(old_angle * TO_RADIANS)));
  drawbox(tankX, tankY, "#a1f3a1");
  drawbox(tankX + (2 * Math.cos(angle * TO_RADIANS)), tankY + (2 * Math.sin(angle * TO_RADIANS)), "#ff0000");
  old_angle = angle;
}



function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
