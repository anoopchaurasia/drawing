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
     * @type {drawing.Layer}
     */
    var layer;

    /**
     * @param {drawing.Layer} l
     */
    this.Tool = function (l) {
        this.strokeWidth = 1;
        this.strokeColor = "#ddd";
        this.fillColor = "#ddd";
        this.currentStartPoint = null;
        this.currentEndPoint = null;
        layer = l;
    };

    /**
     * Set stroke width
     * @param {Integer} width
     * @return {Undefined}
     */
    this.setStrokeWidth = function (width) {
        this.strokeWidth = width;
        getContext().lineWidth = width;
        me.setCursor();
    };

    /**
     * start drawing
     * @param  {Float} x
     * @param  {Float} y
     */
    this.start = function (x, y) {
        this.currentStartPoint = {
            x: x,
            y: y
        };
        getContext().beginPath();
        var quarterStrokeWidth = Math.floor(me.strokeWidth / 2);
        getContext().moveTo(x - quarterStrokeWidth, y);
        me.setCursor();
    };

    /**
     * end of drawing
     * @param  {Float} x
     * @param  {Float} y
     */
    this.end = function (x, y) {
        getContext().closePath();
    };

    function getContext(){
        if(layer.instanceOf(Layer)){
            return layer.context;
        }
        return layer.selectedLayer.context;
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
        getContext().moveTo(x, y);
    };


    /**
     * Return if given width match with current stroke width
     * @param  {Integer}  w
     * @return {Boolean}
     */
    this.isSelectedStrokeWidth = function (w) {
        return w === me.strokeWidth;
    };

    /**
     * set stroke color
     * @param {String} colorcontains color string
     */
    this.setStrokeColor = function (color) {
        this.strokeColor = color;
        getContext().strokeStyle = color;
        me.setCursor();
    };

    this.setFillColor = function(color){
        getContext().fillStyle = color;
        this.fillColor = color;
        getContext().stroke();
    };

    Abstract.setCursor = function () {};
};
