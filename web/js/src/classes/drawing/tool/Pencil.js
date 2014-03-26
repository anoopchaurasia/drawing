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
    var layer;

    /**
     * constructor
     * @param {drawing.Layer} l
     */
    this.Pencil = function (l) {
        base(l);
        layer = l;
    };


    /**
     * Erase drawing
     * @param  {Float} x
     * @param  {Float} y
     * @return {Undefined}
     */
    this.draw = function (x, y) {
        layer.context.lineWidth = me.strokeWidth;
        layer.context.lineTo(x, y);
        layer.context.stroke();
    };

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return drawing.Canvas.MODE_PENCIL;
    };

    /**
     * set  cursor image based on selected size
     */
    this.setCursor = function () {
        layer.canvas.css("cursor", "url(/images/cursor/pencil.cur), pointer");
    };
};
