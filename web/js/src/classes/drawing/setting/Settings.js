fm.Package("drawing.setting");
fm.Class("Settings");
drawing.setting.Settings = function (me) {
	this.setMe = function(_me){ me = _me };

	this.Settings = function () {
		this.width = 700;
		this.height = 400;
		this.offset = $("#container").offset();
		$("#container").css({
			width: me.width,
			height: me.height
		});
	};
};
