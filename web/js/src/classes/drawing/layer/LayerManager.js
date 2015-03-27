fm.Package("drawing.layer");
fm.Import("jfm.dom.DomManager");
fm.Import("drawing.layer.BackgroundLayer");
fm.Import("drawing.layer.Layer");
fm.Class("LayerManager", function(me, DomManager, BackgroundLayer, Layer){
	"use strict";

	this.setMe = function (_me) {
		me = _me;
	}

	var drawing;
	this.LayerManager = function(drw){
		drawing = drw;
        me.backgroudLayer = new BackgroundLayer(drawing, $("canvas#background-canvas"));
        me.backgroudLayer.fill(10);
        me.selectedLayer = me.backgroudLayer;
        me.frontLayer = new  Layer(drawing, $("canvas#front-canvas"));
		me.layerList = [me.backgroudLayer];
	};

    this.onLayoutChange = function () {
        me.layerList.forEach(function (layer) {
            layer.changeSize();
        });
        me.frontLayer.changeSize();
    };

	this.getSelectedLayer = function () {
		return me.selectedLayer;
	};

    this.remove = function (layer) {
        layer = layer || me.selectedLayer;
        var index = me.layerList.indexOf(layer);
        if (index !== -1){
            var isSelected = me.isSelected(layer);
            me.layerList.splice(index, 1);
            layer.destroy();
            if(isSelected){
                me.selectLayer(me.layerList[index - 1]);
            }
        }
    }

    this.addLayer = function(name){
        name = name || "Layer " + me.layerList.length;
        me.layerList.push(new Layer(drawing, undefined, $("#layerContainer"), name));
        me.selectedLayer = me.layerList[me.layerList.length - 1];
    };

    this.addDuplicateLayer = function () {
        var data = me.selectedLayer.getData();
        me.addLayer(me.selectedLayer.name + "- duplicate");
        me.selectedLayer.setData(data);
    };

    this.addImageLayer = function(data, name){
        me.addLayer(name);
        me.selectedLayer.setImageDataURL(data, function(width, height){
            width = Math.max(drawing.settings.width, width);
            height = Math.max(drawing.settings.height, height);
            $("#container").css({
                width: width,
                height: height
            });
            drawing.onLayoutChange(width, height);
        });
    };

    this.selectLayer = function(layer){
    	me.selectedLayer = layer;
    };

    this.isSelected = function (layer) {
    	return me.selectedLayer === layer;
    };

    this.showHideLayer = function (layer) {
        layer = layer || me.selectedLayer;
        layer.toggle();
    };

    this.clearLayer = function (layer) {
        layer = layer || me.selectedLayer;
        layer.clear();
    }

    this.resizeLayer = function (layer, width, height) {
        layer = layer || me.selectedLayer;
        layer.resizeContent(width, height);
    }
});