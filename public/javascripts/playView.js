var sX, sY, sW, sH, dX, dY, dW, dH,
	showParticles = true,
	showHitSound = true,
	gradual = true,
	gradualPx = 100,
	markSecion = 0,
	editSide = 0,
	noteChosen = [],
	noteChosenList = [],
	hitAnimeList = [],
	shadowAnimeList = [],
	particleQueue = new Queue(10);
	shadowQueue = new Queue(10);
	particleAllowMap = [],
	yellowAnimeList = [],
	noteShow = [],
	noteHoldShow = [],
	didList = [],
	didListPlace = -1,
	mixerLT = 0,
	mixerRT = 0,
	perfectHit = 0,
	prHit = 0,
	greatHit = 0,
	goodHit = 0,
	missHit = 0,
	hitNote = 0,
	hitDouble = false,
	pauseShadowH = 120,
	changeToResult = 80,
	pressPause = 100,
	pressStart = 100,
	blurComplete = false,
	blurWorker = false,
	startTime = new Date().getTime(),
	tempTime = 0,
	performanceList = [];

function shootParticle(t, e, i, o, a, h, d, s, r) {
	if(!showParticles) return;
	if(e == 1) {
		yellowAnimeList.push([t, t, i, o, a, h, d, s, e, r])
	} else {
		shadowAnimeList.push([t, t, i, o, a, h, d, s, e, r])
	}
}

function shootRVParticle(t, e, i, o, a) {
	if(!showParticles || musicCtrl && musicCtrl.paused) return;
	var h = jb(Math.random() * 2 * Math.PI, 0, Math.PI * 2);
	shadowAnimeList.push([t, t, i, o, Math.random() * 360, i + Math.cos(h) * a, o + Math.sin(h) * a, Math.random() * 180 - 90, e])
}

function playView() {
	this.isPlaying = true;
	blurWorker = new Worker("./javascripts/blurWorker.js");
	blurWorker.onmessage = function(t) {
		maskCtx.putImageData(t.data, 0, 0);
		blurComplete = true;
	}
}
playView.prototype = {
	name: "playScene",
	set: function() {},
	down: function() {},
	move: function() {},
	up: function() {},
	refresh: function() {
		if(loaded < 6 + totalHitBuffer + (isMobile ? 1 : 0)) {
			return
		}
		if(bg && !playSettings.hideBG) {
			ctx.drawImage(bgCanvas, 0, 0);
			ctx.fillStyle = rgba(0, 0, 0, .7);
			ctx.fillRect(0, windowHeight - ud, windowWidth, ud);
			if(showStart >= 0) {
				if(showStart < 40) {
					ctx.fillStyle = rgba(0, 0, 0, .7)
				} else {
					ctx.fillStyle = rgba(0, 0, 0, showStart >= 40 && showStart <= 60 ? .7 - .035 * (showStart - 40) : .7)
				}
			} else {
				ctx.fillStyle = rgba(0, 0, 0, .7)
			}
			ctx.fillRect(0, 0, windowWidth, windowHeight)
		} else {
			ctx.clearRect(0, 0, windowWidth, windowHeight);
			if(!showCS) {
				ctx.fillStyle = "rgba(25,25,25,0.2)"
			} else {
				ctx.fillStyle = "rgba(32,32,32,0.2)"
			}
			if(isVideo) {
				ctx.globalAlpha = bgAlpha;
				ctx.drawImage(musicCtrl, 0, 0, windowWidth, windowHeight);
				ctx.globalAlpha = 1
			}
			ctx.fillStyle = "rgba(0,0,0,0.7)";
			ctx.fillRect(0, windowHeight - ud, windowWidth, ud)
		}
		if(isMobile) {
//			alert(musicCtrl.paused + "," + musicCtrl.ended);
			if(musicCtrl.ended && changeToResult == 80) {
//			if(musicCtrl.currentTime > 1 && changeToResult == 80) {
				if(bgSrc.complete) {
					blurWorker.postMessage(bgContext.getImageData(0, 0, 1920, 1080))
				}
				changeToResult = 79
			}
			if(changeToResult <= 79) {
				musicCtrl.volume = changeToResult / 80;
				if(--changeToResult == 0) {
					changeToResult = 80;
//					perfectHit = Math.round(totalNote*0.97);
//					prHit = Math.round(totalNote*0.01);
//					greatHit = Math.round(totalNote*0.002);
//					goodHit = Math.round(totalNote*0.003);
//					missHit = totalNote - perfectHit - prHit - greatHit - goodHit;
//					maxCombo = perfectHit + prHit + greatHit + goodHit;
					score = Math.round((maxCombo * .08 + perfectHit * .92 + prHit * .92 + greatHit * .92 * .6 + goodHit * .92 * .6) * 1e6 / totalNote);
					mainResultScene.load();
					mainResultScene.startTime = (new Date).getTime();
					scene = mainResultScene;
					return
				}
			}
			if(pressPause <= 29) {
				fullColor("RGBA(0,0,0," + (1 - pressPause / 30) + ")");
				if(--pressPause <= 0) {
					pressPause = 0
				}
			}
			if(pressStart <= 29) {
				fullColor("RGBA(0,0,0," + pressStart / 30 + ")");
				if(--pressStart <= 0) {
					pressStart = 30;
					musicCtrl.goplay();
					musicPlayButton.click();
				}
			}
		}
		if(showStart >= -1) {
			console.log(ud);
			if(!musicCtrl.paused) {
				musicCtrl.pause()
			}
			if(between(showStart, 48, 60)) {
				ud = (tud + 20 + ud * 3) / 4
			}
			if(between(showStart, 43, 47)) {
				ud = (tud * 2 + ud * 3) / 5
			}
			if(between(showStart, 5, 35)) {
				ud = tud;
				if(Math.abs(lr - tlr) <= .5) {
					lr = tlr
				} else {
					lr = (tlr + lr * 5) / 6
				}
			}
			if(between(showStart, 10, 30)) {
				pauseShadowH = (120 + pauseShadowH * 4) / 5
			}
			if(showStart == -1) {
				pauseShadowH = 120;
				lr = tlr;
				ud = tud;
				if (musicCtrl.currentTime == 0) {
					setTime(0);
				}
				resetCS();
				musicCtrl.goplay()
			}
			showStart--
		}
		if(!timerReady) {
			audioRate = Math.round(playSettings.playbackSpeed*10);
			timerReady = true;
			audioRateCache = audioRate;
			musicCtrl.playbackRate = audioRate/10;
			musicCtrl.volume = 1;
			musicCtrl.goplay();
			var t = 0;
			timer = new Date;
			baseTime = timer.getTime();
			score = 0;
			preScore = 0;
			combo = 0;
			hitThisFrame = 0
		}
		if(audioRate != audioRateCache) {
			audioRateCache = audioRate;
			musicCtrl.playbackRate = audioRateCache/10;
		}
		if(comboAlpha == .98 && comboAlpha > 0) {
			comboAlpha -= .02
		}
		
		if (musicCtrl) {
			if (musicCtrl.animeTime) {
				if (musicCtrl.paused) {
					if (between(musicCtrl.currentTime - musicCtrl.animeTime, -0.002, 0.002)) {
						musicCtrl.currentTime = musicCtrl.animeTime;
					}
					else {
						musicCtrl.currentTime = Math.round((musicCtrl.animeTime + musicCtrl.currentTime*2)/3*1000)/1000;
					}
				}
				else {
					musicCtrl.animeTime = musicCtrl.currentTime;
				}
			}
			else {
				musicCtrl.animeTime = musicCtrl.currentTime;
			}
		}
		if (musicCtrl && !musicCtrl.paused) {
			touchRefresh(thisTime);
		}
		ctx.globalAlpha = 1;
		maxCombo = Math.max(maxCombo, combo);
		doration = musicCtrl.duration;
		timer = new Date;
		var t = timer.getTime();
		startTime = t;
		thisTime = musicCtrl.currentTime + offsetSec;
		if(isMobile) {
			score = Math.round((maxCombo * .08 + perfectHit * .92 + prHit * .92 + greatHit * .92 * .6 + goodHit * .92 * .6) * 1e6 / totalNote)
		} else {
			score = Math.round((maxCombo * .08 + perfectHit * .92 + prHit * .92 + greatHit * .92 * .6 + goodHit * .92 * .6) * 1e6 / totalNote)
		}
		preScore = (score + preScore) / 2;
		preScoreStr = "" + Math.round(preScore);
		while(preScoreStr.length < 7) {
			preScoreStr = "0" + preScoreStr
		}
		hitNote = 0;
		drawMiddleImage(blueCanvasU, 0, 0, 160, 100, windowWidth * .95, windowHeight - ud + 87, 1);
		for(var e = 1; e <= 3; ++e) {
			drawMiddleImage(blankCanvasU, 0, 0, 160, 100, windowWidth * (.95 - e * .1), windowHeight - ud + 87, 1)
		}
		for(var e = 1; e <= 4; ++e) {
			drawMiddleImage(blankCanvasD, 0, 0, 160, 100, windowWidth * (1 - e * .1), windowHeight - ud + 51, 1)
		}
		if(showCS) {
			drawJBox(ctx, 0, pauseShadowH - 60, windowWidth, 50, 0, pauseShadowH - 60, 0, pauseShadowH - 10, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
			ctx.fillStyle = "black";
			ctx.fillRect(0, pauseShadowH - 10, windowWidth, 20);
			drawJBox(ctx, 0, pauseShadowH + 10, windowWidth, 50, 0, pauseShadowH + 10, 0, pauseShadowH + 60, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
			if(musicCtrl.paused) {
				ctx.beginPath();
				ctx.moveTo(windowWidth * .487, pauseShadowH - 60);
				ctx.lineTo(windowWidth * .517, pauseShadowH - 10);
				ctx.lineTo(windowWidth * .487, pauseShadowH + 40);
				ctx.closePath();
				ctx.fillStyle = "white";
				ctx.fill()
			} else {
				drawMiddleImage(pauseCanvas, 0, 0, 17, 92, windowWidth * .49, pauseShadowH, 1);
				drawMiddleImage(pauseCanvas, 0, 0, 17, 92, windowWidth * .51, pauseShadowH, 1)
			}
			if(score > 0) {
				if (playSettings.simpleEffect) {
					ctx.globalAlpha = 0.5;
					drawNumber(preScoreStr, "center", hitThisFrame > 0 ? .58 : .48, hitThisFrame > 0 ? windowWidth * .524 : windowWidth * .52, windowHeight * .94, 7);
				}
				else {
					drawNumber(preScoreStr, "center", hitThisFrame > 0 ? .58 : .48, hitThisFrame > 0 ? windowWidth * .304 : windowWidth * .30, windowHeight * .54, 7);
				}
				ctx.globalAlpha = 1
			}
			if(combo > 3) {
				if (playSettings.simpleEffect) {
					ctx.globalAlpha = 0.5;
					drawNumber(combo, "left", hitThisFrame > 0 ? .58 : .48, hitThisFrame > 0 ? windowWidth * .88 : windowWidth * .87, windowHeight * .94);
				}
				else {
					ctx.globalAlpha = comboAlpha;
					drawNumber(combo, "left", hitThisFrame > 0 ? .58 : .48, hitThisFrame > 0 ? windowWidth * .88 : windowWidth * .87, windowHeight * .54);
					
				}
				ctx.globalAlpha = 1
			}
			var i = .1;
			if (! playSettings.simpleEffect)
			switch(currentJudgeResult) {
				case "Perfect":
					if(hitThisFrame2 > 106) {
						var o = hitDouble > 0 ? .12 : .07;
						drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth * .267, windowHeight * .63, 1.03 + (hitThisFrame2 - 106) * o);
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * .27, windowHeight * .65, 1.03 + (hitThisFrame2 - 106) * o);
						drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth * .724, windowHeight * .63, 1.03 + (hitThisFrame2 - 106) * o);
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * .727, windowHeight * .65, 1.03 + (hitThisFrame2 - 106) * o)
					} else if(hitThisFrame2 >= 80) {
						ctx.globalAlpha = (hitThisFrame2 - 80) / 25;
						drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth * .267, windowHeight * .63, 1.03);
						drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth * .724, windowHeight * .63, 1.03);
						ctx.globalAlpha = 1;
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * .27, windowHeight * .65, 1.03);
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * .727, windowHeight * .65, 1.03)
					} else if(hitThisFrame2 >= 40) {
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * .27, windowHeight * .65, 1.03);
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * .727, windowHeight * .65, 1.03)
					} else {
						ctx.globalAlpha = hitThisFrame2 / 40;
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * .27, windowHeight * .65, 1.03);
						drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * .727, windowHeight * .65, 1.03);
						ctx.globalAlpha = 1
					}
					break;
				case "Pr":
					ctx.globalAlpha = hitThisFrame2 >= 40 ? 1 : hitThisFrame2 / 40;
					drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * .27, windowHeight * .652, 1.03 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * .02 : 0));
					drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth * .727, windowHeight * .652, 1.03 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * .02 : 0));
					ctx.globalAlpha = 1;
					break;
				case "Great":
					ctx.globalAlpha = hitThisFrame2 >= 40 ? 1 : hitThisFrame2 / 40;
					drawMiddleImage(greatJudgeCanvas, 0, 0, 268, 153, windowWidth * .27, windowHeight * .652, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * .02 : 0));
					drawMiddleImage(greatJudgeCanvas, 0, 0, 268, 153, windowWidth * .727, windowHeight * .652, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * .02 : 0));
					ctx.globalAlpha = 1;
					break;
				case "Good":
					ctx.globalAlpha = hitThisFrame2 >= 40 ? 1 : hitThisFrame2 / 40;
					drawMiddleImage(goodJudgeCanvas, 0, 0, 238, 153, windowWidth * .27, windowHeight * .653, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * .02 : 0));
					drawMiddleImage(goodJudgeCanvas, 0, 0, 238, 153, windowWidth * .727, windowHeight * .653, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * .02 : 0));
					ctx.globalAlpha = 1;
					break;
				case "Miss":
					ctx.globalAlpha = hitThisFrame2 >= 40 ? 1 : hitThisFrame2 / 40;
					drawMiddleImage(missJudgeCanvas, 0, 0, 238, 153, windowWidth * .27, windowHeight * .656, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * .02 : 0));
					drawMiddleImage(missJudgeCanvas, 0, 0, 238, 153, windowWidth * .727, windowHeight * .656, 1.2 + (hitThisFrame2 > 106 ? (hitThisFrame2 - 106) * .02 : 0));
					ctx.globalAlpha = 1;
					break;
				default:
					break
			}
		}
		ctx.globalAlpha = jb((1 - Math.abs(Math.round(thisTime / spu / 2) - thisTime / spu / 2) * 2) * .6 + .4, 0, 1);
		if (!playSettings.simpleEffect) {
			drawJBox(ctx, 0, windowHeight - ud - 450, windowWidth, 450, windowWidth / 2, windowHeight - ud - 450, windowWidth / 2, windowHeight - ud, rgba(0, 255, 255, 0), rgba(0, 255, 255, .32));
			ctx.globalAlpha = 1;
			drawJBox(ctx, 0, windowHeight - ud - 30, windowWidth, 30, windowWidth / 2, windowHeight - ud - 30, windowWidth / 2, windowHeight - ud, rgba(0, 255, 255, 0), rgba(0, 255, 255, .5));
			drawJBox(ctx, 0, windowHeight - ud, windowWidth, 30, windowWidth / 2, windowHeight - ud, windowWidth / 2, windowHeight - ud + 30, rgba(0, 255, 255, .5), rgba(0, 255, 255, 0));
			drawJBox(ctx, lr, 0, 25, windowHeight - ud, lr, (windowHeight - ud) / 2, lr + 25, (windowHeight - ud) / 2, rgba(0, 255, 255, .5), rgba(0, 255, 255, 0));
			drawJBox(ctx, lr - 25, 0, 25, windowHeight - ud, lr - 25, (windowHeight - ud) / 2, lr, (windowHeight - ud) / 2, rgba(0, 255, 255, 0), rgba(0, 255, 255, .5));
			drawJBox(ctx, windowWidth - lr - 25, 0, 25, windowHeight - ud, windowWidth - lr - 25, (windowHeight - ud) / 2, windowWidth - lr, (windowHeight - ud) / 2, rgba(0, 255, 255, 0), rgba(0, 255, 255, .5));
			drawJBox(ctx, windowWidth - lr, 0, 25, windowHeight - ud, windowWidth - lr, (windowHeight - ud) / 2, windowWidth - lr + 25, (windowHeight - ud) / 2, rgba(0, 255, 255, .5), rgba(0, 255, 255, 0));
		}
		ctx.fillStyle = "#FFF";
		drawRect(ctx, "#FFF", 0, windowHeight - ud - 3, windowWidth, 7);
		drawRect(ctx, "#FFF", lr - 2, 0, 5, windowHeight - ud - 3);
		drawRect(ctx, "#FFF", windowWidth - lr - 2, 0, 5, windowHeight - ud - 3); {
			ctx.textBaseline = "top";
			ctx.font = "bold 48px orbitron-bold,sans";
			ctx.fillStyle = "#FFF";
			ctx.textAlign = "left";
			ctx.globalAlpha = .35;
			ctx.fillText(CMap.m_path, windowWidth * .021, windowHeight - ud + 26);
			var a = 0;
			switch(hardship) {
				case "CASUAL":
					{
						a = 0;
						break
					}
				case "NORMAL":
					{
						a = 1;
						break
					}
				case "HARD":
					{
						a = 2;
						break
					}
				case "MEGA":
					{
						a = 3;
						break
					}
				case "GIGA":
					{
						a = 4;
						break
					}
				case "CUSTOM":
					{
						a = 5;
						break
					}
			}
			ctx.drawImage(hardshipCanvas, 0, 43 * a, 190, 43, windowWidth * .022, windowHeight - ud + 88, 190, 43);
			ctx.globalAlpha = 1;
			if(showCS) ctx.globalAlpha = 0;
			ctx.font = "22px Dynamix";
			ctx.fillStyle = "#FFF";
			ctx.textAlign = "right";
			ctx.fillText(fps + " Fps", windowWidth, windowHeight - 80);
			if(musicCtrl.paused) {
				ctx.fillStyle = "#0F0"
			}
			ctx.fillText(offsetSec + " s offset (O- P+)", windowWidth, windowHeight - 30);
			ctx.fillText(musicCtrl.currentTime.toFixed(3) + " s (MUSIC)", windowWidth, windowHeight - 55);
			ctx.fillText((hiSpeed / 1e3).toFixed(1) + " x Hispeed (Q- E+)", windowWidth * .87, windowHeight - 30);
			if(audioRate < 5 || audioRate > 40) {
				ctx.fillStyle = "#F88"
			}
			ctx.fillText((audioRate/10).toFixed(1) + " x Rate (S- W+)", windowWidth * .87, windowHeight - 55);
			if(keysDown[72]) {
				ctx.textAlign = "right";
				ctx.fillStyle = "rgba(128, 128, 128, 0.8)";
				ctx.fillText("[Shift](C- V+) ±divition", windowWidth * .74, windowHeight - 55);
				ctx.fillText("[Shift](A- D+) ±[0.01]1s", windowWidth * .74, windowHeight - 30);
				ctx.fillText("(←↓→) barlines", windowWidth * .58, windowHeight - 30);
				ctx.fillText("(F) fullscreen", windowWidth * .58, windowHeight - 55);
				ctx.fillText("(Z) unlock time", windowWidth * .44, windowHeight - 55);
				ctx.fillText("(X) unlock position", windowWidth * .44, windowHeight - 30)
			}
			ctx.textAlign = "left";
			ctx.fillStyle = "#FFF";
			ctx.globalAlpha = 1;
			if(showD >= 1) {
				ctx.globalAlpha = showD == 1 ? .5 : 1;
				for(var h = Math.ceil(thisTime / spq); hiSpeed * (h * spq - thisTime) <= windowHeight - ud; ++h) {
					var d = hiSpeed * (h * spq - thisTime);
					var s = rgba(128, 128, 128, 0);
					var r = rgba(128, 128, 128, 1);
					var l = 3;
					var n = 2;
					if(h == 0) {
						n = 1024
					} else
						while(h % n == 0) {
							n = n * 2
						}
					if(h % 8 == 0) {
						s = rgba(255, 255, 255, 0);
						r = rgba(255, 255, 255, 1);
						l = 12
					} else if(h % 4 == 0) {
						s = rgba(192, 192, 192, 0);
						r = rgba(192, 192, 192, 1);
						l = 9
					} else if(h % 2 == 0) {
						s = rgba(128, 128, 128, 0);
						r = rgba(128, 128, 128, 1);
						l = 3
					}
					if(!playSettings.simpleNote) {
						drawJBox(ctx, lr, windowHeight - ud - d - l, windowWidth - 2 * lr, l, windowWidth / 2, windowHeight - ud - d - l, windowWidth / 2, windowHeight - ud - d, s, r)
					} else {
						ctx.fillRect(lr, windowHeight - ud - d - l / 2, windowWidth - 2 * lr, l)
					}
				}
				ctx.globalAlpha = 1;
				ctx.save();
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
				for(var h = Math.ceil(thisTime / spq); hiSpeed * (h * spq - thisTime) <= windowHeight - ud; ++h) {
					var d = hiSpeed * (h * spq - thisTime);
					var r = rgba(128, 128, 128, 1);
					var n = 2;
					if(h == 0) {
						n = 1024
					} else
						while(h % n == 0) {
							n = n * 2
						}
					if(h % 8 == 0) {
						r = rgba(255, 255, 255, 1)
					} else if(h % 4 == 0) {
						r = rgba(192, 192, 192, 1)
					} else if(h % 2 == 0) {
						r = rgba(128, 128, 128, 1)
					}
					ctx.fillStyle = r;
					if(hiSpeed * spq >= 50 / n) {
						ctx.strokeText(h / 32, windowWidth - lr + 5, windowHeight - ud - d - 20);
						ctx.fillText(h / 32, windowWidth - lr + 5, windowHeight - ud - d - 20)
					}
				}
				ctx.restore()
			}
			ctx.textAlign = "center";
			if(showL >= 1) {
				ctx.globalAlpha = showL == 1 ? .5 : 1;
				for(var h = Math.ceil(thisTime / spq); hiSpeed * (h * spq - thisTime) <= windowWidth / 2 - lr; ++h) {
					var d = hiSpeed * (h * spq - thisTime);
					var s = rgba(128, 128, 128, 0);
					var r = rgba(128, 128, 128, 1);
					var l = 5;
					var n = 2;
					if(h == 0) {
						n = 1024
					} else
						while(h % n == 0) {
							n = n * 2
						}
					if(h % 8 == 0) {
						s = rgba(255, 255, 255, 0);
						r = rgba(255, 255, 255, 1);
						l = 12
					} else if(h % 4 == 0) {
						s = rgba(192, 192, 192, 0);
						r = rgba(192, 192, 192, 1);
						l = 9
					} else if(h % 2 == 0) {
						s = rgba(128, 128, 128, 0);
						r = rgba(128, 128, 128, 1);
						l = 3
					}
					if(!playSettings.simpleNote) {
						drawJBox(ctx, lr + d, 0, l, windowHeight - ud, lr + d, 0, lr + d + l, 0, r, s)
					} else {
						ctx.fillRect(lr + d - l / 2, 0, l, windowHeight - ud)
					}
				}
				ctx.globalAlpha = 1;
				ctx.save();
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
				for(var h = Math.ceil(thisTime / spq); hiSpeed * (h * spq - thisTime) <= windowWidth / 2 - lr; ++h) {
					var d = hiSpeed * (h * spq - thisTime);
					var r = rgba(128, 128, 128, 1);
					var n = 2;
					if(h == 0) {
						n = 1024
					} else
						while(h % n == 0) {
							n = n * 2
						}
					if(h % 8 == 0) {
						r = rgba(255, 255, 255, 1)
					} else if(h % 4 == 0) {
						r = rgba(192, 192, 192, 1)
					} else if(h % 2 == 0) {
						r = rgba(128, 128, 128, 1)
					}
					ctx.fillStyle = r;
					if(hiSpeed * spq >= 200 / n) {
						ctx.strokeText(h / 32, d + lr, windowHeight - ud);
						ctx.fillText(h / 32, d + lr, windowHeight - ud)
					}
				}
				ctx.restore()
			}
			if(showR >= 1) {
				ctx.globalAlpha = showR == 1 ? .5 : 1;
				for(var h = Math.ceil(thisTime / spq); hiSpeed * (h * spq - thisTime) <= windowWidth / 2 - lr; ++h) {
					var d = hiSpeed * (h * spq - thisTime);
					var s = rgba(128, 128, 128, 0);
					var r = rgba(128, 128, 128, 1);
					var l = 5;
					var n = 2;
					if(h == 0) {
						n = 1024
					} else
						while(h % n == 0) {
							n = n * 2
						}
					if(h % 8 == 0) {
						s = rgba(255, 255, 255, 0);
						r = rgba(255, 255, 255, 1);
						l = 12
					} else if(h % 4 == 0) {
						s = rgba(192, 192, 192, 0);
						r = rgba(192, 192, 192, 1);
						l = 9
					} else if(h % 2 == 0) {
						s = rgba(128, 128, 128, 0);
						r = rgba(128, 128, 128, 1);
						l = 3
					}
					if(!playSettings.simpleNote) {
						drawJBox(ctx, windowWidth - lr - d - l, 0, l, windowHeight - ud, windowWidth - lr - d - l, 0, windowWidth - lr - d, 0, s, r)
					} else {
						ctx.fillRect(windowWidth - lr - d - l / 2, 0, l, windowHeight - ud)
					}
				}
				ctx.globalAlpha = 1;
				ctx.save();
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
				for(var h = Math.ceil(thisTime / spq); hiSpeed * (h * spq - thisTime) <= windowWidth / 2 - lr; ++h) {
					var d = hiSpeed * (h * spq - thisTime);
					var r = rgba(128, 128, 128, 1);
					var n = 2;
					if(h == 0) {
						n = 1024
					} else
						while(h % n == 0) {
							n = n * 2
						}
					if(h % 8 == 0) {
						r = rgba(255, 255, 255, 1);
						l = 20
					} else if(h % 4 == 0) {
						r = rgba(192, 192, 192, 1);
						l = 20
					} else if(h % 2 == 0) {
						r = rgba(128, 128, 128, 1);
						l = 10
					}
					ctx.fillStyle = r;
					if(hiSpeed * spq >= 200 / n) {
						ctx.fillText(h / 32, windowWidth - lr - d, windowHeight - ud)
					}
				}
				ctx.restore()
			}
		}
		
		
		//tp
		var totalHit = perfectHit + prHit + greatHit + goodHit + missHit;
		
		//showPerformance
		if (playSettings.showTP == 2 && performanceList.length > 0) {
			ctx.beginPath();
			ctx.lineTo(0,0);
			var t = 0, av;
			for (var i = 0; i < performanceList.length; ++i) {
				var p = performanceList[i];
				if (i < 20) {
					t += 4 - p.tp;
					av = t/(i + 1);
				}
				else {
					t += 4 - p.tp;
					t -= 4 - performanceList[i - 20].tp;
					av = t/20;
				}
				ctx.lineTo(p.time/musicCtrl.duration*windowWidth, av/4*(windowHeight-ud));
			}
			if (i > 0)ctx.lineTo(performanceList[i-1].time/musicCtrl.duration*windowWidth, 0);
			ctx.closePath();
			var tp = (Math.round((perfectHit*3 + prHit*2 + greatHit*1)/(totalHit*3)*10000)/100).toFixed(2);
			var j = jb(255 - Math.round(Math.pow((tp/100), 3)*255), 0, 255);
			//ctx.fillStyle = "RGBA(0,255,255,0.4)";
			ctx.fillStyle = "RGBA(" + j + "," + (255 - j) + "," + (255 - j) + ",0.5)";
			ctx.lineWidth = 1;
			//ctx.strokeStyle = "RGBA(0,255,255,0.9)";
			ctx.strokeStyle = "RGBA(" + j + "," + (255 - j) + "," + (255 - j) + ",0.9)";
			ctx.fill();
			ctx.stroke();
		}
		
		//showTP
		
		var totalHit = perfectHit + prHit + greatHit + goodHit + missHit;
		if (playSettings.showTP == 1 && totalHit > 0) {
			ctx.font = "500px Dynamix";
			var tp = (Math.round((perfectHit*3 + prHit*2 + greatHit*1)/(totalHit*3)*10000)/100).toFixed(2);
			if (perfectHit == totalHit) {
				tp = 100;
			}
			var i = jb(255 - Math.round(Math.pow((tp/100), 3)*255), 0, 255);
			ctx.fillStyle = "RGBA(" + i + "," + (255 - i) + "," + (255 - i) + "," + Math.pow((jb(tp, 90, 100)-90)/10, 1.5).toFixed(2) + ")";
			ctx.globalAlpha = 0.5;
			ctx.fillText(tp, windowWidth/2, windowHeight*0.2);
		}
		
		
		ctx.globalAlpha = 1;
		if(!editMode) {
			drawNumber(ctx, 1, combo, 1, hitThisFrame == 10 ? 3 : 4, .8 * windowWidth, (.5 - .001 * hitThisFrame) * windowHeight);
			drawNumber(ctx, 1, preScoreStr, 1, hitThisFrame == 10 ? 3 : 4, .4 * windowWidth, (.5 - .001 * hitThisFrame) * windowHeight)
		} {
			var w = mixerLT;
			if(w > 0) {
				ctx.globalAlpha = jb(w / 24, 0, 1);
				ctx.drawImage(mixerShadowCanvasL, 0, 0, 437, 381, lr - 95, barL - 190, 437, 381);
				ctx.globalAlpha = 1
			}
			var w = mixerRT;
			if(w > 0) {
				ctx.globalAlpha = jb(w / 24, 0, 1);
				ctx.drawImage(mixerShadowCanvasR, 0, 0, 437, 381, windowWidth - lr - 342, barR - 190, 437, 381);
				ctx.globalAlpha = 1;
				w = 0
			}
			if(mixerLT > 0) mixerLT--;
			if(mixerRT > 0) mixerRT--;
			noteShow = [];
			noteHoldShow = [];
			var m = mainMouse.condition == "writeHold" && mainMouse.condition == 2 ? coverPos2 : coverPos1;
			var c = mainMouse.condition == "writeHold" && mainMouse.condition == 2 ? coverWidth2 : coverWidth1;
			for(var e = 0; e < noteDown.length; ++e) {
				thisNote = noteDown[e];
				if(!thisNote || isMobile && thisNote && thisNote.status != "Untouched" && !(thisNote.status == "Miss" && !missHoldFindD[e]) && thisNote.m_type != "HOLD") continue;
				var u = thisNote.m_time * spu;
				var f = hiSpeed * (u - thisTime);
				var g = deeMode && thisNote.m_type != "HOLD" ? mtox(thisNote.m_position, 0) * (1 - f / (windowHeight - ud)) + f / (windowHeight - ud) * windowWidth * .5 : mtox(thisNote.m_position, 0);
				var b = deeMode && thisNote.m_type != "HOLD" ? mtow(thisNote.m_width, 0) * (1 - f / (windowHeight - ud)) : mtow(thisNote.m_width, 0);
				switch(thisNote.m_type) {
					case "NORMAL":
						if(isMobile) {
							if(thisNote.status == "Untouched" && u < thisTime - judge.g) {
								hitAnime(thisNote, 0, "Miss", true)
							}
						} else if(!noteDownHit[e]) {
							if(u <= thisTime) {
								noteDownHit[e] = true;
								hitAnime(thisNote, 0, "Perfect")
							}
						}
						if((!isMobile && f >= 0 || isMobile) && f <= windowHeight - ud) {
							if(f < -hideHeight - (ud - hideHeight) / hide) {
								missHoldFindD[e] = true;
								break
							}
							var x = f;
							if(deeMode && downJump) {
								f = Math.cos(f / (windowHeight - ud) * Math.PI / 2) * f * downJumpHeight
							}
							noteShow.push([0, 0, b, g, f, (editSide == 0 && equal(thisNote.m_position, m) ? 2 : 0) + (editSide == 0 && equal(thisNote.m_width, c) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * x / (windowHeight - ud), 0, 1)]);
							//between(e, catchStartD, catchEndD) ? -1 : -1;
						}
						break;
					case "CHAIN":
						if(isMobile) {
							if(thisNote.status == "Untouched") {
								if(u < thisTime - judge.g) {
									hitAnime(thisNote, 0, "Miss", true)
								} else if(between(u, thisTime - judge.m, thisTime + judge.p)) {
									for(var [p, M] of touchHold) {
										if(isValidTouch(M, 0) && between(M.x, mtox(thisNote.m_position, 0) - mtow(thisNote.m_width, 0) / 2 - expand, mtox(thisNote.m_position, 0) + mtow(thisNote.m_width, 0) / 2 + expand)) {
											if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.p) {
												hitAnime(thisNote, 0, "Perfect")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.pr) {
												hitAnime(thisNote, 0, "Pr")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.gr) {
												hitAnime(thisNote, 0, "Great")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.g) {
												hitAnime(thisNote, 0, "Good")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.m) {
												hitAnime(thisNote, 0, "Miss")
											}
											break
										}
									}
								}
							} else {}
						} else if(!noteDownHit[e]) {
							if(u <= thisTime) {
								noteDownHit[e] = true;
								hitAnime(thisNote, 0, "Perfect")
							}
						}
						if((!isMobile && f >= 0 || isMobile) && f <= windowHeight - ud) {
							if(f < -hideHeight - (ud - hideHeight) / hide) {
								missHoldFindD[e] = true;
								break
							}
							var x = f;
							if(deeMode && downJump) {
								f = Math.cos(f / (windowHeight - ud) * Math.PI / 2) * f * downJumpHeight
							}
							noteShow.push([1, 0, b, g, f, (editSide == 0 && equal(thisNote.m_position, m) ? 2 : 0) + (editSide == 0 && equal(thisNote.m_width, c) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * x / (windowHeight - ud), 0, 1)])
						}
						break;
					case "HOLD":
						var H = noteDown[noteDown[e].m_subId].m_time * spu;
						var v = hiSpeed * (H - thisTime);
						var S = 0;
						if(f > windowHeight - ud) {
							break
						}
						if(isMobile) {
							if(thisNote.status == "Untouched") {
								if(u < thisTime - judge.g) {
									hitAnime(thisNote, 0, "Miss", true);
									hitAnime(noteDown[thisNote.m_subId], 0, "Miss", true);
									missHoldFindD[e] = {
										half: false,
										missTime: thisTime - judge.g
									};
									missHoldD.add(e)
								}
							}
							var N = missHoldFindD[e];
							if(N) {
								if(N.half) {
									if(thisTime - N.missTime > .3) {
										missHoldFindD[e] = false;
										missHoldD.delete(e);
										break
									} else {
										S = 180 - Math.round(-f) % 180;
										noteHoldShow.push([0, b, v, g, 0, S, 0, false, 1 - (thisTime - N.missTime) / .3]);
										break
									}
								} else {
									if(f < -hideHeight - (ud - hideHeight) / hide) {
										missHoldFindD[e] = false;
										missHoldD.delete(e);
										break
									} else {
										S = 180 - Math.round(-f) % 180;
										noteHoldShow.push([0, b, v - f, g, f, S, 0, false, 1]);
										break
									}
								}
							}
						} else if(!noteDownHit[e]) {
							if(u <= thisTime) {
								noteDownHit[e] = true;
								hitAnime(thisNote, 0, "Perfect")
							}
						}
						if(isMobile) {
							if(holdCheckD.has(e)) {
								var T = false;
								v = Math.min(v, windowHeight - ud + 100);
								for(var [p, M] of touchHold) {
									if(isValidTouch(M, 0) && between(M.x, mtox(thisNote.m_position, 0) - mtow(thisNote.m_width, 0) / 2 - expand, mtox(thisNote.m_position, 0) + mtow(thisNote.m_width, 0) / 2 + expand)) {
										T = true;
										break
									}
								}
								if(T) {
									holdCheckD.set(e, thisTime);
									S = 180 - Math.round(-f) % 180;
									f = 0;
									shootParticle(18 + Math.floor(Math.random() * 24), 1, g + (Math.random() - .5) * b, windowHeight - ud, Math.random() * 360, g + (Math.random() * 2 - 1) * b, windowHeight - ud + (Math.random() - .5) * 2 * ud, (Math.random() - .5) * 180);
									if(holdCheckD.get(e) + 0 >= noteDown[thisNote.m_subId].m_time * (60 / barpm) - judge.p) {
										holdCheckD.delete(e);
										hitAnime(noteDown[thisNote.m_subId], 0, "Perfect")
									} else {
										noteHoldShow.push([0, b, v - f, g, f, S, 0, true, 1]);
										break
									}
								} else {
									S = 180 - Math.round(-f) % 180;
									f = 0;
									var _ = holdCheckD.get(e);
									if(thisTime - _ > holdLeaveTime) {
										if(Math.abs(_ - H) <= judge.p) {
											hitAnime(noteDown[thisNote.m_subId], 0, "Perfect")
										} else if(Math.abs(_ - H) <= judge.pr) {
											hitAnime(noteDown[thisNote.m_subId], 0, "Pr")
										} else if(Math.abs(_ - H) <= judge.gr) {
											hitAnime(noteDown[thisNote.m_subId], 0, "Great")
										} else if(Math.abs(_ - H) <= judge.g) {
											hitAnime(noteDown[thisNote.m_subId], 0, "Good")
										} else {
											missHoldFindD[e] = {
												half: true,
												missTime: thisTime
											};
											missHoldD.add(e);
											hitAnime(noteDown[thisNote.m_subId], 0, "Miss", true)
										}
										holdCheckD.delete(e)
									} else {
										shootParticle(18 + Math.floor(Math.random() * 24), 1, g + (Math.random() - .5) * b, windowHeight - ud, Math.random() * 360, g + (Math.random() * 2 - 1) * b, windowHeight - ud + (Math.random() - .5) * 2 * ud, (Math.random() - .5) * 180);
										noteHoldShow.push([0, b, v - f, g, f, S, 0, true, 1]);
										break
									}
								}
							} else if(thisNote.status == "Untouched") {
								noteHoldShow.push([0, b, v - f, g, f, S, 0, false, 1])
							}
						} else if(f <= windowHeight - ud && v >= 0) {
							v = Math.min(v, windowHeight - ud + 100);
							if(f <= 0) {
								shootParticle(18 + Math.floor(Math.random() * 24), 1, g + (Math.random() - .5) * b, windowHeight - ud, Math.random() * 360, g + (Math.random() * 2 - 1) * b, windowHeight - ud + (Math.random() - .5) * 2 * ud, (Math.random() - .5) * 180);
								S = 180 - Math.round(-f) % 180;
								f = 0
							}
							noteHoldShow.push([0, b, v - f, g, f, S, (editSide == 0 && equal(thisNote.m_position, m) ? 2 : 0) + (editSide == 0 && equal(thisNote.m_width, c) ? 1 : 0), noteDownHit[e]])
						}
						break;
					case "SUB":
						if(!noteDownHit[e] && !isMobile) {
							if(Math.abs(u - thisTime) <= judge.p || u <= thisTime) {
								noteDownHit[e] = true;
								hitAnime(thisNote, 0, "Perfect")
							}
						}
						break
				}
			}
			for(var e = 0; e < noteLeft.length; ++e) {
				thisNote = noteLeft[e];
				if(!thisNote || isMobile && thisNote && thisNote.status != "Untouched" && !(thisNote.status == "Miss" && !missHoldFindL[e]) && thisNote.m_type != "HOLD") continue;
				var u = thisNote.m_time * spu;
				var f = hiSpeed * (u - thisTime);
				var g = deeMode && thisNote.m_type != "HOLD" ? mtox(thisNote.m_position, 1) * (1 - f / (windowWidth / 2 - lr)) : mtox(thisNote.m_position, 1);
				var b = deeMode && thisNote.m_type != "HOLD" ? mtow(thisNote.m_width, 1) * (1 - f / (windowWidth / 2 - lr)) : mtow(thisNote.m_width, 1);
				switch(thisNote.m_type) {
					case "NORMAL":
						if(isMobile) {
							if(thisNote.status == "Untouched" && u < thisTime - judge.g) {
								hitAnime(thisNote, 1, "Miss", true)
							}
						} else if(!noteLeftHit[e]) {
							if(u <= thisTime) {
								noteLeftHit[e] = true;
								hitAnime(thisNote, 1, "Perfect")
							}
						}
						if((!isMobile && f >= 0 || isMobile) && f <= windowWidth / 2 - lr) {
							if(f < -hideHeight - (lr - hideHeight) / hide) {
								missHoldFindL[e] = true;
								break
							}
							var x = f;
							if(deeMode && leftJump) {
								f = Math.cos(f / (windowWidth / 2 - lr) * Math.PI / 2) * f * lrJumpHeight
							}
							noteShow.push([0, 1, b, g, f, (editSide == 1 && equal(thisNote.m_position, m) ? 2 : 0) + (editSide == 1 && equal(thisNote.m_width, c) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * x / (windowWidth / 2 - lr), 0, 1)])
						}
						break;
					case "CHAIN":
						if(isMobile) {
							if(thisNote.status == "Untouched") {
								if(u < thisTime - judge.g) {
									hitAnime(thisNote, 1, "Miss", true)
								} else if(between(u, thisTime - judge.m, thisTime + judge.p)) {
									if(isMixerL) {
										if(!(barTargetL - 100.8 > mtox(thisNote.m_position, 1) + mtow(thisNote.m_width, 1) / 2 + expand || barTargetL + 100.8 < mtox(thisNote.m_position, 1) - mtow(thisNote.m_width, 1) / 2 - expand)) {
											if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.p) {
												hitAnime(thisNote, 1, "Perfect")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.pr) {
												hitAnime(thisNote, 1, "Pr")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.gr) {
												hitAnime(thisNote, 1, "Great")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.g) {
												hitAnime(thisNote, 1, "Good")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.m) {
												hitAnime(thisNote, 1, "Miss")
											}
										}
									} else
										for(var [p, M] of touchHold) {
											if(isValidTouch(M, 1) && between(M.y, mtox(thisNote.m_position, 1) - mtow(thisNote.m_width, 1) / 2 - expand, mtox(thisNote.m_position, 1) + mtow(thisNote.m_width, 1) / 2 + expand)) {
												if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.p) {
													hitAnime(thisNote, 1, "Perfect")
												} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.pr) {
													hitAnime(thisNote, 1, "Pr")
												} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.gr) {
													hitAnime(thisNote, 1, "Great")
												} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.g) {
													hitAnime(thisNote, 1, "Good")
												} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.m) {
													hitAnime(thisNote, 1, "Miss")
												}
												break
											}
										}
								}
							}
						} else if(!noteLeftHit[e]) {
							if(u <= thisTime) {
								noteLeftHit[e] = true;
								hitAnime(thisNote, 1, "Perfect")
							}
						}
						if((!isMobile && f >= 0 || isMobile) && f <= windowWidth - lr) {
							if(f < -hideHeight - (lr - hideHeight) / hide) {
								missHoldFindL[e] = true;
								break
							}
							var x = f;
							if(deeMode && leftJump) {
								f = Math.cos(f / (windowWidth / 2 - lr) * Math.PI / 2) * f * lrJumpHeight
							}
							noteShow.push([1, 1, b, g, f, (editSide == 1 && equal(thisNote.m_position, m) ? 2 : 0) + (editSide == 1 && equal(thisNote.m_width, c) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * x / (windowWidth / 2 - lr), 0, 1)])
						}
						break;
					case "HOLD":
						var H = noteLeft[noteLeft[e].m_subId].m_time * spu;
						var v = hiSpeed * (H - thisTime);
						var S = 0;
						if(f > windowWidth / 2 - lr) {
							break
						}
						if(isMobile) {
							if(thisNote.status == "Untouched") {
								if(u < thisTime - judge.g) {
									hitAnime(thisNote, 1, "Miss", true);
									hitAnime(noteLeft[thisNote.m_subId], 1, "Miss", true);
									missHoldFindL[e] = {
										half: false,
										missTime: thisTime - judge.g
									};
									missHoldL.add(e)
								}
							}
							var N = missHoldFindL[e];
							if(N) {
								if(N.half) {
									if(thisTime - N.missTime > .3) {
										missHoldFindL[e] = false;
										missHoldL.delete(e);
										break
									} else {
										S = 180 - Math.round(-f) % 180;
										noteHoldShow.push([1, b, v, g, 0, S, 0, false, 1 - (thisTime - N.missTime) / .3]);
										break
									}
								} else {
									if(f < -hideHeight - (lr - hideHeight) / hide) {
										missHoldFindL[e] = false;
										missHoldL.delete(e);
										break
									} else {
										S = 180 - Math.round(-f) % 180;
										noteHoldShow.push([1, b, v - f, g, f, S, 0, false, 1]);
										break
									}
								}
							}
						} else if(!noteLeftHit[e]) {
							if(u <= thisTime) {
								noteLeftHit[e] = true;
								hitAnime(thisNote, 1, "Perfect")
							}
						}
						if(isMobile) {
							if(holdCheckL.has(e)) {
								var T = false;
								v = Math.min(v, windowWidth - lr + 100);
								for(var [p, M] of touchHold) {
									if(isValidTouch(M, 1) && between(M.y, mtox(thisNote.m_position, 1) - mtow(thisNote.m_width, 1) / 2 - expand, mtox(thisNote.m_position, 1) + mtow(thisNote.m_width, 1) / 2 + expand)) {
										T = true;
										break
									}
								}
								if(T) {
									holdCheckL.set(e, thisTime);
									S = 180 - Math.round(-f) % 180;
									f = 0;
									shootParticle(18 + Math.floor(Math.random() * 24), 1, lr, g + (Math.random() - .5) * b, Math.random() * 360, lr + (Math.random() - .5) * 2 * ud, g + (Math.random() - .5) * 2 * b, (Math.random() - .5) * 180);
									if(holdCheckL.get(e) + 0 >= noteLeft[thisNote.m_subId].m_time * (60 / barpm) - judge.p) {
										holdCheckL.delete(e);
										hitAnime(noteLeft[thisNote.m_subId], 1, "Perfect")
									} else {
										noteHoldShow.push([1, b, v - f, g, f, S, 0, true, 1]);
										break
									}
								} else {
									S = 180 - Math.round(-f) % 180;
									f = 0;
									var _ = holdCheckL.get(e);
									if(thisTime - _ > holdLeaveTime) {
										if(Math.abs(_ - H) <= judge.p) {
											hitAnime(noteLeft[thisNote.m_subId], 1, "Perfect")
										} else if(Math.abs(_ - H) <= judge.pr) {
											hitAnime(noteLeft[thisNote.m_subId], 1, "Pr")
										} else if(Math.abs(_ - H) <= judge.gr) {
											hitAnime(noteLeft[thisNote.m_subId], 1, "Great")
										} else if(Math.abs(_ - H) <= judge.g) {
											hitAnime(noteLeft[thisNote.m_subId], 1, "Good")
										} else {
											missHoldFindL[e] = {
												half: true,
												missTime: thisTime
											};
											missHoldL.add(e);
											hitAnime(noteLeft[thisNote.m_subId], 1, "Miss", true)
										}
										holdCheckL.delete(e)
									} else {
										shootParticle(18 + Math.floor(Math.random() * 24), 1, lr, g + (Math.random() - .5) * b, Math.random() * 360, lr + (Math.random() - .5) * 2 * ud, g + (Math.random() - .5) * 2 * b, (Math.random() - .5) * 180);
										noteHoldShow.push([1, b, v - f, g, f, S, 0, true, 1]);
										break
									}
								}
							} else if(thisNote.status == "Untouched") {
								noteHoldShow.push([1, b, v - f, g, f, S, 0, false, 1])
							}
						} else if(f <= windowWidth / 2 - lr && v >= 0) {
							if(f <= 0) {
								shootParticle(18 + Math.floor(Math.random() * 24), 1, lr, g + (Math.random() - .5) * b, Math.random() * 360, lr + (Math.random() - .5) * 2 * ud, g + (Math.random() - .5) * 2 * b, (Math.random() - .5) * 180);
								S = 180 - Math.round(-f) % 180;
								f = 0
							}
							noteHoldShow.push([1, b, v - f, g, f, S, (editSide == 1 && equal(thisNote.m_position, m) ? 2 : 0) + (editSide == 1 && equal(thisNote.m_width, c) ? 1 : 0), noteLeftHit[e], thisNote.m_id])
						}
						break;
					case "SUB":
						if(!noteLeftHit[e] && !isMobile) {
							if(Math.abs(u - thisTime) <= judge.p || u <= thisTime) {
								noteLeftHit[e] = true;
								hitAnime(thisNote, 1, "Perfect")
							}
						}
						break
				}
			}
			for(var e = 0; e < noteRight.length; ++e) {
				thisNote = noteRight[e];
				if(!thisNote || isMobile && thisNote && thisNote.status != "Untouched" && !(thisNote.status == "Miss" && !missHoldFindR[e]) && thisNote.m_type != "HOLD") continue;
				var u = thisNote.m_time * spu;
				var f = hiSpeed * (u - thisTime);
				var g = deeMode && thisNote.m_type != "HOLD" ? mtox(thisNote.m_position, 2) * (1 - f / (windowWidth / 2 - lr)) : mtox(thisNote.m_position, 2);
				var b = deeMode && thisNote.m_type != "HOLD" ? mtow(thisNote.m_width, 2) * (1 - f / (windowWidth / 2 - lr)) : mtow(thisNote.m_width, 2);
				switch(thisNote.m_type) {
					case "NORMAL":
						if(isMobile) {
							if(thisNote.status == "Untouched" && u < thisTime - judge.g) {
								hitAnime(thisNote, 2, "Miss", true)
							}
						} else if(!noteRightHit[e]) {
							if(u <= thisTime) {
								noteRightHit[e] = true;
								hitAnime(thisNote, 2, "Perfect")
							}
						}
						if((!isMobile && f >= 0 || isMobile) && f <= windowWidth / 2 - lr) {
							if(f < -hideHeight - (lr - hideHeight) / hide) {
								missHoldFindR[e] = true;
								break
							}
							var x = f;
							if(deeMode && rightJump) {
								f = Math.cos(f / (windowWidth / 2 - lr) * Math.PI / 2) * f * lrJumpHeight
							}
							noteShow.push([0, 2, b, g, f, (editSide == 2 && equal(thisNote.m_position, m) ? 2 : 0) + (editSide == 2 && equal(thisNote.m_width, c) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * x / (windowWidth / 2 - lr), 0, 1)])
						}
						break;
					case "CHAIN":
						if(isMobile) {
							if(thisNote.status == "Untouched") {
								if(u < thisTime - judge.g) {
									hitAnime(thisNote, 2, "Miss", true)
								} else if(between(u, thisTime - judge.m, thisTime + judge.p)) {
									if(isMixerR) {
										if(!(barTargetR - 100.8 > mtox(thisNote.m_position, 2) + mtow(thisNote.m_width, 2) / 2 + expand || barTargetR + 100.8 < mtox(thisNote.m_position, 2) - mtow(thisNote.m_width, 2) / 2 - expand)) {
											if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.p) {
												hitAnime(thisNote, 2, "Perfect")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.pr) {
												hitAnime(thisNote, 2, "Pr")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.gr) {
												hitAnime(thisNote, 2, "Great")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.g) {
												hitAnime(thisNote, 2, "Good")
											} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.m) {
												hitAnime(thisNote, 2, "Miss")
											}
										}
									} else
										for(var [p, M] of touchHold) {
											if(isValidTouch(M, 2) && between(M.y, mtox(thisNote.m_position, 2) - mtow(thisNote.m_width, 2) / 2 - expand, mtox(thisNote.m_position, 2) + mtow(thisNote.m_width, 2) / 2 + expand)) {
												if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.p) {
													hitAnime(thisNote, 2, "Perfect")
												} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.pr) {
													hitAnime(thisNote, 2, "Pr")
												} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.gr) {
													hitAnime(thisNote, 2, "Great")
												} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.g) {
													hitAnime(thisNote, 2, "Good")
												} else if(Math.abs(thisNote.m_time * (60 / barpm) - thisTime) <= judge.m) {
													hitAnime(thisNote, 2, "Miss")
												}
												break
											}
										}
								}
							}
						} else if(!noteRightHit[e]) {
							if(u <= thisTime) {
								noteRightHit[e] = true;
								hitAnime(thisNote, 2, "Perfect")
							}
						}
						if((!isMobile && f >= 0 || isMobile) && f <= windowWidth / 2 - lr) {
							if(f < -hideHeight - (lr - hideHeight) / hide) {
								missHoldFindR[e] = true;
								break
							}
							var x = f;
							if(deeMode && rightJump) {
								f = Math.cos(f / (windowWidth / 2 - lr) * Math.PI / 2) * f * lrJumpHeight
							}
							noteShow.push([1, 2, b, g, f, (editSide == 2 && equal(thisNote.m_position, m) ? 2 : 0) + (editSide == 2 && equal(thisNote.m_width, c) ? 1 : 0), thisNote.m_id, jb(1 - 1.2 * x / (windowWidth / 2 - lr), 0, 1)])
						}
						break;
					case "HOLD":
						var H = noteRight[noteRight[e].m_subId].m_time * spu;
						var v = hiSpeed * (H - thisTime);
						var S = 0;
						if(f > windowWidth / 2 - lr) {
							break
						}
						if(isMobile) {
							if(thisNote.status == "Untouched") {
								if(u < thisTime - judge.g) {
									hitAnime(thisNote, 2, "Miss", true);
									hitAnime(noteRight[thisNote.m_subId], 2, "Miss", true);
									missHoldFindR[e] = {
										half: false,
										missTime: thisTime - judge.g
									};
									missHoldR.add(e)
								}
							}
							var N = missHoldFindR[e];
							if(N) {
								if(N.half) {
									if(thisTime - N.missTime > .3) {
										missHoldFindR[e] = false;
										missHoldR.delete(e);
										break
									} else {
										S = 180 - Math.round(-f) % 180;
										noteHoldShow.push([2, b, v, g, 0, S, 0, false, 1 - (thisTime - N.missTime) / .3]);
										break
									}
								} else {
									if(f < -hideHeight - (lr - hideHeight) / hide) {
										missHoldFindR[e] = false;
										missHoldR.delete(e);
										break
									} else {
										S = 180 - Math.round(-f) % 180;
										noteHoldShow.push([2, b, v - f, g, f, S, 0, false, 1]);
										break
									}
								}
							}
						} else if(!noteRightHit[e]) {
							if(u <= thisTime) {
								noteRightHit[e] = true;
								hitAnime(thisNote, 2, "Perfect")
							}
						}
						if(isMobile) {
							if(holdCheckR.has(e)) {
								var T = false;
								v = Math.min(v, windowWidth - lr + 100);
								for(var [p, M] of touchHold) {
									if(isValidTouch(M, 2) && between(M.y, mtox(thisNote.m_position, 2) - mtow(thisNote.m_width, 2) / 2 - expand, mtox(thisNote.m_position, 2) + mtow(thisNote.m_width, 2) / 2 + expand)) {
										T = true;
										break
									}
								}
								if(T) {
									holdCheckR.set(e, thisTime);
									S = 180 - Math.round(-f) % 180;
									f = 0;
									shootParticle(18 + Math.floor(Math.random() * 24), 1, windowWidth - lr, g + (Math.random() - .5) * b, Math.random() * 360, windowWidth - lr + (Math.random() - .5) * 2 * ud, g + (Math.random() - .5) * 2 * b, (Math.random() - .5) * 180);
									if(holdCheckR.get(e) + 0 >= noteRight[thisNote.m_subId].m_time * (60 / barpm) - judge.p) {
										holdCheckR.delete(e);
										hitAnime(noteRight[thisNote.m_subId], 2, "Perfect")
									} else {
										noteHoldShow.push([2, b, v - f, g, f, S, 0, true, 1]);
										break
									}
								} else {
									S = 180 - Math.round(-f) % 180;
									f = 0;
									var _ = holdCheckR.get(e);
									if(thisTime - _ > holdLeaveTime) {
										if(Math.abs(_ - H) <= judge.p) {
											hitAnime(noteRight[thisNote.m_subId], 2, "Perfect")
										} else if(Math.abs(_ - H) <= judge.pr) {
											hitAnime(noteRight[thisNote.m_subId], 2, "Pr")
										} else if(Math.abs(_ - H) <= judge.gr) {
											hitAnime(noteRight[thisNote.m_subId], 2, "Great")
										} else if(Math.abs(_ - H) <= judge.g) {
											hitAnime(noteRight[thisNote.m_subId], 2, "Good")
										} else {
											missHoldFindR[e] = {
												half: true,
												missTime: thisTime
											};
											missHoldR.add(e);
											hitAnime(noteRight[thisNote.m_subId], 2, "Miss", true)
										}
										holdCheckR.delete(e)
									} else {
										shootParticle(18 + Math.floor(Math.random() * 24), 1, windowWidth - lr, g + (Math.random() - .5) * b, Math.random() * 360, windowWidth - lr + (Math.random() - .5) * 2 * ud, g + (Math.random() - .5) * 2 * b, (Math.random() - .5) * 180);
//										shootParticle(18 + Math.floor(Math.random() * 24), 1, g + (Math.random() - .5) * b, windowHeight - ud, Math.random() * 360, g + (Math.random() * 2 - 1) * b, windowHeight - ud + (Math.random() - .5) * 2 * ud, (Math.random() - .5) * 180);
										noteHoldShow.push([2, b, v - f, g, f, S, 0, true, 1]);
										break
									}
								}
							} else if(thisNote.status == "Untouched") {
								noteHoldShow.push([2, b, v - f, g, f, S, 0, false, 1])
							}
						} else if(f <= windowWidth / 2 - lr && v >= 0) {
							if(f <= 0) {
								shootParticle(18 + Math.floor(Math.random() * 24), 1, windowWidth - lr, g + (Math.random() - .5) * b, Math.random() * 360, windowWidth - lr + (Math.random() - .5) * 2 * ud, g + (Math.random() - .5) * 2 * b, (Math.random() - .5) * 180);
								S = 180 - Math.round(-f) % 180;
								f = 0
							}
							noteHoldShow.push([2, b, v - f, g, f, S, (editSide == 0 && equal(thisNote.m_position, m) ? 2 : 0) + (editSide == 0 && equal(thisNote.m_width, c) ? 1 : 0), noteRightHit[e]])
						}
						break;
					case "SUB":
						if(!noteRightHit[e] && !isMobile) {
							if(Math.abs(u - thisTime) <= judge.p || u <= thisTime) {
								noteRightHit[e] = true;
								hitAnime(thisNote, 2, "Perfect")
							}
						}
						break
				}
			}
			if(hitNote > 1) {
				hitDouble = 4
			} else {
				hitDouble = Math.max(0, hitDouble - 1)
			}
			var A = 13;
			for(var W of noteHoldShow) {
				drawLongNote(ctx, W[0], W[1], W[2], W[3], W[4], W[5], W[7], W[8]);
				ctx.globalAlpha = 1
			}
			for(var W of noteHoldShow) {
				drawLongBoxNote(ctx, W[0], W[1], W[2], W[3], W[4], W[8]);
				ctx.globalAlpha = 1;
				if(showCS) continue;
				if(W[7] === movingId || W[4] > 0 && W[6] > 0) {
					switch(W[6]) {
						case 1:
							ctx.fillStyle = "rgba(64, 64, 255, 1)";
							break;
						case 2:
							ctx.fillStyle = "rgba(255, 64, 64, 1)";
							break;
						case 3:
							ctx.fillStyle = "rgba(255, 64, 255, 1)";
							break
					}
					if(mainMouse.movement == "choose" && W[7] === movingId) {
						if(editSide == movingSide) {
							ctx.fillStyle = "rgba(255, 255, 255, 1)"
						} else {
							ctx.fillStyle = "rgba(255, 255, 255, 0)"
						}
					}
					if (editSide == W[1]) {
						switch(editSide) {
							case 0:
								ctx.fillRect(W[3] - A, windowHeight - ud - W[4] - A, 2 * A, 2 * A);
								break;
							case 1:
								ctx.fillRect(lr + W[4] - A, W[3] - A, 2 * A, 2 * A);
								break;
							case 2:
								ctx.fillRect(windowWidth - lr - W[4] - A, W[3] - A, 2 * A, 2 * A);
								break;
						}
					}
				}
			}
			for(var W of noteShow) {
				if(deeMode && W[7] != undefined) {
					ctx.globalAlpha = up2(W[7])
				}
				if (W[5] == -1 || !playSettings.smartCalculation) {
					ctx.globalAlpha = 1;
				}
				else {
					ctx.globalAlpha = 0.4;
				}
				if(W[0] == 0) {
					drawSingleNote(ctx, W[1], W[2], W[3], W[4])
				} else {
					drawSlideNote(ctx, W[1], W[2], W[3], W[4])
				}
				ctx.globalAlpha = 1;
				if(showCS) continue;
				if(W[6] === movingId || W[4] > 0 && W[5] > 0) {
					switch(W[5]) {
						case 1:
							ctx.fillStyle = "rgba(64, 64, 255, 1)";
							break;
						case 2:
							ctx.fillStyle = "rgba(255, 64, 64, 1)";
							break;
						case 3:
							ctx.fillStyle = "rgba(255, 64, 255, 1)";
							break
					}
					if(mainMouse.movement == "choose" && W[6] === movingId) {
						if(editSide == movingSide) {
							ctx.fillStyle = "rgba(255, 255, 255, 1)"
						} else {
							ctx.fillStyle = "rgba(255, 255, 255, 0)"
						}
					}
					if (editSide == W[1]) {
						switch(editSide) {
							case 0:
								ctx.fillRect(W[3] - A, windowHeight - ud - W[4] - A, 2 * A, 2 * A);
								break;
							case 1:
								ctx.fillRect(lr + W[4] - A, W[3] - A, 2 * A, 2 * A);
								break;
							case 2:
								ctx.fillRect(windowWidth - lr - W[4] - A, W[3] - A, 2 * A, 2 * A);
								break;
						}
					}
				}
			}
			
					ctx.globalAlpha = 1;
			
			for (var i = shadowQueue.head; shadowQueue.data[i]; i = (i + 1)%shadowQueue.maxSize) {
				var s = shadowQueue.data[i];
				if (startTime - s.startTime > s.doration) {
					shadowQueue.pop();
					continue;
				}
				var p = (startTime - s.startTime)/s.doration;
				if (playSettings.simpleEffect) {
					p = p*p;
				}
				var b = s.width;
				var g = s.x;
				var G = s.place;
				var X = 1 - p * p;
				ctx.globalAlpha = 1 - p * p;
				var E = b * (.7 + .31 * X > 1 ? 2 - (.7 + .31 * X) : .7 + .31 * X) * (545 / 305) + 5;
				if(playSettings.simpleEffect) {
					ctx.globalAlpha = (1 - p)*0.3;
					ctx.font = "64px Dynamix";
					var str = s.judgement;
					switch (s.judgement){
						case "Perfect":
							ctx.fillStyle = "#0FF";
							break;
						case "Pr":
							str = "Almost";
							ctx.fillStyle = "#0DD";
							break;
						case "Great":
							ctx.fillStyle = "#77F";
							break;
						case "Good":
							ctx.fillStyle = "#0F0";
							break;
						case "Miss":
							ctx.globalAlpha = (1 - p);
							ctx.fillStyle = "#F00";
							break;
						default:
							str = "?????";
							ctx.fillStyle = "#FFF";
							break;
					}
					switch(G) {
						case 0:
							ctx.fillText(str, g, windowHeight - ud - p*200-80);
							ctx.fillRect(g - b / 2, windowHeight - ud - 0, b, 0 + 1.1 * ud * (1-p));
							break;
						case 1:
							ctx.save();
							ctx.translate(lr + p*200+80, g);
							ctx.rotate(Math.PI*0.5);
							ctx.fillText(str, 0, 0);
							ctx.restore();
							ctx.fillRect(lr + -1.1 * lr * (1-p), g - b / 2, 1.1 * lr * (1-p), b);
							break;
						case 2:
							ctx.save();
							ctx.translate(windowWidth - lr - p*200-80, g);
							ctx.rotate(-Math.PI*0.5);
							ctx.fillText(str, 0, 0);
							ctx.restore();
							ctx.fillRect(windowWidth - lr - 0, g - b / 2, 0 + 1.1 * lr * (1-p), b);
							break
					}
				} else {
					var V, Y, Q;
					switch(s.judgement) {
						case "Perfect":
						case "Pr":
							V = perfectShadowCanvasD;
							Y = perfectShadowCanvasL;
							Q = perfectShadowCanvasR;
							break;
						case "Great":
							V = greatShadowCanvasD;
							Y = greatShadowCanvasL;
							Q = greatShadowCanvasR;
							break;
						case "Good":
							V = goodShadowCanvasD;
							Y = goodShadowCanvasL;
							Q = goodShadowCanvasR;
							break;
						case "Miss":
							V = missShadowCanvasD;
							Y = missShadowCanvasL;
							Q = missShadowCanvasR;
							break;
						default:
							alert(s.judgement);
							break
					}
					switch(G) {
						case 0:
							ctx.drawImage(V, 0, 0, 545, 905, g - E / 2, windowHeight - ud - (1202 - 398), E, 905);
							break;
						case 1:
							ctx.drawImage(Y, 0, 0, 905, 545, lr - 101, g - E / 2, 905, E);
							break;
						case 2:
							ctx.drawImage(Q, 0, 0, 905, 545, windowWidth - (1202 - 398) - lr, g - E / 2, 905, E);
							break
					}
				}
				if (shadowQueue.tail == (i + 1)%shadowQueue.maxSize) {
					break;
				}
			}
			ctx.globalAlpha = 1;
			
			
			var particleList = [];
			for (var i = particleQueue.head; particleQueue.data[i]; i = (i + 1)%particleQueue.maxSize) {
				var t = particleQueue.data[i];
				if (startTime - t.startTime > t.doration) {
					particleQueue.pop();
					continue;
				}
				var p = (startTime - t.startTime)/t.doration;
				for (var j of t.particles) {
					particleList.push({
						type: t.particleColor,
						translateX: j.sx + (j.ex - j.sx) * p,
						translateY: j.sy + (j.ey - j.sy) * p,
						rotate: (j.sd + j.ed * p) * Math.PI / 180,
						scaleX: 2.8 + 2*Math.pow(p, 2) * .9,
						scaleY: 2.8 + 2*Math.pow(p, 2) * .9,
						alphaA: p * (1 - Math.pow(p, 2)),
						alphaB: (1 - p) * (1 - Math.pow(p, 2))
					});
				}
				if (particleQueue.tail == (i + 1)%particleQueue.maxSize) {
					break;
				}
			}
			if(!playSettings.simpleEffect) {
				for(var p of particleList) {
					if (p.translateX <= lr || p.translateX >= windowWidth - lr || p.translateY >= windowHeight - ud) {
						ctx.save();
						ctx.translate(p.translateX, p.translateY);
						ctx.rotate(p.rotate);
						ctx.scale(p.scaleX, p.scaleY);
						ctx.globalAlpha = p.alphaA;
						switch (p.type) {
							case 0:
								ctx.drawImage(purpleParticleCanvas, -25, -25);
								break;
							case 1:
								ctx.drawImage(greenParticleCanvas, -25, -25);
								break;
							case 2:
								ctx.drawImage(blueParticleCanvas, -25, -25);
								break;
						}
						ctx.restore()
					}
				}
				for(var p of particleList) {
					ctx.save();
					ctx.translate(p.translateX, p.translateY);
					ctx.rotate(p.rotate);
					ctx.scale(p.scaleX, p.scaleY);
					ctx.globalAlpha = p.alphaB;
					ctx.drawImage(whiteParticleCanvas, -25, -25);
					ctx.restore()
				}
			}
			if(!playSettings.simpleEffect && showParticles) {
				yellowAnimeList.sort(function(t, e) {
					return t[8] - e[8]
				});
				for(var e = 0; e < yellowAnimeList.length; ++e) {
					var k = yellowAnimeList[e];
					var C = k[0];
					var L = k[1];
					if(e < 800 && C <= L) {
						var z = jb(1 - C / L, 0, 1);
						var y = k[2];
						var I = k[3];
						var P = k[4];
						var D = k[5];
						var j = k[6];
						var J = k[7];
						var q = k[8];
						if(!between(y + (D - y) * z, 0, windowWidth) || !between(I + (j - I) * z, 0, windowHeight)) {
							yellowAnimeList[e] = null;
							continue
						}
						ctx.save();
						ctx.translate(y + (D - y) * z, I + (j - I) * z);
						ctx.rotate((P + J * z) * Math.PI / 180);
						ctx.scale(2.5 - Math.pow(z, 2) * .9, 2.5 - Math.pow(z, 2) * .9);
						ctx.globalAlpha = z * (1 - Math.pow(z, 3));
						ctx.drawImage(yellowParticleCanvas, -25, -25);
						ctx.globalAlpha = (1 - z) * (1 - Math.pow(z, 3));
						ctx.drawImage(whiteParticleCanvas, -25, -25);
						ctx.globalAlpha = 1;
						ctx.restore()
					}
					k[0]--;
					if(k[0] == 0) {
						yellowAnimeList[e] = null
					}
				}
				var Z = [];
				var U = 0;
				for(e = 0; e < yellowAnimeList.length; ++e) {
					if(yellowAnimeList[e]) {
						Z[U] = $.extend(true, [], yellowAnimeList[e]);
						++U
					}
				}
				yellowAnimeList = $.extend(true, [], Z)
			}
			if(isMobile) {
				barL = barTargetL;
				barR = barTargetR
			} else {
				barL = Math.round((barL + barTargetL) / 2);
				if(barL < 198) {
					barL = 198
				}
				if(barL > 908) {
					barL = 908
				}
				barR = Math.round((barR + barTargetR) / 2);
				if(barR < 198) {
					barR = 198
				}
				if(barR > 908) {
					barR = 908
				}
			}
			if(isMixerL) {
				ctx.drawImage(barCanvas, 0, 0, 79, 234, lr - 40, barL - 117, 79, 234)
			}
			if(isMixerR) {
				ctx.drawImage(barCanvas, 0, 0, 79, 234, windowWidth - lr - 40, barR - 117, 79, 234)
			}
			var K = [];
			var U = 0;
			for(e = 0; e < hitAnimeList.length; ++e) {
				if(hitAnimeList[e]) {
					K[U] = $.extend(true, [], hitAnimeList[e]);
					++U
				}
			}
			hitAnimeList = $.extend(true, [], K)
		}
		drawJBox(ctx, 0, 0, (thisTime - offsetSec) / doration * windowWidth, 30, windowWidth / 2, 0, windowWidth / 2, 30, rgba(0, 255, 255, .5), rgba(0, 255, 255, 0));
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, windowWidth, 7);
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0, 0, (thisTime - offsetSec) / doration * windowWidth, 7);
		if(hitThisFrame > 0) {
			hitThisFrame--
		}
		if(hitThisFrame2 > 0) {
			hitThisFrame2--
		}
		if(hitDouble > 0) {
			hitDouble--
		}
		if(mainMouse.movement == "choose") {
			ctx.fillStyle = "#FFF";
			if(mainMouse.condition > 0 && coverPos1 != coverPos2 && coverTime1 != coverTime2) {
				switch(editSide) {
					case 0:
						var y = Math.min(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var D = Math.max(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var I = Math.min(windowHeight - ud - hiSpeed * (coverTime1 * spu - thisTime), windowHeight - ud - hiSpeed * (coverTime2 * spu - thisTime));
						var j = Math.max(windowHeight - ud - hiSpeed * (coverTime1 * spu - thisTime), windowHeight - ud - hiSpeed * (coverTime2 * spu - thisTime));
						if(I > windowHeight - ud) break;
						if(I >= 0) {
							ctx.fillRect(y - 3, I - 3, D - y + 6, 6)
						}
						if(j <= windowHeight - ud) {
							ctx.fillRect(y - 3, j - 3, D - y + 6, 6)
						}
						I = jb(I, 0, windowHeight - ud);
						j = jb(j, 0, windowHeight - ud);
						ctx.fillRect(y - 3, I - 3, 6, j - I + 6);
						ctx.fillRect(D - 3, I - 3, 6, j - I + 6);
						ctx.fillStyle = rgba(255, 255, 255, .3);
						ctx.fillRect(y + 3, I + 3, D - y - 6, j - I - 6);
						break;
					case 1:
						var y = Math.min(lr + hiSpeed * (coverTime1 * spu - thisTime), lr + hiSpeed * (coverTime2 * spu - thisTime));
						var D = Math.max(lr + hiSpeed * (coverTime1 * spu - thisTime), lr + hiSpeed * (coverTime2 * spu - thisTime));
						var I = Math.min(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var j = Math.max(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						if(D < lr) break;
						if(y >= lr) {
							ctx.fillRect(y - 3, I - 3, 6, j - I + 6)
						}
						if(D <= windowWidth / 2) {
							ctx.fillRect(D - 3, I - 3, 6, j - I + 6)
						}
						y = jb(y, lr, windowWidth / 2);
						D = jb(D, lr, windowWidth / 2);
						ctx.fillRect(y - 3, I - 3, D - y + 6, 6);
						ctx.fillRect(y - 3, j - 3, D - y + 6, 6);
						ctx.fillStyle = rgba(255, 255, 255, .3);
						ctx.fillRect(y + 3, I + 3, D - y - 6, j - I - 6);
						break;
					case 2:
						var y = Math.min(windowWidth - lr - hiSpeed * (coverTime1 * spu - thisTime), windowWidth - lr - hiSpeed * (coverTime2 * spu - thisTime));
						var D = Math.max(windowWidth - lr - hiSpeed * (coverTime1 * spu - thisTime), windowWidth - lr - hiSpeed * (coverTime2 * spu - thisTime));
						var I = Math.min(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var j = Math.max(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						if(y > windowWidth - lr) break;
						if(y >= windowWidth / 2) {
							ctx.fillRect(y - 3, I - 3, 6, j - I + 6)
						}
						if(D <= windowWidth - lr) {
							ctx.fillRect(D - 3, I - 3, 6, j - I + 6)
						}
						y = jb(y, windowWidth / 2, windowWidth - lr);
						D = jb(D, windowWidth / 2, windowWidth - lr);
						ctx.fillRect(y - 3, I - 3, D - y + 6, 6);
						ctx.fillRect(y - 3, j - 3, D - y + 6, 6);
						ctx.fillStyle = rgba(255, 255, 255, .3);
						ctx.fillRect(y + 3, I + 3, D - y - 6, j - I - 6);
						break;
					default:
						break
				}
			}
		} else {
			for(var e = 0; e < noteTemp.length; ++e) {
				thisNote = noteTemp[e];
				var u = thisNote.m_time * spu;
				var f = hiSpeed * (u - thisTime);
				var d = f;
				var l = 5;
				var tt = Math.round((thisNote.m_time - Math.floor(thisNote.m_time)) / (1 / magnaticStrength));
				var et = magnaticStrength;
				switch(thisNote.m_type) {
					case "NORMAL":
						var s = rgba(0, 255, 255, 0);
						var r = rgba(0, 255, 255, 1);
						break;
					case "CHAIN":
						var s = rgba(255, 0, 0, 0);
						var r = rgba(255, 0, 0, 1);
						break;
					case "HOLD":
						var s = rgba(255, 255, 0, 0);
						var r = rgba(255, 255, 0, 1);
						break;
					case "SUB":
						var s = rgba(255, 128, 0, 0);
						var r = rgba(255, 128, 0, 1);
						break
				}
				switch(editSide) {
					case 0:
						if(f >= 0 && f <= windowHeight - ud) {
							drawJBox(ctx, 0, windowHeight - ud - d - l, windowWidth, l, 0, windowHeight - ud - d - l, 0, windowHeight - ud - d, s, r);
							drawJBox(ctx, lr + d, 0, l, windowHeight, lr + d, 0, lr + d + l, 0, "rgba(255, 0, 255, 1.0)", "rgba(255, 0, 255, 0.0)");
							drawJBox(ctx, windowWidth - lr - d - l, 0, l, windowHeight, windowWidth - lr - d - l, 0, windowWidth - lr - d, 0, "rgba(255, 0, 255, 0.0)", "rgba(255, 0, 255, 1.0)");
							ctx.fillStyle = "white";
							ctx.fillRect(mtox(thisNote.m_position, 0) - 1, 0, 3, windowHeight - ud);
							ctx.save();
							ctx.textAlign = "left";
							ctx.shadowColor = rgba(0, 0, 0, .9);
							ctx.shadowOffsetX = 0;
							ctx.shadowOffsetY = 0;
							ctx.shadowBlur = 4;
							ctx.fillText(thisNote.m_width, mtox(thisNote.m_position, 0) + 22, windowHeight - ud - d);
							ctx.textAlign = "right";
							ctx.fillStyle = r;
							ctx.fillText(thisNote.m_position, mtox(thisNote.m_position, 0) - 22, windowHeight - ud - d);
							if(e == 1 && mainMouse.movement == "writeHold") {
								ctx.textAlign = "left"
							}
							if(!keysDown[90] && e == noteTemp.length - 1) {
								ctx.fillText("   " + Math.floor(thisNote.m_time) + (tt == 0 ? "" : "+" + tt + "/" + et) + "  ", mtox(thisNote.m_position, 0), windowHeight - ud - d - 40)
							} else {
								ctx.fillText("      " + thisNote.m_time, mtox(thisNote.m_position, 0) - 22, windowHeight - ud - d - 40)
							}
							ctx.restore()
						}
						break;
					case 1:
						if(f >= 0 && f <= windowWidth / 2 - lr) {
							drawJBox(ctx, 0, windowHeight - ud - d - l, windowWidth, l, 0, windowHeight - ud - d - l, 0, windowHeight - ud - d, "rgba(255, 0, 255, 0.0)", "rgba(255, 0, 255, 1.0)");
							drawJBox(ctx, lr + d, 0, l, windowHeight, lr + d, 0, lr + d + l, 0, r, s);
							drawJBox(ctx, windowWidth - lr - d - l, 0, l, windowHeight, windowWidth - lr - d - l, 0, windowWidth - lr - d, 0, s, r);
							ctx.fillRect(0, mtox(thisNote.m_position, 1) - 1, windowWidth / 2, 3);
							ctx.save();
							ctx.textAlign = "left";
							ctx.fillStyle = "white";
							ctx.shadowColor = rgba(0, 0, 0, .9);
							ctx.shadowOffsetX = 0;
							ctx.shadowOffsetY = 0;
							ctx.shadowBlur = 4;
							ctx.fillText(thisNote.m_width, lr + d + 22, mtox(thisNote.m_position, 1));
							ctx.textAlign = "right";
							ctx.fillStyle = r;
							ctx.fillText(thisNote.m_position, lr + d - 22, mtox(thisNote.m_position, 1));
							if(e % 2 == 1) {
								ctx.textAlign = "left"
							}
							if(!keysDown[90] && e == noteTemp.length - 1) {
								ctx.fillText(Math.floor(thisNote.m_time) + (tt == 0 ? "" : "+" + tt + "/" + et) + "      ", lr + d + 22, mtox(thisNote.m_position, 1) - 40)
							} else {
								ctx.fillText(thisNote.m_time, lr + d - 22, mtox(thisNote.m_position, 1) - 40)
							}
							ctx.restore()
						}
						break;
					case 2:
						if(f >= 0 && f <= windowWidth / 2 - lr) {
							drawJBox(ctx, 0, windowHeight - ud - d - l, windowWidth, l, 0, windowHeight - ud - d - l, 0, windowHeight - ud - d, "rgba(255, 0, 255, 0.0)", "rgba(255, 0, 255, 1.0)");
							drawJBox(ctx, lr + d, 0, l, windowHeight, lr + d, 0, lr + d + l, 0, r, s);
							drawJBox(ctx, windowWidth - lr - d - l, 0, l, windowHeight, windowWidth - lr - d - l, 0, windowWidth - lr - d, 0, s, r);
							ctx.fillRect(windowWidth / 2, mtox(thisNote.m_position, 2) - 1, windowWidth / 2, 3);
							ctx.save();
							ctx.textAlign = "left";
							ctx.fillStyle = "white";
							ctx.shadowColor = rgba(0, 0, 0, .9);
							ctx.shadowOffsetX = 0;
							ctx.shadowOffsetY = 0;
							ctx.shadowBlur = 4;
							ctx.fillText(thisNote.m_width, windowWidth - lr - d + 22, mtox(thisNote.m_position, 2));
							ctx.textAlign = "right";
							ctx.fillStyle = r;
							ctx.fillText(thisNote.m_position, windowWidth - lr - d - 22, mtox(thisNote.m_position, 2));
							if(e % 2 == 0) {
								ctx.textAlign = "left"
							}
							if(!keysDown[90] && e == noteTemp.length - 1) {
								ctx.fillText(Math.floor(thisNote.m_time) + (tt == 0 ? "" : "+" + tt + "/" + et) + "      ", windowWidth - lr - d + 22, mtox(thisNote.m_position, 2) - 40)
							} else {
								ctx.fillText(thisNote.m_time, windowWidth - lr - d + 22, mtox(thisNote.m_position, 2) - 40)
							}
							ctx.restore()
						}
						break;
					default:
						break
				}
			}
		}
		for(var e = 0; e < noteTemp.length; ++e) {
			thisNote = noteTemp[e];
			var u = thisNote.m_time * spu;
			var f = hiSpeed * (u - thisTime);
			var g = mtox(thisNote.m_position, editSide);
			var b = thisNote.m_width * (editSide == 0 ? 300 : 150) - 30;
			var it = editSide == 0 ? windowHeight - ud : windowWidth / 2 - lr;
			var ot = editSide == 0 ? windowHeight - ud : windowWidth - lr;
			switch(thisNote.m_type) {
				case "NORMAL":
					if(f >= 0 && f <= it) {
						ctx.globalAlpha = .6;
						drawSingleNote(ctx, editSide, b, g, f);
						ctx.globalAlpha = 1
					}
					break;
				case "CHAIN":
					if(f >= 0 && f <= it) {
						ctx.globalAlpha = .6;
						drawSlideNote(ctx, editSide, b, g, f);
						ctx.globalAlpha = 1
					}
					break;
				case "HOLD":
					var H = coverTime2 * spu;
					var v = hiSpeed * (H - thisTime);
					var S = 0;
					if(f > ot || v < 0) {
						break
					}
					if(v >= it + 100) {
						v = ot + 100
					}
					if(f <= 0) {
						S = 180 - Math.round(-f) % 180;
						f = 0
					}
					ctx.globalAlpha = .6;
					drawLongNote(ctx, editSide, b, v - f, g, f, S);
					drawLongBoxNote(ctx, editSide, b, v - f, g, f, S);
					ctx.globalAlpha = 1;
					break;
				case "SUB":
					if(f >= 0 && f <= ot) {
						var g = windowWidth / 2 + (-2.5 + Number(thisNote.m_position)) * 300;
						var b = thisNote.m_width * 300 - 30
					}
					break
			}
		}
		if(mainMouse.menu) {
			switch(mainMouse.menu) {
				case "basic":
					drawBox(ctx, rx, ry, 400, 610, .8, 8);
					var at = editSide;
					basicMenu[1][3] = editSide == 1 && CMap.m_leftRegion == "MIXER" || editSide == 2 && CMap.m_rightRegion == "MIXER" ? rgba(128, 128, 128, .8) : rgba(0, 255, 255, .8);
					basicMenu[2][3] = editSide == 1 && CMap.m_leftRegion == "PAD" || editSide == 2 && CMap.m_rightRegion == "PAD" ? rgba(128, 128, 128, .8) : rgba(255, 128, 128, .8);
					basicMenu[3][3] = editSide == 1 && CMap.m_leftRegion == "MIXER" || editSide == 2 && CMap.m_rightRegion == "MIXER" ? rgba(128, 128, 128, .8) : rgba(255, 255, 0, .8);
					if(between(mainMouse.coordinate.x, rx, rx + 400) && between(mainMouse.coordinate.y, ry + 566, ry + 604) && musicCtrl) {
						musicCtrl.volume = Math.round((mainMouse.coordinate.x - rx) / 400 * 100) / 100
					} else if(between(mainMouse.coordinate.y, ry + 0, ry + 38)) {
						if(between(mainMouse.coordinate.x, rx, rx + 400 / 3)) {
							editSide = 1
						} else if(between(mainMouse.coordinate.x, rx + 400 / 3, rx + 800 / 3)) {
							editSide = 0
						} else if(between(mainMouse.coordinate.x, rx + 800 / 3, rx + 400)) {
							editSide = 2
						}
					}
					if(editSide != at) {
						changeSide()
					}
					ctx.fillStyle = rgba(Math.round(jb(255 - musicCtrl.volume * 255), 0, 255), Math.round(jb(musicCtrl.volume * 255, 0, 255)), Math.round(jb(musicCtrl.volume * 255, 0, 255)), .8);
					ctx.fillRect(rx, ry + 566, musicCtrl.volume * 400, 38);
					ctx.fillStyle = rgba(128, 128, 128, .8);
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
							break
					}
					basicMenu[6][0] = "     Mark at " + (thisTime / spq / 32).toFixed(3) + " bar";
					basicMenu[7][0] = "[M]  Start at " + Number(markSecion).toFixed(3) + " bar";
					basicMenu[12][0] = "     Hit sound " + (showHitSound ? "ON" : "OFF");
					basicMenu[13][0] = "     Particles " + (showParticles ? "ON" : "OFF");
					basicMenu[14][0] = "     Music volume " + Math.round(musicCtrl.volume * 100) + "%";
					if(musicCtrl) {
						if(musicCtrl.paused) {
							basicMenu[5][0] = "[_]  Play";
							basicMenu[5][3] = "rgba(0, 255, 0, 0.8)"
						} else {
							basicMenu[5][0] = "[_]  Pause";
							basicMenu[5][3] = "rgba(255, 0, 0, 0.8)"
						}
					} else {
						basicMenu[5][0] = "Music ctrl error";
						basicMenu[5][3] = "rgba(255, 0, 0, 0.8)"
					}
					var ht = basicMenu;
					break;
				case "delete":
					drawBox(ctx, rx, ry, 400, 90, .8, 8);
					var ht = editMenu;
					break
			}
			ctx.textAlign = "left";
			ctx.textBaseline = "alphabetic";
			ctx.font = "bold 28px Dynamix";
			for(var e = 0; e < ht.length; ++e) {
				if(!(e == 0 && ht.length != 1) && e != 14 && between(mainMouse.coordinate.y, ry + ht[e][1], ry + ht[e][1] + ht[e][2]) && between(mainMouse.coordinate.x, rx, rx + 400)) {
					ctx.fillStyle = ht[e][3] ? ht[e][3] : "rgba(0, 255, 255, 0.8)";
					ctx.fillRect(rx, ry + ht[e][1], 400, ht[e][2]);
					ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
				} else {
					ctx.fillStyle = ht[e][3] ? ht[e][3] : "rgba(0, 255, 255, 0.8)"
				}
				ctx.fillText(ht[e][0], rx + 20, ry + ht[e][1] + ht[e][2] - 10)
			}
			ctx.textBaseline = "top"
		}
		if (changeToResult <= 79) {
			fullColor("RGBA(0,0,0," + (1 - changeToResult / 80) + ")");
		}
	}
};