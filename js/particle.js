(function() {

	var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

	// Main
	initHeader();
	initAnimation();
	addListeners();

	function initHeader() {
	width = window.innerWidth;
	height = window.innerHeight;
	target = {x: width/2, y: height/2};

	largeHeader = document.getElementById('image-banner');
	largeHeader.style.height = height+'px';

	canvas = document.getElementById('demo-canvas');
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext('2d');

	// create points
	points = [];
	for(var x = 0; x < width; x = x + width/7) {
		for(var y = 0; y < height; y = y + height/7) {
			var px = x + Math.random()*width/7;
			var py = y + Math.random()*height/7;
			var p = {x: px, originX: px, y: py, originY: py };
			points.push(p);
		}
	}

	// for each point find the 5 closest points
	for(var i = 0; i < points.length; i++) {
		var closest = [];
		var p1 = points[i];
		for(var j = 0; j < points.length; j++) {
			var p2 = points[j]
			if(!(p1 == p2)) {
				var placed = false;
				for(var k = 0; k < 5; k++) {
					if(!placed) {
						if(closest[k] == undefined) {
							closest[k] = p2;
							placed = true;
						}
					}
				}

				for(var k = 0; k < 5; k++) {
					if(!placed) {
						if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
							closest[k] = p2;
							placed = true;
						}
					}
				}
			}
		}
		p1.closest = closest;
	}

	// assign a circle to each point
	for(var i in points) {
		var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.2)');
		points[i].circle = c;
	}
	}

	// Event handling
	function addListeners() {
	if(!('ontouchstart' in window)) {
		window.addEventListener('mousemove', mouseMove);
	}
	window.addEventListener('mouseout', mouseOut);
	window.addEventListener('scroll', scrollCheck);
	window.addEventListener('resize', resize);
	}

	function mouseMove(e) {
	var posx = posy = 0;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY)    {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	target.x = posx;
	target.y = posy;
	}

	function mouseOut(e) {
		var posx = posy = 0;
		
		target.x = posx;
		target.y = posy;
		}

	function scrollCheck() {
	if(document.body.scrollTop > height) animateHeader = false;
	else animateHeader = true;
	}

	function resize() {
	width = window.innerWidth;
	height = window.innerHeight;
	largeHeader.style.height = height+'px';
	canvas.width = width;
	canvas.height = height;
	}

	// animation
	function initAnimation() {
	animate();
	for(var i in points) {
		shiftPoint(points[i]);
	}
	}

	function animate() {
	if(animateHeader) {
		ctx.clearRect(0,0,width,height);
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);  
	ctx.fill();
		for(var i in points) {
			// detect points in range
			if(Math.abs(getDistance(target, points[i])) < 4000) {
				points[i].active = 0.3;
				points[i].circle.active = 0.6;
			} else if(Math.abs(getDistance(target, points[i])) < 20000) {
				points[i].active = 0.1;
				points[i].circle.active = 0.3;
			} else if(Math.abs(getDistance(target, points[i])) < 40000) {
				points[i].active = 0.02;
				points[i].circle.active = 0.1;
			} else {
				points[i].active = 0;
				points[i].circle.active = 0;
			}

			drawLines(points[i]);
			points[i].circle.draw();
		}
	}
	requestAnimationFrame(animate);
	}

	function shiftPoint(p) {
	TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*50,
		y: p.originY-50+Math.random()*40, ease:Circ.easeInOut,
		onComplete: function() {
			shiftPoint(p);
		}});
	}

	// Canvas manipulation
	function drawLines(p) {
	   // if(!p.active) return;
	for(var i in p.closest) {
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
		ctx.lineTo(p.closest[i].x, p.closest[i].y);
		ctx.strokeStyle = 'rgba(192,192,192,0.15)';
		ctx.stroke();
	}
	}

	function Circle(pos,rad,color) {
	var _this = this;

	// constructor
	(function() {
		_this.pos = pos || null;
		_this.radius = rad || null;
		_this.color = color || null;
	})();

	this.draw = function() {
		//if(!_this.active) return;
	  ctx.globalCompositeOperation='destination-out';
  ctx.beginPath();
		ctx.arc(_this.pos.x, _this.pos.y, 6, 0, 2 * Math.PI, false);
		ctx.arc(_this.pos.x, _this.pos.y, _this.active*420, 0, 72, false);

	ctx.fillStyle = 'rgba(192,192,192,0.7)';
  ctx.closePath();
	   
	ctx.fill();
   ctx.globalCompositeOperation='source-over';
	};
	}

	// Util
	function getDistance(p1, p2) {
	return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
	}
	
})();