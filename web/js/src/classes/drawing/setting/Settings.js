fm.Package("drawing.setting");
fm.Class("Settings", function (me) {
	this.setMe = function(_me){ me = _me };

	this.Settings = function () {
		this.width = 700;
		this.height = 400;
		this.color = null;
		this.selectedColor = null;
		this.lineWidth = 1;
		this.strokeStyle = "#ff0000";
		this.fillColor = "#ff0000";
		this.offset = $("#container").offset();
		$("#container").css({
			width: me.width,
			height: me.height
		});
	};
});
