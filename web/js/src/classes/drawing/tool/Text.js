fm.Package("drawing.tool");
fm.Class("Text", "drawing.tool.Tool");

/**
 * @class pencil class
 * @param {drawing.tool.Tool} base
 * @param {Undefined} me
 */
drawing.tool.Text = function (base, me) {
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

    var isWriting, element;
    this.Text = function (l) {
        base(l);
        isWriting = false;
        layer = l;
    };

    this.start = function (x, y) {
        var offset = layer.canvas.offset();
        if (isWriting) {
            layer.context.font = "";
            var textarea = element.children();
            layer.context.textBaseline = "top";
            layer.context.textAlign = "left";
            var lineheight = parseInt(textarea.css('font-size')) + 5;
            layer.context.font = textarea.css('font-size') + "  " + textarea.css('font-family');
            var values = textarea.val().split("\n");
            var textoffset = textarea.offset();
            var x = textoffset.left - offset.left;
            var y = textoffset.top - offset.top;
            values.forEach(function (value, index) {
                layer.context.fillText(
                    value,
                    x + parseInt(textarea.css('padding-left')) + 1,
                    y + (index) * lineheight + parseInt(textarea.css('padding-top')) + 3
                );
            });
            element.remove();
            me.base.end();
            isWriting = false;
            return;
        }
        isWriting = true

        element = jQuery("<div></div>", {
            class: 'canvas-text',
            css: {
                left: x + offset.left,
                top: offset.top + y,
                color: layer.context.strokeStyle
            },
            html: "<textarea></textarea>"
        }).appendTo(layer.canvas.parent());
        element.children().focus();
        element.draggable();
        me.base.start(x, y);
    };

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return drawing.Canvas.MODE_TEXT;
    };

    /**
     * set stroke color
     * @param {String} colorcontains color string
     */
    this.setStrokeColor = function (color) {
        element.css('color', color);
        me.base.setStrokeColor(color);
    };

    /**
     * set  cursor image based on selected size
     */
    this.setCursor = function () {
        layer.canvas.css("cursor", "url(/images/cursor/pencil.cur), pointer");
    };
};
