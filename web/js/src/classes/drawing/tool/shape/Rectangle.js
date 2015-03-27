fm.Package("drawing.tool.shape");
fm.Class("Rectangle>drawing.tool.shape.Shape", function ( me) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * constructor
     * @param {drawing.Drawing} drw
     */
    this.Rectangle = function (drw) {
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
        var start = me.currentStartPoint;
        layer.context.rect(start.x, start.y, x - start.x, y - start.y);
    };

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return me.package.ShapeManager.MODE_RECTANGLE;
    };
});
