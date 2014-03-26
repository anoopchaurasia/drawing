fm.Package("drawing.tool.shape");
fm.Class("ArrowLine", "drawing.tool.shape.Shape");

/**
 * @class
 */
drawing.tool.shape.ArrowLine = function (base, me) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * constructor
     * @param {drawing.Layer} ml
     * @param {drawing.Layer} l
     */
    this.ArrowLine = function (ml, l) {
        base(ml, l);
        this.showWidthSelector = false;
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
        drawArrow(layer.context, x, y, me.currentStartPoint.x, me.currentStartPoint.y);
    };

    function drawArrow(context, x, y, startX, startY) {
        var arrowLength = 10;
        var angle = Math.atan2(y - startY, x - startX);
        context.moveTo(x, y);
        context.lineTo(x - arrowLength * Math.cos(angle - Math.PI / 6), y - arrowLength * Math.sin(angle - Math.PI / 6));
        context.lineTo(x - arrowLength * Math.cos(angle), y - arrowLength * Math.sin(angle));
        context.lineTo(x - arrowLength * Math.cos(angle + Math.PI / 6), y - arrowLength * Math.sin(angle + Math.PI / 6));
        context.lineTo(x, y);
        context.closePath();
    }

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return drawing.Canvas.MODE_ARROW_LINE;
    };
};
