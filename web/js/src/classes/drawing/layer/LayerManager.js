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

	var image, color, drawing;
	this.LayerManager = function(img, clr, drw){
		image = img; 
		color = clr;
		drawing = drw;
		me.layerList = [];
        me.backgroudLayer = new BackgroundLayer(image, drawing, color, $("canvas#background-canvas"));
        me.backgroudLayer.fill(10);
        me.imageLayer = new Layer(image, drawing, color, $("canvas#image-canvas"));
        me.imageLayer.setImage(image);
        me.selectedLayer = me.imageLayer;
        me.frontLayer = new  Layer(image, drawing, color, $("canvas#front-canvas"));
	};

	this.getSelectedLayer = function () {
		return me.selectedLayer;	
	};

    this.addLayer = function(){
        me.layerList.push(new Layer(image, drawing, color, undefined, $("#layerContainer")));
    };

    this.selectLayer = function(layer){
    	me.selectedLayer = layer;
    };

    this.isSelected = function (layer) {
    	return me.selectedLayer === layer;	
    };
};