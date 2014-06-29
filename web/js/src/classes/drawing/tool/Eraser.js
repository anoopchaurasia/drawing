fm.Package("drawing.tool");
fm.Class("Eraser", "drawing.tool.Tool");
/**
 * @class Eraser class
 * @param {drawing.tool.Tool} base
 * @param {Undefined} me
 */
drawing.tool.Eraser = function (base, me) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    this.init = function () {
        Static.template = "/templates/tooloptions/eraser.html";
    };

    var layerManager;

    /**
     * constructor
     * @param {CanvasRenderingContext2D } cx
     */
    this.Eraser = function (l) {
        base(l);
        layerManager = l;
    };


    /**
     * Erase drawing from canvas
     * @param  {Float} x
     * @param  {Float} y
     * @return {Undefined}
     */
    this.draw = function (x, y) {
        var strokeWidthHalf = Math.floor(me.strokeWidth);
        layerManager.selectedLayer.context.clearRect(x - strokeWidthHalf, y - strokeWidthHalf, me.strokeWidth * 2, me.strokeWidth * 2);
        layerManager.selectedLayer.context.stroke();
    };

    this.start = function (x, y) {
        me.base.start(x, y);
        me.draw(x, y);
    };

    /**
     * set  cursor image based on selected size
     */
    this.setCursor = function () {
        var canvas = layerManager.selectedLayer.canvas;
        canvas.css("cursor", "url(/images/cursor/" + me.strokeWidth * 2 + "pix_eraser.cur), pointer");
    };

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return me.package.ToolManager.MODE_ERASER;
    };

    this.onChange = function () {
        this.setStrokeWidth(me.borderWidth);
        if(me.currentEndPoint){
            this.draw(me.currentEndPoint.x, me.currentEndPoint.y);
        }
    };
};
