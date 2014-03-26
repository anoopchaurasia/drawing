fm.Package("drawing.tool.shape");
fm.Class("Rectangle", "drawing.tool.shape.Shape");

/**
 * @class
 */
drawing.tool.shape.Rectangle = function (base, me) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * constructor
     * @param {CanvasRenderingContext2D } cx
     * @param {HTMLCanvasElement} cv
     */
    this.Rectangle = function (ml, l) {
        base(ml, l);
    };

    /**
     * Erase drawing
     * @param  {Float} x
     * @param  {Float} y
     * @param {drawing.Layer} layer
     * @return {Undefined}
     */
    this.drawShape = function (x, y, layer) {
        var start = me.currentStartPoint;
        layer.context.rect(start.x, start.y, x - start.x, y - start.y);
    };

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return drawing.Canvas.MODE_RECTANGLE;
    };
};
