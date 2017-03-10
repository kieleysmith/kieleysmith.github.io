'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ctx;

var particles = [];
var frame = 0;
var AMPLITUDE = 6;
var DISTANCE = 5;
var DISTANCE_VARIANT = 10;
var GHOSTING_EFFECT = 0.225;
var originY;

//https://www.freesoundeffects.com/free-track/earcing-426762/
var sound = new Audio("earcing.wav");
sound.loop = true;

var Particle = function Particle(x, y) {
	_classCallCheck(this, Particle);

	this.x = x;
	this.y = y;
};

function tick() {
	draw();
	frame++;
	requestAnimationFrame(tick);
}

function moveParticle(i) {
	var self = particles[i];
	var next = particles[i + 1];
	var prev = particles[i - 1];

	var neighborsAttraction = 0; //0.5*((prev.y-next.y)/2);
	var medianAttraction = (originY - self.y) * 0.1;
	var randomness = AMPLITUDE / 2 - Math.random() * AMPLITUDE;
	self.y += neighborsAttraction + medianAttraction + randomness;

	//TODO: move x in a similar way?
	self.x -= 0.05 * ((self.x - prev.x - (next.x - self.x)) / 2);
	var ampx = 4;
	self.x += ampx / 2 - Math.random() * ampx;
}

function draw() {
	ctx.beginPath();
	ctx.fillStyle = 'rgba(0,0,0,' + GHOSTING_EFFECT + ')';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.lineWidth = 3;
	ctx.lineJoin = 'round';
	var r = Math.floor(127 + 128 * Math.random()),
	    g = Math.floor(256 * Math.random()),
	    b = Math.floor(256 * Math.random());

	var particle = particles[0];
	ctx.moveTo(particle.x, particle.y);

	for (var i = 1; i < particles.length - 1; i++) {
		ctx.strokeStyle = randomColorHSLA(180, 240);
		ctx.lineTo(particles[i].x, particles[i].y);
		ctx.stroke();
		moveParticle(i);
	}

	ctx.lineTo(particles[particles.length - 1].x, particles[particles.length - 1].y);
	ctx.stroke();

	ctx.closePath();
}

function init() {
	ctx = $('#plasma')[0].getContext('2d');
	$('#plasma')[0].addEventListener('click', (event)=>{sound.play();});
	ctx.canvas.width = window.innerWidth * 0.5;
	ctx.canvas.height = window.innerHeight * 0.5;
	originY = ctx.canvas.height / 2;

	var distance, x, y, particle;
	var previous = particle = new Particle(0, originY);
	do {
		distance = DISTANCE + DISTANCE_VARIANT * Math.random();
		x = previous.x + distance;
		y = previous.y;
		particle = new Particle(x, y);
		particles.push(particle);
		previous = particle;
	} while (particle.x < ctx.canvas.width);

	requestAnimationFrame(tick);
}

function randomColorHSLA(minHue, maxHue) {
	var h = Math.round(minHue + Math.random() * (maxHue - minHue)),
	    s = '100%',
	    l = '50%';
	return 'hsla(' + h + ',' + s + ',' + l + ',1)';
}

window.onload = init;