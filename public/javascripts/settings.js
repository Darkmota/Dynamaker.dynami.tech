function Settings() {
	this.active = false;
	this.barpmInput = document.getElementById("")
}

Settings.prototype = {
	activate:function () {
		this.active = true;
		$(".settings").css('display', 'block');
	},
	freeze:function () {
		this.active = false;
		$(".settings").css('display', 'none');
		
	},
	refresh:function () {
		if (!this.active) {
			return;
		}
	}
}
