/**
 * @namespace drawing.tool.shape
 */
fm.Package("drawing.tool.shape");
fm.AbstractClass("Shape", "drawing.tool.Tool");

/**
 * @class
 */
drawing.tool.shape.Shape = function (base, me, Layer) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    this.init = function () {
        Static.strokeWidth = 1;
    }

    /**
     * @type {drawing.Layer}
     */
    var layer;

    /**
     * @type {drawing.Layer}
     */
    var masterLayer;

    /**
     * constructor
     * @param {drawing.Layer} ml
     * @param {drawing.Layer} l
     */
    this.Shape = function (ml, l) {
        masterLayer = ml;
        me.strokeWidth = 1;
        layer = l;
        this.fillShape = false;
        base(layer);
    };


    /**
     * @param  {Float} x
     * @param  {Float} y
     * @return {Undefined}
     */
    this.draw = function (x, y) {
        layer.clear();
        this.base.draw(x, y);
        me.drawShape(x, y, layer);
        if (me.fillShape) {
            layer.context.fill();
        }
        layer.context.stroke();
        if (isDragging) {
            return;
        }
        var negativeX = x - me.currentStartPoint.x < 0;
        var negativeY = y - me.currentStartPoint.y < 0;
        element.css({
            width: Math.abs(x - me.currentStartPoint.x),
            height: Math.abs(y - me.currentStartPoint.y)
        });
        if (negativeX) {
            element.css({
                left: me.currentStartPoint.x + offset.left - Math.abs(x - me.currentStartPoint.x)
            });
        }
        if (negativeY) {
            element.css({
                top: me.currentStartPoint.y + offset.top - Math.abs(y - me.currentStartPoint.y)
            });
        }
    };

    var element, isDragging, offset;

    function drawDashedRect(start, x, y) {
        offset = layer.canvas.offset();
        element = jQuery("<div></div>", {
            class: 'canvas-text',
            css: {
                left: x + offset.left,
                top: offset.top + y,
                color: layer.context.strokeStyle,
                width: Math.abs(x - start.x),
                height: Math.abs(y - start.y)
            },
            keydown: function (e) {
                if(!e.ctrlKey && !e.altKey && !e.shiftKey && e.which === 46){
                    me.getSub().destroy();
                }
            },
            tabindex: 1234
        }).appendTo(layer.canvas.parent());
    }

    /**
     * start drawing
     * @param  {Float} x
     * @param  {Float} y
     */
    this.start = function (x, y) {
        if (element) {
            destroyLayer();
            return;
        }
        layer.show();
        masterLayer.context.lineWidth = me.strokeWidth;
        this.base.start(x, y);
        layer.setContextProps(masterLayer.getContextProps());
        drawDashedRect(me.currentStartPoint, x, y);
    };

    this.setFill = function (isFill) {
        me.fillShape = isFill;
    };

    /**
     * end of drawing
     */
    this.end = function () {

        element.draggable({
            start: function () {
                lastChangeX = 0, lastChangeY = 0;
                isDragging = true;
            },
            drag: function (e, helper) {
                var xChange = helper.originalPosition.left - helper.position.left;
                var yChange = helper.originalPosition.top - helper.position.top;
                me.currentStartPoint.x -= xChange - lastChangeX;
                me.currentStartPoint.y -= yChange - lastChangeY;
                me.draw(me.currentEndPoint.x - (xChange - lastChangeX), me.currentEndPoint.y - (yChange - lastChangeY));
                lastChangeX = xChange;
                lastChangeY = yChange;
            },
            stop: function () {
                isDragging = false;
            }
        }).resizable({
            start: function () {
                lastChangeX = 0, lastChangeY = 0;
                isDragging = true;
            },
            resize: function (e, helper) {
                var xChange = helper.originalSize.width - helper.size.width;
                var yChange = helper.originalSize.height - helper.size.height;
                me.draw(me.currentEndPoint.x - (xChange - lastChangeX), me.currentEndPoint.y - (yChange - lastChangeY));
                lastChangeX = xChange;
                lastChangeY = yChange;
            },
            stop: function () {
                isDragging = false;
            }
        });
        element.focus();
        var lastChangeX, lastChangeY;

    };

    function destroyLayer(donotdraw) {
        element.remove();
        element = null;
        if (!me.currentEndPoint) {
            return;
        }
        if(!donotdraw){
            masterLayer.context.beginPath();
            me.drawShape(me.currentEndPoint.x, me.currentEndPoint.y, masterLayer);
            if (me.fillShape) {
                masterLayer.context.fill();
            }
            masterLayer.context.stroke();
            masterLayer.context.closePath();
        }
        me.currentEndPoint = null;
        me.base.end();
        layer.hide();
    };


    this.destroy = function(){
        destroyLayer(true);
    }

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return drawing.Canvas.MODE_LINE;
    };

    /**
     * set  cursor image based on selected size
     */
    this.setCursor = function () {
        masterLayer.canvas.css("cursor", "pointer");
        layer.canvas.css("cursor", "pointer");
    };

    /**
     * Set stroke width
     * @override
     * @param {Integer} width
     * @return {Undefined}
     */
    this.setStrokeWidth = function (width) {
        masterLayer.context.lineWidth = width;
        me.base.setStrokeWidth(width);
        me.strokeWidth = width;
        element && me.draw(me.currentEndPoint.x, me.currentEndPoint.y);
    };

    /**
     * set stroke color
     * @param {String} colorcontains color string
     */
    this.setStrokeColor = function (color) {
        me.base.setStrokeColor(color);
        element && element.css('color', color);
        masterLayer.context.strokeStyle = color;
        masterLayer.context.fillStyle = color;
        element && me.draw(me.currentEndPoint.x, me.currentEndPoint.y);
    };

    /**
     * abstract draw shape
     */
    Abstract.drawShape = function () {};
};
