
function resultScene() {
	this.score = score;
	this.playerName = "";
	this.tp = 0;
	this.choice = 0;
	this.breath = 0;
	this.startTime = 0;
	this.playBackTIme = 0;
	this.animationList = [];
	this.progress = -0.5*Math.PI;
	this.totalRadion = 2*Math.PI;
	this.circleX = windowWidth*0.5;
	this.circleY = windowHeight*0.5;
	this.r1 = 250;
	this.r2 = 290;
	this.canvas1 = document.createElement("canvas");
	this.canvas1.width = 1024, this.canvas1.height = 1024;
	this.ctx1 = this.canvas1.getContext("2d");
	this.canvas2 = document.createElement("canvas");
	this.canvas2.width = 1024, this.canvas2.height = 1024;
	this.ctx2 = this.canvas2.getContext("2d");
	

	this.animationList.push(new Animation(0, 800, linearTimeInterpolator, function(p) {
		drawBG(1 - p);
		drawMask(p*0.3);
		fullColor("RGBA(0,0,0," + (1 - p) + ")");
	}));

	
	this.animationList.push(new Animation(0, 1000, qsTimeInterpolator, function(p) {
		drawJBox(ctx, 0, 0, windowWidth, windowHeight*0.12*p, 0, 0, 0, windowHeight*0.12*p, "RGBA(0,0,0,1)", "RGBA(0,0,0,0)");
		drawJBox(ctx, 0, windowHeight*(1 - p*0.12), windowWidth, windowHeight*0.12*p, 0, windowHeight*(1 - p*0.12), 0, windowHeight, "RGBA(0,0,0,0)", "RGBA(0,0,0,1)");
	}));
	
	this.animationList.push(new Animation(3600, 5000, qsTimeInterpolator, function(p) {
		var t = mainResultScene.currentTime,
			c1 = (score == 1000000 ? singleCanvas : singleCanvas),
			c2 = (score == 1000000 ? colorCanvas : mainResultScene.canvas2);
		ctx.save();
			ctx.globalAlpha = 0.5;
			ctx.translate(windowWidth/2, windowHeight/2);
			ctx.scale((1-(1-p)*(1-p))*1.3,(1-(1-p)*(1-p))*1.3);
			ctx.save();
				ctx.rotate((t/30000 - 0.667 + Math.sin(t/15000))*Math.PI);
				ctx.scale(jb(Math.sin((t/4000 - 0.667)*Math.PI), 0, 1)*0.1 + 0.9, jb(Math.sin((t/4000 - 0.667)*Math.PI), 0, 1)*0.1 + 0.9);
				ctx.globalAlpha = jb(Math.sin((t/4000 - 0.333)*Math.PI), 0, 1)*0.6 + 0.4;
				ctx.drawImage(c1, -512, -512);
			ctx.restore();
			ctx.save();
				ctx.rotate((t/30000 + 0.000 + Math.sin(t/16000))*Math.PI);
				ctx.scale(jb(Math.sin((t/4000 + 0.000)*Math.PI), 0, 1)*0.1 + 0.9, jb(Math.sin((t/4000 + 0.000)*Math.PI), 0, 1)*0.1 + 0.9);
				ctx.globalAlpha = jb(Math.sin((t/4000 + 0.333)*Math.PI), 0, 1)*0.6 + 0.4;
				ctx.drawImage(c1, -512, -512);
			ctx.restore();
			ctx.save();
				ctx.rotate((t/30000 + 0.667 + Math.sin(t/15000))*Math.PI);
				ctx.scale(jb(Math.sin((t/4000 + 0.667)*Math.PI), 0, 1)*0.1 + 0.9, jb(Math.sin((t/4000 + 0.667)*Math.PI), 0, 1)*0.1 + 0.9);
				ctx.globalAlpha = jb(Math.sin((t/4000 + 1.000)*Math.PI), 0, 1)*0.6 + 0.4;
				ctx.drawImage(c1, -512, -512);
			ctx.restore();
			ctx.save();
				ctx.rotate((t/15000 - 0.667)*Math.PI);
				ctx.scale(jb(Math.sin((t/4000 - 0.667)*Math.PI), 0, 1)*0.1 + 0.9, jb(Math.sin((t/4000 - 0.667)*Math.PI), 0, 1)*0.1 + 0.9);
				ctx.globalAlpha = jb(Math.sin((t/4000 - 0.667)*Math.PI), 0, 1)*0.9 + 0.1;
				ctx.drawImage(c2, -512, -512);
				ctx.rotate(Math.sin(t/5000)*0.2*Math.PI);
				ctx.drawImage(c2, -512, -512);
			ctx.restore();
			ctx.save();
				ctx.rotate((t/15000 + 0.000)*Math.PI);
				ctx.scale(jb(Math.sin((t/4000 + 0.000)*Math.PI), 0, 1)*0.1 + 0.9, jb(Math.sin((t/4000 + 0.000)*Math.PI), 0, 1)*0.1 + 0.9);
				ctx.globalAlpha = jb(Math.sin((t/4000 + 0.000)*Math.PI), 0, 1)*0.9 + 0.1;
				ctx.drawImage(c2, -512, -512);
				ctx.rotate(Math.sin(t/5000)*0.2*Math.PI);
				ctx.drawImage(c2, -512, -512);
			ctx.restore();
			ctx.save();
				ctx.rotate((t/15000 + 0.667)*Math.PI);
				ctx.scale(jb(Math.sin((t/4000 + 0.667)*Math.PI), 0, 1)*0.1 + 0.9, jb(Math.sin((t/4000 + 0.667)*Math.PI), 0, 1)*0.1 + 0.9);
				ctx.globalAlpha = jb(Math.sin((t/4000 + 0.667)*Math.PI), 0, 1)*0.9 + 0.1;
				ctx.drawImage(c2, -512, -512);
				ctx.rotate(Math.sin(t/5000)*0.2*Math.PI);
				ctx.drawImage(c2, -512, -512);
			ctx.restore();
			ctx.globalAlpha = 1;
		ctx.restore();
	}));
	
	this.animationList.push(new Animation(0, 1500, qsTimeInterpolator, function(p) {
		ctx.fillStyle = "RGBA(255,255,255," + p + ")";
		ctx.font = "72px orbitron-bold,sans";
		ctx.fillText(CMap.m_path, windowWidth*0.5, windowHeight*0.08);
		var x, hardshipCut;
		switch(hardship) {
			case "CASUAL":
				{
					hardshipCut = 0;
					x = 0.452;
					break;
				}
			case "NORMAL":
				{
					hardshipCut = 1;
					x = 0.452;
					break;
				}
			case "HARD":
				{
					hardshipCut = 2;
					x = 0.464;
					break;
				}
			case "MEGA":
				{
					hardshipCut = 3;
					x = 0.464;
					break;
				}
			case "GIGA":
				{
					hardshipCut = 4;
					x = 0.464;
					break;
				}
			case "CUSTOM":
				{
					hardshipCut = 5;
					x = 0.452;
					break;
				}
		}
		ctx.globalAlpha = p;
		ctx.drawImage(hardshipCanvas, 0, 43 * hardshipCut, 190, 43, windowWidth*x, windowHeight*0.096, 190, 43);
		ctx.globalAlpha = 1;
	}));
	this.animationList.push(new Animation(0, 1500, qsTimeInterpolator, function(p) {
		ctx.fillStyle = "white";
		ctx.fillRect(windowWidth*(0.5 - 0.4*p), windowHeight*0.14, windowWidth*0.8*p, windowHeight*0.008);
	}));
	this.animationList.push(new Animation(1000, 2000, qsTimeInterpolator, function(p) {
		ctx.fillStyle = "RGBA(255,255,255," + p + ")";
		ctx.fillRect(windowWidth*(0.8 - 0.08*p), windowHeight*0.64, windowWidth*0.16*p, windowHeight*0.005);
		if (missHit > 0) {
			ctx.font = "36px Dynamix";
			ctx.fillText("MISS", windowWidth*0.8, windowHeight*0.63);
			ctx.fillText(Math.round(missHit*p), windowWidth*0.8, windowHeight*0.68);
		}
	}));
	this.animationList.push(new Animation(1300, 2300, qsTimeInterpolator, function(p) {
		ctx.fillStyle = "RGBA(255,255,255," + p + ")";
		ctx.fillRect(windowWidth*(0.8 - 0.08*p), windowHeight*0.36, windowWidth*0.16*p, windowHeight*0.005);
		if (goodHit > 0) {
			ctx.font = "36px Dynamix";
			ctx.fillText("GOOD", windowWidth*0.8, windowHeight*0.35);
			ctx.fillText(Math.round(goodHit*p), windowWidth*0.8, windowHeight*0.40);
		}
	}));
	this.animationList.push(new Animation(3600, 4600, qsTimeInterpolator, function(p) {
		ctx.fillStyle = "RGBA(255,255,255," + p + ")";
		ctx.fillRect(windowWidth*(0.2 - 0.08*p), windowHeight*0.64, windowWidth*0.16*p, windowHeight*0.005);
		if (greatHit > 0) {
			ctx.font = "36px Dynamix";
			ctx.fillText("GREAT", windowWidth*0.2, windowHeight*0.63);
			ctx.fillText(Math.round(greatHit*p), windowWidth*0.2, windowHeight*0.68);
		}
	}));
	this.animationList.push(new Animation(3900, 4900, qsTimeInterpolator, function(p) {
		ctx.fillStyle = "RGBA(255,255,255," + p + ")";
		ctx.fillRect(windowWidth*(0.2 - 0.08*p), windowHeight*0.36, windowWidth*0.16*p, windowHeight*0.005);
		if (perfectHit + prHit > 0) {
			ctx.font = "36px Dynamix";
			ctx.fillText("PERFECT", windowWidth*0.2, windowHeight*0.35);
			ctx.fillText(Math.round((perfectHit + prHit)*p), windowWidth*0.2, windowHeight*0.40);
			ctx.font = "16px Dynamix";
			ctx.fillText("NEAR " + Math.round(prHit*p), windowWidth*0.21, windowHeight*0.42);
		}
	}));
	this.animationList.push(new Animation(0, 3600, qsTimeInterpolator, function(p) {
		if (p == 1) {
			return;
		}
		ctx.globalAlpha = p*p;
		var temp = Math.round((maxCombo*0.08 + perfectHit*0.92*0.6 + greatHit*0.92*0.6 + goodHit*0.92*0.6) * 1000000 / totalNote);
		mainResultScene.score = Math.round((1 - Math.pow(1 - p, 3))*temp);
		for (var str = "" + mainResultScene.score; str.length < 7; str = "0" + str);
//		ctx.font = "bold 48px orbitron-bold,sans";
		drawNumber(str, "center", 0.6, windowWidth*(0.50 + 0.038*(1 - (1 - p)*(1 - p))), windowHeight*0.5);
		if (missHit != 0) {
			ctx.globalAlpha *= 0.6;
			drawNumber(Math.round(maxCombo*p), "left", 0.3, windowWidth*(0.60 + 0.05*(1 - (1 - p)*(1 - p))), windowHeight*0.58);
		}
		ctx.globalAlpha = 1;
	}));
	this.animationList.push(new Animation(3600, 5000, qsTimeInterpolator, function(p) {
		if (p == 0) {
			return;
		}
		var temp = Math.round((maxCombo*0.08 + perfectHit*0.92*0.6 + greatHit*0.92*0.6 + goodHit*0.92*0.6) * 1000000 / totalNote);
		mainResultScene.score = Math.round(temp + (1 - Math.pow(1 - p, 3))*(score - temp));
		for (var str = "" + mainResultScene.score; str.length < 7; str = "0" + str);
//		ctx.font = "bold 48px orbitron-bold,sans";
		drawNumber(str, "center", 0.6, windowWidth*((score == 1000000 ? 0.538 - p*0.013 : 0.538)), windowHeight*0.5);
		if (missHit != 0) {
			ctx.globalAlpha = 0.6;
			drawNumber(maxCombo, "left", 0.3, windowWidth*0.65, windowHeight*0.58);
		}
		ctx.globalAlpha = 1;
	}));
	this.animationList.push(new Animation(2100, 3300, qsTimeInterpolator, function(p) {
		var l = 0.4;
		drawJBox(ctx, windowWidth*(0.5 - p*l),windowHeight*0.83, windowWidth*l*p, windowHeight*0.10, windowWidth*(0.5 - p*l), 0, windowWidth*0.5, 0, "RGBA(0, 0, 0, 0)", "RGBA(0, 0, 0, 1)");
		drawJBox(ctx, windowWidth*0.5,windowHeight*0.83, windowWidth*l*p, windowHeight*0.10, windowWidth*0.5, 0, windowWidth*(0.5 + p*l), 0, "RGBA(0, 0, 0, 1)", "RGBA(0, 0, 0, 0)");
	}));
	this.animationList.push(new Animation(2400, 3600, qsTimeInterpolator, function(p) {
		var x = windowWidth*0.5,
			y = windowHeight*0.88,
			r = windowHeight*0.08*p;
		ctx.save()
			ctx.beginPath();
			ctx.moveTo(x, y - r);
			ctx.lineTo(x + r, y);
			ctx.lineTo(x, y + r);
			ctx.lineTo(x - r, y);
			ctx.lineTo(x, y - r);
			ctx.closePath();
			ctx.clip();
			ctx.fillStyle = "RGBA(192,192,192," + p*0.5 + ")";
			ctx.fill();
			var i = jb(255 - Math.round(Math.pow((mainResultScene.tp*p/100), 3)*255), 0, 255);
			ctx.fillStyle = "RGBA(" + i + "," + (255 - i) + "," + (255 - i) + "," + p*0.7 + ")";
			ctx.fillRect(x - r, y + r - (2*r)*mainResultScene.tp*p/100, 2*r, 2*r);
			ctx.fillStyle = "RGBA(256,256,256," + p*0.8 + ")";
			ctx.lineWidth = p*7;
			ctx.strokeStyle = "black";
			ctx.stroke();
		ctx.restore();
	}));
	this.animationList.push(new Animation(2400, 3600, qsTimeInterpolator, function(p) {
		ctx.font = "48px Dynamix";
		ctx.fillStyle = "RGBA(255,255,255," + p + ")";
		ctx.fillText("RETRY", windowWidth*0.7, windowHeight*0.891);
		ctx.fillText("ANOTHER", windowWidth*0.3, windowHeight*0.891);
	}));
	this.animationList.push(new Animation(3800, 4300, qsTimeInterpolator, function(p) {
		ctx.font = "48px Dynamix";
		if (missHit == 0 && goodHit == 0 && greatHit == 0) {
			ctx.fillStyle = "RGBA(255,255,255," + p + ")";
			ctx.fillText("PERFECT", windowWidth*0.5, windowHeight*0.585);
		}
		else if (missHit == 0 && goodHit == 0) {
			ctx.fillStyle = "RGBA(255,255,255," + p + ")";
			ctx.fillText("EXCELLENT", windowWidth*0.5, windowHeight*0.585);
		}
		else if (missHit == 0) {
			ctx.fillStyle = "RGBA(192,192,192," + p + ")";
			ctx.fillText("Full Combo", windowWidth*0.5, windowHeight*0.585);
		}
		ctx.font = "36px Dynamix";
		ctx.fillStyle = "RGBA(255,255,255," + p + ")";
		ctx.fillText(mainResultScene.tp, windowWidth*0.5, windowHeight*0.891);
	}));
	
}

resultScene.prototype = {
	load: function () {
		this.tp = (Math.round((perfectHit*3 + prHit*2 + greatHit*1)/(totalNote*3)*10000)/100).toFixed(2);
		if (this.tp == "100.00") {
			this.tp = "100";
		}
		this.score = Math.round((maxCombo*0.08 + perfectHit*0.92 + prHit*0.92 + greatHit*0.92*0.6 + goodHit*0.92*0.6) * 1000000 / totalNote);
		var r1, g1, b1, r2, g2, b2;
		if (this.score >= 980000 && this.score != 1000000) {
			r1 = 1.000, g1 = 1.000, b1 = 0.800; 
			r2 = 1.000, g2 = 1.000, b2 = 0.300; 
		}
		else if (this.score >= 950000) {
			r1 = 1.000, g1 = 0.000, b1 = 0.000; 
			r2 = 0.800, g2 = 0.000, b2 = 0.000; 
		}
		else if (this.score >= 900000) {
			r1 = 1.000, g1 = 1.000, b1 = 0.300; 
			r2 = 0.800, g2 = 0.800, b2 = 0.100; 
		}
		else if (this.score >= 800000) {
			r1 = 0.300, g1 = 1.000, b1 = 0.300; 
			r2 = 0.000, g2 = 1.000, b2 = 0.000; 
		}
		else if (this.score >= 700000) {
			r1 = 0.300, g1 = 1.000, b1 = 1.000; 
			r2 = 0.000, g2 = 1.000, b2 = 1.000; 
		}
		else if (this.score >= 600000) {
			r1 = 0.300, g1 = 0.500, b1 = 1.000; 
			r2 = 0.000, g2 = 0.500, b2 = 1.000; 
		}
		else if (this.score >= 500000) {
			r1 = 1.000, g1 = 0.300, b1 = 1.000; 
			r2 = 1.000, g2 = 0.000, b2 = 1.000; 
		}
		else {
			r1 = 0.700, g1 = 0.000, b1 = 0.000; 
			r2 = 0.200, g2 = 0.000, b2 = 0.000; 
		}
		var imageData = singleCtx.getImageData(0, 0, 1024, 1024),
			d1 = ctx.createImageData(1024, 1024),
			d2 = ctx.createImageData(1024, 1024);
		for (var i = 0, l = imageData.data.length; i < l; i += 4) {
			d1.data[i] = jb(Math.round(imageData.data[i]*r1), 0, 255);
			d1.data[i + 1] = jb(Math.round(imageData.data[i + 1]*g1), 0, 255);
			d1.data[i + 2] = jb(Math.round(imageData.data[i + 2]*b1), 0, 255);
			d1.data[i + 3] = imageData.data[i + 3];
			d2.data[i] = jb(Math.round(imageData.data[i]*r2), 0, 255);
			d2.data[i + 1] = jb(Math.round(imageData.data[i + 1]*g2), 0, 255);
			d2.data[i + 2] = jb(Math.round(imageData.data[i + 2]*b2), 0, 255);
			d2.data[i + 3] = imageData.data[i + 3];
		}
		this.ctx1.clearRect(0, 0, 1024, 1024);
		this.ctx1.putImageData(d1, 0, 0);
		this.ctx2.clearRect(0, 0, 1024, 1024);
		this.ctx2.putImageData(d2, 0, 0);
	},
	down: function (coordinate) {
		if (inArea(coordinate, windowWidth*0.25, windowHeight*0.83, windowWidth*0.15, windowHeight*0.10)) {
			loaded -= 2;
			musicCtrl = null;
			bg = false;
			bgSrc = new Image();
			mapFileElement = null;
			mapFileElement = document.createElement("input");
			mapFileElement.type = "file";
			mapFileElement.multiple  = true;
			mapFileElement.style = "display:none";
			mapFileElement.addEventListener("change", function () {
				mapFileCtrl = this.files;
			}, false);
			mapFileCtrl = mapFileElement.files;
			scene = new startMenuSceneMobile();
		}
		else if (inArea(coordinate, windowWidth*0.6, windowHeight*0.83, windowWidth*0.15, windowHeight*0.10)) {
			restart();
			scene = mainPlayView;
		}
		else if (inArea(coordinate, windowWidth*0.4, windowHeight*0.4, windowWidth*0.2, windowHeight*0.2)) {
			this.playerName = window.prompt("Enter tester name:", this.playerName);
		}
	},
	up: function(coordinate) {
	
	},
	move: function(coordinate) {
	
	},
	refresh: function() {
		ctx.textBaseline = "alphabetic";
		this.currentTime = new Date().getTime() - this.startTime;
		this.breath = Math.abs(frameCount - 54) / 54;
//		mainResultScene.totalRadion = jb(this.currentTime, 0, 3000)/3000*2*Math.PI;
		this.progress = -this.currentTime/5000*Math.PI;
		for (var animation of this.animationList) {
			animation.update(this.currentTime);
		}
		ctx.font = "36px orbitron-bold,sans";
		ctx.fillText(this.playerName, windowWidth*0.5, windowHeight*0.93);
		
		ctx.fillStyle = "#0ff";
		
//		ctx.font = '48px Dynamix';
//		ctx.fillText(perfectHit, 200, 300);
//		ctx.fillStyle = "#33f";
//		ctx.fillText(greatHit, 200,400);
//		ctx.fillStyle = "#f3f";
//		ctx.fillText(goodHit, 200, 500);
//		ctx.fillStyle = "#f00";
//		ctx.fillText(missHit, 200, 600);
//		ctx.fillStyle = "#FFF";
//		ctx.fillText(totalNote, 200, 700);
//		ctx.fillStyle = "#FF0";
//		ctx.fillText(maxCombo, 200, 800);
		
		
		// drawBox(ctx, windowWidth * 0.45, windowHeight * 0.5, windowWidth * 0.1, windowHeight * 0.0618, 1, 10);
		
		
		//pointJudge
	}
}






//	this.animationList.push(new Animation(0, 1000, qsTimeInterpolator, function(p) {
////		ctx.fillStyle = "RGBA(0,255,255," + p*0.6 + ")";
////		ctx.fillRect(0, 0, windowWidth/2, windowHeight/2);
//		var color = "#0FF",
//			startRadian = mainResultScene.progress;
//			curveRadian = perfectHit/totalNote*mainResultScene.totalRadion*p,
//			gradient = ctx.createRadialGradient(mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r1, mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r2);
//		mainResultScene.progress += curveRadian;
//		gradient.addColorStop(0, "RGBA(0,255,255,0)");
//		gradient.addColorStop(0.5, "RGBA(0,255,255,0.6)");
//		gradient.addColorStop(0.95, "RGBA(0,0,0,1)");
//		gradient.addColorStop(1, "RGBA(0,0,0,0)");
//		ctx.fillStyle = gradient;
//		ctx.save();
//		ctx.beginPath();
//		ctx.moveTo(mainResultScene.circleX, mainResultScene.circleY);
//		ctx.arc(mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r2, startRadian, startRadian + curveRadian);
//		ctx.moveTo(mainResultScene.circleX, mainResultScene.circleY);
//		ctx.clip();
//		ctx.fillRect(mainResultScene.circleX - mainResultScene.r2, mainResultScene.circleY - mainResultScene.r2, 2*mainResultScene.r2, 2*mainResultScene.r2);
//		ctx.restore();
//		
//	}));
//	this.animationList.push(new Animation(300, 1300, qsTimeInterpolator, function(p) {
////		ctx.fillStyle = "RGBA(48,48,255," + p*0.6 + ")";
////		ctx.fillRect(0, windowHeight/2, windowWidth/2, windowHeight/2);
//		var color = "#33F",
//			startRadian = mainResultScene.progress;
//			curveRadian = greatHit/totalNote*mainResultScene.totalRadion*p,
//			gradient = ctx.createRadialGradient(mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r1, mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r2);
//		mainResultScene.progress += curveRadian;
//		gradient.addColorStop(0, "RGBA(48,48,255,0)");
//		gradient.addColorStop(0.5, "RGBA(48,48,255,0.6)");
//		gradient.addColorStop(0.95, "RGBA(0,0,0,1)");
//		gradient.addColorStop(1, "RGBA(0,0,0,0)");
//		ctx.fillStyle = gradient;
//		ctx.save();
//		ctx.beginPath();
//		ctx.moveTo(mainResultScene.circleX, mainResultScene.circleY);
//		ctx.arc(mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r2, startRadian, startRadian + curveRadian);
//		ctx.moveTo(mainResultScene.circleX, mainResultScene.circleY);
//		ctx.clip();
//		ctx.fillRect(mainResultScene.circleX - mainResultScene.r2, mainResultScene.circleY - mainResultScene.r2, 2*mainResultScene.r2, 2*mainResultScene.r2);
//		ctx.restore();
//	}));
//	this.animationList.push(new Animation(600, 1600, qsTimeInterpolator, function(p) {
////		ctx.fillStyle = "RGBA(255,0,255," + p*0.6 + ")";
////		ctx.fillRect(windowWidth/2, 0, windowWidth/2, windowHeight/2);
//		var color = "#F0F",
//			startRadian = mainResultScene.progress;
//			curveRadian = goodHit/totalNote*mainResultScene.totalRadion*p,
//			gradient = ctx.createRadialGradient(mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r1, mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r2);
//		mainResultScene.progress += curveRadian;
//		gradient.addColorStop(0, "RGBA(255,0,255,0)");
//		gradient.addColorStop(0.5, "RGBA(255,0,255,0.6)");
//		gradient.addColorStop(0.95, "RGBA(0,0,0,1)");
//		gradient.addColorStop(1, "RGBA(0,0,0,0)");
//		ctx.fillStyle = gradient;
//		ctx.save();
//		ctx.beginPath();
//		ctx.moveTo(mainResultScene.circleX, mainResultScene.circleY);
//		ctx.arc(mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r2, startRadian, startRadian + curveRadian);
//		ctx.moveTo(mainResultScene.circleX, mainResultScene.circleY);
//		ctx.clip();
//		ctx.fillRect(mainResultScene.circleX - mainResultScene.r2, mainResultScene.circleY - mainResultScene.r2, 2*mainResultScene.r2, 2*mainResultScene.r2);
//		ctx.restore();
//	}));
//	this.animationList.push(new Animation(900, 1900, qsTimeInterpolator, function(p) {
////		ctx.fillStyle = "RGBA(255,0,0," + p*0.6 + ")";
////		ctx.fillRect(windowWidth/2, windowHeight/2, windowWidth/2, windowHeight/2);
//		var color = "#F00",
//			startRadian = mainResultScene.progress;
//			curveRadian = missHit/totalNote*mainResultScene.totalRadion*p,
//			gradient = ctx.createRadialGradient(mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r1, mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r2);
//		mainResultScene.progress += curveRadian;
//		gradient.addColorStop(0, "RGBA(255,0,0,0)");
//		gradient.addColorStop(0.5, "RGBA(255,0,0,0.6)");
//		gradient.addColorStop(0.95, "RGBA(0,0,0,1)");
//		gradient.addColorStop(1, "RGBA(0,0,0,0)");
//		ctx.fillStyle = gradient;
//		ctx.save();
//		ctx.beginPath();
//		ctx.moveTo(mainResultScene.circleX, mainResultScene.circleY);
//		ctx.arc(mainResultScene.circleX, mainResultScene.circleY, mainResultScene.r2, startRadian, startRadian + curveRadian);
//		ctx.moveTo(mainResultScene.circleX, mainResultScene.circleY);
//		ctx.clip();
//		ctx.fillRect(mainResultScene.circleX - mainResultScene.r2, mainResultScene.circleY - mainResultScene.r2, 2*mainResultScene.r2, 2*mainResultScene.r2);
//		ctx.restore();
//	}));


		//drawJBox(ctx, 0, windowHeight*0.1, windowWidth*0.5*p, windowHeight*0.08, 0, 0, windowWidth*0.5*p, 0, "RGBA(0,0,0,1)", "RGBA(0,0,0,0)");
	
//	this.animationList.push(new Animation(0, 1000, qsTimeInterpolator, function(p) {
//		ctx.fillStyle = "#0FF";
//		drawJBox(ctx, 0, windowHeight*0.1, windowWidth*0.5*p, windowHeight*0.08, 0, 0, windowWidth*0.5*p, 0, "RGBA(0,255,255,1)", "RGBA(0,255,255,0)");
//	}));
//	this.animationList.push(new Animation(100, 1100, qsTimeInterpolator, function(p) {
//		ctx.fillStyle = "#33F";
//		drawJBox(ctx, windowWidth*(1 - p*0.5), windowHeight*0.3, windowWidth*0.5*p, windowHeight*0.08, windowWidth*(1 - p*0.5), 0, windowWidth, 0, "RGBA(48,48,255,0)", "RGBA(48,48,255,1)");
//	}));
//	this.animationList.push(new Animation(200, 1200, qsTimeInterpolator, function(p) {
//		ctx.fillStyle = "#F0F";
//		drawJBox(ctx, 0, windowHeight*0.5, windowWidth*0.5*p, windowHeight*0.08, 0, 0, windowWidth*0.5*p, 0, "RGBA(255,0,255,1)", "RGBA(255,0,255,0)");
//	}));
//	this.animationList.push(new Animation(300, 1300, qsTimeInterpolator, function(p) {
//		ctx.fillStyle = "#F00";
//		drawJBox(ctx, 0, windowHeight*0.7, windowWidth*0.5*p, windowHeight*0.08, 0, 0, windowWidth*0.5*p, 0, "RGBA(255,0,0,1)", "RGBA(255,0,0,0)");
//	}));

//	this.animationList.push(new Animation(0, 1000, qsTimeInterpolator, function(p) {
//		ctx.fillStyle = "#0FF";
//		drawJBox(ctx, 0, windowHeight*0.1, windowWidth*0.5*p, windowHeight*0.08, 0, 0, windowWidth*0.5*p, 0, "RGBA(0,255,255,1)", "RGBA(0,255,255,0)");
//	}));
//	this.animationList.push(new Animation(100, 1100, qsTimeInterpolator, function(p) {
//		ctx.fillStyle = "#33F";
//		drawJBox(ctx, 0, windowHeight*0.3, windowWidth*0.5*p, windowHeight*0.08, 0, 0, windowWidth*0.5*p, 0, "RGBA(48,48,255,1)", "RGBA(48,48,255,0)");
//	}));
//	this.animationList.push(new Animation(200, 1200, qsTimeInterpolator, function(p) {
//		ctx.fillStyle = "#F0F";
//		drawJBox(ctx, 0, windowHeight*0.5, windowWidth*0.5*p, windowHeight*0.08, 0, 0, windowWidth*0.5*p, 0, "RGBA(255,0,255,1)", "RGBA(255,0,255,0)");
//	}));
//	this.animationList.push(new Animation(300, 1300, qsTimeInterpolator, function(p) {
//		ctx.fillStyle = "#F00";
//		drawJBox(ctx, 0, windowHeight*0.7, windowWidth*0.5*p, windowHeight*0.08, 0, 0, windowWidth*0.5*p, 0, "RGBA(255,0,0,1)", "RGBA(255,0,0,0)");
//	}));
//	this.animationList.push(new Animation(0, 1900, qsTimeInterpolator, function(p) {
//		mainResultScene.circleX = (0.5*(1 - p) + score/160000*p)*windowWidth;
//	}));