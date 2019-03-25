var keysDown = {};
var keysReacted = {};
for (var i = 0; i < 256; ++i) {
	keysReacted[i] = 0;
}
function keyboard() {
}
function kble(i) {
	if (i in keysDown) {
		if (keysReacted[i] == 0) {
			keysReacted[i] = 1;
			return true;
		}
		else {
			return keysReacted[i] == 13;
		}
	}
	else {
		return false;
	}
}
keyboard.prototype = {
	set:function() {
		addEventListener("keydown", function (e) {
			if (scene && scene.banKeyboard) return;
			keysDown[e.keyCode] = true;
	    	if (kble(8)) { // Backspace
	    		e.preventDefault();
			}
	    	if (kble(70)) { // F
	    		if (isFullScreen) {
	    			unFullScreen();
	    		}
	       		else {
	       			fullScreen();
	       		}
			}
		}, false);

		addEventListener("keyup", function (e) {
			keysReacted[e.keyCode] = 0;
			delete keysDown[e.keyCode];
		}, false);
		this.ready = true;
	},
	refresh:function() {
		if (scene && scene.banKeyboard) return;
		for (var i = 0; i < 256; ++i) {
			if (keysReacted[i] != 13 && keysReacted[i] != 0) {
				++keysReacted[i];
			}
		}
		if (mainMouse) {
			var toolOnChange = false;
			if (keysDown[49] && mainMouse.movement != "writeNormal" && !((editSide == 1 && CMap.m_leftRegion == "MIXER") || (editSide == 2 && CMap.m_rightRegion == "MIXER"))) { // 1!
				mainMouse.movement = "writeNormal";
				toolOnChange = true;
			}
			if (keysDown[50] && mainMouse.movement != "writeChain" && !((editSide == 1 && CMap.m_leftRegion == "PAD") || (editSide == 2 && CMap.m_rightRegion == "PAD"))) { // 2@
				mainMouse.movement = "writeChain";
				toolOnChange = true;
			}
			if (keysDown[51] && mainMouse.movement != "writeHold"  && !((editSide == 1 && CMap.m_leftRegion == "MIXER") || (editSide == 2 && CMap.m_rightRegion == "MIXER"))) { // 3#
				mainMouse.movement = "writeHold";
				toolOnChange = true;
			}
			if (keysDown[52] && mainMouse.movement != "choose") { // 4$
				mainMouse.movement = "choose";
				toolOnChange = true;
			}
			if (keysDown[8] || keysDown[46]) { //backspace or del
				noteChosenList.sort(function (x, y) {
            		return y-x;
            	});
            	for (var j of noteChosenList) {
					var delNote = getNote(j, editSide);
					switch (delNote.m_type) {
						case "HOLD":
							var subId = delNote.m_subId;
							delNoteById(j, editSide);
							delNoteById(subId, editSide);
							break;
						case "NORMAL":
						case "CHAIN":
							delNoteById(j, editSide);
							break;
						default:{}
					}
				}
				toolOnChange = true;
        	}
		}
		if (toolOnChange) {
			mainMouse.menu = false;
			mainMouse.condition = 0;
			noteTemp = [];
			noteChosen = [];
			noteChosenList = [];
		}
			
		if (kble(76)) { // L
			linkMode = ! linkMode;
			if (linkMode) {
				switch (mainMouse.movement){
					case "writeHold":
					case "choose":
					case "writeNormal":
						linkType = "NORMAL";
						break;
					case "writeChain":
						linkType = "CHAIN";
						break;
					default:
						console.error("Movement type error.");
						break;
				}
				mainMouse.movement = "link";
			}
			else {
				switch (linkType){
					case "NORMAL":
						mainMouse.movement = "writeNormal";
						break;
					case "CHAIN":
						mainMouse.movement = "writeChain";
						break;
					default:
						console.error("Link type error.");
						break;
				}
				
			}
		}
		if (kble(37)) { //left
			if (keysDown[16]) {
				undo();
			}
			else {
				showL = (showL + 1) % 3;
			}
		}
		if (kble(38)) { //up38 9tab
			editSide = (editSide + 1) % 3;
			changeSide();
		}
		if (kble(39)) { //right
			if (keysDown[16]) {
				redo();
			}
			else {
				showR = (showR + 1) % 3;
			}
		}
		if (kble(40)) { //down
			showD = (showD + 1) % 3;
		}
		if (kble(66)) { // B
			rollReverse = ! rollReverse;
		}
		if (kble(81)) { // Q
			if (hiSpeed <= 100) {
				hiSpeed = 100;
			}
			else if (hiSpeed <= 2000) {
				hiSpeed -= 100;
			}
			else if (hiSpeed <= 4000) {
				hiSpeed -= 200;
			}
			else if (hiSpeed <= 10000) {
				hiSpeed -= 500;
			}
			else {
				hiSpeed -= 1000;
			}
		}
		else if (kble(69)) { // E
			if (hiSpeed < 2000) {
				hiSpeed += 100;
			}
			else if (hiSpeed < 4000) {
				hiSpeed += 200;
			}
			else if (hiSpeed < 10000) {
				hiSpeed += 500;
			}
			else {
				hiSpeed += 1000;
			}
		}
		if (kble(83)) { // S
			if (audioRate <= 1 ) {
				audioRate = 1;
			}
			else if (audioRate <= 20) {
				audioRate -= 1;
			}
			else if (audioRate <= 40) {
				audioRate -= 2;
			}
			else if (audioRate <= 100) {
				audioRate -= 5;
			}
			else {
				audioRate -= 10;
			}
		}	
		else if (kble(87)) { // W
			if (audioRate < 20) {
				audioRate += 1;
			}
			else if (audioRate < 40) {
				audioRate += 2;
			}
			else if (audioRate < 100) {
				audioRate += 5;
			}
			else {
				audioRate += 10;
			}
		}
		
		if (musicCtrl && CMap) {
			if (kble(77)) { // M
				resetAnime();
	       		setTime(markSecion*spu - offsetSec);
			}
			if (kble(82)) { // R
	    		if (keysDown[16]) {
	    			magnaticStrength = 32;
	    			hiSpeed = 1000;
	    			audioRate = 1;
	    		}
				barTargetL = windowHeight/2;
				barTargetR = windowHeight/2;
	       		setTime(0);
	       		showCS = false;
	       		clearHit(true);
	       		resetAnime();
			}
			if (kble(13)) { // Enter
				restart();
//				perfectHit = 0;
//				prHit = 0;
//				greatHit = 0;
//				goodHit = 0;
//				missHit = 0;
//				combo = 0;
//				maxCombo = 0;
//				barTargetL = windowHeight/2;
//				barTargetR = windowHeight/2;
//	       		setTime(0);
//	       		resetCS();
//	       		clearHit(true);
//	       		resetAnime();
//				lr = -40;
//				ud = -50; 
//				pauseShadowH = -180;
//				noteTemp = [];
//				mainMouse.condition = 0;
//				mainMouse.movement = "choose";
//	       		showStart = 60;
			}
			
	    	if (kble(65)) { // A
	    		if (keysDown[16]) {
	       			setTime(musicCtrl.currentTime - 0.01);
	    		} 
	    		else {
	       			setTime(musicCtrl.currentTime - 1);
	    		}
	       		resetAnime();
			}
	    	else if (kble(68)) { // D
	    		if (keysDown[16]) {
	       			setTime(musicCtrl.currentTime + 0.01);
	    		}
	    		else {
	       			setTime(musicCtrl.currentTime + 1);
	    		}
	       		resetAnime();
			}
	    	
	    if (kble(67)) { // C
    		if (magnaticStrength > 1) {
	    		if (keysDown[16]) {
	       			magnaticStrength -= 1;
	    		}
	    		else if (magnaticStrength <= 8) {
       				magnaticStrength /= 2;
       			}
    			else switch (magnaticStrength) {
    					case 12:
    						magnaticStrength = 8;
    						break;
    					case 16:
    						magnaticStrength = 12;
    						break;
    					case 24:
    						magnaticStrength = 16;
    						break;
    					case 32:
    						magnaticStrength = 24;
    						break;
    					case 48:
    						magnaticStrength = 32;
    						break;
    					case 64:
    						magnaticStrength = 48;
    						break;
    			
    					default:
    						if (magnaticStrength % 32 == 0) {
    							magnaticStrength -= 32;
    						}
    						else {
    							magnaticStrength = Math.max(1, Math.floor(magnaticStrength/32)*32);
    						}
    						break;
    				}
       		}
		}
    	else if (kble(86)) { // V
	    		if (keysDown[16]) {
	       			magnaticStrength += 1;
	    		}
	    		else if (magnaticStrength <= 4) {
       				magnaticStrength *= 2;
       			}
    			else switch (magnaticStrength) {
    					case 8:
    						magnaticStrength = 12;
    						break;
    					case 12:
    						magnaticStrength = 16;
    						break;
    					case 16:
    						magnaticStrength = 24;
    						break;
    					case 24:
    						magnaticStrength = 32;
    						break;
    					case 32:
    						magnaticStrength = 48;
    						break;
    					case 48:
    						magnaticStrength = 64;
    						break;
    			
    					default:
    						if (magnaticStrength % 32 == 0) {
    							magnaticStrength += 32;
    						}
    						else {
    							magnaticStrength = Math.max(1, Math.ceil(magnaticStrength/32)*32);
    						}
    						break;
    			}
		}
    	
    	if (kble(32)) { // space
    		if (musicCtrl.paused) {
    			if (musicCtrl.ended) {
    				restart();
    			}
    			else {
    				musicCtrl.goplay();
    			}
    		}
    		else {
    			musicCtrl.pause();
    		}
		}	
	    	
		}

		if (CMap) {
	    	if (kble(79)) { // O
	       		changeOffsetSec(Math.round((offsetSec - 0.001)*10000)/10000);
			}
	    	else if (kble(80)) { // P
	       		changeOffsetSec(Math.round((offsetSec + 0.001)*10000)/10000);
			}
		}
    	

		
		if (kble(13) || kble(108)) { // 回车
//			scene = false;
		}
	}
}