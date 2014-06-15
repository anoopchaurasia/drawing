fm.Package("drawing.tool.shape");
fm.Class("Line", "drawing.tool.shape.Shape");

/**
 * @class
 */
drawing.tool.shape.Line = function (base, me) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * constructor
     * @param {drawing.Layer} ml
     * @param {drawing.Layer} l
     */
    this.Line = function (ml, l) {
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
        layer.context.moveTo(me.currentStartPoint.x, me.currentStartPoint.y);
        layer.context.lineTo(x, y);
    };

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return me.package.ShapeManager.MODE_LINE;
    };
};
