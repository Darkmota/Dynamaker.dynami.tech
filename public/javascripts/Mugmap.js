function Mugmap() {
	this.getRotateMatrix = function() {
		
	}
	
	this.matrix = {
		Hscale: 1,
		Htilt: 0,
		Vtilt: 0,
		Vscale: 1,
		Htranslate: 0,
		Vtranslate: 0
	}
	this.matrix = [[1, 0, 0],
					[0, 1, 0],
					[0, 0, 1]]
	this.notes = [];
}

Mugmap.prototype.getHscale = function(ctx) {
	ctx.save();
	ctx.transform(Hscale, Htilt, Vtilt, Vscale, Htranslate, Vtranslate);
}

Mugmap.prototype.set = function(ctx) {
	ctx.save();
	ctx.transform(Hscale, Htilt, Vtilt, Vscale, Htranslate, Vtranslate);
}

Mugmap.prototype.unset = function(ctx) {
	ctx.restore();
}
