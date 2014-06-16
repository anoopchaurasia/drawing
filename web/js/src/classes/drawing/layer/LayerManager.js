fm.Package("drawing.layer");
fm.Import("jfm.dom.DomManager");
fm.Import("drawing.layer.BackgroundLayer");
fm.Import("drawing.layer.Layer");
fm.Class("LayerManager");
drawing.layer.LayerManager = function(me, DomManager, BackgroundLayer, Layer){
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

	this.getSelectedLayer = function () {
		return me.selectedLayer;	
	};

    this.addLayer = function(){
        me.layerList.push(new Layer(drawing, undefined, $("#layerContainer")));
        me.selectedLayer = me.layerList[me.layerList.length - 1];
    };

    this.addImageLayer = function(data){
        me.addLayer();
        me.selectedLayer.setImageDataURL(data);
    };

    this.selectLayer = function(layer){
    	me.selectedLayer = layer;
    };

    this.isSelected = function (layer) {
    	return me.selectedLayer === layer;	
    };
};