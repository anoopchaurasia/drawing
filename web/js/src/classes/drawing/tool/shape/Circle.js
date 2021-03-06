fm.Package("drawing.tool.shape");
fm.Class("Circle>drawing.tool.shape.Shape", function ( me) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * constructor
     * @param {drawing.Drawing} drw
     * @param {drawing.Layer} l
     */
    this.Circle = function (drw) {
       me.base(drw);
    };

    /**
     * Erase drawing
     * @param  {Float} x
     * @param  {Float} y
     * @param {drawing.Layer} layer
     * @return {Undefined}
     */
    this.drawShape = function (x, y, layer) {
        drawEllipse(layer.context, me.currentStartPoint.x, me.currentStartPoint.y, x - me.currentStartPoint.x, y - me.currentStartPoint.y);
    };

    function drawEllipse(ctx, x, y, w, h) {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w, // x-end
            ye = y + h, // y-end
            xm = x + w / 2, // x-middle
            ym = y + h / 2; // y-middle
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    }

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return me.package.ShapeManager.MODE_CIRCLE;
    };
});
