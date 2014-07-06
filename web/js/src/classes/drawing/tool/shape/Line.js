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

    this.init = function () {
        Static.template = "/templates/tooloptions/line.html";
    };

    /**
     * constructor
     * @param {drawing.Drawing} drw
     */
    this.Line = function (drw) {
        base(drw);
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
        if(me.rightarrow){
            drawArrow(layer.context, x, y, me.currentStartPoint.x, me.currentStartPoint.y);
        }
        if(me.leftarrow){
            drawArrow(layer.context, me.currentStartPoint.x, me.currentStartPoint.y, x, y);
        }
    };

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return me.package.ShapeManager.MODE_LINE;
    };

    function drawArrow(context, x, y, startX, startY) {
        var arrowLength = 10;
        var angle = Math.atan2(y - startY, x - startX);
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

    this.enableLeftArrow = function (value) {
        me.leftarrow = value;
        if(me.isDrawing){
            me.draw(me.currentEndPoint.x, me.currentEndPoint.y);    
        }
    };

    this.enableRightArrow = function (value) {
        me.rightarrow = value;   
        if(me.isDrawing){
            me.draw(me.currentEndPoint.x, me.currentEndPoint.y);    
        }
    };

};
