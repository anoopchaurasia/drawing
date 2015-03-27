fm.Package("drawing.tool");
fm.Class("Eraser > drawing.tool.Tool", function ( me) {
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
    this.Eraser = function (drawing) {
       me.base(drawing);
        layerManager = drawing.layerManager;
    };


    /**
     * Erase drawing from canvas
     * @param  {Float} x
     * @param  {Float} y
     * @return {Undefined}
     */
    this.draw = function (x, y) {
        var lineWidthHalf = Math.floor(me.lineWidth);
        layerManager.selectedLayer.context.clearRect(x - lineWidthHalf, y - lineWidthHalf, me.lineWidth * 2, me.lineWidth * 2);
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
        canvas.css("cursor", "url(/images/cursor/" + me.lineWidth * 2 + "pix_eraser.cur), pointer");
    };

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return me.package.ToolManager.MODE_ERASER;
    };
});
