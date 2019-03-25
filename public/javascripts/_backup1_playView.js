var sX, sY, sW, sH, dX, dY, dW, dH;
var showParticles = false;
var showHitSound = true;
var gradual = true;
var gradualPx = 100;
var markSecion = 0;
var editSide = 0; //0Down 1Left 2Right
var noteChosen = [];
var noteChosenList = [];
var hitAnimeList = [];
var shadowAnimeList = [];
var particleAllowMap = [];
var yellowAnimeList = [];
var noteShow = [];
var noteHoldShow = [];
var didList = [];
var didListPlace = -1;
var mixerLT = 0;
var mixerRT = 0;
var perfectHit = 0;
var greatHit = 0;
var goodHit = 0;
var missHit = 0;
var hitNote = 0;
var hitDouble = false;
var pauseShadowH = 120;
var performanceList = [];

function shootParticle(frames, type, x1, y1, d1, x2, y2, d2, fid) {
	if(!showParticles) return;
	if(type == 1) {
		yellowAnimeList.push([frames, frames, x1, y1, d1, x2, y2, d2, type, fid]);
	} else {
		shadowAnimeList.push([frames, frames, x1, y1, d1, x2, y2, d2, type, fid]);
	}
}

function shootRVParticle(frames, type, x, y, r) {
	if(!showParticles || (musicCtrl && musicCtrl.paused)) return;
	var sv = jb(Math.random() * 2 * Math.PI, 0, Math.PI * 2);
	shadowAnimeList.push([frames, frames, x, y, Math.random() * 360, x + Math.cos(sv) * r, y + Math.sin(sv) * r, Math.random() * 180 - 90, type]);
}

function playView() {}

playView.prototype = {
	set: function() {

	},
	refresh: function() {
		//test
		//		holdBottom = [];
		//		drawMiddleImage(redCanvasU, 0, 0, 160, 93, windowWidth/2, windowHeight/2, 1);
		//file check
		{
			if(loaded < 5 + totalHitBuffer + (isMobile ? 1 : 0)) return;
			if(showStart >= -1) {
				if(!musicCtrl.paused) {
					musicCtrl.pause();
				}
				if(between(showStart, 48, 60)) {
					ud = (tud + 20 + ud * 3) / 4;
				}
				if(between(showStart, 43, 47)) {
					ud = (tud * 2 + ud * 3) / 5;
				}
				if(between(showStart, 5, 35)) {
					ud = tud;
					if(Math.abs(lr - tlr) <= 0.5) {
						lr = tlr;
					} else {
						lr = (tlr + lr * 5) / 6;
					}
				}
				if(between(showStart, 10, 30)) {
					pauseShadowH = (120 + pauseShadowH * 4) / 5;
				}
				if(showStart == -1) {
					pauseShadowH = 120;
					lr = tlr;
					ud = tud;
					setTime(0);
					resetCS();
					musicCtrl.goplay();
				}
				showStart--;
			}

			if(!timerReady) {
				timerReady = true;
				audioRate = 1; //Math.random()/10;
				audioRateCache = 1;
				musicCtrl.playbackRate = 1;
				musicCtrl.volume = 1;
				musicCtrl.goplay();
				var realTime = 0;
				timer = new Date();
				baseTime = timer.getTime();
				score = 0;
				preScore = 0;
				combo = 0;
				hitThisFrame = 0;
			}
		}

		//musicMessageUpdate
		if(audioRate != audioRateCache) {
			audioRateCache = audioRate;
			musicCtrl.playbackRate = audioRateCache;
		}




		if (isMobile) {
//			touchRefresh();
		}







		//updateTime
		if (comboAlpha == 0.98 && comboAlpha > 0) {
			comboAlpha -= 0.02;
			
		}
		maxCombo = Math.max(maxCombo, combo);
		//		currentPerfectJudge = perfectJudge*audioRate;
		doration = musicCtrl.duration;
		timer = new Date();
		var realTime = timer.getTime(); // - CMap.m_timeOffset;
		//		thisTime = timer.getTime()/1000 - baseTime;
		thisTime = musicCtrl.currentTime + offsetSec;
		if (isMobile) {
			score = Math.round((maxCombo*0.08 + perfectHit*0.92 + greatHit*0.92*0.75 + goodHit*0.92*0.5) * 1000000 / totalNote);
		}
		else {
			score = Math.round((maxCombo*0.08 + perfectHit*0.92 + greatHit*0.92*0.75 + goodHit*0.92*0.5) * 1000000 / totalNote);
			//score = Math.round(combo * 1000000 / totalNote);
		}
		
		preScore = (score + preScore) / 2;
		preScoreStr = "" + Math.round(preScore);
		while(preScoreStr.length < 7) {
			preScoreStr = "0" + preScoreStr;
		}
		hitNote = 0;

		drawMiddleImage(blueCanvasU, 0, 0, 160, 100, windowWidth * 0.95, windowHeight - ud + 87, 1);
		for(var i = 1; i <= 3; ++i) {
			drawMiddleImage(blankCanvasU, 0, 0, 160, 100, windowWidth * (0.95 - i * 0.1), windowHeight - ud + 87, 1);
		}
		for(var i = 1; i <= 4; ++i) {
			drawMiddleImage(blankCanvasD, 0, 0, 160, 100, windowWidth * (1 - i * 0.1), windowHeight - ud + 51, 1);
		}

		//comboScore
		if(showCS) {
			drawJBox(ctx, 0, pauseShadowH - 60, windowWidth, 50, 0, pauseShadowH - 60, 0, pauseShadowH - 10, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
			ctx.fillStyle = "black";
			ctx.fillRect(0, pauseShadowH - 10, windowWidth, 20);
			drawJBox(ctx, 0, pauseShadowH + 10, windowWidth, 50, 0, pauseShadowH + 10, 0, pauseShadowH + 60, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
			if(musicCtrl.paused) {
				ctx.beginPath();
				ctx.moveTo(windowWidth * 0.487, pauseShadowH - 60);
				ctx.lineTo(windowWidth * 0.517, pauseShadowH - 10);
				ctx.lineTo(windowWidth * 0.487, pauseShadowH + 40);
				ctx.closePath();
				ctx.fillStyle = "white";
				ctx.fill();
			} else {
				drawMiddleImage(pauseCanvas, 0, 0, 17, 92, windowWidth * 0.49, pauseShadowH, 1);
				drawMiddleImage(pauseCanvas, 0, 0, 17, 92, windowWidth * 0.51, pauseShadowH, 1);
			}
			if(score > 0) drawNumber(preScoreStr, "center", (hitThisFrame > 0 ? 0.58 : 0.48), (hitThisFrame > 0 ? windowWidth * 0.294 : windowWidth * 0.29), windowHeight * 0.54, 7);
			if(combo > 3) {
				ctx.globalAlpha = comboAlpha;
				drawNumber(combo, "left", (hitThisFrame > 0 ? 0.58 : 0.48), (hitThisFrame > 0 ? windowWidth * 0.89 : windowWidth * 0.88), windowHeight * 0.54);
				ctx.globalAlpha = 1;
			}
			switch (currentJudgeResult){
				case "Perfect":
					if(hitThisFrame2 > 106) {
						var rate = hitDouble > 0 ? 0.12 : 0.07;
						drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth * 0.257, windowHeight * 0.63, 1.03 + (hitThisFrame2 - 106) * rate);
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * 0.26, windowHeight * 0.65, 1.03 + (hitThisFrame2 - 106) * rate);
						drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth * 0.734, windowHeight * 0.63, 1.03 + (hitThisFrame2 - 106) * rate);
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * 0.737, windowHeight * 0.65, 1.03 + (hitThisFrame2 - 106) * rate);
					} else if(hitThisFrame2 >= 80) {
						ctx.globalAlpha = (hitThisFrame2 - 80) / 25;
						drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth * 0.257, windowHeight * 0.63, 1.03);
						drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth * 0.734, windowHeight * 0.63, 1.03);
						ctx.globalAlpha = 1;
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * 0.26, windowHeight * 0.65, 1.03);
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * 0.737, windowHeight * 0.65, 1.03);
					} else if(hitThisFrame2 >= 40) {
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * 0.26, windowHeight * 0.65, 1.03);
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * 0.737, windowHeight * 0.65, 1.03);
					} else {
						ctx.globalAlpha = hitThisFrame2 / 40;
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * 0.26, windowHeight * 0.65, 1.03);
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * 0.737, windowHeight * 0.65, 1.03);
						ctx.globalAlpha = 1;
					}
					break;
				case "Great":
					ctx.globalAlpha = hitThisFrame2 / 106;
					drawMiddleImage(greatJudgeCanvas, 0, 0, 268, 153, windowWidth * 0.26, windowHeight * 0.653, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * 0.02 : 0));
					drawMiddleImage(greatJudgeCanvas, 0, 0, 268, 153, windowWidth * 0.737, windowHeight * 0.655, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * 0.02 : 0));
					ctx.globalAlpha = 1;
				
					break;
				case "Good":
					ctx.globalAlpha = hitThisFrame2 / 106;
					drawMiddleImage(goodJudgeCanvas, 0, 0, 238, 153, windowWidth * 0.26, windowHeight * 0.653, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * 0.02 : 0));
					drawMiddleImage(goodJudgeCanvas, 0, 0, 238, 153, windowWidth * 0.737, windowHeight * 0.655, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * 0.02 : 0));
					ctx.globalAlpha = 1;
				
					break;
				case "Miss":
					ctx.globalAlpha = hitThisFrame2 / 106;
					drawMiddleImage(missJudgeCanvas, 0, 0, 238, 153, windowWidth * 0.26, windowHeight * 0.656, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * 0.02 : 0));
					drawMiddleImage(missJudgeCanvas, 0, 0, 238, 153, windowWidth * 0.737, windowHeight * 0.656, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * 0.02 : 0));
					ctx.globalAlpha = 1;
				
					break;
				default:
					break;
			}

		}

		//bone
		//function drawJBox(c, x, y, w, h, x1, y1, x2, y2, r1, g1, b1, a1, r2, g2, b2, a2)
		ctx.globalAlpha = jb((1 - Math.abs(Math.round(thisTime / (spu) / 2) - thisTime / (spu) / 2) * 2) * 0.6 + 0.4, 0, 1);
		drawJBox(ctx, 0, windowHeight - ud - 450, windowWidth, 450, windowWidth / 2, windowHeight - ud - 450, windowWidth / 2, windowHeight - ud, rgba(0, 255, 255, 0.0), rgba(0, 255, 255, 0.32));
		ctx.globalAlpha = 1;
		drawJBox(ctx, 0, windowHeight - ud - 30, windowWidth, 30, windowWidth / 2, windowHeight - ud - 30, windowWidth / 2, windowHeight - ud, rgba(0, 255, 255, 0.0), rgba(0, 255, 255, 0.5));
		drawJBox(ctx, 0, windowHeight - ud, windowWidth, 30, windowWidth / 2, windowHeight - ud, windowWidth / 2, windowHeight - ud + 30, rgba(0, 255, 255, 0.5), rgba(0, 255, 255, 0.0));

		drawJBox(ctx, lr, 0, 25, windowHeight - ud, lr, (windowHeight - ud) / 2, lr + 25, (windowHeight - ud) / 2, rgba(0, 255, 255, 0.5), rgba(0, 255, 255, 0.0));
		drawJBox(ctx, lr - 25, 0, 25, windowHeight - ud, lr - 25, (windowHeight - ud) / 2, lr, (windowHeight - ud) / 2, rgba(0, 255, 255, 0.0), rgba(0, 255, 255, 0.5));

		drawJBox(ctx, windowWidth - lr - 25, 0, 25, windowHeight - ud, windowWidth - lr - 25, (windowHeight - ud) / 2, windowWidth - lr, (windowHeight - ud) / 2, rgba(0, 255, 255, 0.0), rgba(0, 255, 255, 0.5));
		drawJBox(ctx, windowWidth - lr, 0, 25, windowHeight - ud, windowWidth - lr, (windowHeight - ud) / 2, windowWidth - lr + 25, (windowHeight - ud) / 2, rgba(0, 255, 255, 0.5), rgba(0, 255, 255, 0.0));

		//targetLine
		ctx.fillStyle = "#FFF";
		drawRect(ctx, "#FFF", 0, windowHeight - ud - 3, windowWidth, 7);
		drawRect(ctx, "#FFF", lr - 2, 0, 5, windowHeight - ud - 3);
		drawRect(ctx, "#FFF", windowWidth - lr - 2, 0, 5, windowHeight - ud - 3);

		//bottomMessage	
		{
			ctx.textBaseline = "top";
			//message
			ctx.font = "bold 48px orbitron-bold,sans";
			ctx.fillStyle = "#FFF";
			ctx.textAlign = "left";
			ctx.globalAlpha = 0.35;
			ctx.fillText(CMap.m_path, windowWidth * 0.021, windowHeight - ud + 26);

			//		ctx.font = "50px Dynamix";
			//		ctx.fillStyle = hardshipColor;
			//		ctx.fillText(hardship, 10, windowHeight - ud + 77);
			var hardshipCut = 0;
			switch(hardship) {
				case "CASUAL":
					{
						hardshipCut = 0;
						break;
					}
				case "NORMAL":
					{
						hardshipCut = 1;
						break;
					}
				case "HARD":
					{
						hardshipCut = 2;
						break;
					}
				case "MEGA":
					{
						hardshipCut = 3;
						break;
					}
				case "GIGA":
					{
						hardshipCut = 4;
						break;
					}
				case "CUSTOM":
					{
						hardshipCut = 5;
						break;
					}
			}
			ctx.drawImage(hardshipCanvas, 0, 43 * hardshipCut, 190, 43, windowWidth * 0.022, windowHeight - ud + 88, 190, 43);
			ctx.globalAlpha = 1;

			if(showCS) ctx.globalAlpha = 0;
			ctx.font = "22px Dynamix";
			ctx.fillStyle = "#FFF";
			ctx.textAlign = "right";
			//ctx.fillText(((realTime - baseTime)/1000).toFixed(3) + " s (REAL)", 0, 50);
			ctx.fillText(fps + " Fps", windowWidth, windowHeight - 80);
			if(musicCtrl.paused) {
				ctx.fillStyle = "#0F0";
			}
			ctx.fillText(offsetSec + " s offset (O- P+)", windowWidth, windowHeight - 30);
			ctx.fillText(musicCtrl.currentTime.toFixed(3) + " s (MUSIC)", windowWidth, windowHeight - 55);

			ctx.fillText((hiSpeed / 1000).toFixed(1) + " x Hispeed (Q- E+)", windowWidth * 0.87, windowHeight - 30);
			if(audioRate < 0.5 || audioRate > 4.0) {
				ctx.fillStyle = "#F88";
			}
			ctx.fillText(audioRate.toFixed(1) + " x Rate (S- W+)", windowWidth * 0.87, windowHeight - 55);

			if(keysDown[72]) {
				ctx.textAlign = "right";
				ctx.fillStyle = "rgba(128, 128, 128, 0.8)";
				ctx.fillText("[Shift](C- V+) ±divition", windowWidth * 0.74, windowHeight - 55);
				ctx.fillText("[Shift](A- D+) ±[0.01]1s", windowWidth * 0.74, windowHeight - 30);
				ctx.fillText("(←↓→) barlines", windowWidth * 0.58, windowHeight - 30);
				ctx.fillText("(F) fullscreen", windowWidth * 0.58, windowHeight - 55);
				ctx.fillText("(Z) unlock time", windowWidth * 0.44, windowHeight - 55);
				ctx.fillText("(X) unlock position", windowWidth * 0.44, windowHeight - 30);
			}
			//		ctx.fillText(offset + " s offset (O- P+)", windowWidth, windowHeight - 25);
			//		ctx.fillText(musicCtrl.currentTime.toFixed(3) + " s (MUSIC)", windowWidth, windowHeight - 50);
			//		ctx.fillText((hiSpeed/1000).toFixed(1) + " x Hispeed (Q- E+)", windowWidth, windowHeight - 100);
			//		if (audioRate < 0.5 || audioRate > 4.0) {
			//			ctx.fillStyle = "#F88";
			//		}
			//		ctx.fillText(audioRate.toFixed(1) + " x Rate (S- W+)", windowWidth, windowHeight - 75);
			ctx.textAlign = "left";
			ctx.fillStyle = "#FFF";
			ctx.globalAlpha = 1;

			/*
					ctx.fillStyle =  "white";
					ctx.shadowColor = "white";
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = 3;
			*/
			//editLine
			if(showD >= 1) {
				ctx.globalAlpha = showD == 1 ? 0.5 : 1;
				for(var qsection = Math.ceil(thisTime / spq); hiSpeed * (qsection * spq - thisTime) <= windowHeight - ud; ++qsection) {
					var lineDis = hiSpeed * (qsection * spq - thisTime);
					var lineColor1 = rgba(128, 128, 128, 0.0);
					var lineColor2 = rgba(128, 128, 128, 1.0);
					var lineWidth = 3;
					var b = 2;
					if(qsection == 0) {
						b = 1024;
					} else
						while(qsection % b == 0) {
							b = b * 2;
						}
					if(qsection % 8 == 0) {
						lineColor1 = rgba(255, 255, 255, 0.0);
						lineColor2 = rgba(255, 255, 255, 1.0);
						lineWidth = 12;
					} else if(qsection % 4 == 0) {
						lineColor1 = rgba(192, 192, 192, 0.0);
						lineColor2 = rgba(192, 192, 192, 1.0);
						lineWidth = 9;
					} else if(qsection % 2 == 0) {
						lineColor1 = rgba(128, 128, 128, 0.0);
						lineColor2 = rgba(128, 128, 128, 1.0);
						lineWidth = 3;
					}
					if((!low)) {
						drawJBox(ctx, lr, windowHeight - ud - lineDis - lineWidth, windowWidth - 2 * lr, lineWidth, windowWidth / 2, windowHeight - ud - lineDis - lineWidth, windowWidth / 2, windowHeight - ud - lineDis, lineColor1, lineColor2);
					} else {
						ctx.fillRect(lr, windowHeight - ud - lineDis - lineWidth / 2, windowWidth - 2 * lr, lineWidth);
					}
				}
				ctx.globalAlpha = 1;
				ctx.save();
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
				for(var qsection = Math.ceil(thisTime / spq); hiSpeed * (qsection * spq - thisTime) <= windowHeight - ud; ++qsection) {
					var lineDis = hiSpeed * (qsection * spq - thisTime);
					var lineColor2 = rgba(128, 128, 128, 1.0);
					var b = 2;
					if(qsection == 0) {
						b = 1024;
					} else
						while(qsection % b == 0) {
							b = b * 2;
						}
					if(qsection % 8 == 0) {
						lineColor2 = rgba(255, 255, 255, 1.0);
					} else if(qsection % 4 == 0) {
						lineColor2 = rgba(192, 192, 192, 1.0);
					} else if(qsection % 2 == 0) {
						lineColor2 = rgba(128, 128, 128, 1.0);
					}
					ctx.fillStyle = lineColor2;
					if(hiSpeed * spq >= 50 / b) {
						ctx.strokeText(qsection / 32, windowWidth - lr + 5, windowHeight - ud - lineDis - 20);
						ctx.fillText(qsection / 32, windowWidth - lr + 5, windowHeight - ud - lineDis - 20);
					}
				}
				ctx.restore();
			}
			ctx.textAlign = "center";
			if(showL >= 1) {
				ctx.globalAlpha = showL == 1 ? 0.5 : 1;
				for(var qsection = Math.ceil(thisTime / spq); hiSpeed * (qsection * spq - thisTime) <= windowWidth / 2 - lr; ++qsection) {
					var lineDis = hiSpeed * (qsection * spq - thisTime);
					var lineColor1 = rgba(128, 128, 128, 0.0);
					var lineColor2 = rgba(128, 128, 128, 1.0);
					var lineWidth = 5;
					var b = 2;
					if(qsection == 0) {
						b = 1024;
					} else
						while(qsection % b == 0) {
							b = b * 2;
						}
					if(qsection % 8 == 0) {
						lineColor1 = rgba(255, 255, 255, 0.0);
						lineColor2 = rgba(255, 255, 255, 1.0);
						lineWidth = 12;
					} else if(qsection % 4 == 0) {
						lineColor1 = rgba(192, 192, 192, 0.0);
						lineColor2 = rgba(192, 192, 192, 1.0);
						lineWidth = 9;
					} else if(qsection % 2 == 0) {
						lineColor1 = rgba(128, 128, 128, 0.0);
						lineColor2 = rgba(128, 128, 128, 1.0);
						lineWidth = 3;
					}
					if((!low)) {
						drawJBox(ctx, lr + lineDis, 0, lineWidth, windowHeight - ud, lr + lineDis, 0, lr + lineDis + lineWidth, 0, lineColor2, lineColor1);
					} else {
						ctx.fillRect(lr + lineDis - lineWidth / 2, 0, lineWidth, windowHeight - ud);
					}
				}
				ctx.globalAlpha = 1;
				ctx.save();
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
				for(var qsection = Math.ceil(thisTime / spq); hiSpeed * (qsection * spq - thisTime) <= windowWidth / 2 - lr; ++qsection) {
					var lineDis = hiSpeed * (qsection * spq - thisTime);
					var lineColor2 = rgba(128, 128, 128, 1.0);
					var b = 2;
					if(qsection == 0) {
						b = 1024;
					} else
						while(qsection % b == 0) {
							b = b * 2;
						}
					if(qsection % 8 == 0) {
						lineColor2 = rgba(255, 255, 255, 1.0);
					} else if(qsection % 4 == 0) {
						lineColor2 = rgba(192, 192, 192, 1.0);
					} else if(qsection % 2 == 0) {
						lineColor2 = rgba(128, 128, 128, 1.0);
					}
					ctx.fillStyle = lineColor2;
					if(hiSpeed * spq >= 200 / b) {
						ctx.strokeText(qsection / 32, lineDis + lr, windowHeight - ud);
						ctx.fillText(qsection / 32, lineDis + lr, windowHeight - ud);
					}
				}
				ctx.restore();
			}
			if(showR >= 1) {
				ctx.globalAlpha = showR == 1 ? 0.5 : 1;
				for(var qsection = Math.ceil(thisTime / spq); hiSpeed * (qsection * spq - thisTime) <= windowWidth / 2 - lr; ++qsection) {
					var lineDis = hiSpeed * (qsection * spq - thisTime);
					var lineColor1 = rgba(128, 128, 128, 0.0);
					var lineColor2 = rgba(128, 128, 128, 1.0);
					var lineWidth = 5;
					var b = 2;
					if(qsection == 0) {
						b = 1024;
					} else
						while(qsection % b == 0) {
							b = b * 2;
						}
					if(qsection % 8 == 0) {
						lineColor1 = rgba(255, 255, 255, 0.0);
						lineColor2 = rgba(255, 255, 255, 1.0);
						lineWidth = 12;
					} else if(qsection % 4 == 0) {
						lineColor1 = rgba(192, 192, 192, 0.0);
						lineColor2 = rgba(192, 192, 192, 1.0);
						lineWidth = 9;
					} else if(qsection % 2 == 0) {
						lineColor1 = rgba(128, 128, 128, 0.0);
						lineColor2 = rgba(128, 128, 128, 1.0);
						lineWidth = 3;
					}
					if((!low)) {
						drawJBox(ctx, windowWidth - lr - lineDis - lineWidth, 0, lineWidth, windowHeight - ud, windowWidth - lr - lineDis - lineWidth, 0, windowWidth - lr - lineDis, 0, lineColor1, lineColor2);
					} else {
						ctx.fillRect(windowWidth - lr - lineDis - lineWidth / 2, 0, lineWidth, windowHeight - ud);
					}
				}
				ctx.globalAlpha = 1;
				ctx.save();
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
				for(var qsection = Math.ceil(thisTime / spq); hiSpeed * (qsection * spq - thisTime) <= windowWidth / 2 - lr; ++qsection) {
					var lineDis = hiSpeed * (qsection * spq - thisTime);
					var lineColor2 = rgba(128, 128, 128, 1.0);
					var b = 2;
					if(qsection == 0) {
						b = 1024;
					} else
						while(qsection % b == 0) {
							b = b * 2;
						}
					if(qsection % 8 == 0) {
						lineColor2 = rgba(255, 255, 255, 1.0);
						lineWidth = 20;
					} else if(qsection % 4 == 0) {
						lineColor2 = rgba(192, 192, 192, 1.0);
						lineWidth = 20;
					} else if(qsection % 2 == 0) {
						lineColor2 = rgba(128, 128, 128, 1.0);
						lineWidth = 10;
					}
					ctx.fillStyle = lineColor2;
					if(hiSpeed * spq >= 200 / b) {
						ctx.fillText(qsection / 32, windowWidth - lr - lineDis, windowHeight - ud);
					}
				}
				ctx.restore();
			}
		}

		//ctx.fillText(spq + " s/demisemiquaver", 0, 250);
		/*
		for (var i = 0; i < hitUrl.length; ++i) {
			var used = 0;
			ctx.fillStyle = "#FFF";
			for (var j = 0; j < hitBuffer[i]; ++j) {
				if (! hitCtrl[i][j].paused) ++used;
			}
			if (used == hitBuffer[i]) {
				ctx.fillStyle = "#F88";
			}
			ctx.fillText("hitUsage" + i + " " + used + "/" + hitBuffer[i], 0, 300 + 50*i);
		}
		*/
		if(!editMode) {
			drawNumber(ctx, 1, combo, 1, (hitThisFrame == 10 ? 3 : 4), 0.8 * windowWidth, (0.5 - 0.001 * hitThisFrame) * windowHeight);
			drawNumber(ctx, 1, preScoreStr, 1, (hitThisFrame == 10 ? 3 : 4), 0.4 * windowWidth, (0.5 - 0.001 * hitThisFrame) * windowHeight);
		}

		//shadow
		{
			var t = mixerLT;
			if(t > 0) {
				ctx.globalAlpha = jb(t / 24, 0, 1);
				ctx.drawImage(mixerShadowCanvasL, 0, 0, 437, 381, lr - 95, barL - 190, 437, 381);
				ctx.globalAlpha = 1;
			}
			var t = mixerRT;
			if(t > 0) {
				ctx.globalAlpha = jb(t / 24, 0, 1);
				ctx.drawImage(mixerShadowCanvasR, 0, 0, 437, 381, windowWidth - lr - 342, barR - 190, 437, 381);
				ctx.globalAlpha = 1;
				t = 0;
			}
			if(mixerLT > 0) mixerLT--;
			if(mixerRT > 0) mixerRT--;

			//dis=0% mtox*100%+windowWidth/2*0%
			//dis=100% (mtox*dp + windowWidth/2*(1-dp)
			//100% 0.5*windowWidth
			
			//note
			noteShow = [];
			noteHoldShow = [];
			var magPos = (mainMouse.condition == "writeHold" && mainMouse.condition == 2) ? coverPos2 : coverPos1;
			var magWidth = (mainMouse.condition == "writeHold" && mainMouse.condition == 2) ? coverWidth2 : coverWidth1;
			for(var i = 0; i < noteDown.length; ++i) {
				thisNote = noteDown[i];
				if(!thisNote || (isMobile && thisNote && thisNote.status != "Untouched" && !(thisNote.status == "Miss" && ! missHoldFindD[i]) && thisNote.m_type != "HOLD")) continue;
				var touchTime = thisNote.m_time * (spu);//getTime(thisNote.m_time);
				var dis = hiSpeed * (touchTime - thisTime);
				var x = deeMode && thisNote.m_type != "HOLD" ? mtox(thisNote.m_position, 0) * (1 - dis / (windowHeight - ud)) + dis / (windowHeight - ud) * windowWidth * 0.5 : mtox(thisNote.m_position, 0);
				var width = deeMode && thisNote.m_type != "HOLD" ? mtow(thisNote.m_width, 0) * (1 - dis / (windowHeight - ud)) : mtow(thisNote.m_width, 0);
				switch(thisNote.m_type) {
					case "NORMAL":
						//						drawSingleNote(ctx, 0, width, x, dis);
						if (isMobile) {
							if(thisNote.status == "Untouched" && touchTime < thisTime - judge.g) {
								hitAnime(thisNote, 0, "Miss", true);
							}
						}
						else if(!noteDownHit[i]) {
							if(touchTime <= thisTime) {
								noteDownHit[i] = true;
								hitAnime(thisNote, 0, "Perfect");
							}
						}
						if(((! isMobile && dis >= 0) || isMobile) && dis <= windowHeight - ud) {
							if (dis < -hideHeight - (ud - hideHeight)/hide) {
								missHoldFindD[i] = true;
								break;
							}
							var ndis = dis;
							if(deeMode && downJump) {
								dis = Math.cos(dis / (windowHeight - ud) * Math.PI / 2) * dis * downJumpHeight;
							}
							noteShow.push([0, 0, width, x, dis, ((editSide == 0 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 0 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * ndis / (windowHeight - ud), 0, 1)]);
						}
						break;

					case "CHAIN":
						//		drawSlideNote(ctx, 0, width, x, dis);	
						if (isMobile) {
							if(thisNote.status == "Untouched") {
								if (touchTime < thisTime - judge.g) {
									hitAnime(thisNote, 0, "Miss", true);
								}
								else if (between(touchTime, thisTime - judge.m, thisTime + judge.p)) {
									for (var [id, f] of touchHold) {
										if (Math.abs(f.y - (windowHeight - ud)) <= udo && between(f.x, mtox(thisNote.m_position, 0) - mtow(thisNote.m_width, 0)/2 - expand, mtox(thisNote.m_position, 0) + mtow(thisNote.m_width, 0)/2 + expand)) {
											if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.p) {
												hitAnime(thisNote, 0, "Perfect");
											}
											else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.gr) {
												hitAnime(thisNote, 0, "Great");
											}
											else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.g) {
												hitAnime(thisNote, 0, "Good");
											}
											else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.m) {
												hitAnime(thisNote, 0, "Miss");
											}
											break;
										}
									}
								}
							}
							else {
							}
						}
						else if(!noteDownHit[i]) {
							if(touchTime <= thisTime) {
								noteDownHit[i] = true;
								hitAnime(thisNote, 0, "Perfect");
							}
						}
						if(((! isMobile && dis >= 0) || isMobile) && dis <= windowHeight - ud) {
							if (dis < -hideHeight - (ud - hideHeight)/hide) {
								missHoldFindD[i] = true;
								break;
							}
							var ndis = dis;
							if(deeMode && downJump) {
								dis = Math.cos(dis / (windowHeight - ud) * Math.PI / 2) * dis * downJumpHeight;
							}
							noteShow.push([1, 0, width, x, dis, ((editSide == 0 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 0 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * ndis / (windowHeight - ud), 0, 1)]);
						}
						break;

					case "HOLD":
						var subTime = noteDown[noteDown[i].m_subId].m_time * (spu);
						var dis2 = hiSpeed * (subTime - thisTime);
						var extra = 0;
						if (dis > windowHeight - ud) {
							break;
						}
						if (isMobile) {
							if(thisNote.status == "Untouched") {
								if (touchTime < thisTime - judge.g) {
									hitAnime(thisNote, 0, "Miss", true);
									hitAnime(noteDown[thisNote.m_subId], 0, "Miss", true);
									missHoldFindD[i] = {
										half: false,
										missTime: thisTime - judge.g
									};
									missHoldD.add(i);
								}
							}
							var miss = missHoldFindD[i];
							if (miss) {
								if (miss.half) {
									if (thisTime - miss.missTime > 0.3) {
										missHoldFindD[i] = false;
										missHoldD.delete(i);
										break;
									}
									else {
										extra = 180 - Math.round(0) % 180;
										noteHoldShow.push([0, width, dis2, x, 0, extra, 0, false, 1 - (thisTime - miss.missTime)/0.3]);
										break;
									}
								}
								else {
									if (dis < -hideHeight - (ud - hideHeight)/hide) {
										missHoldFindD[i] = false;
										missHoldD.delete(i);
										break;
									}
									else {
										extra = 180 - Math.round(-dis) % 180;
										noteHoldShow.push([0, width, dis2 - dis, x, dis, extra, 0, false, 1.0]);
										break;
									}
								}
							}
						}
						else if(!noteDownHit[i]) {
							if(touchTime <= thisTime) {
								noteDownHit[i] = true;
								hitAnime(thisNote, 0, "Perfect");
							}
						}
						if (isMobile) {
							if (holdCheckD.has(i)) {
								var holding = false;
								dis2 = Math.min(dis2, windowHeight - ud + 100);
								for (var [id, f] of touchHold) {
									if (Math.abs(f.y - (windowHeight - ud)) <= udo && between(f.x, mtox(thisNote.m_position, 0) - mtow(thisNote.m_width, 0)/2 - expand, mtox(thisNote.m_position, 0) + mtow(thisNote.m_width, 0)/2 + expand)) {
										holding = true;
										break;
									}
								}
								if (holding) {
									holdCheckD.set(i, thisTime);
									extra = 180 - Math.round(-dis) % 180;
									dis = 0;
									shootParticle(18 + Math.floor(Math.random() * 24), 1, x + (Math.random() - 0.5) * width, windowHeight - ud, Math.random() * 360, x + (Math.random() * 2 - 1) * width, windowHeight - ud + (Math.random() - 0.5) * 2 * ud, (Math.random() - 0.5) * 180);
									if (holdCheckD.get(i) + 0 >= noteDown[thisNote.m_subId].m_time*(60/barpm) - judge.p) {
										holdCheckD.delete(i);
										hitAnime(noteDown[thisNote.m_subId], 0, "Perfect");
									}
									else {
								//function drawLongNote(c, place, swidth, length, x, height, extra, hitting, salpha) {}
										noteHoldShow.push([0, width, dis2 - dis, x, dis, extra, 0, true, 1.0]);
										break;
									}
								}
								else {
									extra = 180 - Math.round(-dis) % 180;
									dis = 0;
									var releaseTime = holdCheckD.get(i);
									if (thisTime - releaseTime > holdLeaveTime) {
										if (Math.abs(releaseTime - subTime) <= judge.p) {
											hitAnime(noteDown[thisNote.m_subId], 0, "Perfect");
										}
										else if (Math.abs(releaseTime - subTime) <= judge.gr) {
											hitAnime(noteDown[thisNote.m_subId], 0, "Great");
										}
										else if (Math.abs(releaseTime - subTime) <= judge.g) {
											hitAnime(noteDown[thisNote.m_subId], 0, "Good");
										}
										else {
											missHoldFindD[i] = {
												half: true,
												missTime: thisTime
											};
											missHoldD.add(i);
											hitAnime(noteDown[thisNote.m_subId], 0, "Miss", true);
										}
										holdCheckD.delete(i);
									}
									else {
										shootParticle(18 + Math.floor(Math.random() * 24), 1, x + (Math.random() - 0.5) * width, windowHeight - ud, Math.random() * 360, x + (Math.random() * 2 - 1) * width, windowHeight - ud + (Math.random() - 0.5) * 2 * ud, (Math.random() - 0.5) * 180);
										noteHoldShow.push([0, width, dis2 - dis, x, dis, extra, 0, true, 1.0]);
										break;
									}
								}
							}
							else if (thisNote.status == "Untouched") {
								noteHoldShow.push([0, width, dis2 - dis, x, dis, extra, 0, false, 1.0]);
							}
						}
						else if(dis <= windowHeight - ud && dis2 >= 0) {
							dis2 = Math.min(dis2, windowHeight - ud + 100);
							if(dis <= 0) {
								shootParticle(18 + Math.floor(Math.random() * 24), 1, x + (Math.random() - 0.5) * width, windowHeight - ud, Math.random() * 360, x + (Math.random() * 2 - 1) * width, windowHeight - ud + (Math.random() - 0.5) * 2 * ud, (Math.random() - 0.5) * 180);
								extra = 180 - Math.round(-dis) % 180;
								dis = 0;
							}
							noteHoldShow.push([0, width, dis2 - dis, x, dis, extra, ((editSide == 0 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 0 && equal(thisNote.m_width, magWidth)) ? 1 : 0), noteDownHit[i]]);
						}
						//					drawLongNote(ctx, 0, width, dis2 - dis, x, dis, extra);
						//					drawLongBoxNote(ctx, 0, width, dis2 - dis, x, dis, extra);
						break;

					case "SUB":
						if(!noteDownHit[i] && !isMobile) {
							if(Math.abs(touchTime - thisTime) <= judge.p || touchTime <= thisTime) {
								noteDownHit[i] = true;
								hitAnime(thisNote, 0, "Perfect");
							}
						}
						break;
				}
			}

			for(var i = 0; i < noteLeft.length; ++i) {
				thisNote = noteLeft[i];
				if(!noteLeft[i] || (noteLeft[i] && isMobile && thisNote.status != "Untouched")) continue;
				var touchTime = thisNote.m_time * (spu);
				var dis = hiSpeed * (touchTime - thisTime);
				var x = deeMode && thisNote.m_type != "HOLD" ? mtox(thisNote.m_position, 1) * (1 - dis / (windowWidth / 2 - lr)) : mtox(thisNote.m_position, 1);
				var width = deeMode && thisNote.m_type != "HOLD" ? mtow(thisNote.m_width, 1) * (1 - dis / (windowWidth / 2 - lr)) : mtow(thisNote.m_width, 1);
				switch(thisNote.m_type) {
					case "NORMAL":
						if(!noteLeftHit[i]) {
							if(!isMobile) {
								if(touchTime <= thisTime) {
									noteLeftHit[i] = true;
									hitAnime(thisNote, 1, "Perfect");
								}
							} else {}
						}
						if(dis >= 0 && dis <= windowWidth / 2 - lr) {
							var ndis = dis;
							if(deeMode && leftJump) {
								dis = Math.cos(dis / (windowWidth / 2 - lr) * Math.PI / 2) * dis * lrJumpHeight;
							}
							noteShow.push([0, 1, width, x, dis, ((editSide == 1 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 1 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * ndis / (windowWidth / 2 - lr), 0, 1)]);
						}
						break;

					case "CHAIN":
						if(!noteLeftHit[i]) {
							if(!isMobile) {
								if(touchTime <= thisTime) {
									noteLeftHit[i] = true;
									hitAnime(thisNote, 1, "Perfect");
								}
							} else {}
						}
						if(dis >= 0 && dis <= windowWidth / 2 - lr) {
							var ndis = dis;
							if(deeMode && leftJump) {
								dis = Math.cos(dis / (windowWidth / 2 - lr) * Math.PI / 2) * dis * lrJumpHeight;
							}
							noteShow.push([1, 1, width, x, dis, ((editSide == 1 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 1 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * ndis / (windowWidth / 2 - lr), 0, 1)]);
						}
						break;

					case "HOLD":
						var subTime = noteLeft[noteLeft[i].m_subId].m_time * (spu);
						var dis2 = hiSpeed * (subTime - thisTime);
						var extra = 0;
						if(!noteLeftHit[i]) {
							if(!isMobile) {
								if(touchTime <= thisTime) {
									noteLeftHit[i] = true;
									hitAnime(thisNote, 1, "Perfect");
								}
							} else {}
						}

						if(dis <= windowWidth - lr && dis2 >= 0) {
							dis2 = Math.min(dis2, windowWidth - lr + 100);
							if(dis <= 0) {
								shootParticle(18 + Math.floor(Math.random() * 24), 1, lr, x + (Math.random() - 0.5) * width, Math.random() * 360, lr + (Math.random() - 0.5) * 2 * ud, x + (Math.random() - 0.5) * 2 * width, (Math.random() - 0.5) * 180);
								extra = 180 - Math.round(-dis) % 180;
								dis = 0;
							}
							noteHoldShow.push([1, width, dis2 - dis, x, dis, extra, ((editSide == 1 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 1 && equal(thisNote.m_width, magWidth)) ? 1 : 0), noteLeftHit[i], thisNote.m_id, jb(1 - 1.2 * dis / (windowWidth / 2 - lr), 0, 1)]);
						}
						break;

					case "SUB":
						if(!noteLeftHit[i]) {
							if(!isMobile) {
								if(Math.abs(touchTime - thisTime) <= judge.p || touchTime <= thisTime) {
									noteLeftHit[i] = true;
									hitAnime(thisNote, 1, "Perfect");
								}
							} else {}
						}
						break;
				}
			}

			for(var i = 0; i < noteRight.length; ++i) {
				thisNote = noteRight[i];
				if(!noteRight[i] || (noteRight[i] && isMobile && thisNote.status != "Untouched")) continue;
				var touchTime = thisNote.m_time * (spu);
				var dis = hiSpeed * (touchTime - thisTime);
				var x = deeMode && thisNote.m_type != "HOLD" ? mtox(thisNote.m_position, 1) * (1 - dis / (windowWidth / 2 - lr)) : mtox(thisNote.m_position, 1);
				var width = deeMode && thisNote.m_type != "HOLD" ? mtow(thisNote.m_width, 2) * (1 - dis / (windowWidth / 2 - lr)) : mtow(thisNote.m_width, 2);
				switch(thisNote.m_type) {
					case "NORMAL":
						if(!noteRightHit[i]) {
							if(!isMobile) {
								if(touchTime <= thisTime) {
									noteRightHit[i] = true;
									hitAnime(thisNote, 2, "Perfect");
								}
							} else {}
						}
						if(dis >= 0 && dis <= windowWidth / 2 - lr) {
							var ndis = dis;
							if(deeMode && rightJump) {
								dis = Math.cos(dis / (windowWidth / 2 - lr) * Math.PI / 2) * dis * lrJumpHeight;
							}
							noteShow.push([0, 2, width, x, dis, ((editSide == 2 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 2 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * ndis / (windowWidth / 2 - lr), 0, 1)]);
						}
						break;

					case "CHAIN":
						if(!noteRightHit[i]) {
							if(!isMobile) {
								if(touchTime <= thisTime) {
									noteRightHit[i] = true;
									hitAnime(thisNote, 2, "Perfect");
								}
							} else {}
						}
						if(dis >= 0 && dis <= windowWidth / 2 - lr) {
							var ndis = dis;
							if(deeMode && rightJump) {
								dis = Math.cos(dis / (windowWidth / 2 - lr) * Math.PI / 2) * dis * lrJumpHeight;
							}
							noteShow.push([1, 2, width, x, dis, ((editSide == 2 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 2 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * ndis / (windowWidth / 2 - lr), 0, 1)]);
						}
						break;

					case "HOLD":
						var subTime = noteRight[noteRight[i].m_subId].m_time * (spu);
						var dis2 = hiSpeed * (subTime - thisTime);
						var extra = 0;
						if(!noteRightHit[i]) {
							if(!isMobile) {
								if(touchTime <= thisTime) {
									noteRightHit[i] = true;
									hitAnime(thisNote, 2, "Perfect");
								}
							} else {}
						}
						if(dis <= windowWidth - lr && dis2 >= 0) {
							dis2 = Math.min(dis2, windowWidth - lr + 100);
							if(dis <= 0) {
								shootParticle(18 + Math.floor(Math.random() * 24), 1, windowWidth - lr, x + (Math.random() - 0.5) * width, Math.random() * 360, windowWidth - lr + (Math.random() - 0.5) * 2 * ud, x + (Math.random() - 0.5) * 2 * width, (Math.random() - 0.5) * 180);
								extra = 180 - Math.round(-dis) % 180;
								dis = 0;
							}
							noteHoldShow.push([2, width, dis2 - dis, x, dis, extra, ((editSide == 2 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 2 && equal(thisNote.m_width, magWidth)) ? 1 : 0), noteRightHit[i], thisNote.m_id, jb(1 - 1.2 * dis / (windowWidth / 2 - lr), 0, 1)]);
						}
						break;
		
					case "SUB":
						if(!noteRightHit[i]) {
							if(!isMobile) {
								if(Math.abs(touchTime - thisTime) <= judge.p || touchTime <= thisTime) {
									noteRightHit[i] = true;
									hitAnime(thisNote, 2, "Perfect");
								}
							} else {}
						}
						break;
				}
			}
			if(hitNote > 1) {
				hitDouble = 4;
			} else {
				hitDouble = Math.max(0, hitDouble - 1);
			}
			var w = 13;
			for(var v of noteHoldShow) {
				drawLongNote(ctx, v[0], v[1], v[2], v[3], v[4], v[5], v[7], v[8]);
				ctx.globalAlpha = 1;
			}
			for(var v of noteHoldShow) {
				drawLongBoxNote(ctx, v[0], v[1], v[2], v[3], v[4], v[8]);
				ctx.globalAlpha = 1;
				if(showCS) continue;
				if(v[7] === movingId || (v[4] > 0 && v[6] > 0)) {
					switch(v[6]) {
						case 1:
							ctx.fillStyle = "rgba(64, 64, 255, 1)";
							break;
						case 2:
							ctx.fillStyle = "rgba(255, 64, 64, 1)";
							break;
						case 3:
							ctx.fillStyle = "rgba(255, 64, 255, 1)";
							break;
					}
					if(mainMouse.movement == "choose" && v[7] === movingId) {
						if(editSide == movingSide) {
							ctx.fillStyle = "rgba(255, 255, 255, 1)";
						} else {
							ctx.fillStyle = "rgba(255, 255, 255, 0)";
						}
					}
					switch(editSide) {
						case 0:
							ctx.fillRect(v[3] - w, windowHeight - ud - v[4] - w, 2 * w, 2 * w);
							break;
						case 1:
							ctx.fillRect(lr + v[4] - w, v[3] - w, 2 * w, 2 * w);
							break;
						case 2:
							ctx.fillRect(windowWidth - lr - v[4] - w, v[3] - w, 2 * w, 2 * w);
							break;
					}
				}
			}

			for(var v of noteShow) {
				if(deeMode && v[7] != undefined) {
					ctx.globalAlpha = up2(v[7]);
				}
				if(v[0] == 0) {
					drawSingleNote(ctx, v[1], v[2], v[3], v[4]);
				} else {
					drawSlideNote(ctx, v[1], v[2], v[3], v[4]);
				}
				ctx.globalAlpha = 1;
				if(showCS) continue;
				if(v[6] === movingId || (v[4] > 0 && v[5] > 0)) {
					switch(v[5]) {
						case 1:
							ctx.fillStyle = "rgba(64, 64, 255, 1)";
							break;
						case 2:
							ctx.fillStyle = "rgba(255, 64, 64, 1)";
							break;
						case 3:
							ctx.fillStyle = "rgba(255, 64, 255, 1)";
							break;

					}
					if(mainMouse.movement == "choose" && v[6] === movingId) {
						if(editSide == movingSide) {
							ctx.fillStyle = "rgba(255, 255, 255, 1)";
						} else {
							ctx.fillStyle = "rgba(255, 255, 255, 0)";
						}
					}
					switch(editSide) {
						case 0:
							ctx.fillRect(v[3] - w, windowHeight - ud - v[4] - w, 2 * w, 2 * w);
							break;
						case 1:
							ctx.fillRect(lr + v[4] - w, v[3] - w, 2 * w, 2 * w);
							break;
						case 2:
							ctx.fillRect(windowWidth - lr - v[4] - w, v[3] - w, 2 * w, 2 * w);
							break;
					}
				}
			}
			//PurPLE particles		
			if(!low) {
				var tempAnimationList = [];
				shadowAnimeList.sort(function(x, y) {
					return x[8] - y[8];
				})
				for(var i = 0; i < shadowAnimeList.length; ++i) {
					var thisAnime = shadowAnimeList[i];
					var frames = thisAnime[0];
					var maxFrames = thisAnime[1];
					if(i < 800 && frames <= maxFrames) {
						var shadowRate = jb((1 - frames / maxFrames), 0, 1);
						var x1 = thisAnime[2];
						var y1 = thisAnime[3];
						var d1 = thisAnime[4];
						var x2 = thisAnime[5];
						var y2 = thisAnime[6];
						var d2 = thisAnime[7];
						var type = thisAnime[8];
						if(!between(x1 + (x2 - x1) * shadowRate, 0, windowWidth) || !between(y1 + (y2 - y1) * shadowRate, 0, windowHeight)) {
							shadowAnimeList[i] = null;
							continue;
						}

						tempAnimationList.push({
							translateX: x1 + (x2 - x1) * shadowRate,
							translateY: y1 + (y2 - y1) * shadowRate,
							rotate: (d1 + d2 * shadowRate) * Math.PI / 180,
							scaleX: 1.2 - Math.pow(shadowRate, 2) * 0.9,
							scaleY: 1.2 - Math.pow(shadowRate, 2) * 0.9,
							alphaA: shadowRate * (1 - Math.pow(shadowRate, 2)),
							alphaB: (1 - shadowRate) * (1 - Math.pow(shadowRate, 2))
						});
					}
					thisAnime[0]--;
					if(thisAnime[0] == 0) {
						shadowAnimeList[i] = null;
					}
				}
				for(var p of tempAnimationList) {
					ctx.save();
					ctx.translate(p.translateX, p.translateY);
					ctx.rotate(p.rotate);
					ctx.scale(p.scaleX, p.scaleY);
					ctx.globalAlpha = p.alphaA;
					ctx.drawImage(purpleParticleCanvas, -58, -73);
					ctx.restore();
				}
				for(var p of tempAnimationList) {
					ctx.save();
					ctx.translate(p.translateX, p.translateY);
					ctx.rotate(p.rotate);
					ctx.scale(p.scaleX, p.scaleY);
					ctx.globalAlpha = p.alphaB;
					ctx.drawImage(whiteParticleCanvas, -58, -73);
					ctx.restore();
				}

				var newShadowAnimeList = [];
				var j = 0;
				for(i = 0; i < shadowAnimeList.length; ++i) {
					if(shadowAnimeList[i]) {
						newShadowAnimeList[j] = $.extend(true, [], shadowAnimeList[i]);
						++j;
					}
				}
				shadowAnimeList = $.extend(true, [], newShadowAnimeList);
			}
			//perfect shadow
			for(var i = 0; i < hitAnimeList.length; ++i) {
				var thisAnime = hitAnimeList[i];
				var width = thisAnime.note.m_width*(thisAnime.place == 0 ? 270 : 270*12/25);
				var x = mtox(thisAnime.note.m_position, thisAnime.place);
				var maxFrames = thisAnime.totalFrame;
				var place = thisAnime.place;
				var per = 1 - (1 - thisAnime.currentFrame / maxFrames) * (1 - thisAnime.currentFrame / maxFrames);
				//			switch (type) {
				//			case 0:			 
				////				ctx.fillStyle = rgba(0, Math.floor(thisAnime.currentFrame/maxFrames*255), Math.floor(thisAnime.currentFrame/maxFrames*255), (0.3 + 0.7*thisAnime.currentFrame/maxFrames));
				//				break;
				//			case 1:
				////				ctx.fillStyle = rgba(Math.floor(thisAnime.currentFrame/maxFrames*255), 0, 0, (0.3 + 0.7*thisAnime.currentFrame/maxFrames));
				//				break;
				//			case 2:
				////				ctx.fillStyle = rgba(Math.floor(thisAnime.currentFrame/maxFrames*255)s, Math.floor(thisAnime.currentFrame/maxFrames*255), 0, (0.3 + 0.7*thisAnime.currentFrame/maxFrames));
				//				break;
				//			}

				ctx.globalAlpha = (1 - (1 - thisAnime.currentFrame / maxFrames) * (1 - thisAnime.currentFrame / maxFrames));
				var swid = (width) * (0.70 + 0.31 * per > 1 ? 2 - (0.70 + 0.31 * per) : 0.70 + 0.31 * per) * (545 / 305) + 5;
				if(low) {
					switch(place) {
						case 0:
							ctx.fillRect(x - width / 2, windowHeight - ud - (0), width, 0 + 1.1 * ud * thisAnime.currentFrame / maxFrames);
							break;
						case 1:
							ctx.fillRect(lr + (-1.1 * lr * thisAnime.currentFrame / maxFrames), x - width / 2, 1.1 * lr * thisAnime.currentFrame / maxFrames, width);
							break;
						case 2:
							ctx.fillRect(windowWidth - lr - (0), x - width / 2, 0 + 1.1 * lr * thisAnime.currentFrame / maxFrames, width);
							break;
					}

				} else {
					var shadowD, shadowL, shadowR;
					switch(thisAnime.judgement) {
						case "Perfect":
							shadowD = perfectShadowCanvasD;
							shadowL = perfectShadowCanvasL;
							shadowR = perfectShadowCanvasR;
							break;
						case "Great":
							shadowD = greatShadowCanvasD;
							shadowL = greatShadowCanvasL;
							shadowR = greatShadowCanvasR;
							break;
						case "Good":
							shadowD = goodShadowCanvasD;
							shadowL = goodShadowCanvasL;
							shadowR = goodShadowCanvasR;
							break;
						case "Miss":
							shadowD = missShadowCanvasD;
							shadowL = missShadowCanvasL;
							shadowR = missShadowCanvasR;
							break;
						default:
							alert("wow");
							break;
							
					}
					switch(place) {
						case 0:
							ctx.drawImage(shadowD, 0, 0, 545, 905, x - swid / 2, windowHeight - ud - (1202 - 398), swid, 905);
							break;
						case 1:
							ctx.drawImage(shadowL, 0, 0, 905, 545, lr - 101, x - swid / 2, 905, swid);
							break;
						case 2:
							ctx.drawImage(shadowR, 0, 0, 905, 545, windowWidth - (1202 - 398) - lr, x - swid / 2, 905, swid);
							break;
					}
				}
				ctx.globalAlpha = 1;
				thisAnime.currentFrame--;
				if(thisAnime.currentFrame == 0) {
					hitAnimeList[i] = null;
				}
			}



			// YELLOW particles		
			if(!low) {
				yellowAnimeList.sort(function(x, y) {
					return x[8] - y[8];
				})
				for(var i = 0; i < yellowAnimeList.length; ++i) {
					var thisAnime = yellowAnimeList[i];
					var frames = thisAnime[0];
					var maxFrames = thisAnime[1];
					if(i < 800 && frames <= maxFrames) {
						var yellowRate = jb((1 - frames / maxFrames), 0, 1);
						var x1 = thisAnime[2];
						var y1 = thisAnime[3];
						var d1 = thisAnime[4];
						var x2 = thisAnime[5];
						var y2 = thisAnime[6];
						var d2 = thisAnime[7];
						var type = thisAnime[8];
						if(!between(x1 + (x2 - x1) * yellowRate, 0, windowWidth) || !between(y1 + (y2 - y1) * yellowRate, 0, windowHeight)) {
							yellowAnimeList[i] = null;
							continue;
						}

						ctx.save();
						//			var whiteAlpha = yellowRate < 1 ? 1 - Math.sqrt(Math.max(1 - (1*yellowRate - 1)*(1*yellowRate - 1), 0)) : 0;
						//			var colorAlpha = Math.max(1 - yellowRate - whiteAlpha, 0);
						ctx.translate(x1 + (x2 - x1) * yellowRate, y1 + (y2 - y1) * yellowRate);
						ctx.rotate((d1 + d2 * yellowRate) * Math.PI / 180);
						ctx.scale(1.2 - Math.pow(yellowRate, 2) * 0.9, 1.2 - Math.pow(yellowRate, 2) * 0.9);

						ctx.globalAlpha = yellowRate * (1 - Math.pow(yellowRate, 3));
						ctx.drawImage(yellowParticleCanvas, -58, -73);
						ctx.globalAlpha = (1 - yellowRate) * (1 - Math.pow(yellowRate, 3));
						ctx.drawImage(whiteParticleCanvas, -58, -73);

						ctx.globalAlpha = 1;
						ctx.restore();

						//			switch (type) {
						//			case 0:			 
						////				ctx.fillStyle = rgba(0, Math.floor(thisAnime[0]/maxFrames*255), Math.floor(thisAnime[0]/maxFrames*255), (0.3 + 0.7*thisAnime[0]/maxFrames));
						//				break;
						//			case 1:
						////				ctx.fillStyle = rgba(Math.floor(thisAnime[0]/maxFrames*255), 0, 0, (0.3 + 0.7*thisAnime[0]/maxFrames));
						//				break;
						//			case 2:
						////				ctx.fillStyle = rgba(Math.floor(thisAnime[0]/maxFrames*255), Math.floor(thisAnime[0]/maxFrames*255), 0, (0.3 + 0.7*thisAnime[0]/maxFrames));
						//				break;
						//			}
					}
					thisAnime[0]--;
					if(thisAnime[0] == 0) {
						yellowAnimeList[i] = null;
					}
				}

				var newYellowAnimeList = [];
				var j = 0;
				for(i = 0; i < yellowAnimeList.length; ++i) {
					if(yellowAnimeList[i]) {
						newYellowAnimeList[j] = $.extend(true, [], yellowAnimeList[i]);
						++j;
					}
				}
				yellowAnimeList = $.extend(true, [], newYellowAnimeList);
			}

			//bar
			barL = Math.round((barL + barTargetL) / 2);
			if(barL < 198) {
				barL = 198;
			}
			if(barL > 908) {
				barL = 908;
			}
			barR = Math.round((barR + barTargetR) / 2);
			if(barR < 198) {
				barR = 198;
			}
			if(barR > 908) {
				barR = 908;
			}
			if(CMap.m_leftRegion == "MIXER") { //198~808
				ctx.drawImage(barCanvas, 0, 0, 79, 234, lr - 40, barL - 117, 79, 234);
			}
			if(CMap.m_rightRegion == "MIXER") {
				ctx.drawImage(barCanvas, 0, 0, 79, 234, windowWidth - lr - 40, barR - 117, 79, 234);
			}

			//animation
			var newHitAnimeList = [];
			var j = 0;
			for(i = 0; i < hitAnimeList.length; ++i) {
				if(hitAnimeList[i]) {
					newHitAnimeList[j] = $.extend(true, [], hitAnimeList[i]);
					++j;
				}
			}
			hitAnimeList = $.extend(true, [], newHitAnimeList);

			//shadowAnime 0frame 1maxframe 234567 x1y1d1x2y2d2 type

		}

		//pre anime
		drawJBox(ctx, 0, 0, (thisTime - offsetSec) / doration * windowWidth, 30, windowWidth / 2, 0, windowWidth / 2, 30, rgba(0, 255, 255, 0.5), rgba(0, 255, 255, 0.0));
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, windowWidth, 7);
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0, 0, (thisTime - offsetSec) / doration * windowWidth, 7);

		if(hitThisFrame > 0) {
			hitThisFrame--;
		}
		if(hitThisFrame2 > 0) {
			hitThisFrame2--;
		}
		if(hitDouble > 0) {
			hitDouble--;
		}

		//mouse
		if(mainMouse.movement == "choose") {
			ctx.fillStyle = "#FFF";
			if(mainMouse.condition > 0 && coverPos1 != coverPos2 && coverTime1 != coverTime2) {
				switch(editSide) {
					case 0:
						var x1 = Math.min(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var x2 = Math.max(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var y1 = Math.min(windowHeight - ud - (hiSpeed * (coverTime1 * (spu) - thisTime)), windowHeight - ud - (hiSpeed * (coverTime2 * (spu) - thisTime)));
						var y2 = Math.max(windowHeight - ud - (hiSpeed * (coverTime1 * (spu) - thisTime)), windowHeight - ud - (hiSpeed * (coverTime2 * (spu) - thisTime)));
						if(y1 > windowHeight - ud) break;
						if(y1 >= 0) {
							ctx.fillRect(x1 - 3, y1 - 3, x2 - x1 + 6, 6);
						}
						if(y2 <= windowHeight - ud) {
							ctx.fillRect(x1 - 3, y2 - 3, x2 - x1 + 6, 6); //
						}
						y1 = jb(y1, 0, windowHeight - ud);
						y2 = jb(y2, 0, windowHeight - ud);
						ctx.fillRect(x1 - 3, y1 - 3, 6, y2 - y1 + 6);
						ctx.fillRect(x2 - 3, y1 - 3, 6, y2 - y1 + 6);
						ctx.fillStyle = rgba(255, 255, 255, 0.3);
						ctx.fillRect(x1 + 3, y1 + 3, x2 - x1 - 6, y2 - y1 - 6);
						break;

					case 1:
						var x1 = Math.min(lr + (hiSpeed * (coverTime1 * (spu) - thisTime)), lr + (hiSpeed * (coverTime2 * (spu) - thisTime)));
						var x2 = Math.max(lr + (hiSpeed * (coverTime1 * (spu) - thisTime)), lr + (hiSpeed * (coverTime2 * (spu) - thisTime)));
						var y1 = Math.min(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var y2 = Math.max(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						if(x2 < lr) break;
						if(x1 >= lr) {
							ctx.fillRect(x1 - 3, y1 - 3, 6, y2 - y1 + 6); //
						}
						if(x2 <= windowWidth / 2) {
							ctx.fillRect(x2 - 3, y1 - 3, 6, y2 - y1 + 6);
						}
						x1 = jb(x1, lr, windowWidth / 2);
						x2 = jb(x2, lr, windowWidth / 2);
						ctx.fillRect(x1 - 3, y1 - 3, x2 - x1 + 6, 6);
						ctx.fillRect(x1 - 3, y2 - 3, x2 - x1 + 6, 6);
						ctx.fillStyle = rgba(255, 255, 255, 0.3);
						ctx.fillRect(x1 + 3, y1 + 3, x2 - x1 - 6, y2 - y1 - 6);
						break;

					case 2:
						var x1 = Math.min(windowWidth - lr - (hiSpeed * (coverTime1 * (spu) - thisTime)), windowWidth - lr - (hiSpeed * (coverTime2 * (spu) - thisTime)));
						var x2 = Math.max(windowWidth - lr - (hiSpeed * (coverTime1 * (spu) - thisTime)), windowWidth - lr - (hiSpeed * (coverTime2 * (spu) - thisTime)));
						var y1 = Math.min(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var y2 = Math.max(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						if(x1 > windowWidth - lr) break;
						if(x1 >= windowWidth / 2) {
							ctx.fillRect(x1 - 3, y1 - 3, 6, y2 - y1 + 6); //
						}
						if(x2 <= windowWidth - lr) {
							ctx.fillRect(x2 - 3, y1 - 3, 6, y2 - y1 + 6);
						}
						x1 = jb(x1, windowWidth / 2, windowWidth - lr);
						x2 = jb(x2, windowWidth / 2, windowWidth - lr);
						ctx.fillRect(x1 - 3, y1 - 3, x2 - x1 + 6, 6);
						ctx.fillRect(x1 - 3, y2 - 3, x2 - x1 + 6, 6);
						ctx.fillStyle = rgba(255, 255, 255, 0.3);
						ctx.fillRect(x1 + 3, y1 + 3, x2 - x1 - 6, y2 - y1 - 6);
						break;

					default:
						break;
				}
			}
		} else {
			for(var i = 0; i < noteTemp.length; ++i) {
				thisNote = noteTemp[i];
				var touchTime = thisNote.m_time * (spu);
				var dis = hiSpeed * (touchTime - thisTime);
				var lineDis = dis;
				var lineWidth = 5;
				var fz = Math.round((thisNote.m_time - Math.floor(thisNote.m_time)) / (1 / (magnaticStrength)));
				var fm = magnaticStrength;
				switch(thisNote.m_type) {
					case "NORMAL":
						var lineColor1 = rgba(0, 255, 255, 0.0);
						var lineColor2 = rgba(0, 255, 255, 1.0);
						break;

					case "CHAIN":
						var lineColor1 = rgba(255, 0, 0, 0.0);
						var lineColor2 = rgba(255, 0, 0, 1.0);
						break;

					case "HOLD":
						var lineColor1 = rgba(255, 255, 0, 0.0);
						var lineColor2 = rgba(255, 255, 0, 1.0);
						break;

					case "SUB":
						var lineColor1 = rgba(255, 128, 0, 0.0);
						var lineColor2 = rgba(255, 128, 0, 1.0);
						break;
				}
				switch(editSide) {
					case 0:
						if(dis >= 0 && dis <= windowHeight - ud) {
							drawJBox(ctx, 0, windowHeight - ud - lineDis - lineWidth, windowWidth, lineWidth, 0, windowHeight - ud - lineDis - lineWidth, 0, windowHeight - ud - lineDis, lineColor1, lineColor2);
							drawJBox(ctx, lr + lineDis, 0, lineWidth, windowHeight, lr + lineDis, 0, lr + lineDis + lineWidth, 0, "rgba(255, 0, 255, 1.0)", "rgba(255, 0, 255, 0.0)");
							drawJBox(ctx, windowWidth - lr - lineDis - lineWidth, 0, lineWidth, windowHeight, windowWidth - lr - lineDis - lineWidth, 0, windowWidth - lr - lineDis, 0, "rgba(255, 0, 255, 0.0)", "rgba(255, 0, 255, 1.0)");
							ctx.fillStyle = "white";
							ctx.fillRect(mtox(thisNote.m_position, 0) - 1, 0, 3, windowHeight - ud);
							ctx.save();
							ctx.textAlign = "left";
							ctx.shadowColor = rgba(0, 0, 0, 0.9);
							ctx.shadowOffsetX = 0;
							ctx.shadowOffsetY = 0;
							ctx.shadowBlur = 4;
							ctx.fillText(thisNote.m_width, mtox(thisNote.m_position, 0) + 22, windowHeight - ud - lineDis);
							ctx.textAlign = "right";
							ctx.fillStyle = lineColor2;
							ctx.fillText(thisNote.m_position, mtox(thisNote.m_position, 0) - 22, windowHeight - ud - lineDis);
							if(i == 1 && mainMouse.movement == "writeHold") {
								ctx.textAlign = "left";
							}
							if(!keysDown[90] && i == noteTemp.length - 1) {
								ctx.fillText("   " + Math.floor(thisNote.m_time) + (fz == 0 ? "" : "+" + fz + "/" + fm) + "  ", mtox(thisNote.m_position, 0), windowHeight - ud - lineDis - 40);
							} else {
								ctx.fillText("      " + thisNote.m_time, mtox(thisNote.m_position, 0) - 22, windowHeight - ud - lineDis - 40);
							}
							ctx.restore();
						}
						break;

					case 1:
						if(dis >= 0 && dis <= windowWidth / 2 - lr) {
							drawJBox(ctx, 0, windowHeight - ud - lineDis - lineWidth, windowWidth, lineWidth, 0, windowHeight - ud - lineDis - lineWidth, 0, windowHeight - ud - lineDis, "rgba(255, 0, 255, 0.0)", "rgba(255, 0, 255, 1.0)");
							drawJBox(ctx, lr + lineDis, 0, lineWidth, windowHeight, lr + lineDis, 0, lr + lineDis + lineWidth, 0, lineColor2, lineColor1);
							drawJBox(ctx, windowWidth - lr - lineDis - lineWidth, 0, lineWidth, windowHeight, windowWidth - lr - lineDis - lineWidth, 0, windowWidth - lr - lineDis, 0, lineColor1, lineColor2)
							ctx.fillRect(0, mtox(thisNote.m_position, 1) - 1, windowWidth / 2, 3);
							ctx.save();
							ctx.textAlign = "left";
							ctx.fillStyle = "white";
							ctx.shadowColor = rgba(0, 0, 0, 0.9);
							ctx.shadowOffsetX = 0;
							ctx.shadowOffsetY = 0;
							ctx.shadowBlur = 4;
							ctx.fillText(thisNote.m_width, lr + lineDis + 22, mtox(thisNote.m_position, 1));
							ctx.textAlign = "right";
							ctx.fillStyle = lineColor2;
							ctx.fillText(thisNote.m_position, lr + lineDis - 22, mtox(thisNote.m_position, 1));
							if(i % 2 == 1) {
								ctx.textAlign = "left";
							}
							if(!keysDown[90] && i == noteTemp.length - 1) {
								ctx.fillText(Math.floor(thisNote.m_time) + (fz == 0 ? "" : "+" + fz + "/" + fm) + "      ", lr + lineDis + 22, mtox(thisNote.m_position, 1) - 40);
							} else {
								ctx.fillText(thisNote.m_time, lr + lineDis - 22, mtox(thisNote.m_position, 1) - 40);
							}
							ctx.restore();
						}
						break;

					case 2:
						if(dis >= 0 && dis <= windowWidth / 2 - lr) {
							drawJBox(ctx, 0, windowHeight - ud - lineDis - lineWidth, windowWidth, lineWidth, 0, windowHeight - ud - lineDis - lineWidth, 0, windowHeight - ud - lineDis, "rgba(255, 0, 255, 0.0)", "rgba(255, 0, 255, 1.0)");
							drawJBox(ctx, lr + lineDis, 0, lineWidth, windowHeight, lr + lineDis, 0, lr + lineDis + lineWidth, 0, lineColor2, lineColor1);
							drawJBox(ctx, windowWidth - lr - lineDis - lineWidth, 0, lineWidth, windowHeight, windowWidth - lr - lineDis - lineWidth, 0, windowWidth - lr - lineDis, 0, lineColor1, lineColor2);
							ctx.fillRect(windowWidth / 2, mtox(thisNote.m_position, 2) - 1, windowWidth / 2, 3);
							ctx.save();
							ctx.textAlign = "left";
							ctx.fillStyle = "white";
							ctx.shadowColor = rgba(0, 0, 0, 0.9);
							ctx.shadowOffsetX = 0;
							ctx.shadowOffsetY = 0;
							ctx.shadowBlur = 4;
							ctx.fillText(thisNote.m_width, windowWidth - lr - lineDis + 22, mtox(thisNote.m_position, 2));
							ctx.textAlign = "right";
							ctx.fillStyle = lineColor2;
							ctx.fillText(thisNote.m_position, windowWidth - lr - lineDis - 22, mtox(thisNote.m_position, 2));
							if(i % 2 == 0) {
								ctx.textAlign = "left";
							}
							if(!keysDown[90] && i == noteTemp.length - 1) {
								ctx.fillText(Math.floor(thisNote.m_time) + (fz == 0 ? "" : "+" + fz + "/" + fm) + "      ", windowWidth - lr - lineDis + 22, mtox(thisNote.m_position, 2) - 40);
							} else {
								ctx.fillText(thisNote.m_time, windowWidth - lr - lineDis + 22, mtox(thisNote.m_position, 2) - 40);
							}
							ctx.restore();
						}
						break;

					default:
						break;
				}

			}
		}

		//noteTemp
		for(var i = 0; i < noteTemp.length; ++i) {
			thisNote = noteTemp[i];
			var touchTime = thisNote.m_time * (spu);
			var dis = hiSpeed * (touchTime - thisTime);
			var x = mtox(thisNote.m_position, editSide);
			var width = thisNote.m_width * (editSide == 0 ? 300 : 150) - 30;
			var disLimit = editSide == 0 ? windowHeight - ud : windowWidth / 2 - lr;
			var disLimit2 = editSide == 0 ? windowHeight - ud : windowWidth - lr;
			switch(thisNote.m_type) {
				case "NORMAL":
					if(dis >= 0 && dis <= disLimit) {
						ctx.globalAlpha = 0.6;
						drawSingleNote(ctx, editSide, width, x, dis);
						ctx.globalAlpha = 1;
						//						if (! noteDownHit[i] && ((!isMobile && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
						//							noteDownHit[i] = true;
						//							hitAnime(0, 0, width, x, Math.floor(10.0/audioRate));
						//						}
					}
					break;

				case "CHAIN":
					if(dis >= 0 && dis <= disLimit) {
						ctx.globalAlpha = 0.6;
						drawSlideNote(ctx, editSide, width, x, dis);
						ctx.globalAlpha = 1;
						//						if (! noteDownHit[i] && ((!isMobile && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
						//							noteDownHit[i] = true;
						//							hitAnime(0, 1, width, x, Math.floor(10.0/audioRate));
						//						}
					}
					break;

				case "HOLD":
					var subTime = coverTime2 * (spu); //special
					var dis2 = hiSpeed * (subTime - thisTime);
					var extra = 0;
					if(dis > disLimit2 || dis2 < 0) {
						break;
					}
					if(dis2 >= disLimit + 100) {
						dis2 = disLimit2 + 100;
					}
					if(dis <= 0) {
						extra = 180 - Math.round(-dis) % 180;
						dis = 0;
					}
					ctx.globalAlpha = 0.6;
					drawLongNote(ctx, editSide, width, dis2 - dis, x, dis, extra);
					drawLongBoxNote(ctx, editSide, width, dis2 - dis, x, dis, extra);
					ctx.globalAlpha = 1;
					break;

				case "SUB":
					if(dis >= 0 && dis <= disLimit2) {
						var x = windowWidth / 2 + (-2.5 + Number(thisNote.m_position)) * 300;
						var width = thisNote.m_width * 300 - 30;
						//						if ((!isMobile && touchTime < thisTime && ! noteDownHit[i]) || Math.abs(touchTime - thisTime) <= currentPerfectJudge && ! noteDownHit[i]) {
						//							noteDownHit[i] = true;
						//							hitAnime(0, 3, width, x, Math.floor(10.0/audioRate));
						//						}
					}
					break;
			}
		}

		//bottomButtons
		//for (var i = 0;)
		//rightClick
		if(mainMouse.menu) {
			switch(mainMouse.menu) {
				case "basic":
					drawBox(ctx, rx, ry, 400, 570, 0.8, 8);
					var preSide = editSide;

					basicMenu[1][3] = ((editSide == 1 && CMap.m_leftRegion == "MIXER") || (editSide == 2 && CMap.m_rightRegion == "MIXER")) ? rgba(128, 128, 128, 0.8) : rgba(0, 255, 255, 0.8);
					basicMenu[2][3] = ((editSide == 1 && CMap.m_leftRegion == "PAD") || (editSide == 2 && CMap.m_rightRegion == "PAD")) ? rgba(128, 128, 128, 0.8) : rgba(255, 128, 128, 0.8);
					basicMenu[3][3] = ((editSide == 1 && CMap.m_leftRegion == "MIXER") || (editSide == 2 && CMap.m_rightRegion == "MIXER")) ? rgba(128, 128, 128, 0.8) : rgba(255, 255, 0, 0.8);

					if(between(mainMouse.coordinate.x, rx, rx + 400) && between(mainMouse.coordinate.y, ry + 526, ry + 564) && musicCtrl) {
						musicCtrl.volume = Math.round((mainMouse.coordinate.x - rx) / 400 * 100) / 100;
					} else if(between(mainMouse.coordinate.y, ry + 0, ry + 38)) {
						if(between(mainMouse.coordinate.x, rx, rx + 400 / 3)) {
							editSide = 1;
						} else if(between(mainMouse.coordinate.x, rx + 400 / 3, rx + 800 / 3)) {
							editSide = 0;
						} else if(between(mainMouse.coordinate.x, rx + 800 / 3, rx + 400)) {
							editSide = 2;
						}
					}
					if(editSide != preSide) {
						changeSide();
					}
					ctx.fillStyle = rgba(Math.round(jb((255 - musicCtrl.volume * 255)), 0, 255), Math.round(jb(musicCtrl.volume * 255, 0, 255)), Math.round(jb(musicCtrl.volume * 255, 0, 255)), 0.8);
					ctx.fillRect(rx, ry + 526, musicCtrl.volume * 400, 38);

					ctx.fillStyle = rgba(128, 128, 128, 0.8);
					switch(editSide) {
						case 0:
							ctx.fillRect(rx + 133, ry + 6, 133, 38);
							basicMenu[0][0] = "[↑]  Edit ↓";
							break;
						case 1:
							ctx.fillRect(rx, ry + 6, 133, 38);
							basicMenu[0][0] = "[↑]  Edit ←";
							break;
						case 2:
							ctx.fillRect(rx + 267, ry + 6, 133, 38);
							basicMenu[0][0] = "[↑]  Edit →";
							break;

						default:
							break;
					}

					basicMenu[6][0] = "     Mark at " + (thisTime / spq / 32).toFixed(3) + " bar";
					basicMenu[7][0] = "[M]  Start at " + (Number(markSecion)).toFixed(3) + " bar";
					basicMenu[11][0] = "     Hit sound " + (showHitSound ? "ON" : "OFF");
					basicMenu[12][0] = "     Particles " + (showParticles ? "ON" : "OFF");
					basicMenu[13][0] = "     Music volume " + Math.round(musicCtrl.volume * 100) + "%";
					if(musicCtrl) {
						if(musicCtrl.paused) {
							basicMenu[5][0] = "[_]  Play";
							basicMenu[5][3] = "rgba(0, 255, 0, 0.8)";
						} else {
							basicMenu[5][0] = "[_]  Pause";
							basicMenu[5][3] = "rgba(255, 0, 0, 0.8)";
						}
					} else {
						basicMenu[5][0] = "Music ctrl error";
						basicMenu[5][3] = "rgba(255, 0, 0, 0.8)";
					}
					var thisMenu = basicMenu;
					break;

				case "delete":
					drawBox(ctx, rx, ry, 400, 90, 0.8, 8);
					var thisMenu = editMenu;
					break;

			}
			ctx.textAlign = "left";
			ctx.textBaseline = "alphabetic";
			ctx.font = "bold 28px Dynamix";
			for(var i = 0; i < thisMenu.length; ++i) {
				if(!(i == 0 && thisMenu.length != 1) && i != 13 && between(mainMouse.coordinate.y, ry + thisMenu[i][1], ry + thisMenu[i][1] + thisMenu[i][2]) && between(mainMouse.coordinate.x, rx, rx + 400)) {
					ctx.fillStyle = thisMenu[i][3] ? thisMenu[i][3] : "rgba(0, 255, 255, 0.8)";
					ctx.fillRect(rx, ry + thisMenu[i][1], 400, thisMenu[i][2]);
					ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
				} else {
					ctx.fillStyle = thisMenu[i][3] ? thisMenu[i][3] : "rgba(0, 255, 255, 0.8)";
				}
				ctx.fillText(thisMenu[i][0], rx + 20, ry + thisMenu[i][1] + thisMenu[i][2] - 10);
			}
			ctx.textBaseline = "top";
		}
	}
}