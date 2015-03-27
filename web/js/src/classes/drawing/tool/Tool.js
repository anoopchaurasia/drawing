/**
 * @namespace drawing.tool
 */
fm.Package("drawing.tool");
fm.Import("drawing.layer.Layer");
fm.AbstractClass("Tool");
/**
 * @class
 *
 */
drawing.tool.Tool = function (me, Layer) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };


    /**
     * @type {drawing.layer.LayerManager}
     */
    var layerManager;

    /**
     * @param {drawing.Layer} l
     */
    this.Tool = function (drawing) {
        this.isDrawing = false;
        this.lineWidth = drawing.settings.lineWidth;
        this.strokeStyle = drawing.settings.strokeStyle;
        this.fillColor = drawing.settings.fillColor;
        this.currentStartPoint = null;
        this.currentEndPoint = null;
        layerManager = drawing.layerManager;
    };

    /**
     * Set stroke width
     * @param {Integer} width
     * @return {Undefined}
     */
    this.setStrokeWidth = function (width) {
        this.lineWidth = width;
        if(me.isDrawing){
            getContext().lineWidth = width;
        }
        me.setCursor();
    };

    /**
     * start drawing
     * @param  {Float} x
     * @param  {Float} y
     */
    this.start = function (x, y) {
        this.isDrawing = true;
        this.currentStartPoint = {
            x: x,
            y: y
        };
        var layerContext = getContext();
        layerContext.beginPath();
        layerContext.lineWidth = me.lineWidth;
        layerContext.strokeStyle = me.strokeStyle;
        layerContext.fillStyle = me.fillStyle;
        var quarterStrokeWidth = Math.floor(me.lineWidth / 2);
        layerContext.moveTo(x - quarterStrokeWidth, y);
    };

    /**
     * end of drawing
     * @param  {Float} x
     * @param  {Float} y
     */
    this.end = function (x, y) {
        this.isDrawing = false;
        getContext().closePath();
    };

    this.setProperties = function(){
        var layerContext = layerManager.selectedLayer;
        layerContext.lineWidth = me.lineWidth;
        layerContext.strokeStyle = me.strokeStyle;
        layerContext.fillStyle = me.fillStyle;
    };

    function getContext(){
        if(!me.getSub().instanceOf(drawing.tool.shape.Shape)){
            return layerManager.selectedLayer.context;
        }
        return layerManager.frontLayer.context;
    }

    /**
     * draw for given point
     * @param  {Float} x
     * @param  {Float} y
     */
    this.draw = function (x, y) {
        this.currentEndPoint = {
            x: x,
            y: y
        };
    };

    /**
     * change current position on mouse reentering in canvas area
     * @param  {Float} x
     * @param  {Float} y
     */
    this.mouseReenter = function (x, y) {
        if(me.isDrawing){
            getContext().moveTo(x, y);
        }
    };


    /**
     * Return if given width match with current stroke width
     * @param  {Integer}  w
     * @return {Boolean}
     */
    this.isSelectedStrokeWidth = function (w) {
        return w === me.lineWidth;
    };

    /**
     * set stroke color
     * @param {String} colorcontains color string
     */
    this.setStrokeColor = function (color) {
        this.strokeStyle = color;
        if(me.isDrawing){
            getContext().strokeStyle = color;
        }
    };

    this.setFillColor = function(color){
        if(me.isDrawing){
            getContext().fillStyle = color;
            getContext().stroke();
        }
        this.fillColor = color;
    };

    Abstract.setCursor = function () {};
};
