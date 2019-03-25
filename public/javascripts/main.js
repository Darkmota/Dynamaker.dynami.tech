window.onbeforeunload = function () {
	if(confirm("确定关闭页面？请注意是否保存了谱面文件！")){
		return true;
	}
	else{
		return false;
	}
}
var test;
var BlobBuilder = Blob,
    browser = getBrowser(),
    windowWidth = 1920,
    windowHeight = 1080,
    loaded = 0,
    low = false,
    gLine = false,
    chartName = false,
    beatpmName = false,
    barpmName = false,
    offsetSecName = false,
    offsetBarName = false,
    hardshipName = false,
    leftName = false,
    rightName = false,
    isVideo = false,
    musicFileElement = false,
    musicFileCtrl = false,
    musicUrl = false,
    musicPlayButton = false,
    musicCtrl = false,
    mapFileElement = false,
    mapType = false,
    mapFileCtrl = [],
    mapJsonUrl = false,
    mapXmlUrl = false,
    backgroundFileElement = false,
    backgroundFileCtrl = false,
    hitUrl = ["./audio/hit.wav", "./audio/clap.wav", "./audio/drum.wav", "./audio/drumh.wav", "./audio/slideShort.wav"],
    hitCtrl = [],
    hitBuffer = [10, 10, 10, 10, 60],
    hitTypeMap = [],
    totalHitBuffer = 0,
    audioNow = false,
    audioReady = false,
    audioRate = 1,
    audioRateCache = 1,
    amax = 6,
    doration = 0,
    timerReady = false,
    barpm = 0,
    hardship = 0,
    hardshipColor = "#FFF",
    CMap = false,
    note = [],
    
    noteDown = [],
    noteLeft = [],
    noteRight = [],
    noteUp = [],
    
    noteDownMax = 0,
    noteLeftMax = 0,
    noteRightMax = 0,
    noteUpMax = 0,
    
    noteDownHit = [],
    noteLeftHit = [],
    noteRightHit = [],
    noteUpHit = [],
    
    noteDownMap = [],
    noteLeftMap = [],
    noteRightMap = [],
    noteUpMap = [],
    
    noteDownUsed = [],
    noteLeftUsed = [],
    noteRightUsed = [],
    noteUpUsed = [],
    
    noteTemp = [],
//    noteDownChose = [],
//    noteLeftChose = [],
//    noteRightChose = [],
    barTargetL = windowHeight/2,
    barTargetR = windowHeight/2,
    barL = windowHeight/2,
    barR = windowHeight/2,
    totalNote = 0,
    combo = 0,
    score = 0,
    preScore = 0,
    hitThisFrame = 0,
    hitThisFrame2 = 0,
    offsetSec = 0,
    offsetBar = 0,
    currentPerfectJudge = 0.010,
    spq = 0,
    spu = 0,
    scene = false,
    mapFileType = false,
    musicFileOk = false,
    isFullScreen = false,
    defaultCanvasStyle = false,
    editMode = true,
    autoMode = true,
    showCS = false,
    showStart = -3,
    rollReverse = true,
    olr = 112,//(1920 - 5.8*300)/2*1920/windowWidth, //112/1920
    oud = 137/1080 * windowHeight,
    lr = olr,
    ud = oud,
    tlr = lr,
    tud = ud,
    udUnit = 270/1920 * windowWidth,
    lrUnit = 135/1920 * windowHeight,
    timer = new Date(),
    mainMouse = false,
    baseTime = timer.getTime(),
    thisTime = 0,
    nail = [],
    
   	showD = 0, //1 noteOnly 2 note&line,
   	showL = 0,
   	showR = 0,
   	showU = 0,
   	
    typeL = false,
    typeR = false,
    tempCanvas = null,
    tempContext = null,
    mixerSrc = null,
    playSrc = null,
    playCanvas = null,
    playContext = null,
    barCanvas = null,
    barContext = null,
    holdSrc = null,
    
    holdNoteCanvasU = null,
    holdNoteContextU = null,
    holdNoteCanvasD = null,
    holdNoteContextD = null,
    holdNoteCanvasL = null,
    holdNoteContextL = null,
    holdNoteCanvasR = null,
    holdNoteContextR = null,
    
    holdBoxCanvasU = null,
    holdBoxContextU = null,
    holdBoxCanvasD = null,
    holdBoxContextD = null,
    holdBoxCanvasL = null,
    holdBoxContextL = null,
    holdBoxCanvasR = null,
    holdBoxContextR = null,
    
    chainNoteCanvasU = null,
    chainNoteContextU = null,
    chainNoteCanvasD = null,
    chainNoteContextD = null,
    chainNoteCanvasL = null,
    chainNoteContextL = null,
    chainNoteCanvasR = null,
    chainNoteContextR = null,
    
    
    normalNoteCanvasU = null,
    normalNoteContextU = null,
    normalNoteCanvasL = null,
    normalNoteContextL = null,
    normalNoteCanvasR = null,
    normalNoteContextR = null,
    normalNoteCanvasD = null,
    normalNoteContextD = null,
    
    perfectShadowCanvasU = null,
    perfectShadowContextU = null,
    perfectShadowCanvasL = null,
    perfectShadowContextL = null,
    perfectShadowCanvasR = null,
    perfectShadowContextR = null,
    perfectShadowCanvasD = null,
    perfectShadowContextD = null,
    
    perfectJudgeCanvas = null,
    perfectJudgeContext = null,
    perfectShineCanvas = null,
    perfectShineContext = null,
    
    mixerShadowCanvasU = null,
    mixerShadowContextU = null,
    mixerShadowCanvasD = null,
    mixerShadowContextD = null,
    mixerShadowCanvasL = null,
    mixerShadowContextL = null,
    mixerShadowCanvasR = null,
    mixerShadowContextR = null,
    
    blankCanvasU = null,
    blankContextU = null,
    blankCanvasD = null,
    blankContextD = null,
    redCanvasU = null,
    redContextU = null,
    redCanvasD = null,
    redContextD = null,
    blueCanvasU = null,
    blueContextU = null,
    blueCanvasD = null,
    blueContextD = null,
    
    pauseCanvas = null,
    pauseContext = null,
    hardshipCanvas = null,
    hardshipContext = null,
    bg = false,
    bgSrc = new Image(),
    bgCanvas = null,
    bgContext = null,
    charSrc = null,
    charCanvas = null,
    charContext = null,
    numberSrc = null,
    numberCanvas = null,
    numberContext = null,
    canvas = null,
    ctx = null;
				   //N,S,H,Sub
	hitTypeMap[3] = [0,4,0,4];//Up
	hitTypeMap[0] = [0,4,0,4],//Down
	hitTypeMap[1] = [3,4,3,4],//Left
	hitTypeMap[2] = [3,4,3,4];//Right
	
	basicMenu = [
		["     Edit side", 6, 38],
		["[1]  NORMAL note", 46, 38, rgba(0, 255, 255, 0.8)],
		["[2]  CHAIN note", 86, 38, rgba(255, 128, 128, 0.8)],
		["[3]  HOLD note", 126, 38, rgba(255, 255, 0, 0.8)],
		["[4]  Edit mode", 166, 38, rgba(255, 255, 255, 0.8)],
		["[_]  Pause/Play", 206, 38],
		["     Mark here", 246, 38, rgba(128, 128, 255, 0.8)],
		["[M]  Start from mark", 286, 38, rgba(128, 128, 255, 0.8)],
		["[R]  Replay", 326, 38],
		["     Save As .xml", 366, 38],
		["     Save As .dy", 406, 38],
		["     Background", 446, 38],
		["     Hit sound", 486, 38],
		["     Animation", 526, 38],
		["     Music volume", 566, 38]
	],
	

	editMenu = [
		["     Delete", 6, 38],
		["     Copy", 46, 38]
	];
//New variables in v1.3
var bgAlpha = 0.3,
    rseed1 = 1.99,//1.261735634511,
    rseed2 = 1.83,// 3.365725756527,
	browser={
	    versions:function(){
	        var u = navigator.userAgent, app = navigator.appVersion;
	        return {
	            trident: u.indexOf('Trident') > -1, //IE内核
	            presto: u.indexOf('Presto') > -1, //opera内核
	            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
	            mobile: (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) || !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
	            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
	            iPad: u.indexOf('iPad') > -1, //是否iPad
	            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
	            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
	            qq: u.match(/\sQQ/i) == " qq" //是否QQ
	        };
    	}(),
	    language:(navigator.browserLanguage || navigator.language).toLowerCase()
	},
	isMobile = browser.versions.mobile,
	test = false,
	beatpm = 160;
	judge = getJudge(beatpm, "MEGA"),
	
	noteUpJudge = [],
	noteDownJudge = [],
	noteLeftJudge = [],
	noteRightJudge = [],
	
	touchAddList = {},
	touchMinusList = {},
	holdList = [],
	holdToTouch = {},
	touchToHold = {},
	mainSettings = new Settings(),
	deeMode = false,
	deeModeHold = false,
	dp = (windowWidth - lr)/2/(windowHeight - ud),
	downJump = true,
	leftJump = true,
	rightJump = true,
	upJump = true,
	downJumpHeight = 2.2,
	lrJumpHeight = 1.6,
	linkMode = true,
	linkType = "NORMAL",
	divLink = false,
	sansLoad = false,
	sansOnload = false,
	creatorType = "",
	barpmShiftList = [],
	fullComboImage = false,
	fullComboLoad = false,
	fullComboOnLoad = false,
	fullCombeCanvas = null,
	fullComboContext = null,
	extraImage = false,
	extraLoad = false,
	extraOnLoad = false,
	extraCanvas = false,
	extraContext = false,
	
    greatShadowCanvasU = null,
    greatShadowContextU = null,
    greatShadowCanvasD = null,
    greatShadowContextD = null,
    greatShadowCanvasL = null,
    greatShadowContextL = null,
    greatShadowCanvasR = null,
    greatShadowContextR = null,
    
    greatJudgeCanvas = null,
    greatJudgeContext = null,
    
    goodShadowCanvasU = null,
    goodShadowContextU = null,
    goodShadowCanvasD = null,
    goodShadowContextD = null,
    goodShadowCanvasL = null,
    goodShadowContextL = null,
    goodShadowCanvasR = null,
    goodShadowContextR = null,
    
    goodJudgeCanvas = null,
    goodJudgeContext = null,
    
    missShadowCanvasU = null,
    missShadowContextU = null,
    missShadowCanvasD = null,
    missShadowContextD = null,
    missShadowCanvasL = null,
    missShadowContextL = null,
    missShadowCanvasR = null,
    missShadowContextR = null,
    
    missJudgeCanvas = null,
    missJudgeContext = null,
    currentJudgeResult = "Great",
    comboAlpha = 1,
    shiftList = [],
    maxCombo = 0,
    thisNote = null,
	hiSpeed = 1200,
	hide = 0.10,
	viewport = null,
	viewTop = 0,
	viewCoef = 1,
	isMixerL = false,
	isMixerR = false,
	inputHispeed = 1.6,
	maskCanvas = null,
	maskCtx = null,
	maskVisiable = false,
	black = 0,
	hideHeight = 0,
	colorImage = null,
	colorCanvas = null,
	colorCtx = null,
	singleImage = null,
	singleCanvas = null,
	singleCtx = null,
	userOffsetSec = 0,
    particleImage = null,
    particleCanvas = null,
    particleContext = null,
   	blueParticleCanvas = null,
    blueParticleContext = null,
    greenParticleCanvas = null,
    greenParticleContext = null,
    yellowParticleCanvas = null,
    yellowParticleContext = null,
    purpleParticleCanvas = null,
    purpleParticleContext = null,
    whiteParticleCanvas = null,
    whiteParticleContext = null,
    playSettings = {
        smartCalculation: false,
    	hidden: false,
    	playbackSpeed: 1,
    	showTP: 0,
    	mirror: false,
    	mirrored: false,
    	twist: false,
    	simpleNote: false,
    	simpleEffect: false,
    	hideBG: false,
    	gamePosition: "MIDDLE"
    },
    debugSettings = {
    	alertError: false,
    	log: []
    };
	
document.oncontextmenu = function stop(){
	return false;
};

canvas = document.createElement("canvas");
canvas.width = windowWidth;
canvas.height = windowHeight;
canvas.id = "main";
document.getElementById("game").appendChild(canvas);
defaultCanvasStyle = $.extend(true, {}, canvas.style);


/* use webgl-2d.js */
// ctx = new WebGL2D(canvas)
/* end */

ctx = canvas.getContext("2d");
ctx.font = "30px Dynamix";
ctx.textBaseline = "Top";

maskCanvas = document.createElement("canvas");
maskCanvas.width = windowWidth;
maskCanvas.height = windowHeight;
/* use webgl-2d.js */
// maskCtx = new WebGL2D(maskCanvas)
/* end */
maskCtx = maskCanvas.getContext("2d");
maskCanvas.id = "mask";

if (isMobile) {
	if (! document.cookie) {
		document.cookie = "A";
	}
	else {
		document.cookie = document.cookie + "A";
	}
	//alert(document.cookie);
	document.body.style.height = "100%";
	document.body.style.width = "100%";
	document.body.style.margin = "0";
	document.body.style.padding = "0";
//	document.ontouchmove = function(e){
//	    e.preventDefault();
//	}
	viewport = getViewportSize();
	
	canvas.style.height = "100%";
	canvas.style.width = "100%";
	canvas.style.margin = "0";
	viewCoef = viewport.width/1920;
	viewTop = (viewport.height - viewport.width*(1080/1920))/2;
	canvas.style.paddingTop = viewTop + "px";
	canvas.style.display = "block";
	
}

playSrc = new Image();
playSrc.src = "images/play.png";
holdSrc = new Image();
holdSrc.src = "images/hold.png";
numberSrc = new Image();
numberSrc.src = "images/number.png";
particleImage = new Image();
particleImage.src = "./images/particle.png";
//charSrc = new Image();
//charSrc.src = "images/char2.png";

blankCanvasU = document.createElement("canvas"); blankContextU = blankCanvasU.getContext("2d"); blankCanvasU.width = 160; blankCanvasU.height = 100;
blankCanvasD = document.createElement("canvas"); blankContextD = blankCanvasD.getContext("2d"); blankCanvasD.width = 160; blankCanvasD.height = 100;
redCanvasU = document.createElement("canvas"); redContextU = redCanvasU.getContext("2d"); redCanvasU.width = 160; redCanvasU.height = 100;
redCanvasD = document.createElement("canvas"); redContextD = redCanvasD.getContext("2d"); redCanvasD.width = 160; redCanvasD.height = 100;
blueCanvasU = document.createElement("canvas"); blueContextU = blueCanvasU.getContext("2d"); blueCanvasU.width = 160; blueCanvasU.height = 100;
blueCanvasD = document.createElement("canvas"); blueContextD = blueCanvasD.getContext("2d"); blueCanvasD.width = 160; blueCanvasD.height = 100;
pauseCanvas = document.createElement("canvas"); pauseContext = pauseCanvas.getContext("2d"); pauseCanvas.width = 17; pauseCanvas.height = 92;
particleCanvas = document.createElement("canvas"); particleContext = particleCanvas.getContext("2d"); particleCanvas.width = 49; particleCanvas.height = 51;
blueParticleCanvas = document.createElement("canvas"); blueParticleContext = blueParticleCanvas.getContext("2d"); blueParticleCanvas.width = 49; blueParticleCanvas.height = 51;
greenParticleCanvas = document.createElement("canvas"); greenParticleContext = greenParticleCanvas.getContext("2d"); greenParticleCanvas.width = 49; greenParticleCanvas.height = 51;
yellowParticleCanvas = document.createElement("canvas"); yellowParticleContext = yellowParticleCanvas.getContext("2d"); yellowParticleCanvas.width = 49; yellowParticleCanvas.height = 51;
purpleParticleCanvas = document.createElement("canvas"); purpleParticleContext = purpleParticleCanvas.getContext("2d"); purpleParticleCanvas.width = 49; purpleParticleCanvas.height = 51;
whiteParticleCanvas = document.createElement("canvas"); whiteParticleContext = whiteParticleCanvas.getContext("2d"); whiteParticleCanvas.width = 49; whiteParticleCanvas.height = 51;
barCanvas = document.createElement("canvas"); barContext = barCanvas.getContext("2d"); barCanvas.width = 79; barCanvas.height = 234;  //131+67 741+67   
playCanvas = document.createElement("canvas"); playContext = playCanvas.getContext("2d"); playCanvas.width = 2048; playCanvas.height = 1320;
numberCanvas = document.createElement("canvas"); numberContext = numberCanvas.getContext("2d"); numberCanvas.width = 1541; numberCanvas.height = 176;
bgCanvas = document.createElement("canvas"); bgContext = bgCanvas.getContext("2d"); bgCanvas.width = 1920; bgCanvas.height = 1080;
hardshipCanvas = document.createElement("canvas"); hardshipContext = hardshipCanvas.getContext("2d"); hardshipCanvas.width = 190; hardshipCanvas.height = 258;
//charCanvas = document.createElement("canvas"); charContext = charCanvas.getContext("2d"); charCanvas.width = 1920; charCanvas.height = 1080;
holdNoteCanvasU = document.createElement("canvas"); holdNoteContextU = holdNoteCanvasU.getContext("2d"); holdNoteCanvasU.width = 512; holdNoteCanvasU.height = 256;
holdNoteCanvasD = document.createElement("canvas"); holdNoteContextD = holdNoteCanvasD.getContext("2d"); holdNoteCanvasD.width = 512; holdNoteCanvasD.height = 256;
holdNoteCanvasL = document.createElement("canvas"); holdNoteContextL = holdNoteCanvasL.getContext("2d"); holdNoteCanvasL.width = 256; holdNoteCanvasL.height = 512;
holdNoteCanvasR = document.createElement("canvas"); holdNoteContextR = holdNoteCanvasR.getContext("2d"); holdNoteCanvasR.width = 256; holdNoteCanvasR.height = 512;

holdBoxCanvasU = document.createElement("canvas"); holdBoxContextU = holdBoxCanvasU.getContext("2d"); holdBoxCanvasU.width = 69; holdBoxCanvasU.height = 108;
holdBoxCanvasD = document.createElement("canvas"); holdBoxContextD = holdBoxCanvasD.getContext("2d"); holdBoxCanvasD.width = 69; holdBoxCanvasD.height = 108;
holdBoxCanvasL = document.createElement("canvas"); holdBoxContextL = holdBoxCanvasL.getContext("2d"); holdBoxCanvasL.width = 108; holdBoxCanvasL.height = 69;
holdBoxCanvasR = document.createElement("canvas"); holdBoxContextR = holdBoxCanvasR.getContext("2d"); holdBoxCanvasR.width = 108; holdBoxCanvasR.height = 69;

chainNoteCanvasU = document.createElement("canvas"); chainNoteContextU = chainNoteCanvasU.getContext("2d"); chainNoteCanvasU.width = 122; chainNoteCanvasU.height = 77;
chainNoteCanvasD = document.createElement("canvas"); chainNoteContextD = chainNoteCanvasD.getContext("2d"); chainNoteCanvasD.width = 122; chainNoteCanvasD.height = 77;
chainNoteCanvasL = document.createElement("canvas"); chainNoteContextL = chainNoteCanvasL.getContext("2d"); chainNoteCanvasL.width = 77; chainNoteCanvasL.height = 122;
chainNoteCanvasR = document.createElement("canvas"); chainNoteContextR = chainNoteCanvasR.getContext("2d"); chainNoteCanvasR.width = 77; chainNoteCanvasR.height = 122;

normalNoteCanvasU = document.createElement("canvas"); normalNoteContextU = normalNoteCanvasU.getContext("2d"); normalNoteCanvasU.width = 45; normalNoteCanvasU.height = 28;
normalNoteCanvasD = document.createElement("canvas"); normalNoteContextD = normalNoteCanvasD.getContext("2d"); normalNoteCanvasD.width = 45; normalNoteCanvasD.height = 28;
normalNoteCanvasL = document.createElement("canvas"); normalNoteContextL = normalNoteCanvasL.getContext("2d"); normalNoteCanvasL.width = 28; normalNoteCanvasL.height = 45;
normalNoteCanvasR = document.createElement("canvas"); normalNoteContextR = normalNoteCanvasR.getContext("2d"); normalNoteCanvasR.width = 28; normalNoteCanvasR.height = 45;

missShadowCanvasU = document.createElement("canvas"); missShadowContextU = missShadowCanvasU.getContext("2d"); missShadowCanvasU.width = 545; missShadowCanvasU.height = 905;
missShadowCanvasD = document.createElement("canvas"); missShadowContextD = missShadowCanvasD.getContext("2d"); missShadowCanvasD.width = 545; missShadowCanvasD.height = 905;
missShadowCanvasL = document.createElement("canvas"); missShadowContextL = missShadowCanvasL.getContext("2d"); missShadowCanvasL.width = 905; missShadowCanvasL.height = 545;
missShadowCanvasR = document.createElement("canvas"); missShadowContextR = missShadowCanvasR.getContext("2d"); missShadowCanvasR.width = 905; missShadowCanvasR.height = 545;

missJudgeCanvas = document.createElement("canvas"); missJudgeContext = missJudgeCanvas.getContext("2d"); missJudgeCanvas.width = 438; missJudgeCanvas.height = 153;

goodShadowCanvasU = document.createElement("canvas"); goodShadowContextU = goodShadowCanvasU.getContext("2d"); goodShadowCanvasU.width = 545; goodShadowCanvasU.height = 905;
goodShadowCanvasD = document.createElement("canvas"); goodShadowContextD = goodShadowCanvasD.getContext("2d"); goodShadowCanvasD.width = 545; goodShadowCanvasD.height = 905;
goodShadowCanvasL = document.createElement("canvas"); goodShadowContextL = goodShadowCanvasL.getContext("2d"); goodShadowCanvasL.width = 905; goodShadowCanvasL.height = 545;
goodShadowCanvasR = document.createElement("canvas"); goodShadowContextR = goodShadowCanvasR.getContext("2d"); goodShadowCanvasR.width = 905; goodShadowCanvasR.height = 545;

goodJudgeCanvas = document.createElement("canvas"); goodJudgeContext = goodJudgeCanvas.getContext("2d"); goodJudgeCanvas.width = 438; goodJudgeCanvas.height = 153;

greatShadowCanvasU = document.createElement("canvas"); greatShadowContextU = greatShadowCanvasU.getContext("2d"); greatShadowCanvasU.width = 545; greatShadowCanvasU.height = 905;
greatShadowCanvasD = document.createElement("canvas"); greatShadowContextD = greatShadowCanvasD.getContext("2d"); greatShadowCanvasD.width = 545; greatShadowCanvasD.height = 905;
greatShadowCanvasL = document.createElement("canvas"); greatShadowContextL = greatShadowCanvasL.getContext("2d"); greatShadowCanvasL.width = 905; greatShadowCanvasL.height = 545;
greatShadowCanvasR = document.createElement("canvas"); greatShadowContextR = greatShadowCanvasR.getContext("2d"); greatShadowCanvasR.width = 905; greatShadowCanvasR.height = 545;
greatJudgeCanvas = document.createElement("canvas"); greatJudgeContext = greatJudgeCanvas.getContext("2d"); greatJudgeCanvas.width = 438; greatJudgeCanvas.height = 153;

perfectShadowCanvasU = document.createElement("canvas"); perfectShadowContextU = perfectShadowCanvasU.getContext("2d"); perfectShadowCanvasU.width = 545; perfectShadowCanvasU.height = 905;
perfectShadowCanvasD = document.createElement("canvas"); perfectShadowContextD = perfectShadowCanvasD.getContext("2d"); perfectShadowCanvasD.width = 545; perfectShadowCanvasD.height = 905;
perfectShadowCanvasL = document.createElement("canvas"); perfectShadowContextL = perfectShadowCanvasL.getContext("2d"); perfectShadowCanvasL.width = 905; perfectShadowCanvasL.height = 545;
perfectShadowCanvasR = document.createElement("canvas"); perfectShadowContextR = perfectShadowCanvasR.getContext("2d"); perfectShadowCanvasR.width = 905; perfectShadowCanvasR.height = 545;
perfectJudgeCanvas = document.createElement("canvas"); perfectJudgeContext = perfectJudgeCanvas.getContext("2d"); perfectJudgeCanvas.width = 438; perfectJudgeCanvas.height = 153;
perfectShineCanvas = document.createElement("canvas"); perfectShineContext = perfectShineCanvas.getContext("2d"); perfectShineCanvas.width = 514; perfectShineCanvas.height = 201;

mixerShadowCanvasU = document.createElement("canvas"); mixerShadowContextU = mixerShadowCanvasU.getContext("2d"); mixerShadowCanvasU.width = 381; mixerShadowCanvasU.height = 437;
mixerShadowCanvasD = document.createElement("canvas"); mixerShadowContextD = mixerShadowCanvasD.getContext("2d"); mixerShadowCanvasD.width = 381; mixerShadowCanvasD.height = 437;
mixerShadowCanvasL = document.createElement("canvas"); mixerShadowContextL = mixerShadowCanvasL.getContext("2d"); mixerShadowCanvasL.width = 437; mixerShadowCanvasL.height = 381;
mixerShadowCanvasR = document.createElement("canvas"); mixerShadowContextR = mixerShadowCanvasR.getContext("2d"); mixerShadowCanvasR.width = 437; mixerShadowCanvasR.height = 381;


if (isMobile) {
	colorCanvas = document.createElement("canvas"); colorCtx = colorCanvas.getContext("2d"); colorCanvas.width = 1024; colorCanvas.height = 1024;
	singleCanvas = document.createElement("canvas"); singleCtx = singleCanvas.getContext("2d"); singleCanvas.width = 1024; singleCanvas.height = 1024;
	extraImage = new Image();
	colorImage = new Image();
	singleImage = new Image();
	extraImage.src = "./images/EXTRA.png";
	colorImage.src = "./images/oac/ColorSmall.png";
	singleImage.src = "./images/oac/SingleSmall.png";
	imgLoad(extraImage, function() {
		greatShadowContextD.drawImage(extraImage, 0, 296, 545, 905, 0, 0, 545, 905);
		greatShadowContextL.save();
		greatShadowContextL.translate(905, 0);
		greatShadowContextL.rotate(90 * Math.PI/180);
		greatShadowContextL.drawImage(greatShadowCanvasD, 0, 0);
		greatShadowContextL.restore();
		greatShadowContextU.save();
		greatShadowContextU.translate(545, 905);
		greatShadowContextU.rotate(Math.PI);
		greatShadowContextU.drawImage(greatShadowCanvasD, 0, 0);
		greatShadowContextU.restore();
		greatShadowContextR.save();
		greatShadowContextR.translate(0, 545);
		greatShadowContextR.rotate(270 * Math.PI/180);
		greatShadowContextR.drawImage(greatShadowCanvasD, 0, 0);
		greatShadowContextR.restore();
		greatJudgeContext.drawImage(extraImage, 0, 0, 438, 153, 0, 0, 438, 153);
		
		goodShadowContextD.drawImage(extraImage, 568, 296, 545, 905, 0, 0, 545, 905);
		goodShadowContextL.save();
		goodShadowContextL.translate(905, 0);
		goodShadowContextL.rotate(90 * Math.PI/180);
		goodShadowContextL.drawImage(goodShadowCanvasD, 0, 0);
		goodShadowContextL.restore();
		goodShadowContextU.save();
		goodShadowContextU.translate(545, 905);
		goodShadowContextU.rotate(Math.PI);
		goodShadowContextU.drawImage(goodShadowCanvasD, 0, 0);
		goodShadowContextU.restore();
		goodShadowContextR.save();
		goodShadowContextR.translate(0, 545);
		goodShadowContextR.rotate(270 * Math.PI/180);
		goodShadowContextR.drawImage(goodShadowCanvasD, 0, 0);
		goodShadowContextR.restore();
		goodJudgeContext.drawImage(extraImage, 277, 0, 350, 153, 0, 0, 350, 153);
	
		missShadowContextD.drawImage(extraImage, 1128, 292, 545, 905, 0, 0, 545, 905);
		missShadowContextL.save();
		missShadowContextL.translate(905, 0);
		missShadowContextL.rotate(90 * Math.PI/180);
		missShadowContextL.drawImage(missShadowCanvasD, 0, 0);
		missShadowContextL.restore();
		missShadowContextU.save();
		missShadowContextU.translate(545, 905);
		missShadowContextU.rotate(Math.PI);
		missShadowContextU.drawImage(missShadowCanvasD, 0, 0);
		missShadowContextU.restore();
		missShadowContextR.save();
		missShadowContextR.translate(0, 545);
		missShadowContextR.rotate(270 * Math.PI/180);
		missShadowContextR.drawImage(missShadowCanvasD, 0, 0);
		missShadowContextR.restore();
		missJudgeContext.drawImage(extraImage, 506, 0, 350, 153, 0, 0, 350, 153);
	});
	imgLoad(colorImage, function() {
		colorCtx.drawImage(colorImage, 0, 0);
	});
	imgLoad(singleImage, function() {
		singleCtx.drawImage(singleImage, 0, 0);
	});
}

imgLoad(playSrc, function() {
	barContext.drawImage(playSrc, 0, 152, 79, 234, 0, 0, 79, 234);
	hardshipContext.drawImage(playSrc, 0, 416, 190, 258, 0, 0, 190, 258);
	perfectJudgeContext.drawImage(playSrc, 951, 203, 438, 153, 0, 0, 438, 153);
	perfectShineContext.drawImage(playSrc, 913, 0, 514, 201, 0, 0, 514, 201);
	
	mixerShadowContextD.drawImage(playSrc, 951, 359, 381, 437, 0, 0, 381, 437);
	mixerShadowContextL.save();
	mixerShadowContextL.translate(437, 0);
	mixerShadowContextL.rotate(90 * Math.PI/180);
	mixerShadowContextL.drawImage(mixerShadowCanvasD, 0, 0);
	mixerShadowContextL.restore();
	mixerShadowContextU.save();
	mixerShadowContextU.translate(381, 437);
	mixerShadowContextU.rotate(Math.PI);
	mixerShadowContextU.drawImage(mixerShadowCanvasD, 0, 0);
	mixerShadowContextU.restore();
	mixerShadowContextR.save();
	mixerShadowContextR.translate(0, 381);
	mixerShadowContextR.rotate(270 * Math.PI/180);
	mixerShadowContextR.drawImage(mixerShadowCanvasD, 0, 0);
	mixerShadowContextR.restore();
	
	normalNoteContextD.drawImage(playSrc, 1, 105, 45, 28, 0, 0, 45, 28);
	normalNoteContextL.save();
	normalNoteContextL.translate(28, 0);
	normalNoteContextL.rotate(90 * Math.PI/180);
	normalNoteContextL.drawImage(normalNoteCanvasD, 0, 0);
	normalNoteContextL.restore();
	normalNoteContextU.save();
	normalNoteContextU.translate(45, 28);
	normalNoteContextU.rotate(Math.PI);
	normalNoteContextU.drawImage(normalNoteCanvasD, 0, 0);
	normalNoteContextU.restore();
	normalNoteContextR.save();
	normalNoteContextR.translate(0, 45);
	normalNoteContextR.rotate(270 * Math.PI/180);
	normalNoteContextR.drawImage(normalNoteCanvasD, 0, 0);
	normalNoteContextR.restore();
	
	chainNoteContextD.drawImage(playSrc, 1, 16, 122, 77, 0, 0, 122, 77);
	chainNoteContextL.save();
	chainNoteContextL.translate(77, 0);
	chainNoteContextL.rotate(90 * Math.PI/180);
	chainNoteContextL.drawImage(chainNoteCanvasD, 0, 0);
	chainNoteContextL.restore();
	chainNoteContextU.save();
	chainNoteContextU.translate(122, 77);
	chainNoteContextU.rotate(Math.PI);
	chainNoteContextU.drawImage(chainNoteCanvasD, 0, 0);
	chainNoteContextU.restore();
	chainNoteContextR.save();
	chainNoteContextR.translate(0, 122);
	chainNoteContextR.rotate(270 * Math.PI/180);
	chainNoteContextR.drawImage(chainNoteCanvasD, 0, 0);
	chainNoteContextR.restore();
	
	holdBoxContextD.drawImage(playSrc, 0, 677, 69, 108, 0, 0, 69, 108);
	holdBoxContextL.save();
	holdBoxContextL.translate(108, 0);
	holdBoxContextL.rotate(90 * Math.PI/180);
	holdBoxContextL.drawImage(holdBoxCanvasD, 0, 0);
	holdBoxContextL.restore();
	holdBoxContextU.save();
	holdBoxContextU.translate(69, 108);
	holdBoxContextU.rotate(Math.PI);
	holdBoxContextU.drawImage(holdBoxCanvasD, 0, 0);
	holdBoxContextU.restore();
	holdBoxContextR.save();
	holdBoxContextR.translate(0, 69);
	holdBoxContextR.rotate(270 * Math.PI/180);
	holdBoxContextR.drawImage(holdBoxCanvasD, 0, 0);
	holdBoxContextR.restore();
	
	holdAutoBoxU = new autoBox(holdBoxCanvasU, {x: 0, y: 0, width: 69, height: 108}, 32, 55, 35, 56, 0, 0, 20, 12);
	holdAutoBoxD = new autoBox(holdBoxCanvasD, {x: 0, y: 0, width: 69, height: 108}, 34, 52, 37, 53, 0, 0, 12, 20);
	holdAutoBoxL = new autoBox(holdBoxCanvasL, {x: 0, y: 0, width: 108, height: 69}, 55, 32, 56, 35, 12, 20, 0, 0);
	holdAutoBoxR = new autoBox(holdBoxCanvasR, {x: 0, y: 0, width: 108, height: 69}, 52, 34, 53, 37, 20, 12, 0, 0);
	
	perfectShadowContextD.drawImage(playSrc, 361, 38, 545, 905, 0, 0, 545, 905);
	perfectShadowContextL.save();
	perfectShadowContextL.translate(905, 0);
	perfectShadowContextL.rotate(90 * Math.PI/180);
	perfectShadowContextL.drawImage(perfectShadowCanvasD, 0, 0);
	perfectShadowContextL.restore();
	perfectShadowContextR.save();
	perfectShadowContextR.translate(0, 545);
	perfectShadowContextR.rotate(270 * Math.PI/180);
	perfectShadowContextR.drawImage(perfectShadowCanvasD, 0, 0);
	perfectShadowContextR.restore();
	
	blankContextD.drawImage(playSrc, 147, 0, 160, 100, 0, 0, 160, 100);
	blankContextU.save();
	blankContextU.translate(160, 100);
	blankContextU.rotate(180 * Math.PI/180);
	blankContextU.drawImage(blankCanvasD, 0, 0);
	blankContextU.restore();
	
	redContextD.drawImage(playSrc, 147, 100, 160, 100, 0, 0, 160, 100);
	redContextU.save();
	redContextU.translate(160, 100);
	redContextU.rotate(180 * Math.PI/180);
	redContextU.drawImage(redCanvasD, 0, 0);
	redContextU.restore();
	
	blueContextD.drawImage(playSrc, 147, 200, 160, 100, 0, 0, 160, 100);
	blueContextU.save();
	blueContextU.translate(160, 100);
	blueContextU.rotate(180 * Math.PI/180);
	blueContextU.drawImage(blueCanvasD, 0, 0);
	blueContextU.restore();
	
	pauseContext.drawImage(playSrc, 339, 8, 17, 92, 0, 0, 17, 92);
	
//	yellowParticleContext.drawImage(playSrc, 1, 814, 116, 146, 0, 0, 116, 146);
//
//	purpleParticleContext.drawImage(playSrc, 117, 814, 116, 146, 0, 0, 116, 146);
//
//	whiteParticleContext.drawImage(playSrc, 233, 814, 116, 146, 0, 0, 116, 146);
});

//imgLoad(charSrc, function() {
//	charContext.drawImage(charSrc, 0, 0);
//});
imgLoad(holdSrc, function() {
	holdNoteContextD.drawImage(holdSrc, 0, 0);
	holdNoteContextL.save();
	holdNoteContextL.translate(256, 0);
	holdNoteContextL.rotate(90 * Math.PI/180);
	holdNoteContextL.drawImage(holdNoteCanvasD, 0, 0);
	holdNoteContextL.restore();
	holdNoteContextU.save();
	holdNoteContextU.translate(256, 512);
	holdNoteContextU.rotate(Math.PI);
	holdNoteContextU.drawImage(holdNoteCanvasD, 0, 0);
	holdNoteContextU.restore();
	holdNoteContextR.save();
	holdNoteContextR.translate(0, 512);
	holdNoteContextR.rotate(270 * Math.PI/180);
	holdNoteContextR.drawImage(holdNoteCanvasD, 0, 0);
	holdNoteContextR.restore();
});

imgLoad(numberSrc, function() {
	numberContext.drawImage(numberSrc, 0, 0, 1541, 176, 0, 0, 1541, 176);
});


imgLoad(particleImage, function() {
	particleContext.drawImage(particleImage, 0, 0);
	var imageData = particleContext.getImageData(0, 0, 49, 51);
	function buildParticle(ctx, color) {
		var imageDataTemp = ctx.createImageData(49, 51);
		for (var i = 0, l = imageDataTemp.data.length; i < l; i += 4) {
			imageDataTemp.data[i] = color.r;
			imageDataTemp.data[i + 1] = color.g;
			imageDataTemp.data[i + 2] = color.b;
			imageDataTemp.data[i + 3] = imageData.data[i];
		}
		ctx.putImageData(imageDataTemp, 0, 0, 0, 0, 49, 51);
	}
	buildParticle(blueParticleContext, {r: 0, g: 0, b: 255});
	buildParticle(greenParticleContext, {r: 0, g: 255, b: 0});
	buildParticle(yellowParticleContext, {r: 255, g: 255, b: 0});
	buildParticle(purpleParticleContext, {r: 255, g: 0, b: 255});
	buildParticle(whiteParticleContext, {r: 255, g: 255, b: 255});
});

var mainPlayView = new playView();
var mainFpsWatcher = new fpsWatcher();
	mainFpsWatcher.set();
var mainKeybord = new keyboard();
	mainKeybord.set();
var mainPrepareResultScene = new prepareResultScene();
var mainResultScene = new resultScene();
 
mapFileElement = document.createElement("input");
mapFileElement.type = "file";
mapFileElement.multiple  = true;
mapFileElement.style = "display:none";
mapFileElement.addEventListener("change", function () {
	mapFileCtrl = this.files;
}, false);

musicFileElement = document.createElement("input");
musicFileElement.type = "file";
//musicFileElement.accept = "audio/*,video/*";
musicFileElement.style = "display:none";
musicFileElement.addEventListener("change", function () {
	musicFileCtrl = this.files[0]; 
}, false);


window.onload = function () {
	window.scrollTo(0,1);
	window.addEventListener("orientationchange", function() {
		viewport = getViewportSize();
		viewCoef = viewport.width/1920;
		viewTop = (viewport.height - viewport.width*(1080/1920))/2;
		canvas.style.paddingTop = viewTop + "px";
	});
	mainMouse = new mouse(canvas);
	musicPlayButton = $("#goplay")[0];
	function onMouseWheel(event) {
		if (! musicCtrl) {
			return;
		}
		var event = event || window.event;
		if (event.wheelDelta ? event.wheelDelta < 0 : event.detail > 0) {
			if (rollReverse) {
				setTime(musicCtrl.currentTime - 100 / hiSpeed);
			}
			else {
				setTime(musicCtrl.currentTime + 100 / hiSpeed);
			}
	       	resetAnime();
		}
		else {
			if (rollReverse) {
				setTime(musicCtrl.currentTime + 100 / hiSpeed);
			}
			else {
				setTime(musicCtrl.currentTime - 100 / hiSpeed);
			}
	       	resetAnime();
		}
	}
	var gameDiv = document.getElementById("game");
	addEvent(gameDiv,'mousewheel',onMouseWheel);
	addEvent(gameDiv,'DOMMouseScroll',onMouseWheel);
		
	backgroundFileElement = document.createElement("input");
	backgroundFileElement.type = "file";
	backgroundFileElement.accept = "image/png,image/jpg,image/jpeg";
	backgroundFileElement.style = "opacity: 0;";
	backgroundFileElement.addEventListener("change", function () {
		backgroundFileCtrl = this.files[0]; 
		bgSrc.src = window.URL.createObjectURL(backgroundFileCtrl);
		imgLoad(bgSrc, function() {
			bgContext.save();
			bgContext.fillStyle = "#111";
			bgContext.fillRect(0, 0, windowWidth, windowHeight);
			bgContext.drawImage(bgSrc, 0, 0, bgSrc.width, bgSrc.height, 0, 0, windowWidth, windowHeight);
			bgContext.restore();
			bg = true;
		});
	}, false);
	chartName = document.getElementById("chartName");
	beatpmName = document.getElementById("beatpm");
	barpmName = document.getElementById("barpm");
	offsetSecName = document.getElementById("offsetSec");
	offsetBarName = document.getElementById("offsetBar");
	hardshipName = document.getElementById("hardship");
	leftName = document.getElementById("left");
	rightName = document.getElementById("right");
	beatpmName.onchange = barpmName.onchange = function() {
		var bar = Number(barpmName.value);
		var beat = Number(beatpmName.value);
		if (isNaN(beat) || beat <= 0 || isNaN(bar) || bar <= 0) {
			offsetSecName.disabled = "disabled";
			offsetBarName.disabled = "disabled";
			offsetSecName.style.backgroundColor = "red";
			offsetBarName.style.backgroundColor = "red";
		}
		else {
			offsetSecName.disabled = false;
			offsetBarName.disabled = false;
			offsetSecName.style.backgroundColor = "rgb(25,25,25)";
			offsetBarName.style.backgroundColor = "rgb(25,25,25)";
		}
	}
	offsetSecName.onchange = function() {
		offsetBarName.value = this.value * (barpmName.value / 60);
	}
	offsetBarName.onchange = function() {
		offsetSecName.value = this.value / (barpmName.value / 60);
	}
	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		AC = new window.AudioContext();
	}
	catch (e) {
		alert("Your browser does't support Web Audio API");
	}
	if (AC) {// smart way
		for (var i = 0; i < hitUrl.length; ++i) {
			totalHitBuffer++;
			loadSound(hitUrl[i], i);
		}
	}
	else {// shitty way
		for (var i = 0; i < hitUrl.length; ++i) {
			hitCtrl[i] = [];
			totalHitBuffer++;
			audioLoad(hitUrl[i], function(audio){
				audio.id = "hit" + i;
				$("body").append(audio);
				hitCtrl[i][0] = audio;
				loaded++;
			});
			for (var j = 1; j < hitBuffer[i]; ++j) {
				hitCtrl[i][j] = hitCtrl[i][0].cloneNode(true);
			}
		}
	}
}

var round = false;
CanvasRenderingContext2D.prototype.oldDrawImage = CanvasRenderingContext2D.prototype.drawImage;
var roundDrawImage = function(a, b, c, d, e, f, g, h, i) {
	if (round) {
		if (i != undefined) {
			this.oldDrawImage(a, Math.floor(b), Math.floor(c), Math.floor(d), Math.floor(e), Math.floor(f), Math.floor(g), Math.floor(h), Math.floor(i));
		}
		else if (e != undefined) {
			this.oldDrawImage(a, Math.floor(b), Math.floor(c), Math.floor(d), Math.floor(e));
		}
		else {
			this.oldDrawImage(a, Math.floor(b), Math.floor(c));
		}
	}
	else {
		if (i != undefined) {
			if (d <= 0 || e <= 0 || h <= 0 || i <= 0) {
				return;
			}
			try {
				this.oldDrawImage(a, b, c, d, e, f, g, h, i);
			}
			catch(e) {
				alert(e.name + " " + e.message);
				alert(b+"-"+c+"-"+d+"-"+e+"-"+f+"-"+g+"-"+h+"-"+i);
			}
		}
		else if (e != undefined) {
			this.oldDrawImage(a, b, c, d, e);
		}
		else {
			this.oldDrawImage(a, b, c);
		}
	}
}
//CanvasRenderingContext2D.prototype.drawImage = roundDrawImage;

if (isMobile) {
	scene = new startMenuSceneMobile();
}
else {
	scene = new startMenuScene();
}
var newStyle;

function fullColor(color) {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 1920, 1080);
}
function drawMask(alpha) {
	if (blurComplete) {
		ctx.globalAlpha = alpha;
		ctx.drawImage(maskCanvas, 0, 0, 1920, 1080);
		ctx.globalAlpha = 1;
	}
}
function drawBG(alpha) {
	ctx.globalAlpha = alpha;
	ctx.drawImage(bgCanvas, 0, 0, 1920, 1080);
	ctx.globalAlpha = 1;
}
function backGroundUpdate() {
	
}
var main = function () {
	ctx.textAlign = "center";
	try{
		
	fullColor("#222");
	mainKeybord.refresh();
	scene.refresh();
	mainFpsWatcher.refresh();
	mainSettings.refresh();
	if (mainMouse) {
		mainMouse.refresh();
	}
//	holdAutoBoxD.draw(ctx, {x: 100, y: 200, width: 200, height: 200});
//	holdAutoBoxU.draw(ctx, {x: 350, y: 200, width: 200, height: 200});
//	holdAutoBoxL.draw(ctx, {x: 600, y: 200, width: 200, height: 200});
//	holdAutoBoxR.draw(ctx, {x: 850, y: 200, width: 200, height: 200});
//	ctx.fillRect(0, 200, 1920, 1);
//	ctx.fillRect(0, 400, 1920, 1);
	}
	catch(e) {
		if (debugSettings.alertError) {
			ctx.fillStyle = "white";
			ctx.font = "30px Dynamix";
			ctx.fillText(loaded + '/' + (6 + totalHitBuffer + (isMobile ? 3 : 0)), windowWidth-120, windowHeight-100);
			if (musicCtrl) {
				ctx.textAlign = "left";
				ctx.fillText("src: " + musicCtrl.src, 0, 10);
				ctx.fillText("currentSrc: " + musicCtrl.currentSrc, 0, 40);
				ctx.fillText("state: " + musicCtrl.readyState, 0, 70);
				ctx.fillText("time: " + musicCtrl.currentTime, 0, 100);
				ctx.fillText("duration: " + musicCtrl.duration, 0, 130);
				ctx.fillText("ended: " + musicCtrl.ended, 0, 160);
				ctx.fillText("paused: " + musicCtrl.paused, 0, 190);
				ctx.fillText("buffered length: " + musicCtrl.buffered.length, 0, 220);
				for (var i = 0; i < musicCtrl.buffered.length; ++i) {
					ctx.fillText("buffered: " + i + "> " + musicCtrl.buffered.start(i) + "~" + musicCtrl.buffered.end(i), 0, 250 + 30*i);
				}
			}
			alert("name: " + e.name + "\nmessage: " + e.message + "\nstack: " + e.stack); 
		}
		debugSettings.log.push(e);
	}
	ctx.fillStyle = "red";
	ctx.font = "16px Dynamix";
	ctx.textAlign = "left";
	var i, k = 0;
	for (i = Math.max(0, debugSettings.log.length - 10); i < debugSettings.log.length; ++i, ++k) {
		ctx.fillText(debugSettings.log[i].name, 0, windowHeight*(0.02*(k*3)));
		ctx.fillText(debugSettings.log[i].message, 0, windowHeight*(0.02*(k*3+1)));
		ctx.fillText(debugSettings.log[i].stack, 0, windowHeight*(0.02*(k*3+2)));
	}
	requestAnimationFrame(main);
};

setTouch();
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
main();







//	try {
	
//	if (sansLoad && !sansOnload) {
//		newStyle = document.createElement('style');
//		newStyle.appendChild(document.createTextNode("@font-face {font-family: \"sans\"; src: url(\"./Font/SourceHanSans-Bold.otf\") format(\"opentype\");}"));
//		document.head.appendChild(newStyle);
//		sansOnload = true;
//	}