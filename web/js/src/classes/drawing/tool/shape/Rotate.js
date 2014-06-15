fm.Package("drawing.tool.shape");
fm.Class("Rotate", "drawing.tool.shape.Shape");

/**
 * @class
 */
drawing.tool.shape.Rotate = function (base, me) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * constructor
     * @param {drawing.Layer} ml
     * @param {drawing.Layer} l
     */
    this.Rotate = function (ml, l) {
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
        layer.context.quadraticCurveTo(me.currentStartPoint.x, y, x, me.currentStartPoint.y);
        drawArrow(layer.context, x, me.currentStartPoint.y, me.currentStartPoint.x, me.currentStartPoint.y, y);
    };

    function drawArrow(context, x, y, startX, startY, endy) {
        var arrowLength = 10;
        var angle = Math.atan2(startY - endy, x - startX);
        context.moveTo(x, y);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.lineTo(x - arrowLength * Math.cos(angle - Math.PI / 6), y - arrowLength * Math.sin(angle - Math.PI / 6));
        context.lineTo(x - arrowLength * Math.cos(angle), y - arrowLength * Math.sin(angle));
        context.lineTo(x - arrowLength * Math.cos(angle + Math.PI / 6), y - arrowLength * Math.sin(angle + Math.PI / 6));
        context.lineTo(x, y);
        context.fill();
        context.closePath();
    }

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return me.package.ShapeManager.MODE_ROTATE;
    };
};
