function startMenuSceneMobile() {
	var choice = 0;
	var breath = 0;

}


startMenuSceneMobile.prototype = {
	down: function (coordinate) {
		this.move(coordinate);
	},
	up: function(coordinate) {
		
		var onOne = false;
	
		switch (this.choice) {
			case 1: 
				if (mapFileType && (mapFileType == "DY" || musicFileOk)) {
					scene = new loadingScene();
					scene.init(mapFileType);
				}
				else {
					mapFileElement.focus();
					mapFileElement.click();
				}
				break;
			default:
				break;
		}
	},
	move: function(coordinate) {
		
//  	hidden: false,
//  	doubleSpeed: false,
//  	halfSpeed: false,
//  	showTP: false,
//  	mirror: false,
//  	mirrored: false
		var onOne = false;
		if (inArea(coordinate, 0, 0, windowWidth*0.2, windowHeight*0.1)) {
			playSettings.hidden = !playSettings.hidden;
		}
		
		if (inArea(coordinate, windowWidth*0.2, 0, windowWidth*0.2, windowHeight*0.1)) {
			if (playSettings.playbackSpeed == 2) {
				playSettings.playbackSpeed = 0.5;
			}
			else {
				playSettings.playbackSpeed = Math.round((playSettings.playbackSpeed + 0.25)*100)/100;
			}
		}
		
		if (inArea(coordinate, windowWidth*0.4, 0, windowWidth*0.2, windowHeight*0.1)) {
			playSettings.showTP = (playSettings.showTP + 1)%3;
		}
		
		if (inArea(coordinate, windowWidth*0.6, 0, windowWidth*0.2, windowHeight*0.1)) {
			playSettings.mirror = !playSettings.mirror;
		}
		
		if (inArea(coordinate, windowWidth*0.8, 0, windowWidth*0.2, windowHeight*0.1)) {
			playSettings.twist = !playSettings.twist;
		}
		
		if (inArea(coordinate, 0, windowHeight*0.9, windowWidth*0.2, windowHeight*0.1)) {
			playSettings.simpleNote = !playSettings.simpleNote;
		}
		
		if (inArea(coordinate, windowWidth*0.2, windowHeight*0.9, windowWidth*0.2, windowHeight*0.1)) {
			playSettings.simpleEffect = !playSettings.simpleEffect;
		}
		
		if (inArea(coordinate, windowWidth*0.4, windowHeight*0.9, windowWidth*0.2, windowHeight*0.1)) {
			playSettings.hideBG = !playSettings.hideBG;
		}
		
		if (inArea(coordinate, windowWidth*0.9, windowHeight*0.9, windowWidth*0.1, windowHeight*0.1)) {
			location.reload();
		}
		
		if (inArea(coordinate, windowWidth*0.5 - 200, windowHeight*0.5 - 100, 400, 200)) {
			this.choice = 1;
			onOne = true;
		}
		if (inArea(coordinate, windowWidth*0.2, windowHeight*0.2 - 10, windowWidth*0.6, windowHeight*0.1)) {
			this.choice = 2;
			userOffsetSec = Math.round((jb(coordinate.x, windowWidth*0.2, windowWidth*0.8) - windowWidth*0.5)/1000*100)/100;
			onOne = true;
		}
		if (inArea(coordinate, windowWidth*0.2, windowHeight*0.3 - 10, windowWidth*0.6, windowHeight*0.1)) {
			this.choice = 3;
			inputHispeed = Math.round(((jb(coordinate.x, windowWidth*0.2, windowWidth*0.8) - windowWidth*0.5) + 1.6*400)/400*10)/10;
			onOne = true;
		}
		if (! onOne) {
			this.choice = 0;
		}
	},
	refresh: function() {
		ctx.textBaseline = "top";
		ctx.font = "42px Dynamix";
		
		ctx.fillStyle = playSettings.hidden ? "#1FF" : "#111";
		ctx.fillRect(0, 0, windowWidth*0.2, windowHeight*0.1);
		ctx.fillStyle = playSettings.hidden ? "#111" : "#1FF";
		ctx.fillText("HIDDEN", windowWidth*0.1, windowHeight*0.02);
		
		ctx.fillStyle = playSettings.playbackSpeed!=1 ? "#1FF" : "#111";
		ctx.fillRect(windowWidth*0.2, 0, windowWidth*0.2, windowHeight*0.1);
		ctx.fillStyle = playSettings.playbackSpeed!=1 ? "#111" : "#1FF";
		ctx.fillText(playSettings.playbackSpeed+"x", windowWidth*0.3, windowHeight*0.02);
		
		ctx.fillStyle = playSettings.showTP ? "#1FF" : "#111";
		ctx.fillRect(windowWidth*0.4, 0, windowWidth*0.2, windowHeight*0.1);
		ctx.fillStyle = playSettings.showTP? "#111" : "#1FF";
		var showTPtext = "No Perf.";
		switch (playSettings.showTP){
			case 1:
				showTPtext = "Number Perf.";
				break;
			case 2:
				showTPtext = "Graph Perf.";
				break;
			default:
				break;
		}
		ctx.fillText(showTPtext, windowWidth*0.5, windowHeight*0.02);
		
		ctx.fillStyle = playSettings.mirror ? "#1FF" : "#111";
		ctx.fillRect(windowWidth*0.6, 0, windowWidth*0.2, windowHeight*0.1);
		ctx.fillStyle = playSettings.mirror? "#111" : "#1FF";
		ctx.fillText("MIRROR", windowWidth*0.7, windowHeight*0.02);
		
		ctx.fillStyle = playSettings.twist ? "#1FF" : "#111";
		ctx.fillRect(windowWidth*0.8, 0, windowWidth*0.2, windowHeight*0.1);
		ctx.fillStyle = playSettings.twist? "#111" : "#1FF";
		ctx.fillText("TWIST", windowWidth*0.9, windowHeight*0.02);
		
		ctx.fillStyle = playSettings.simpleNote ? "#FFF" : "#111";
		ctx.fillRect(0, windowHeight*0.9, windowWidth*0.2, windowHeight*0.1);
		ctx.fillStyle = playSettings.simpleNote? "#111" : "#FFF";
		ctx.fillText("Simple Note", windowWidth*0.1, windowHeight*0.92);
		
		ctx.fillStyle = playSettings.simpleEffect ? "#FFF" : "#111";
		ctx.fillRect(windowWidth*0.2, windowHeight*0.9, windowWidth*0.2, windowHeight*0.1);
		ctx.fillStyle = playSettings.simpleEffect? "#111" : "#FFF";
		ctx.fillText("Simple EFFECT", windowWidth*0.3, windowHeight*0.92);
		
		ctx.fillStyle = playSettings.hideBG ? "#FFF" : "#111";
		ctx.fillRect(windowWidth*0.4, windowHeight*0.9, windowWidth*0.2, windowHeight*0.1);
		ctx.fillStyle = playSettings.hideBG ? "#111" : "#FFF";
		ctx.fillText("Hide BG", windowWidth*0.5, windowHeight*0.92);
		
		ctx.font = "36px Dynamix";
		
//		ctx.fillStyle = playSettings.halfSpeed ? "#1FF" : "#111";
//		ctx.fillRect(windowWidth*0.4, 0, windowWidth*0.2, windowHeight*0.1);
//		ctx.fillStyle = playSettings.halfSpeed ? "#111" : "#1FF";
//		ctx.fillText("HALF", windowWidth*0.5, windowHeight*0.01);
//		ctx.fillText("SPEED", windowWidth*0.5, windowHeight*0.04);
		
		
		ctx.font = "36px Dynamix";
		ctx.fillStyle = "#0FF";
		ctx.fillRect(windowWidth*0.9, windowHeight*0.9, windowWidth*0.1, windowHeight*0.1);
		
		ctx.fillRect(windowWidth*0.2, windowHeight*0.2, windowWidth*0.6, windowHeight*0.006);
		ctx.fillRect(windowWidth*0.5 - 10 + userOffsetSec*1000, windowHeight*0.17, 20, windowHeight*0.06);
		ctx.fillText("OFFSET " + userOffsetSec, windowWidth * 0.50, windowHeight * 0.13);
		
		ctx.fillRect(windowWidth*0.2, windowHeight*0.3, windowWidth*0.6, windowHeight*0.006);
		ctx.fillRect(windowWidth*0.5 - 10 + (inputHispeed - 1.6)*400, windowHeight*0.27, 20, windowHeight*0.06);
		ctx.fillText("HiSpeed " + inputHispeed, windowWidth * 0.50, windowHeight * 0.23);
		
		ctx.fillStyle = "#FFF";
		ctx.fillText("Use DynaMakerPlayer to EVLUATE your chart's quality.", windowWidth * 0.50, windowHeight * 0.70);
		ctx.fillText("Bad charts make you awkward while testing.", windowWidth * 0.50, windowHeight * 0.75);
		ctx.fillText("I hope it can help charting for some charters.", windowWidth * 0.50, windowHeight * 0.80);
		ctx.font = "24px Dynamix";
		ctx.fillText("Yours, omegaPi", windowWidth * 0.50, windowHeight * 0.85);
		this.breath = Math.abs(frameCount - 54) / 54;
		if(typeof FileReader == 'undefined'){
			ctx.textAlign = "center";
			ctx.fillText("ERROR", windowWidth * 0.50, windowHeight * 0.42);
			ctx.fillText("Your explorer doesn't support fileAPI.", windowWidth * 0.50, windowHeight * 0.50);
			ctx.fillText("Why not use a higher version of " + getBrowser() + " ?", windowWidth * 0.50, windowHeight * 0.54);
		}
		else {
			if (this.choice == 1) {
				ctx.fillStyle = "#0F0";
			}
			else {
				ctx.fillStyle = "#0FF";
			}
			drawBox(ctx, windowWidth*0.5 - 200, windowHeight*0.5 - 100, 400, 200, 0.5, 10);
			//map browse
			ctx.fillText("SELECT FILE", windowWidth*0.5, windowHeight*0.5);
			if (mapFileCtrl) {
				ctx.textAlign = "center";
				if (mapFileCtrl.length == 1) {
					var mapFileNameSplit = mapFileCtrl[0].name.split("."),
						mapFileExName = mapFileNameSplit[mapFileNameSplit.length - 1].toUpperCase();
						
					ctx.fillStyle = "#FFF";
					ctx.fillText(mapFileCtrl[0].name, windowWidth * 0.5, windowHeight * 0.6);
					
					if (1 || mapFileExName == "DY") {
						ctx.fillStyle = "#0FF";
						ctx.fillText(mapFileCtrl[0].name, windowWidth * 0.5, windowHeight * 0.5);
						mapFileType = "DY";//mapFileExName;
					}
					else {
						mapFileType = false;
						ctx.fillStyle = "#FFF";
						ctx.fillText("It's not a current file.", windowWidth * 0.5, windowHeight * 0.5);
					}
				}
				else {
					mapFileType = false;
					if (mapFileCtrl.length > 0) {
						ctx.fillStyle = "#FFF";
						ctx.fillText("Don't put mulipile files here.", windowWidth * 0.5, windowHeight * 0.5);
					}
					else {
						ctx.fillStyle = "#0FF";
						ctx.fillText("Put file here.", windowWidth * 0.5, windowHeight * 0.5);
						
					}
				}
			}
		}
	}
}
