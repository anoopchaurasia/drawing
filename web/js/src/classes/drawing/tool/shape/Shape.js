/**
 * @namespace drawing.tool.shape
 */
fm.Package("drawing.tool.shape");
fm.Import("drawing.tool.shape.ShapeOverlay");
fm.AbstractClass("Shape", "drawing.tool.Tool");

/**
 * @class
 */
drawing.tool.shape.Shape = function (base, me, ShapeOverlay) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    this.init = function () {
        Static.strokeWidth = 1;
    }

    /**
     * @type {drawing.tool.shape.ShapeOverlay}
     */
    var overlay;
    /**
     * @type {drawing.Layer}
     */
    var layerManager;

    /**
     * constructor
     * @param {drawing.Layer} ml
     * @param {drawing.Layer} l
     */
    this.Shape = function (ml) {
        layerManager = ml;
        me.strokeWidth = 1;
        this.fillShape = false;
        base(layerManager);
    };


    /**
     * @param  {Float} x
     * @param  {Float} y
     * @return {Undefined}
     */
    this.draw = function (x, y) {
        layerManager.frontLayer.clear();
        this.base.draw(x, y);
        me.drawShape(x, y, layerManager.frontLayer);
        if (me.fillShape) {
            layerManager.frontLayer.context.fill();
        }
        layerManager.frontLayer.context.stroke();
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
        }
        layerManager.frontLayer.show();
        layerManager.selectedLayer.context.lineWidth = me.strokeWidth;
        this.base.start(x, y);
        layerManager.frontLayer.setContextProps(layerManager.selectedLayer.getContextProps());
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
        if( overlay && overlay.isActive()){
            return;
        }
        overlay = new ShapeOverlay(layerManager.frontLayer.canvas.offset(), layerManager.frontLayer.canvas.parent(), me);
        overlay.enableDrag();
        overlay.enableResize();
    };


    /**
     * destroy overlay
     * and draw current shape on layerManager.selectedLayer
     * hide secondary layer
     */
    function destroyLayer(dontDrawOnMaster) {
        overlay.destroy();
        if (!me.currentEndPoint) {
            return;
        }
        if(!dontDrawOnMaster){
            layerManager.selectedLayer.context.beginPath();
            me.drawShape(me.currentEndPoint.x, me.currentEndPoint.y, layerManager.selectedLayer);
            if (me.fillShape) {
                layerManager.selectedLayer.context.fill();
            }
            layerManager.selectedLayer.context.stroke();
            layerManager.selectedLayer.context.closePath();
        }
        me.currentEndPoint = null;
        me.base.end();
        layerManager.frontLayer.hide();
    };

    /**
     * set  cursor image based on selected size
     */
    this.setCursor = function () {
        layerManager.selectedLayer.canvas.css("cursor", "pointer");
        layerManager.frontLayer.canvas.css("cursor", "pointer");
    };

    /**
     * Set stroke width
     * @override
     * @param {Integer} width
     * @return {Undefined}
     */
    this.setStrokeWidth = function (width) {
        layerManager.selectedLayer.context.lineWidth = width;
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
        layerManager.selectedLayer.context.strokeStyle = color;
        me.currentEndPoint && me.draw(me.currentEndPoint.x, me.currentEndPoint.y);
    };

    this.setFillColor = function(color){
        layerManager.selectedLayer.context.fillStyle = color;
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
            contextProperties: layerManager.frontLayer.getContextProps(),
            type: me.getSub() + ""
        };
    };

    this.applyShape = function (data){
        var cls = me.getSub();
        me.currentStartPoint = data.start;
        layerManager.frontLayer.setContextProps(data.contextProperties);
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
