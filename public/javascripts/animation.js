function Animation(startTime, endTime, timeInterpolator, movement) {
	this.startTime = startTime;
	this.endTime = endTime;
	this.timeInterpolator = timeInterpolator;
	this.movement = movement;
}

Animation.prototype = {
	update:function(thisTime, extra) {
		this.movement(this.timeInterpolator(this.startTime, this.endTime, thisTime, extra));
	}
}

var linearTimeInterpolator = function (startTime, endTime, thisTime) {
	if (thisTime <= startTime) {
		return 0;
	}
	if (thisTime >= endTime) {
		return 1;
	}
	return (thisTime - startTime)/(endTime - startTime);
}

var qsTimeInterpolator = function (startTime, endTime, thisTime) {
	if (thisTime <= startTime) {
		return 0;
	}
	if (thisTime >= endTime) {
		return 1;
	}
	var x = (thisTime - startTime)/(endTime - startTime);
	return 1 - (1 - x)*(1 - x)*(1 - x);
}

var sqTimeInterpolator = function (startTime, endTime, thisTime) {
	if (thisTime <= startTime) {
		return 0;
	}
	if (thisTime >= endTime) {
		return 1;
	}
	var x = (thisTime - startTime)/(endTime - startTime);
	return x*x*x;
}

var qsoTimeInterpolator = function (startTime, endTime, thisTime) {
	var x1 = 0,
		y1 = 0,
		x2 = 1,
		y2 = 1,
		x3 = 0.9,
		y3 = 1.1;
	if (thisTime <= startTime) {
		return 0;
	}
	if (thisTime >= endTime) {
		return 1;
	}
	var x = (thisTime - startTime)/(endTime - startTime);
	return ((x-x1)*(x-x2)/(x3-x1)*(x3-x2))*y3+((x-x1)*(x-x3)/(x2-x1)*(x2-x3))*y2+((x-x2)*(x-x3)/(x1-x2)*(x1-x3))*y1;
}