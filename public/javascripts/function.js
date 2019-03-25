//functions in v1.3
var de;
function dataToResult(data) {
	return {
		score: Math.round((data.perfectHit + data.prHit + data.greatHit*0.8 + data.goodHit*0.4)/totalNote*1000000),
		tp: Math.round((data.perfectHit + data.prHit*0.5)/totalNote*10000)/100
	}
}

function Queue(maxSize) {
	this.maxSize = maxSize;
	this.count = 0;
	this.data = [];
	this.head = 0;
	this.tail = 0;
}
Queue.prototype = {
	clear: function() {
		this.count = 0;
		this.data = [];
		this.head = 0;
		this.tail = 0;
	},
	full: function() {
		return this.count == this.maxSize;
	},
	push: function(data) {
		if (this.full()) {
			this.pop();
		}
		this.data[this.tail] = data;
		this.tail = (this.tail + 1)%this.maxSize;
		this.count++;
	},
	pop: function() {
		if (this.count == 0) {
			console.log(this);
			throw"111";
		}
		else {
			var returnData = this.data[this.head];
			delete this.data[this.head];
			this.head = (this.head + 1)%this.maxSize;
			this.count--;
			return returnData;
		}
	},
	show: function() {
		return this.data;
	}
}

function getViewportSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
}

function isValidTouch(f, side) {
	switch (side) {
		case 0:
			return between(f.y, ud*1.7, 1060);
			break;
		case 1:
			return between(f.x, 20, 320);
			break;
		case 2:
			return between(f.x, 1600, 1900);
			break;
	}	
}

function restart() {
	if (isMobile) {
		performanceList = [];
		if (playSettings.mirror && !playSettings.mirrored) {
			for (var n of noteDown) {
				if (n) {
					n.m_position = 5 - n.m_position;
				}
			}
			var t = $.extend(true, [], noteLeft);
			noteLeft = $.extend(true, [], noteRight);
			noteRight = $.extend(true, [], t);
			t = isMixerL;
			isMixerL = isMixerR;
			isMixerR = t;
			playSettings.mirrored = true;
		}
		deeMode = playSettings.twist;
		prHit = 0;
		greatHit = 0;
		goodHit = 0;
		missHit = 0;
		for (var note of noteDown) {
			if (note) {
				note.status = "Untouched";
			}
		}
		for (var note of noteLeft) {
			if (note) {
				note.status = "Untouched";
			}
		}
		for (var note of noteRight) {
			if (note) {
				note.status = "Untouched";
			}
		}
		touchesStart = [],
		touchesMove = [],
		touchesEnd = [],
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
		catchEndD = 0;
		catchStartL = 0,
		catchEndL = 0;
		catchStartR = 0,
		catchEndR = 0;
		if (! playSettings.smartCalculation) {
			console.log(1);
			catchStartD = 0,
			catchEndD = noteDown.length - 1,
			catchStartL = 0,
			catchEndL = noteLeft.length - 1,
			catchStartR = 0,
			catchEndR = noteRight.length - 1;
		}
		catched = {
			down: new Set(),
			left: new Set(),
			right: new Set()
		};
	}
	barTargetL = windowHeight/2;
	barTargetR = windowHeight/2;
	perfectHit = 0;
	combo = 0;
	maxCombo = 0;
	resetAnime();
	lr = -40;
	ud = -50; 
	pauseShadowH = -180;
	noteTemp = [];
	mainMouse.condition = 0;
	mainMouse.movement = "choose";
	showStart = 60;
	thisTime = 0;
	setTime(0, true);
	resetCS();
	clearHit(true);
	musicCtrl.goplay();
}


function getJudge(b, h) {
	var j = calculateJudge(b, h);
	j.gr = (j.p + j.g)/2;
	j.pr = j.p;
	j.p/=2;
	return j;
}
function calculateJudge(b, h) {
	if (b >= 160) {
		switch (h) {
			case "CASUAL":
				return {p:0.094, g:0.188, m:0.234};
			case "NORMAL":
				return {p:0.059, g:0.188, m:0.234};
			default:
				return {p:0.059, g:0.152, m:0.234};
		}
	}
	if (b <= 120) {
		switch (h) {
			case "CASUAL":
				return {p:0.125, g:0.250, m:0.313};
			case "NORMAL":
				return {p:0.078, g:0.250, m:0.313};
			default:
				return {p:0.078, g:0.303, m:0.313};
		}
	}
	var x = 60/(b/4)/16*1000;
	switch (h) {
		case "CASUAL":
			return {p:x*0.001, g:2*x*0.001, m:2.5*x*0.001};
		case "NORMAL":
			return {p:0.625*x*0.001, g:2*x*0.001, m:2.5*x*0.001};
		default:
			return {p:0.625*x*0.001, g:1.625*x*0.001, m:2.5*x*0.001};
	}
}
function changeOffsetSec(os) {
	/*
	 ob = os * barpm * 60;
	 */
	offsetSec = os;
	return offsetBar = offsetSec*(barpm/60);
}
function changeOffsetBar(ob) {
	/*
	 os = ob / barpm / 60;
	 */
	offsetBar = ob;
	return offsetSec = offsetBar/(barpm/60);
}

function up2(p) {
	return 1 - Math.pow(1 - p, 2);
}

function countNote() {
	var note = 0;
	for (var i = 0; i < noteDown.length; ++i) {
		if (noteDown[i]) note++;
	}
	for (var i = 0; i < noteLeft.length; ++i) {
		if (noteLeft[i]) note++;
	}
	for (var i = 0; i < noteRight.length; ++i) {
		if (noteRight[i]) note++;
	}
	return note;
}

function clearHit(only) {
	var thisTime = musicCtrl.currentTime + offsetSec;
	noteDownHit = [];
	noteLeftHit = [];
	noteRightHit = [];
	if (! only) {
		for (var i = 0; i < noteDown.length; ++i) {
			noteDownHit[i] = noteDown[i] && noteDown[i].m_time*(spu) < thisTime;
		}
		for (var i = 0; i < noteLeft.length; ++i) {
			noteLeftHit[i] = noteLeft[i] && noteLeft[i].m_time*(spu) < thisTime;
		}
		for (var i = 0; i < noteRight.length; ++i) {
			noteRightHit[i] = noteRight[i] && noteRight[i].m_time*(spu) < thisTime;
		}
	}
}

function setTime(time, now) {
	if (musicCtrl) {
		if (now || !musicCtrl.paused) {
			musicCtrl.currentTime = musicCtrl.animeTime = time;
		}
		else {
			musicCtrl.animeTime = time;
		}
		if (! musicCtrl.paused) {
			if (showCS && musicCtrl.ended) {
				restart();
			}
			else {
				clearHit();
			}
		}
	}
	showCS = false;
}

function resetCS() {
	showCS = true;
	combo = 0;
	totalNote = countNote();
	score = 0;
	preScore = 0;
	hitDouble = 0;
	hitThisFrame2 = 0;
	clearHit();
}

function drawNumber(nb, align, rate, x, y, len) {
	var str = String(nb), width = 154*rate, height = 176*rate, wx, wy = y - height/2;
	if (len) {
		while (str.length < len) {
			str = "0" + str;
		}
	}
	for (var i = 0; i < str.length; ++i) {
		switch (align) {
			case "left":
				wx = x + (-str.length + i - 1)*width*0.85;
				break;
			case "right":
				wx = x + i*width*0.85;
				break;
			case "center":
				wx = x + (-str.length/2 + i - 1)*width*0.85;
				break;
		}
		ctx.drawImage(numberCanvas, str[i]*154, 0, 154, 176, wx, wy, width, height);
	}
}

function drawMiddleImage(target, sx, sy, sw, sh, x, y, rate) {
	var rate = rate || 1;
	var w = sw*rate;
	var h = sh*rate;
	x = x - w/2;
	y = y - h/2;
	ctx.drawImage(target, sx, sy, sw, sh, x, y, w, h);
}

function getNote(id, side) {
	switch (side) {
		case 0:
			return noteDown[id];
			break;
		case 1:
			return noteLeft[id];
			break;
		case 2:
			return noteRight[id];
			break;
		default:
			return undefined;
			break;
	}
}

function undo() {
	var thing = didList[didListPlace];
	if (thing) {
		switch (thing[0]) {
			case "del":
				switch (thing[1]) {
					case 0:
						for (var id = 0; noteDown[id]; ++id);
						break;
					case 1:
						for (var id = 0; noteLeft[id]; ++id);
						break;
					case 2:
						for (var id = 0; noteRight[id]; ++id);
						break;
				}
				addNoteById(id, thing[1], thing[2], 1);
				break;
			
			case "add":
				delNoteById(thing[2].m_id, thing[1], 1);
				break;
		}
		didListPlace--;
		if (thing[2].m_type == "SUB") {
			undo();
		}
	}
}

function redo() {
	var thing = didList[didListPlace + 1];
	if (thing) {
		didListPlace++;
		switch (thing[0]) {
			case "add":
				switch (thing[1]) {
					case 0:
						for (var id = 0; noteDown[id]; ++id);
						break;
					case 1:
						for (var id = 0; noteLeft[id]; ++id);
						break;
					case 2:
						for (var id = 0; noteRight[id]; ++id);
						break;
				}
				addNoteById(id, thing[1], thing[2], 1);
				break;
			
			case "del":
				delNoteById(thing[2].m_id, thing[1], 1);
				break;
		}
		if (thing[2].m_type == "HOLD") {
			redo();
		}
	}
}

function equal(a, b) {
	return Math.abs(a - b) < 0.000001;
}

function approximateFraction(f, maxDen) {
	var minError = f;
	var outF;
	var outNum = 1, outDen = 1, newNum, newDen;
	for (var den = 1; den <= maxDen; ++den) {
		if (outF = Math.abs(Math.round(f*den)/den - f), outF < minError) {
			minError = outF;
			newNum = Math.abs(Math.round(f*den));
			newDen = den;
			if (newNum * outDen != newDen * outNum) {
				outNum = newNum;
				outDen = newDen;
			}
			if (minError == 0) break;
		}
	}
	return ({num : outNum, den : outDen});
}

function changeSide() {
	noteChosen = [];
	noteChosenList = [];
	switch (editSide)  {
		case 1:
			if (CMap.m_leftRegion == "MIXER") {
				if (mainMouse.movement == "writeHold" || mainMouse.movement == "writeNormal") {
					mainMouse.movement = "writeChain";
					resetEdit();
				}
			}
			else {
				if (mainMouse.movement == "writeChain") {
					mainMouse.movement = "writeNormal";
					resetEdit();
				}
			}
			break;
		case 2:
			if (CMap.m_rightRegion == "MIXER") {
				if (mainMouse.movement == "writeHold" || mainMouse.movement == "writeNormal") {
					mainMouse.movement = "writeChain";
					resetEdit();
				}
			}
			else {
				if (mainMouse.movement == "writeChain") {
					mainMouse.movement = "writeNormal";
					resetEdit();
				}
			}
			break;
		
		default:
			break;
	}
}

function isEmptyObject(obj){
	for(var key in obj){
		return false;
	};
 	return true;
};

function timeSorter(x, y) {
	return x.m_time - y.m_time;
}
function standardize(noteList, adjust) {
	var index, s, ss;
	index = 1;
	s = [];
	ss = $.extend(true, [], noteList);
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			if (adjust) {
				ss[i].m_position = Math.round((Number(ss[i].m_position) - ss[i].m_width/2) * 1000000)/1000000;
			}
			if (ss[i].m_type == "HOLD") {
				ss[i].t = index;
				ss[ss[i].m_subId].t = index;
				index++;
			}
		}
	}
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			s.push(ss[i]);
		}
	}
	s.sort(timeSorter);
	for (var i = 0; i < s.length; ++i) {
		s[i].m_id = i;
		s[i].m_subId = Number(s[i].m_subId);
		s[i].m_time = Number(s[i].m_time);
		s[i].m_width = Number(s[i].m_width);
		if (s[i].m_type == "HOLD") {
			for (var j = 0; j < s.length; ++j) {
				if (s[j].m_type == "SUB" && s[j].t && s[i].t == s[j].t && i != j) {
					delete s[i].t;
					delete s[j].t;
					s[i].m_subId = j;
					break;
				}
			}
		}
	}
	return $.extend(true, [], s);
}

function save() {
	var t = $.extend(true, [], noteDown);
	t = standardize(t, true);
	CMap.m_notes = {};
	CMap.m_notes.m_notes = {};
	CMap.m_notes.m_notes.CMapNoteAsset = $.extend(true, [], t);

	var t = $.extend(true, [], noteLeft);
	t = standardize(t, true);
	CMap.m_notesLeft = {};
	CMap.m_notesLeft.m_notes = {};
	CMap.m_notesLeft.m_notes.CMapNoteAsset = $.extend(true, [], t);

	var t = $.extend(true, [], noteRight);
	t = standardize(t, true);
	CMap.m_notesRight = {};
	CMap.m_notesRight.m_notes = {};
	CMap.m_notesRight.m_notes.CMapNoteAsset = $.extend(true, [], t);

	CMap.m_timeOffset = offsetBar;
	CMap.m_barPerMin = barpm; //shiftList[0].bar;


	var xotree = new XML.ObjTree();
	var CCMap = {"CMap":CMap};
	var jsonText = JSON.stringify(CCMap);
	var xmlText = xotree.writeXML(CCMap);
	var BB = new Blob([xmlText], {type:"application/xml"});
	upload(jsonText);
	saveAs(BB, CMap.m_mapID + " " + getNowFormatDate() + ".xml");
}

function saveAsMinimal() {
	var remix = {
		isMinimal: true
	};
	if (bg) {
		var dataurl = bgCanvas.toDataURL('image/png');
		remix.bg = dataurl;
	}
	else {
		remix.bg = null;
	}
	var reader = new FileReader();
	reader.readAsDataURL(musicFileCtrl, "UTF-8");
	reader.onload = function(e) {
		remix.music = e.target.result;
		var CCMap = {
			"CMap": CMap,
			"remix": remix
		}
		var jsonText = JSON.stringify(CCMap);
		var BB = new Blob([jsonText], {type:"application/json"});
		//upload(jsonText);
		saveAs(BB, CMap.m_mapID + " " + getNowFormatDate() + ".dy");
	}
}

function saveAsDynaMaker() {
	var remix = {};
	if (bg) {
		var dataurl = bgCanvas.toDataURL('image/png');
		remix.bg = dataurl;
	}
	else {
		remix.bg = null;
	}
	var reader = new FileReader();
	reader.readAsDataURL(musicFileCtrl, "UTF-8");
	reader.onload = function(e) {
		remix.music = e.target.result;
		var CCMap = {
			"CMap": CMap,
			"remix": remix
		}
		var jsonText = JSON.stringify(CCMap);
		var BB = new Blob([jsonText], {type:"application/json"});
		//upload(jsonText);
		saveAs(BB, CMap.m_mapID + " " + getNowFormatDate() + ".dy");
	}
}


var encodeFormData = function(data) {  
    var pairs = [];  
    var regexp = /%20/g;  
  
    for (var name in data) {  
	    var value = data[name].toString();  
	    var pair = encodeURIComponent(name).replace(regexp, "+") + "=" +  
	        encodeURIComponent(value).replace(regexp, "+");  
	    pairs.push(pair);  
    }  
    return pairs.join("&");
};  

function upload(mapdata) {
	var xhr = new XMLHttpRequest();
	var data = encodeFormData({
		authorname : "omegaPi",
		authorpassword : "Ilovegame233",
		type : "jsonmap",
		name : CMap.m_path,
		difficulty : hardship,
		mapdata : mapdata
	});
	xhr.open("POST","http://localhost:3000/upload",true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');  
	xhr.onreadystatechange=function() {
		if (xhr.readyState==4 && xhr.status==200 || xhr.status==304) {
			alert("Share Key: " + xhr.responseText.shareKey);
		}
	}
	xhr.send(data);
}

function saveAs(xblob, filename) {
	var xurl = URL.createObjectURL(xblob);
	var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	save_link.href = xurl;
	save_link.download = filename;
	
	var xevent = document.createEvent("MouseEvents");
	xevent.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	save_link.dispatchEvent(xevent);
	URL.revokeObjectURL(xurl);
}

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			+ " " + date.getHours() + seperator2 + date.getMinutes()
			+ seperator2 + date.getSeconds();
	return currentdate;
}

function resetAnime() {
//	noteDownHit = [];
//	noteLeftHit = [];
//	noteRightHit = [];
}

function resetEdit(condition) {
	mainMouse.condition = condition || 0;
	noteTemp = [];
	noteChosen = [];
	noteChosenList = [];
	movingId = false;
}

function mtow(m, side) {
	if (side == 0) {
		return 300*m - 30;
	}
	else {
		return (300*m - 30)*12/25;
	}
}

function mtox(m, side) {
	if (side == 0) {
		return 210 + Number(m)*300;
	}
	else {
		return windowHeight - 165 - Number(m)*150;
	}
}

function xtom(x, side) {
	if (side == 0) {
		return (x - 210)/300;
	}
	else {
		return - (x - windowHeight + 165)/150;
	}
}

function between(x, a, b) {
	if (a > b) {
		var temp = a;
		a = b;
		b = temp;
	}
	return a <= x && x <= b;
}
function jb(x, a, b) {
	if (a > b) {
		var temp = a;
		a = b;
		b = temp;
	}
	if (x < a) {
		return a;
	}
	else if (x > b) {
		return b;
	}
	else {
		return x;
	}
}

function delNoteById(id, side, noRecord) {
	if (! noRecord) {
		didListPlace++;
		didList[didListPlace] = [];
		didList[didListPlace][0] = "del";
		didList[didListPlace][1] = side;
	}
	switch (side) {
		case 0:
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteDown[id]);
			noteDown[id] = undefined;
			break;
		
		case 1:
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteLeft[id]);
			noteLeft[id] = undefined;
			break;
			
		case 2:
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteRight[id]);
			noteRight[id] = undefined;
			break;
	}
	if (! noRecord)
		didList.length = didListPlace + 1;
	showCS = false;
}

function addNoteById(id, side, note, noRecord) {
	if (! noRecord) {
		didListPlace++;
		didList[didListPlace] = [];
		didList[didListPlace][0] = "add";
		didList[didListPlace][1] = side;
	}
	switch (side) {
		case 0:
			noteDown[id] = $.extend(true, {}, note);
			noteDown[id].m_id = id;
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteDown[id]);
			break;
	
		case 1:  
			noteLeft[id] = $.extend(true, {}, note);
			noteLeft[id].m_id = id;
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteLeft[id]);
			break;
		
		case 2:
			noteRight[id] = $.extend(true, {}, note);
			noteRight[id].m_id = id;
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteRight[id]);
			break
	}
	if (! noRecord)
		didList.length = didListPlace + 1;
	showCS = false;	
}

function imgLoad(img, callback) {
	var timer = setInterval(function() {
		if (img && img.complete) {
			clearInterval(timer);
			loaded++;
			callback(img);
		}
	}, 50);
}

function extraImgLoad(img, callback) {
	var timer = setInterval(function() {
		if (img && img.complete) {
			clearInterval(timer);
			callback(img);
		}
	}, 50);
}


function addEvent(obj,xEvent,fn) {
    if (obj.attachEvent) {
      obj.attachEvent('on' + xEvent,fn);
    }
    else {
      obj.addEventListener(xEvent, fn, false);
    }
}

function fullScreen() {
	var docElm = document.documentElement;
	if (docElm.requestFullscreen) { 
	  docElm.requestFullscreen(); 
	}

	//FireFox 
	else if (docElm.mozRequestFullScreen) { 
	  docElm.mozRequestFullScreen(); 
	}
	
	//Chrome
	else if (docElm.webkitRequestFullScreen) { 
	  docElm.webkitRequestFullScreen(); 
	}
	
	//IE11
	else if (elem.msRequestFullscreen) {
	 elem.msRequestFullscreen();
	}
	isFullScreen = true;
	canvas.style = " height: 100%;width: 100%;margin: 0;padding: 0;display: block;";
}

function unFullScreen() {
	if (document.exitFullscreen) { 
		document.exitFullscreen(); 
	} 
	else if (document.mozCancelFullScreen) { 
		document.mozCancelFullScreen(); 
	} 
	else if (document.webkitCancelFullScreen) { 
		document.webkitCancelFullScreen(); 
	} 
	else if (document.msExitFullscreen) {
		document.msExitFullscreen(); 
	} 
	isFullScreen = false;
	canvas.style = defaultCanvasStyle;
}

function getBrowser() {
	var userAgent = navigator.userAgent;
	var isOpera = userAgent.indexOf("Opera") > -1;
	if (isOpera) {
		return "Opera";
	}
	if (userAgent.indexOf("Firefox") > -1) {
		return "Firefox";
	}
	if (userAgent.indexOf("Edge") > -1) {
		return "Edge";
	} 
	if (userAgent.indexOf("Chrome") > -1){
		return "Chrome";
	}
	if (userAgent.indexOf("Safari") > -1) {
		return "Safari";
	}
	if (userAgent.indexOf("compatible") > -1 || userAgent.indexOf("MSIE") > -1) {
		return "IE";
    }
	return "IE";
}

function getPointOnCanvas(c, x, y) {
    var box = c.getBoundingClientRect();
    if (isMobile) {
	    return {
	    			x: x/viewCoef,
	    			y: (y - viewTop)/viewCoef
				};
    }
    else if (isFullScreen) {
	    return {
	    			x: x*windowWidth/window.screen.width,
	    			y: y*windowHeight/window.screen.height
				};
    	
    }
    else {
	    return {
	    			x: x - box.left*(c.width/box.width),
	    			y: y - box.top *(c.height/box.height)
				};
    }
}

function inArea(coordinate, x, y, w, h) {
	return coordinate.x >= x && coordinate.x <= x + w && coordinate.y >= y && coordinate.y <= y + h;
}

function rgba(red, green, blue, alpha) {
	return "rgba(" + red + ","+ green + ","+ blue + ","+ alpha + ")";
}

function rgb(red, green, blue) {
	return "rgb(" + red + ","+ green + ","+ blue + ")";
}

function drawRect(c, color, x, y, w, h) {
	c.fillStyle = color;
	c.fillRect(x, y, w, h);
}

function drawJBox(c, x, y, w, h, x1, y1, x2, y2, color1, color2) {
	c.beginPath();
	var grad = c.createLinearGradient(x1, y1, x2, y2);
	grad.addColorStop(0, color1);
	grad.addColorStop(1, color2);
	c.fillStyle = grad;
	c.fillRect(x, y, w, h);
}

function drawBox(c, x, y, w, h, alpha, lw) {
	canvas.globalAlpha = alpha;
	c.fillStyle = rgba(0, 0, 0, 0.8);
	c.fillRect(x, y, w, h);
	drawJBox(c, x, y, w, lw, x + lw/2, y, x + lw/2, y + lw, "#0FF", rgba(0, 255, 255, 0.0));
	drawJBox(c, x, y + h - lw, w, lw, x + lw/2, y + h - lw, x + lw/2, y + h, rgba(0, 255, 255, 0.0), "#0FF");
	drawJBox(c, x, y, lw, h, x, y + h/2, x + lw, y + h/2, "#0FF", rgba(0, 255, 255, 0.0));
	drawJBox(c, x + w - lw, y, lw, h, x + w - lw, y + h/2, x + w, y + h/2, rgba(0, 255, 255, 0.0), "#0FF");
	canvas.globalAlpha = 1;
}

//function drawNumber(c, lr, num, size, type, x, y) {
//	var nw = 42;
//	var nh = 40;
//	t = num + "";
//	for (var i = 0; i < t.length; ++i) {
////		c.drawImage(charCanvas[0], 8 + t[i]*nw, 217 + nw*type, nw, nh, x + (i*lr*t.length) + (i - lr*t.length)*(nw - 5), y, nw, nh)
////		c.drawImage(charCanvas[1], 2*(8 + t[i]*nw), 2*(217.5 + nw*type), 2*nw, 2*nh, x + (i - lr*t.length)*(2*nw - 10), y, 2*nw, 2*nh);
//		c.drawImage(charCanvas, 4*(8 + t[i]*nw), 4*(217.5 + nw*type), 4*nw, 4*nh, x + (i - lr*t.length)*(4*nw - 20), y, 4*nw, 4*nh);
//	}
//}

function drawLevel(c, size, type, x, y) {
	var rate = [1, 2, 4][size];
	var w = [159, 186, 114, 156, 262][type]*rate;
	//c.fillStyle = ["#ccc", "#8ff", "#f0f", "#f80", "#srcW/28"][type];
	//c.fillRect(x, y, w, 39*rate);
	c.fillStyle = "#000";
	c.drawImage(charCanvas[size], 8*rate, (42*type + 6)*rate, w, 39*rate, x, y, w, 39*rate);
}
function drawSingleNote(c, place, swidth, x, height, shadow) {
	var side = (place == 0 ? ud : lr);
	//height >= -hideHeight - (side - hideHeight)/hide
	if (height < -hideHeight) {
		height = -hideHeight - (-height - hideHeight)*hide;
		ctx.globalAlpha = jb(1 - (-height - hideHeight)/(side - hideHeight), 0, 1);
	}
	if (playSettings.simpleNote) {
		if (! deeMode && gradual) {
			if (height + lr + gradualPx >= windowHeight/2) {
				c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
			}
		}
		c.strokeStyle = "rgba(128, 255, 255, 1)";
		c.lineWidth = 5;
		c.fillStyle = "rgba(0,255,255,1)";
		switch (place) {
			case 0 :
				c.fillRect(x - swidth/2, windowHeight - ud - (height + 7), swidth, 15);
				c.strokeRect(x - swidth/2, windowHeight - ud - (height + 7), swidth, 15);
				break;
			case 1 :
				c.fillRect(lr + (height - 7), x - swidth/2, 15, swidth);
				c.strokeRect(lr + (height - 7), x - swidth/2, 15, swidth);
				break;
			case 2 :
				c.fillRect(windowWidth - lr - (height + 7), x - swidth/2, 15, swidth);
				c.strokeRect(windowWidth - lr - (height + 7), x - swidth/2, 15, swidth);
				break;
		}
		if (height < -side/2) {
			ctx.globalAlpha = 1;
		}
		return;
	}
	if (swidth <= 40) {
		var width = 40;
	}
	else {
		var width = swidth + 10;
	}
	var l = 22;
	var cy = 23;
	var core = 1;
	var srcW = 45;
	var srcH = 28;
	var bldL = 0;
	var bldR = 0;
	switch (place) {
		case 0:
			var startX = windowHeight - ud - (height + srcH/2);
			if (width >= core + 2*l) {
				c.drawImage(normalNoteCanvasD, srcW/2 - core/2, 0, core, srcH, x - core/2, startX, core, srcH); //mid=srcW/2,
				c.drawImage(normalNoteCanvasD, cy, 0, 1, srcH, x - width/2 + l, startX, width/2 - core/2 - l, srcH); // l
				c.drawImage(normalNoteCanvasD, cy, 0, 1, srcH, x + core/2, startX, width/2 - core/2 - l, srcH); // r
				c.drawImage(normalNoteCanvasD, bldL, 0, l, srcH, x - width/2, startX, l, srcH);// l
				c.drawImage(normalNoteCanvasD, srcW - bldR - l, 0, l, srcH, x + width/2 - l, startX, l, srcH);// r
				
			}
			else if (width > core) {
				width -= 12;
				c.drawImage(normalNoteCanvasD, srcW/2 - core/2, 0, core, srcH, x - core/2, startX, core, srcH); //mid=srcW/2
				c.drawImage(normalNoteCanvasD, cy, 0, 1, srcH, x - width/2 , startX, width/2 - core/2, srcH); // l
				c.drawImage(normalNoteCanvasD, cy, 0, 1, srcH, x + core/2, startX, width/2 - core/2, srcH); // r
			}
			else {
				width -= 12;
				c.drawImage(normalNoteCanvasD, srcW/2 - width/2, 0, width, srcH, x - width/2, startX, width, srcH); // corepix srcW/2
			}
			if (shadow != 0 && shadow != undefined) {
				c.fillStyle = rgba(255, 0, 255, Math.pow(shadow,3));
				c.fillRect(x - width*shadow/2, windowHeight - ud - (height + 10), width*shadow, 20);
			}
			break;
			
		case 1:
			if (! deeMode && gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			var startX = lr + height - srcH/2;
			if (width >= core + 2*l) {
				c.drawImage(normalNoteCanvasL, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(normalNoteCanvasL, 0, cy, srcH, 1, startX, x - width/2 + l, srcH, width/2 - core/2 - l); // l
				c.drawImage(normalNoteCanvasL, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2 - l); // r
				c.drawImage(normalNoteCanvasL, 0, bldL, srcH, l, startX, x - width/2, srcH, l);// l			
				c.drawImage(normalNoteCanvasL, 0, srcW - bldR - l, srcH, l, startX, x + width/2 - l, srcH, l);// r
			}
			else if (width > core) {
				width -= 12;
				c.drawImage(normalNoteCanvasL, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(normalNoteCanvasL, 0, cy, srcH, 1, startX, x - width/2, srcH, width/2 - core/2); // l
				c.drawImage(normalNoteCanvasL, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2); // r
			}
			else {
				width -= 12;
				c.drawImage(normalNoteCanvasL, 0, srcW/2 - width/2, srcH, width, startX, x - core/2, srcH, width); // corepix srcW/2
			}
			c.globalAlpha = 1;
			break;
			
		case 2:
			if (! deeMode && gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			var startX = windowWidth - lr - height - srcH/2;
			if (width >= core + 2*l) {
				c.drawImage(normalNoteCanvasR, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(normalNoteCanvasR, 0, cy, srcH, 1, startX, x - width/2 + l, srcH, width/2 - core/2 - l); // l
				c.drawImage(normalNoteCanvasR, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2 - l); // r
				c.drawImage(normalNoteCanvasR, 0, bldL, srcH, l, startX, x - width/2, srcH, l);// l			
				c.drawImage(normalNoteCanvasR, 0, srcW - bldR - l, srcH, l, startX, x + width/2 - l, srcH, l);// r
			}
			else if (width > core) {
				width -= 12;
				c.drawImage(normalNoteCanvasR, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(normalNoteCanvasR, 0, cy, srcH, 1, startX, x - width/2, srcH, width/2 - core/2); // l
				c.drawImage(normalNoteCanvasR, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2); // r
			}
			else {
				width -= 12;
				c.drawImage(normalNoteCanvasR, 0, srcW/2 - width/2, srcH, width, startX, x - core/2, srcH, width); // corepix srcW/2
			}
			c.globalAlpha = 1;
			break;
	}
}

function drawSlideNote(c, place, swidth, x, height, shadow) {
	var side = (place == 0 ? ud : lr);
	if (height < -hideHeight) {
		height = -hideHeight - (-height - hideHeight)*hide;
		ctx.globalAlpha = jb(1 - (-height - hideHeight)/(side - hideHeight), 0, 1);
	}
	if (playSettings.simpleNote) {
		if (! deeMode && gradual) {
			if (height + lr + gradualPx >= windowHeight/2) {
				c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
			}
		}
		c.strokeStyle = "rgba(255, 128, 128, 1)";
		c.lineWidth = 5;
		c.fillStyle = "rgba(255, 32, 32, 1)";
		switch (place) {
			case 0 :
				c.fillRect(x - swidth/2, windowHeight - ud - (height + 7), swidth, 15);
				c.strokeRect(x - swidth/2, windowHeight - ud - (height + 7), swidth, 15);
				break;
			case 1 :
				c.fillRect(lr + (height - 7), x - swidth/2, 15, swidth);
				c.strokeRect(lr + (height - 7), x - swidth/2, 15, swidth);
				break;
			case 2 :
				c.fillRect(windowWidth - lr - (height + 7), x - swidth/2, 15, swidth);
				c.strokeRect(windowWidth - lr - (height + 7), x - swidth/2, 15, swidth);
				break;
		}
		return;
	}
	if (swidth <= 82) {
		var width = 82;
	}
	else {
		var width = swidth + 14;
	}
//	var l = 11;
//	var cy = 30;
//	var core = 72;
//	var srcW = 176;
//	var srcH = 82;
//	var bldL = 7;
//	var bldR = 5;
	var l = 21;
	var cy = 21;
	var core = 80;
	var srcW = 122;
	var srcH = 77;
	var bldL = 0;
	var bldR = 0;
	switch (place) {
		case 0:
			var startX = windowHeight - ud - (height + srcH/2);
//			c.fillRect(x - width/2, windowHeight - ud - (height + 5), width, 10);
			if (width >= core + 2*l) {
				c.drawImage(chainNoteCanvasD, srcW/2 - core/2, 0, core, srcH, x - core/2, startX, core, srcH); //mid=srcW/2,
				c.drawImage(chainNoteCanvasD, cy, 0, 1, srcH, x - width/2 + l, startX, width/2 - core/2 - l, srcH); // l
				c.drawImage(chainNoteCanvasD, cy, 0, 1, srcH, x + core/2, startX, width/2 - core/2 - l, srcH); // r
				c.drawImage(chainNoteCanvasD, bldL, 0, l, srcH, x - width/2, startX, l, srcH);// l
				c.drawImage(chainNoteCanvasD, srcW - bldR - l, 0, l, srcH, x + width/2 - l, startX, l, srcH);// r
				
			}
			else if (width > core) {
				width -= 14;
				c.drawImage(chainNoteCanvasD, srcW/2 - core/2, 0, core, srcH, x - core/2, startX, core, srcH); //mid=srcW/2
				c.drawImage(chainNoteCanvasD, cy, 0, 1, srcH, x - width/2 , startX, width/2 - core/2, srcH); // l
				c.drawImage(chainNoteCanvasD, cy, 0, 1, srcH, x + core/2, startX, width/2 - core/2, srcH); // r
			}
			else {
				width -= 14;
				c.drawImage(chainNoteCanvasD, srcW/2 - width/2, 0, width, srcH, x - width/2, startX, width, srcH); // corepix srcW/2
			}
			break;
			
		case 1:
			if (! deeMode && gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			var startX = lr + height - srcH/2;
			//c.fillRect(lr + (height - 5), x - width/2, 10, width);
			if (width >= core + 2*l) {
				c.drawImage(chainNoteCanvasL, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(chainNoteCanvasL, 0, cy, srcH, 1, startX, x - width/2 + l, srcH, width/2 - core/2 - l); // l
				c.drawImage(chainNoteCanvasL, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2 - l); // r
				c.drawImage(chainNoteCanvasL, 0, bldL, srcH, l, startX, x - width/2, srcH, l);// l			
				c.drawImage(chainNoteCanvasL, 0, srcW - bldR - l, srcH, l, startX, x + width/2 - l, srcH, l);// r
			}
			else if (width > core) {
				width -= 14;
				c.drawImage(chainNoteCanvasL, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(chainNoteCanvasL, 0, cy, srcH, 1, startX, x - width/2, srcH, width/2 - core/2); // l
				c.drawImage(chainNoteCanvasL, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2); // r
			}
			else {
				width -= 14;
				c.drawImage(chainNoteCanvasL, 0, srcW/2 - width/2, srcH, width, startX, x - core/2, srcH, width); // corepix srcW/2
			}
			c.globalAlpha = 1;
			break;
			
		case 2:
			if (! deeMode && gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			var startX = windowWidth - lr - height - srcH/2;
			//c.fillRect(windowWidth - lr - (height + 5), x - width/2, 10, width);
			if (width >= core + 2*l) {
				c.drawImage(chainNoteCanvasR, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(chainNoteCanvasR, 0, cy, srcH, 1, startX, x - width/2 + l, srcH, width/2 - core/2 - l); // l
				c.drawImage(chainNoteCanvasR, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2 - l); // r
				c.drawImage(chainNoteCanvasR, 0, bldL, srcH, l, startX, x - width/2, srcH, l);// l			
				c.drawImage(chainNoteCanvasR, 0, srcW - bldR - l, srcH, l, startX, x + width/2 - l, srcH, l);// r
			}
			else if (width > core) {
				width -= 14;
				c.drawImage(chainNoteCanvasR, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(chainNoteCanvasR, 0, cy, srcH, 1, startX, x - width/2, srcH, width/2 - core/2); // l
				c.drawImage(chainNoteCanvasR, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2); // r
			}
			else {
				width -= 14;
				c.drawImage(chainNoteCanvasR, 0, srcW/2 - width/2, srcH, width, startX, x - core/2, srcH, width); // corepix srcW/2
			}
			c.globalAlpha = 1;
			break;
	}
}

function drawLongNote(c, place, swidth, length, x, height, extra, hitting, salpha) {
	var alpha = salpha || 1;
	var side = (place == 0 ? ud : lr);
	if (height < -hideHeight) {
		var d = (-height - hideHeight)*(1 - hide);
		length = Math.max(0, length - d);
		height = -hideHeight - (-height - hideHeight)*hide;
		alpha *= jb(1 - (-height - hideHeight)/(side - hideHeight), 0, 1);
	}
	if (playSettings.simpleNote) {
		ctx.strokeStyle = "#FF0";
		ctx.lineWidth = 8;
		if (place > 0 && gradual) {
			if (height + lr + gradualPx >= windowHeight/2) {
				alpha *= jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
			}
		}
		switch (place) {
			case 0: 
				if (hitting) {
					c.globalAlpha = alpha*0.4;
					c.fillStyle = "#FF0";
					c.fillRect(x - swidth/2, windowHeight - ud - (height + length), swidth, length);
				}
				c.globalAlpha = alpha*0.6;
				c.fillStyle = rgba(255, 255, 0, 0.7);
				c.fillRect(x - swidth/2, windowHeight - ud - (height + length), swidth, length);
				c.fillStyle = rgba(128, 128, 0, 0.8);
				c.fillRect(x - swidth/2, windowHeight - ud - (height) - 7, swidth, 15);
				c.globalAlpha = alpha;
				c.strokeRect(x - swidth/2, windowHeight - ud - (height + length), swidth, length);
				break;
				
			case 1: 
				if (hitting) {
					c.globalAlpha = alpha*0.4;
					c.fillStyle = "#FF0";
					c.fillRect(lr + height, x - swidth/2, length, swidth);
				}
				c.globalAlpha = alpha*0.6;
				c.fillStyle = rgba(255, 255, 0, 0.7);
				c.fillRect(lr + height, x - swidth/2, length, swidth);
				c.fillStyle = rgba(128, 128, 0, 0.8);
				c.fillRect(lr + height - 7, x - swidth/2, 15, swidth);
				c.globalAlpha = alpha;
				c.strokeRect(lr + height, x - swidth/2, length, swidth);
				break;
				
			case 2: 
				if (hitting) {
					c.globalAlpha = alpha*0.4;
					c.fillStyle = "#FF0";
					c.fillRect(windowWidth - lr - (height + length), x - swidth/2, length, swidth);
				}
				c.globalAlpha = alpha*0.6;
				c.fillStyle = rgba(255, 255, 0, 0.7);
				c.fillRect(windowWidth - lr - (height + length), x - swidth/2, length, swidth);
				c.fillStyle = rgba(128, 128, 0, 0.8);
				c.fillRect(windowWidth - lr - (height) - 7, x - swidth/2, 15, swidth);
				c.globalAlpha = alpha;
				c.strokeRect(windowWidth - lr - (height + length), x - swidth/2, length, swidth);
				break;
			default:
		}
		c.globalAlpha = 1;
		return;
	}
	if (swidth <= 40) {
		var width = 40;
	}
	else {
		var width = swidth + 10;
	}
	c.globalAlpha = alpha*(hitting ? 0.8 : 0.6);
	switch (place) {
		case 0:
			if (hitting) {
				var t = c.globalAlpha;
				c.globalAlpha *= 0.6;
				c.fillStyle = "#0F0";
				c.fillRect(x - width/2, windowHeight - ud - (height + length), width, length);
				c.globalAlpha = t;
			}
			var step = height;
			var ex = extra;
			while (step < height + length) {
				if (ex > 0 && height + length - step <= ex) {
					sX = 0;
					sY = (ex - (height + length - step))/180*256;
					sW = 512;
					sH = (height + length - step)/180*256;
					dX = x - width/2;
					dY = windowHeight - ud - step - (height + length - step);
					dW = width;
					dH = height + length - step;

					step = height + length;
					ex = 0;
				}
				else if (ex > 0) {
					sX = 0;
					sY = 0;
					sW = 512;
					sH = ex/180*256;
					dX = x - width/2;
					dY = windowHeight - ud - step - ex;
					dW = width;
					dH = ex;

					step += ex;
					ex = 0;
				}
				else if (height + length - step < 180) {
					sX = 0;
					sY = (180 - (height + length - step))/180*256;
					sW = 512;
					sH = (height + length - step)/180*256;
					dX = x - width/2;
					dY = windowHeight - ud - step - (height + length - step);
					dW = width;
					dH = height + length - step;

					step = height + length;
				}
				else {
					sX = 0;
					sY = 0;
					sW = 512;
					sH = 256;
					dX = x - width/2;
					dY = windowHeight - ud - step - 180;
					dW = width;
					dH = 180;

					step += 180;
				}
				sX = Math.round(sX);
				sY = Math.round(sY);
				sW = Math.round(sW);
				sH = Math.round(sH);
				dX = Math.round(dX);
				dY = Math.round(dY);
				dW = Math.round(dW);
				dH = Math.round(dH);
				if (sH == 0) {
					sH = 1;
				}
				c.drawImage(holdNoteCanvasD, sX, sY, sW, sH, dX, dY, dW, dH);
			}
			break;
			
		case 1:
			if (gradual) {
				if (height + lr + gradualPx >= windowWidth/2) {
					alpha *= jb((windowWidth/2 - lr - height)/gradualPx*0.6, 0, 0.6);
				}
			}
//			c.fillRect(lr + height, x - width/2, length, width);

			c.globalAlpha = alpha*0.6;
			if (hitting) {
				var t = c.globalAlpha;
				c.globalAlpha *= 0.6;
				c.fillStyle = "#0F0";
				c.fillRect(lr + height, x - width/2, length, width);
				c.globalAlpha = t;
			}
			var step = height;
			var ex = extra;
			while (step < height + length) {
				if (ex > 0 && height + length - step <= ex) {
					sX = (180 - ex)/180*256;
					sY = 0;
					sW = (height + length - step)/180*256;
					sH = 512;
					dX = lr + step;
					dY = (x) - width/2;
					dW = height + length - step;
					dH = width;

					step = height + length;
					ex = 0;
				}
				else if (ex > 0) {
					sX = (180 - ex)/180*256;
					sY = 0;
					sW = ex/180*256;
					sH = 512;
					dX = lr + step;
					dY = (x) - width/2;
					dW = ex;
					dH = width;

					step += ex;
					ex = 0;
				}
				else if (height + length - step < 180) {
					sX = 0;
					sY = 0;
					sW = (height + length - step)/180*256;
					sH = 512;
					dX = lr + step;
					dY = (x) - width/2;
					dW = height + length - step;
					dH = width;

					step = height + length;
				}
				else {
					sX = 0;
					sY = 0;
					sW = 256;
					sH = 512;
					dX = lr + step;
					dY = (x) - width/2;
					dW = 180;
					dH = width;

					step += 180;
				}
				sX = Math.round(sX);
				sY = Math.round(sY);
				sW = Math.round(sW);
				sH = Math.round(sH);
				dX = Math.round(dX);
				dY = Math.round(dY);
				dW = Math.round(dW);
				dH = Math.round(dH);
				if (sW == 0) {
					sW = 1;
				}
				c.drawImage(holdNoteCanvasL, sX, sY, sW, sH, dX, dY, dW, dH);
			}
			c.globalAlpha = 1;
			break;
			
		case 2:
			if (gradual) {
				if (height + lr + gradualPx >= windowWidth/2) {
					alpha *= jb((windowWidth/2 - lr - height)/gradualPx*0.6, 0, 0.6);
				}
			}
//			c.fillRect(windowWidth - lr - (height + length), x - width/2, length, width);
			c.globalAlpha = alpha*0.6;
			if (hitting) {
				var t = c.globalAlpha;
				c.globalAlpha *= 0.6;
				c.fillStyle = "#0F0";
				c.fillRect(windowWidth - lr - (height + length), x - width/2, length, width);
				c.globalAlpha = t;
			}
			var step = height;
			var ex = extra;
			while (step < height + length) {
				if (ex > 0 && height + length - step <= ex) {
					sX = (ex - (height + length - step))/180*256;
					sY = 0;
					sW = (height + length - step)/180*256;
					sH = 512;
					dX = windowWidth - lr - step - (height + length - step);
					dY = (x) - width/2;
					dW = height + length - step;
					dH = width;

					step = height + length;
					ex = 0;
				}
				else if (ex > 0) {
					sX = 0;
					sY = 0;
					sW = ex/180*256;
					sH = 512;
					dX = windowWidth - lr - step - ex;
					dY = (x) - width/2;
					dW = ex;
					dH = width;

					step += ex;
					ex = 0;
				}
				else if (height + length - step < 180) {
					sX = (180 - (height + length - step))/180*256;
					sY = 0;
					sW = (height + length - step)/180*256;
					sH = 512;
					dX = windowWidth - lr - step - (height + length - step);
					dY = (x) - width/2;
					dW = height + length - step;
					dH = width;

					step = height + length;
				}
				else {
					sX = 0;
					sY = 0;
					sW = 256;
					sH = 512;
					dX = windowWidth - lr - step - 180;
					dY = (x) - width/2;
					dW = 180;
					dH = width;

					step += 180;
				}
				sX = Math.round(sX);
				sY = Math.round(sY);
				sW = Math.round(sW);
				sH = Math.round(sH);
				dX = Math.round(dX);
				dY = Math.round(dY);
				dW = Math.round(dW);
				dH = Math.round(dH);
				if (sW == 0) {
					sW = 1;
				}
				c.drawImage(holdNoteCanvasR, sX, sY, sW, sH, dX, dY, dW, dH);
			}
			c.globalAlpha = 1;
			break;
	}
	c.fillStyle = "rgba(255,255,0,1.0)";
}

function autoCutter(at, step, start, end, callback) {
	
}

function autoBox(canvas, rect, x1, y1, x2, y2, leftFix, rightFix, upFix, downFix) {
	this.canvas = document.createElement('canvas');
	var width = this.canvas.width = rect.width;
	var height = this.canvas.height = rect.height;
	this.ctx = this.canvas.getContext('2d');
	this.leftFix = leftFix || 0;
	this.rightFix = rightFix || 0;
	this.upFix = upFix || 0;
	this.downFix = downFix || 0;
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.w1 = x1;
	this.w2 = x2 - x1;
	this.w3 = width - x2;
	this.h1 = y1;
	this.h2 = y2 - y1;
	this.h3 = height - y2;
	this.ctx.drawImage(canvas, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
	this.luRect = {
		x: 0,
		y: 0,
		width: this.w1,
		height: this.h1
	}
	this.ruRect = {
		x: x2,
		y: 0,
		width: this.w3,
		height: this.h1
	}
	this.ldRect = {
		x: 0,
		y: y2,
		width: this.w1,
		height: this.h3
	}
	this.rdRect = {
		x: x2,
		y: y2,
		width: this.w3,
		height: this.h3
	}
	this.leftRect = {
		x: 0,
		y: y1,
		width: this.w1,
		height: this.h2
	}
	this.rightRect = {
		x: x2,
		y: y1,
		width: this.w3,
		height: this.h2
	}
	this.upRect = {
		x: x1,
		y: 0,
		width: this.w2,
		height: this.h1
	}
	this.downRect = {
		x: x1,
		y: y2,
		width: this.w2,
		height: this.h3
	}
}

autoBox.prototype.draw = function(ctx, rect) {
	let x = rect.x - this.leftFix;
	let y = rect.y - this.upFix;
	let width = rect.width + this.rightFix + this.leftFix;
	let height = rect.height + this.upFix + this.downFix;
	ctx.drawImage(this.canvas, this.luRect.x, this.luRect.y, this.luRect.width, this.luRect.height, x, y, this.luRect.width, this.luRect.height);
	ctx.drawImage(this.canvas, this.ruRect.x, this.ruRect.y, this.ruRect.width, this.ruRect.height, x + width - this.ruRect.width, y, this.ruRect.width, this.ruRect.height);
	ctx.drawImage(this.canvas, this.ldRect.x, this.ldRect.y, this.ldRect.width, this.ldRect.height, x, y + height - this.ldRect.height, this.ldRect.width, this.ldRect.height);
	ctx.drawImage(this.canvas, this.rdRect.x, this.rdRect.y, this.rdRect.width, this.rdRect.height, x + width - this.rdRect.width, y + height - this.rdRect.height, this.rdRect.width, this.rdRect.height);
	if (height > this.h1 + this.h3) {
		ctx.drawImage(this.canvas, this.leftRect.x, this.leftRect.y, this.leftRect.width, this.leftRect.height, x, y + this.y1, this.leftRect.width, height - this.h1 - this.h3);
		ctx.drawImage(this.canvas, this.rightRect.x, this.rightRect.y, this.rightRect.width, this.rightRect.height, x + width - this.w3, y + this.y1, this.rightRect.width, height - this.h1 - this.h3);
	}
	if (width > this.w1 + this.w3) {
		ctx.drawImage(this.canvas, this.upRect.x, this.upRect.y, this.upRect.width, this.upRect.height, x + this.x1, y, width - this.w1 - this.w3, this.upRect.height);
		ctx.drawImage(this.canvas, this.downRect.x, this.downRect.y, this.downRect.width, this.downRect.height, x + this.x1, y + height - this.downRect.height, width - this.w1 - this.w3, this.downRect.height);
	}
	
}


function drawLongBoxNote(c, place, width, length, x, height, alpha) {
	var alpha = alpha || 1;
	var side = (place == 0 ? ud : lr);
	if (height < -hideHeight) { 
		var d = (-height - hideHeight)*(1 - hide);
		length = Math.max(0, length - d);
		height = -hideHeight - (-height - hideHeight)*hide;
		alpha *= jb(1 - (-height - hideHeight)/(side - hideHeight), 0, 1);
	}
	c.globalAlpha = alpha;
	if (playSettings.simpleNote) {
		return;
	}
	var ub = 14;
	var db = 25;
	var lrb = 13;

	if (length <= 66) {
		length = 66;
	}
	if (width <= 30) {
		width = 30;
	}
	switch (place) {
		case 0:
			if (test.hold)
				holdAutoBoxD.draw(ctx, {});
			c.drawImage(holdBoxCanvasD, 0, 56, 34, 48, x - width/2 - 18, windowHeight - ud - height - db, 34, 48); //LD
			c.drawImage(holdBoxCanvasD, 35, 56, 34, 48, x + width/2 - 16, windowHeight - ud - height - db, 34, 48); //RD
			c.drawImage(holdBoxCanvasD, 0, 0, 34, 55, x - width/2 - 18, windowHeight - ud - (height + length) - ub, 34, 55); //LU
			c.drawImage(holdBoxCanvasD, 35, 0, 34, 55, x + width/2 - 16, windowHeight - ud - (height + length) - ub, 34, 55); //RU
			c.drawImage(holdBoxCanvasD, 34, 56, 1, 48, x - width/2 + 16, windowHeight - ud - height - 25, width - 32, 48); //D
			c.drawImage(holdBoxCanvasD, 34, 0, 1, 55, x - width/2 + 16, windowHeight - ud - (height + length) - 14, width - 32, 55); //U
			c.drawImage(holdBoxCanvasD, 0, 55, 32, 1, x - width/2 - 18, windowHeight - ud - (height + length) - ub + 55, 32, length - 66); //L
			c.drawImage(holdBoxCanvasD, 35, 55, 34, 1, x + width/2 - 16, windowHeight - ud - (height + length) - ub + 55, 34, length - 66); //R
			break;
			
		case 1:
			if (gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			c.drawImage(holdBoxCanvasL, 0, 0, 52, 34, lr + height - 25, x - width/2 - 18, 52, 34); //LU
			c.drawImage(holdBoxCanvasL, 0, 35, 52, 34, lr + height - 25, x + width/2 - 16, 52, 34); //LD
			c.drawImage(holdBoxCanvasL, 52, 0, 55, 34, lr + height + length - 44, x - width/2 - 18, 55, 34); //RU
			c.drawImage(holdBoxCanvasL, 52, 35, 55, 34, lr + height + length - 44, x + width/2 - 16, 55, 34); //RD
			c.drawImage(holdBoxCanvasL, 0, 34, 52, 1, lr + height - 25, x - width/2 + 16, 52, width - 32); //L
			c.drawImage(holdBoxCanvasL, 52, 34, 55, 1, lr + (height + length) - 44, x - width/2 + 16, 55, width - 32); //R
			c.drawImage(holdBoxCanvasL, 52, 0, 1, 32, lr + height + 27, x - width/2 - 18, length - 71, 32); //U
			c.drawImage(holdBoxCanvasL, 52, 34, 1, 34, lr + height + 27, x + width/2 - 17, length - 71, 34); //D
			c.globalAlpha = 1;
			break;
			
		case 2:
			if (gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			c.drawImage(holdBoxCanvasR, 0, 0, 55, 34, windowWidth - lr - (height +  length) - 12, x - width/2 - 18, 55, 34); //LU
			c.drawImage(holdBoxCanvasR, 0, 34, 55, 34, windowWidth - lr - (height +  length) - 12, x + width/2 - 17, 55, 34); //LD
			c.drawImage(holdBoxCanvasR, 56, 0, 52, 34, windowWidth - lr - height - 29, x - width/2 - 18, 52, 34); //RU
			c.drawImage(holdBoxCanvasR, 56, 35, 52, 34, windowWidth - lr - height - 29, x + width/2 - 16, 52, 34); //RD
			c.drawImage(holdBoxCanvasR, 0, 34, 55, 1, windowWidth - lr - (height +  length) - 12, x - width/2 + 16, 55, width - 33); //L
			c.drawImage(holdBoxCanvasR, 55, 34, 52, 1, windowWidth - lr - height - 30, x - width/2 + 16, 52, width - 32); //R
			c.drawImage(holdBoxCanvasR, 55, 0, 1, 32, windowWidth - lr - (height +  length) + 43, x - width/2 - 18, length - 72, 32); //U
			c.drawImage(holdBoxCanvasR, 55, 36, 1, 32, windowWidth - lr - (height +  length) + 43, x + width/2 - 15, length - 72, 32); //D
			c.globalAlpha = 1;
			break;
	}
}

function hash(m) {
	return Math.floor((m*m*rseed1 + m*rseed2)*100000)%100000/100000.0;
}

function hitAnime(note, place, judgement, dontShow) {
	function shootParticle(effect, sx, sy, sd, ex, ey, ed) {
		effect.particles.push({
			sx:sx,
			sy:sy,
			sd:sd,
			ex:ex,
			ey:ey,
			ed:ed
		});
	}
	if (musicCtrl.paused) {
		return;
	}
	hitThisFrame2 = 110;
	var newEffect = {
		startTime: startTime,
		doration: 240,
		particles: []
	}
	var type = note.m_type,
		width = mtow(note.m_width, place);
		x = mtox(note.m_position, place);
	
	var sx1, sy1, sd1, sx2, sy2, sd2;
	var shootFrame = Math.ceil(fps/60.0*16/audioRate), shootRange = 370;
	var ps = Math.floor(width/20) + 1;
	var rua;
	var rub;
	var add;
	if (!isMobile && showHitSound) {
		if (AC) {
			playSound(hitCtrl[hitTypeMap[place][type]], 0);
		}
		else for (var i = 0; i < hitBuffer[hitTypeMap[place][type]]; ++i) {
			if (hitCtrl[hitTypeMap[place][type]][i].paused) {
				hitCtrl[hitTypeMap[place][type]][i].play();
				break;
			}
		}
	}
//	if (note.status != "Untouched") {
//		console.warn(note.status);
//	}
	switch (judgement) {
		case "Perfect":
			performanceList.push({
				tp: 4,
				time: thisTime
			});
			newEffect.particleColor = 0;
			perfectHit++;
			combo++;
			comboAlpha = 1;
			hitThisFrame = 3;
			break;
		case "Pr":
			performanceList.push({
				tp: 3,
				time: thisTime
			});
			newEffect.particleColor = 0;
			prHit++;
			combo++;
			comboAlpha = 1;
			hitThisFrame = 3;
			break;
		case "Great":
			performanceList.push({
				tp: 2,
				time: thisTime
			});
			newEffect.particleColor = 2;
			greatHit++;
			combo++;
			comboAlpha = 1;
			hitThisFrame = 3;
			break;
		case "Good":
			performanceList.push({
				tp: 1,
				time: thisTime
			});
			newEffect.particleColor = 1;
			goodHit++;
			combo++;
			comboAlpha = 1;
			hitThisFrame = 3;
			break;
		case "Miss":
			performanceList.push({
				tp: 0,
				time: thisTime
			});
			missHit++;
			combo = 0;
			comboAlpha = 0.98;
			break;
	}
	currentJudgeResult = judgement;
	note.status = judgement;
	
	if (playSettings.simpleEffect) {
		shadowQueue.push({
			startTime: startTime,
			doration: 400,
			judgement: judgement,
			place: place,
			x: x,
			width: width
		});
	}
	if (isMixerL && place == 1) { //shadow of mixer2
		if (judgement == "Miss") {
			return;
		}
		else {
			ps = 8;
			if (type == "CHAIN") {
				if (! isMobile) {
					barTargetL = x;
				}
				mixerLT = 24;
				var stype = 0;
				shootRange = 270;
				width = 234;
				for (var i = 0; i < ps; ++i) {
					rua = hash(place*1.234 + ps*width + i);
					rub = hash(place*1.234 + ps*width + i + 0.5);
					sy1 = x - width/2 + rua*width;
					sx1 = lr;
					sd1 = rua*360;
					sx2 = sx1 + shootRange*Math.sin(rua*2*i);
					sy2 = sy1 + shootRange*Math.cos(rub*2*i);
					sd2 = rub*360 - 180;
					add = rub*180;
					shootParticle(newEffect, sx1, sy1, sd1, sx2, sy2, sd2);
					if (i % 2 == 1) {
						shootParticle(newEffect, sx1, sy1, sd1 + add, sx2 + (sx2 - sx1)*0.3, sy2 + (sy2 - sy1)*0.3, sd2);
					}
					if (i % 3 == 2) {
						shootParticle(newEffect, sx1, sy1, sd1 + add*2, sx2 + (sx2 - sx1)*0.6, sy2 + (sy2 - sy1)*0.6, sd2);
					}
				}
			}
		}
	}
	else if (isMixerR && place == 2) { //shadow of mixer1
		if (judgement == "Miss") {
			return;
		}
		ps = 12;
		if (type == "CHAIN") {
			if (! isMobile) {
				barTargetR = x;
			}
			mixerRT = 24;
			shootRange = 270;
			width = 234;
			for (var i = 0; i < ps; ++i) {
				rua = hash(place*1.234 + ps*width + i);
				rub = hash(place*1.234 + ps*width + i + 0.5);
				sy1 = x - width/2 + rua*width;
				sx1 = windowWidth - lr;
				sd1 = rua*360;
				sx2 = sx1 + shootRange*Math.sin(rua*2*i);
				sy2 = sy1 + shootRange*Math.cos(rub*2*i);
				sd2 = rub*360 - 180;
				add = rub*180;
				shootParticle(newEffect, sx1, sy1, sd1, sx2, sy2, sd2);
				if (i % 2 == 1) {
					shootParticle(newEffect, sx1, sy1, sd1 + add, sx2 + (sx2 - sx1)*0.3, sy2 + (sy2 - sy1)*0.3, sd2);
				}
				if (i % 3 == 2) {
					shootParticle(newEffect, sx1, sy1, sd1 + add*2, sx2 + (sx2 - sx1)*0.6, sy2 + (sy2 - sy1)*0.6, sd2);
				}
			}
		}
	}
	else {
		if (!dontShow) {
			shadowQueue.push({
				startTime: startTime,
				doration: 400,
				judgement: judgement,
				place: place,
				x: x,
				width: width
			});
		}
		if (judgement == "Miss") {
			return;
		}
		switch (place) {
			case 0:
				for (var i = 0; i < ps; ++i) {
					rua = hash(place*1.543 + ps*width + i*1.2);
					rub = hash(place*1.543 + ps*width + i*1.2 + 0.666);
					sx1 = x - width/2 + rua*width;
					sy1 = windowHeight - ud + rub*(sx1 - x)/width;
					sd1 = rua*360;
					sx2 = sx1 + (rua - 0.5)*shootRange; 
					sy2 = sy1 + (rub - 0.5)*shootRange;
					sd2 = rub*360 - 180;
					add = rub*180;
					shootParticle(newEffect, sx1, sy1, sd1, sx2, sy2, sd2);
					if (i % 3 == 2) {
						shootParticle(newEffect, sx1, sy1, sd1 + add, sx2 + (sx2 - sx1)*0.3, sy2 + (sy2 - sy1)*0.3, sd2);
					}
					if (i % 4 == 3) {
						shootParticle(newEffect, sx1, sy1, sd1 + add*2, sx2 + (sx2 - sx1)*0.6, sy2 + (sy2 - sy1)*0.6, sd2);
					}
				}
				break;
			case 1:
				for (var i = 0; i < ps; ++i) {
					rua = hash(place*1.234 + ps*width + i*1.2);
					rub = hash(place*1.234 + ps*width + i*1.2 + 0.5);
					sy1 = x - width/2 + rua*width;
					sx1 = lr + rub*(sy1 - x)/width;
					sd1 = rua*360;
					sx2 = sx1 + (rub - 0.5)*shootRange; 
					sy2 = sy1 + (rua - 0.5)*shootRange;
					sd2 = rub*360 - 180;
					add = rub*180;
					shootParticle(newEffect, sx1, sy1, sd1, sx2, sy2, sd2);
					if (i % 3 == 1) {
						shootParticle(newEffect, sx1, sy1, sd1 + add, sx2 + (sx2 - sx1)*0.3, sy2 + (sy2 - sy1)*0.3, sd2);
					}
					if (i % 4 == 2) {
						shootParticle(newEffect, sx1, sy1, sd1 + add*2, sx2 + (sx2 - sx1)*0.6, sy2 + (sy2 - sy1)*0.6, sd2);
					}
				}
				break;
			case 2:
				for (var i = 0; i < ps; ++i) {
					rua = hash(place*1.234 + ps*width + i*1.2);
					rub = hash(place*1.234 + ps*width + i*1.2 + 0.5);
					sy1 = x - width/2 + rua*width;
					sx1 = windowWidth - lr + rub*(sy1 - x)/width;
					sd1 = rua*360;
					sx2 = sx1 + (rub - 0.5)*shootRange; 
					sy2 = sy1 + (rua - 0.5)*shootRange;
					sd2 = rub*360 - 180;
					add = rub*180;
					shootParticle(newEffect, sx1, sy1, sd1, sx2, sy2, sd2);
					if (i % 3 == 1) {
						shootParticle(newEffect, sx1, sy1, sd1 + add, sx2 + (sx2 - sx1)*0.3, sy2 + (sy2 - sy1)*0.3, sd2);
					}
					if (i % 4 == 2) {
						shootParticle(newEffect, sx1, sy1, sd1 + add*2, sx2 + (sx2 - sx1)*0.6, sy2 + (sy2 - sy1)*0.6, sd2);
					}
				}
				break;
		}
	}
	particleQueue.push(newEffect);
}

function drawTextInBox(c, mes, x, y, w, h, alpha) {
	var startX = x + 8;
	var startY = y + 8;
	var temp = 0;
	var width = w - 16;
	var height = h - 16;
	var left = mes;
	var line = "";
	c.fillStyle = "rgba(255,255,255," + alpha + ")";
	c.font = "14px consolas";
	c.textAlign = "left";
	c.textBaseline = "top";
	while (left != "") {
		line = "";
		while (c.measureText(line).width <= width && left != "") {
			line = line + left.charAt(0);
			left = left.substring(1);
		}
		if (c.measureText(line).width > width) {
			left = line.charAt(line.length - 1) + left;
			line = line.substring(0, line.length - 1);
		}
		c.fillText(line, startX, startY + temp*16);
		++temp;
	}
}

function audioLoad(src, callback) {
	if (! src) return;
	var audio = isVideo ? document.createElement("video") : document.createElement("audio");
	audio.oncanplay = callback(audio);
	audio.src = src;
	audio.style.crossOrigin = "anonymous";
}

function comparer_old(x, y) {
	return y[0] - x[0];
}
function comparer(x, y) {
	return x.m_id - y.m_id;
}
function getNumberInNormalDistribution(mean,std_dev){    
    return mean+(uniform2NormalDistribution()*std_dev);
}

function uniform2NormalDistribution(){
    var sum=0.0;
    for(var i=0; i<6; i++){
        sum=sum+Math.random();
    }
    return sum-3.0;
}