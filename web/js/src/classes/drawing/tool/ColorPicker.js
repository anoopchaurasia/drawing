fm.Package("drawing.tool");
fm.Class("ColorPicker", "drawing.tool.Tool");

drawing.tool.ColorPicker = function (base, me) {
	'use strict';	

	this.setMe = function (_me) {
		me = _me;
	};

	var layerManager;

	this.ColorPicker = function (drw) {
		base(drw);
		layerManager = drw.layerManager;
	};

	this.pick = function (startX, startY) {
		var layer = layerManager.selectedLayer;
		var canvasWidth = layer.canvas[0].width;
		var pixelPos = (startY * canvasWidth + startX) * 4;
		var outlineLayerData = layer.getData().data;
        var clickedColorR = new Number(outlineLayerData[pixelPos + 0]).toString(16);
        var clickedColorG = new Number(outlineLayerData[pixelPos + 1]).toString(16);
        var clickedColorB = new Number(outlineLayerData[pixelPos + 2]).toString(16);
        return "#" + setTwoChar(clickedColorR) + setTwoChar(clickedColorG) + setTwoChar(clickedColorB); 
	};

	this.setCursor = function () {
		// body...
	};

	function setTwoChar (value) {
		if(value.length === 1){
			value = "0" + value;
		}
		return value;
	}

	 /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return me.package.ToolManager.MODE_COLOR_PICKER;
    };
};