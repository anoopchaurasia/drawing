fm.Package("drawing.tool");
fm.Class("Pencil", "drawing.tool.Tool");

/**
 * @class pencil class
 * @param {drawing.tool.Tool} base
 * @param {Undefined} me
 */
drawing.tool.Pencil = function (base, me) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * @type {drawing.Layer}
     */
    var layerManager;

    /**
     * constructor
     * @param {drawing.Layer} l
     */
    this.Pencil = function (drawing) {
        base(drawing);
        layerManager = drawing.layerManager;
    };


    /**
     * Erase drawing
     * @param  {Float} x
     * @param  {Float} y
     * @return {Undefined}
     */
    this.draw = function (x, y) {
        layerManager.selectedLayer.context.lineWidth = me.lineWidth;
        layerManager.selectedLayer.context.lineTo(x, y);
        layerManager.selectedLayer.context.stroke();
    };

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return me.package.ToolManager.MODE_PENCIL;
    };

    /**
     * set  cursor image based on selected size
     */
    this.setCursor = function () {
        layerManager.selectedLayer.canvas.css("cursor", "url(/images/cursor/pencil.cur), pointer");
    };
};
