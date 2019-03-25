importScripts("StackBlur.js");

var ans = 0,
	i = 0;
this.onmessage = function(event) {
	var imageData = event.data;
	stackBlurImageData(imageData, 0, 0, 1920, 1080, 10);
	postMessage(imageData);
}
