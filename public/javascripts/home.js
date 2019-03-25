var fileReader = new FileReader(),
	currentMapId = "",
	coverFileElement = null;

window.onload = function() {
	coverFileElement = document.querySelector('.upload');
	coverFileElement.addEventListener("change", function () {
		if (this.files.length > 0) {
			console.log(currentMapId, this.files[0]);
			var data = new FormData();
			data.append('mapId', currentMapId);
			data.append('imageData', this.files[0]);
			console.log(data.getAll('mapId'), data.getAll('imagaData'));
			$.ajax({
				type:"POST",
				url:"/maps/coverupload",
			    processData: false,
			    contentType: false,
				data: data
			});
		}
	}, false);
	var maps = document.querySelectorAll('#eachTr');
	for (var n of maps) {
		
		n.mapId = n.getAttribute('mapid');
		n.oanclick = function() {
			currentMapId = this.mapId;
			coverFileElement.focus();
			coverFileElement.click();
		}
	}
}