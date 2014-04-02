/**
 * @namespace drawing.tool.shape
 */
fm.Package("drawing.tool.shape");
fm.Import("drawing.tool.shape.ShapeOverlay");
fm.AbstractClass("Shape", "drawing.tool.Tool");

/**
 * @class
 */
drawing.tool.shape.Shape = function (base, me, ShapeOverlay, Layer) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    this.init = function () {
        Static.strokeWidth = 1;
    }

    /**
     * @type {drawing.Layer}
     */
    var layer;

    /**
     * @type {drawing.tool.shape.ShapeOverlay}
     */
    var overlay;
    /**
     * @type {drawing.Layer}
     */
    var masterLayer;

    /**
     * constructor
     * @param {drawing.Layer} ml
     * @param {drawing.Layer} l
     */
    this.Shape = function (ml, l) {
        masterLayer = ml;
        me.strokeWidth = 1;
        layer = l;
        this.fillShape = false;
        base(layer);
    };


    /**
     * @param  {Float} x
     * @param  {Float} y
     * @return {Undefined}
     */
    this.draw = function (x, y) {
        //return if overlay no longer active
        if(overlay && !overlay.isActive()){
            return;
        }
        layer.clear();
        this.base.draw(x, y);
        me.drawShape(x, y, layer);
        if (me.fillShape) {
            layer.context.fill();
        }
        layer.context.stroke();
        overlay.resize(x, y);
    };

    /**
     * start drawing
     * @param  {Float} x
     * @param  {Float} y
     */
    this.start = function (x, y) {
        //On second start call end drawing
        if (overlay && overlay.isActive()) {
            destroyLayer();
            return;
        }
        layer.show();
        masterLayer.context.lineWidth = me.strokeWidth;
        this.base.start(x, y);
        layer.setContextProps(masterLayer.getContextProps());
        overlay = new ShapeOverlay(layer.canvas.offset(), x, y, layer.canvas.parent(), layer.context.strokeStyle, me);
    };

    this.setFill = function (isFill) {
        me.fillShape = isFill;
    };


    this.fill = function(){
        me.setFill(true);
        if (me.currentEndPoint){
            me.draw(me.currentEndPoint.x, me.currentEndPoint.y);
        }
    };

    /**
     * end of drawing
     */
    this.end = function () {

        if( !overlay.isActive() ){
            return;
            }
        overlay.enableDrag();
        overlay.enableResize();
    };


    /**
     * destroy overlay
     * and draw current shape on masterlayer
     * hide secondary layer
     */
    function destroyLayer(dontDrawOnMaster) {
        overlay.destroy();
        if (!me.currentEndPoint) {
            return;
        }
        if(!dontDrawOnMaster){
            masterLayer.context.beginPath();
            me.drawShape(me.currentEndPoint.x, me.currentEndPoint.y, masterLayer);
            if (me.fillShape) {
                masterLayer.context.fill();
            }
            masterLayer.context.stroke();
            masterLayer.context.closePath();
        }
        me.currentEndPoint = null;
        me.base.end();
        layer.hide();
    };

    /**
     * set  cursor image based on selected size
     */
    this.setCursor = function () {
        masterLayer.canvas.css("cursor", "pointer");
        layer.canvas.css("cursor", "pointer");
    };

    /**
     * Set stroke width
     * @override
     * @param {Integer} width
     * @return {Undefined}
     */
    this.setStrokeWidth = function (width) {
        masterLayer.context.lineWidth = width;
        me.base.setStrokeWidth(width);
        me.strokeWidth = width;
        me.currentEndPoint && me.draw(me.currentEndPoint.x, me.currentEndPoint.y);
    };

    /**
     * set stroke color
     * @param {String} colorcontains color string
     */
    this.setStrokeColor = function (color) {
        me.base.setStrokeColor(color);
        overlay && overlay.setColor(color);
        masterLayer.context.strokeStyle = color;
        me.currentEndPoint && me.draw(me.currentEndPoint.x, me.currentEndPoint.y);
    };

    this.setFillColor = function(color){
        masterLayer.context.fillStyle = color;
        me.base.setFillColor(color);
        me.currentEndPoint && me.draw(me.currentEndPoint.x, me.currentEndPoint.y);
    };

    /**
     * called on tool change
     * end current drawing
     */
    this.stop = function(dontDrawOnMaster){
        if (overlay && overlay.isActive()) {
            destroyLayer(dontDrawOnMaster);
            return;
        }
    };

    this.getCurrentShapeInfo = function(){

        return {
            start: me.currentStartPoint,
            end: me.currentEndPoint,
            contextProperties: layer.getContextProps(),
            type: me.getSub() + ""
        };
    };

    this.applyShape = function (data){
        var cls = me.getSub();
        me.currentStartPoint = data.start;
        layer.setContextProps(data.contextProperties);
        var minX =Math.min(data.start.x, data.end.x);
        var minY =Math.min(data.start.y, data.end.y);
        cls.start(data.start.x - minX, data.start.y - minY);
        me.currentEndPoint = data.end;
        cls.draw(data.end.x - minX , data.end.y  -minY);
        cls.end();

    };
    /**
     * abstract draw shape
     */
    Abstract.drawShape = function () {};
};
