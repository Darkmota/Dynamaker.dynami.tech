var touchesStart = [],
	touchesMove = [],
	touchesEnd = [],
	touchesCancel = [],
	changedTouches = [],
	touchHold = new Map(),
	holdCheckD = new Map(),
	holdCheckL = new Map(),
	holdCheckR = new Map(),
	missHoldD = new Set(),
	missHoldL = new Set(),
	missHoldR = new Set(),
	missHoldFindD = [],
	missHoldFindL = [],
	missHoldFindR = [],
	catchStartD = 0,
	catchEndD = 0,
	catchStartL = 0,
	catchEndL = 0,
	catchStartR = 0,
	catchEndR = 0,
	catched = {
		down: new Set(),
		left: new Set(),
		right: new Set()
	},
	expand = 30,
	holdLeaveTime = 0,
	mixerFingerIdL = false,
	mixerFingerIdR = false;

function getTime(bar) {
	var time = - offsetBar*(60/shiftList[0].barpm);
	for (var i = 1; i < shiftList.length; ++i) {
		if (i == shiftList.length - 1) {
			time += (bar - shiftList[i].bar)*(60/shiftList[i].barpm);
		}
		else if (bar >= shiftList[i].bar) {
			time += (shiftList[i + 1].bar - shiftList[i].bar)*(60/shift.barpm);
		}
		else {
			time += (bar - shiftList[i].bar)*(60/shiftList[i].barpm);
			break;
		}
	}
	return time;
}

//function getBar(time) {
//	var bar = 0;
//	
//} 



function mixer() {
	mixerFingerIdL = false;
	mixerFingerIdR = false;
	for (var [id, f] of touchHold) {
		if (isValidTouch(f, 1)) {
			if (mixerFingerIdL < id || mixerFingerIdL === false) {
				mixerFingerIdL = id;
			}
		}
		if (isValidTouch(f, 2)) {
			if (mixerFingerIdR < id || mixerFingerIdR === false) {
				mixerFingerIdR = id;
			}
		}
	}
	if (mixerFingerIdL !== false) {
		var point = touchHold.get(mixerFingerIdL);
		if (point) {
			barTargetL = jb(point.y, 235, 845);
		}
	}
	if (mixerFingerIdR !== false) {
		var point = touchHold.get(mixerFingerIdR);
		if (point) {
			barTargetR = jb(point.y, 235, 845);
		}
	}
}

function findHit(catched, c, t) {
	var x = c.x,
		y = c.y,
		catchTime;
	if (isValidTouch(c, 0)) {
		for (var i = catchStartD; i <= catchEndD; ++i) {
			if (noteDown[i].m_type == "SUB") {
				continue;
			}
			catchTime = noteDown[i].m_time*(60/barpm);
			if (noteDown[i].status == "Untouched" && between(catchTime, t - judge.g, t + judge.m) && between(x, mtox(noteDown[i].m_position, 0) - mtow(noteDown[i].m_width, 0)/2 - expand, mtox(noteDown[i].m_position, 0) + mtow(noteDown[i].m_width, 0)/2 + expand)) {
				catched.down.add(i);
				for (var j = i + 1; j <= catchEndD; j++) {
					if (noteDown[j].m_type == "SUB") {
						continue;
					}
					if (! equal(noteDown[i].m_time, noteDown[j].m_time)) {
						break;
					}
					else if (noteDown[j].status == "Untouched" && equal(noteDown[i].m_time, noteDown[j].m_time) && between(x, mtox(noteDown[j].m_position, 0) - mtow(noteDown[j].m_width, 0)/2 - expand, mtox(noteDown[j].m_position, 0) + mtow(noteDown[j].m_width, 0)/2 + expand)) {
						catched.down.add(j);
					}
				}
				break;
			}
		}
	}
	if (isValidTouch(c, 1)) {
		for (var i = catchStartL; i <= catchEndL; ++i) {
			if (noteLeft[i].m_type == "SUB") {
				continue;
			}
			catchTime = noteLeft[i].m_time*(60/barpm);
			if (noteLeft[i].status == "Untouched" && between(catchTime, t - judge.g, t + judge.m) && between(y, mtox(noteLeft[i].m_position, 1) - mtow(noteLeft[i].m_width, 1)/2 - expand, mtox(noteLeft[i].m_position, 1) + mtow(noteLeft[i].m_width, 1)/2 + expand)) {
				catched.left.add(i);
				for (var j = i + 1; j <= catchEndL; j++) {
					if (noteLeft[j].m_type == "SUB") {
						continue;
					}
					if (! equal(noteLeft[i].m_time, noteLeft[j].m_time)) {
						break;
					}
					else if (noteLeft[j].status == "Untouched" && between(y, mtox(noteLeft[j].m_position, 1) - mtow(noteLeft[j].m_width, 1)/2 - expand, mtox(noteLeft[j].m_position, 1) + mtow(noteLeft[j].m_width, 1)/2 + expand)) {
						catched.left.add(j);
					}
				}
				break;
			}
		}
	}
	if (isValidTouch(c, 2)) {
		for (var i = catchStartR; i <= catchEndR; ++i) {
			if (noteRight[i].m_type == "SUB") {
				continue;
			}
			catchTime = noteRight[i].m_time*(60/barpm); 
			if (noteRight[i].status == "Untouched" && between(catchTime, t - judge.g, t + judge.m) && between(y, mtox(noteRight[i].m_position, 2) - mtow(noteRight[i].m_width, 2)/2 - expand, mtox(noteRight[i].m_position, 2) + mtow(noteRight[i].m_width, 2)/2 + expand)) {
				catched.right.add(i);
				for (var j = i + 1; j <= catchEndR; j++) {
					if (noteRight[j].m_type == "SUB") {
						continue;
					}
					if (! equal(noteRight[i].m_time, noteRight[j].m_time)) {
						break;
					}
					else if (noteRight[j].status == "Untouched" && between(y, mtox(noteRight[j].m_position, 2) - mtow(noteRight[j].m_width, 2)/2 - expand, mtox(noteRight[j].m_position, 2) + mtow(noteRight[j].m_width, 2)/2 + expand)) {
						catched.right.add(j);
					}
				}
				break;
			}
		}
	}
}

function setTouch() {
	document.querySelector('body').addEventListener('touchstart', function (event) {
	    if (event.cancelable) {
	        if (!event.defaultPrevented) {
	            event.preventDefault();
	        }
	    }
	});
	document.querySelector('body').addEventListener('touchmove', function (event) {
	    if (event.cancelable) {
	        if (!event.defaultPrevented) {
	            event.preventDefault();
	        }
	    }
	});
	document.querySelector('body').addEventListener('touchend', function (event) {
	    if (event.cancelable) {
	        if (!event.defaultPrevented) {
	            event.preventDefault();
	        }
	    }
	});
	touchHold.clear();
	document.addEventListener('touchstart', function(event) {
		///temp
		if (musicCtrl && musicCtrl.currentTime == 0 && musicCtrl.paused) {
			musicCtrl.play();
			return;
		}
	});
	canvas.addEventListener('touchstart', function(event) {
		///tempend
		touchesStart = event.changedTouches;
////		location.reload();
//		console.log(thisTime - musicCtrl.currentTime - offsetSec);
		// event.preventDefault();
		event.stopPropagation();
		if (inArea(getPointOnCanvas(canvas, touchesStart[0].pageX, touchesStart[0].pageY), windowWidth * 0.5 - 100, windowHeight * 0.01, 200, 250) && musicCtrl) {
			if (musicCtrl.paused) {
				pressPause = 30;
				pressStart = 29;
			}
			else {
				pressPause = 29;
				musicCtrl.pause();
			}
		}
//		for (var finger of touchesStart) {
//			findHit(catched, getPointOnCanvas(canvas, finger.pageX, finger.pageY), thisTime);
//		}

		if (scene && scene.isPlaying) {
			var thisTime = musicCtrl.currentTime + offsetSec;
			catched.down.clear();
			catched.left.clear();
			catched.right.clear();
			for (var i = 0; i < touchesStart.length; ++i) {
				var finger = touchesStart[i],
					point = getPointOnCanvas(canvas, finger.pageX, finger.pageY);
				touchHold.set(finger.identifier, point);
				findHit(catched, point, thisTime);
			}
			mixer();
			for (var id of catched.down) {
				if (noteDown[id].status == "Untouched") {
					var thisNote = noteDown[id];
					switch (thisNote.m_type){
						case "NORMAL":
							if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.p) {
								hitAnime(thisNote, 0, "Perfect");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.pr) {
								hitAnime(thisNote, 0, "Pr");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.gr) {
								hitAnime(thisNote, 0, "Great");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.g) {
								hitAnime(thisNote, 0, "Good");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.m) {
								missHoldFindD[id] = true;
								hitAnime(thisNote, 0, "Miss");
							}
							break;
						case "HOLD":
							if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.p) {
								holdCheckD.set(id, thisTime);
								hitAnime(thisNote, 0, "Perfect");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.pr) {
								holdCheckD.set(id, thisTime);
								hitAnime(thisNote, 0, "Pr");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.gr) {
								holdCheckD.set(id, thisTime);
								hitAnime(thisNote, 0, "Great");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.g) {
								holdCheckD.set(id, thisTime);
								hitAnime(thisNote, 0, "Good");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.m) {
								//missHoldD.set(id, true);
								hitAnime(thisNote, 0, "Miss");
								hitAnime(noteDown[thisNote.m_subId], 0, "Miss", true);
							}
							break;
						default:
							break;
					}
				}
			}
			for (var id of catched.left) {
				if (noteLeft[id].status == "Untouched") {
					var thisNote = noteLeft[id];
					switch (thisNote.m_type){
						case "NORMAL":
							if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.p) {
								hitAnime(thisNote, 1, "Perfect");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.pr) {
								hitAnime(thisNote, 1, "Pr");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.gr) {
								hitAnime(thisNote, 1, "Great");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.g) {
								hitAnime(thisNote, 1, "Good");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.m) {
								missHoldFindL[id] = true;
								hitAnime(thisNote, 1, "Miss");
							}
							break;
						case "HOLD":
							if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.p) {
								holdCheckL.set(id, thisTime);
								hitAnime(thisNote, 1, "Perfect");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.pr) {
								holdCheckL.set(id, thisTime);
								hitAnime(thisNote, 1, "Pr");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.gr) {
								holdCheckL.set(id, thisTime);
								hitAnime(thisNote, 1, "Great");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.g) {
								holdCheckL.set(id, thisTime);
								hitAnime(thisNote, 1, "Good");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.m) {
								//missHoldD.set(id, true);
								hitAnime(thisNote, 1, "Miss");
								hitAnime(noteLeft[thisNote.m_subId], 1, "Miss", true);
							}
							break;
						default:
							break;
					}
				}
			}
			for (var id of catched.right) {
				if (noteRight[id].status == "Untouched") {
					var thisNote = noteRight[id];
					switch (thisNote.m_type){
						case "NORMAL":
							if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.p) {
								hitAnime(thisNote, 2, "Perfect");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.pr) {
								hitAnime(thisNote, 2, "Pr");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.gr) {
								hitAnime(thisNote, 2, "Great");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.g) {
								hitAnime(thisNote, 2, "Good");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.m) {
								missHoldFindR[id] = true;
								hitAnime(thisNote, 2, "Miss");
							}
							break;
						case "HOLD":
							if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.p) {
								holdCheckR.set(id, thisTime);
								hitAnime(thisNote, 2, "Perfect");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.pr) {
								holdCheckR.set(id, thisTime);
								hitAnime(thisNote, 2, "Pr");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.gr) {
								holdCheckR.set(id, thisTime);
								hitAnime(thisNote, 2, "Great");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.g) {
								holdCheckR.set(id, thisTime);
								hitAnime(thisNote, 2, "Good");
							}
							else if (Math.abs(thisNote.m_time*(60/barpm) - thisTime) <= judge.m) {
								//missHoldD.set(id, true);
								hitAnime(thisNote, 2, "Miss");
								hitAnime(noteRight[thisNote.m_subId], 2, "Miss", true);
							}
							break;
						default:
							break;
					}
				}
			}
		}
		if (scene) scene.down(getPointOnCanvas(canvas, touchesStart[0].pageX, touchesStart[0].pageY));
	},false);
			
	canvas.addEventListener('touchmove', function(event) {
		touchesMove = event.changedTouches;
		if (scene && scene.isPlaying) {
			var thisTime = musicCtrl.currentTime + offsetSec;
			// event.preventDefault();
			for (var i = 0; i < touchesMove.length; ++i) {
				var finger = touchesMove[i],
					point = getPointOnCanvas(canvas, finger.pageX, finger.pageY);
				touchHold.set(finger.identifier, point);
			}
			mixer();
		}
		if (scene) scene.move(getPointOnCanvas(canvas, touchesMove[0].pageX, touchesMove[0].pageY));
	}, false);
	canvas.addEventListener('touchend', function(event) {
		touchesEnd = event.changedTouches;
		if (scene && scene.isPlaying) {
			var thisTime = musicCtrl.currentTime + offsetSec;
			// event.preventDefault();
			for (var i = 0; i < touchesEnd.length; ++i) {
				var finger = touchesEnd[i];
				touchHold.delete(finger.identifier);
			}
			mixer();
		}
		if (scene) scene.up(getPointOnCanvas(canvas, touchesEnd[0].pageX, touchesEnd[0].pageY));
	}, false);
	canvas.addEventListener('touchcancel', function(event) {
		touchesCancel = event.changedTouches;
		// event.preventDefault();
		if (scene && scene.isPlaying) {
			for (var i = 0; i < touchesCancel.length; ++i) {
				var finger = touchesCancel[i];
				touchHold.delete(finger.identifier);
			}
			mixer();
		}
		if (scene) scene.up(getPointOnCanvas(canvas, touchesEnd[0].pageX, touchesEnd[0].pageY));
	}, false);
}

function touchRefresh(thisTime) {
	if (!isMobile || !playSettings.smartCalculation) {
		return;
	}
	var d = noteDown.length,
		l = noteLeft.length,
		r = noteRight.length;
	for (; catchStartD != d; ++catchStartD) {
		if (noteDown[catchStartD].m_time*(60/barpm) >= thisTime - judge.g) {
			break;
		}
	}
	if (catchStartD == d) {
		--catchStartD;
	}
	if (catchEndD == -1) {
		catchEndD = 0;
	}
	for (; catchEndD != d && noteDown[catchEndD].m_time*(60/barpm) <= thisTime + judge.m; ++catchEndD) {
		if (noteDown[catchEndD].m_time*(60/barpm) > thisTime + judge.m) {
			break;
		}
	}
//	--catchEndD;
	
	for (; catchStartL != l; ++catchStartL) {
		if (noteLeft[catchStartL].m_time*(60/barpm) >= thisTime - judge.g) {
			break;
		}
	}
	if (catchStartL == l) {
		--catchStartL;
	}
	if (catchEndL == -1) {
		catchEndL = 0;
	}
	for (; catchEndL != l && noteLeft[catchEndL].m_time*(60/barpm) <= thisTime + judge.m; ++catchEndL) {
		if (noteLeft[catchEndL].m_time*(60/barpm) > thisTime + judge.m) {
			break;
		}
	}
//	--catchEndL;
	
	for (; catchStartR != r; ++catchStartR) {
		if (noteRight[catchStartR].m_time*(60/barpm) >= thisTime - judge.g) {
			break;
		}
	}
	if (catchStartR == r) {
		--catchStartR;
	}
	if (catchEndR == -1) {
		catchEndR = 0;
	}
	for (; catchEndR != r && noteRight[catchEndR].m_time*(60/barpm) <= thisTime + judge.m; ++catchEndR) {
		if (noteRight[catchEndR].m_time*(60/barpm) > thisTime + judge.m) {
			break;
		}
	}
//	--catchEndR;
	
	
}

function showTouch() {
	
//	ctx.fillStyle = "#FFF";
//	ctx.fillText(catchStartD + "-" + catchEndD, 960, 35);
//	ctx.fillText(catchStartL + "-" + catchEndL, 560, 35);
//	ctx.fillText(catchStartR + "-" + catchEndR, 1360, 35);
//	ctx.fillStyle = "#DDD";
//	ctx.font = '20px Dynamix';
//	for (var i = 0; i < touchesStart.length; ++i) {
//		ctx.fillText(Math.round(getPointOnCanvas(canvas, touchesStart[i].pageX, touchesStart[i].pageY).x), 200, 100+i*40);
//		ctx.fillText(Math.round(getPointOnCanvas(canvas, touchesStart[i].pageX, touchesStart[i].pageY).y), 250, 100+i*40);
//		ctx.fillText(touchesStart[i].identifier, 350, 100+i*40);
//	}
//	for (var i = 0; i < touchesMove.length; ++i) {
//		ctx.fillText(Math.round(getPointOnCanvas(canvas, touchesMove[i].pageX, touchesMove[i].pageY).x), 500, 100+i*40);
//		ctx.fillText(Math.round(getPointOnCanvas(canvas, touchesMove[i].pageX, touchesMove[i].pageY).y), 550, 100+i*40);
//		ctx.fillText(touchesMove[i].identifier, 650, 100+i*40);
//	}
//	for (var i = 0; i < touchesEnd.length; ++i) {
//		ctx.fillText(Math.round(getPointOnCanvas(canvas, touchesEnd[i].pageX, touchesEnd[i].pageY).x), 800, 100+i*40);
//		ctx.fillText(Math.round(getPointOnCanvas(canvas, touchesEnd[i].pageX, touchesEnd[i].pageY).y), 850, 100+i*40);
//		ctx.fillText(touchesEnd[i].identifier, 950, 100+i*40);
//	}
//	for (var i = 0; i < changedTouches.length; ++i) {
//		ctx.fillText(Math.round(getPointOnCanvas(canvas, changedTouches[i].pageX, changedTouches[i].pageY).x), 1100, 100+i*40);
//		ctx.fillText(Math.round(getPointOnCanvas(canvas, changedTouches[i].pageX, changedTouches[i].pageY).y), 1150, 100+i*40);
//		ctx.fillText(changedTouches[i].identifier, 1250, 100+i*40);
//	}
//	touchesStart = [];
//	touchesMove = [];
//	touchesEnd = [];
//	changedTouches = [];
}
