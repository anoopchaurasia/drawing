fm.Package("drawing.tool");
fm.Class("Text > drawing.tool.Tool", function ( me) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * @type {drawing.Layer}
     */
    var layerManager;

    /**
     * constructor
     * @param {drawing.Layer} l
     */

    var isWriting, element;
    this.Text = function (drawing) {
        var l = drawing.layerManager;
       me.base(drawing);
        isWriting = false;
        layerManager = l;
    };

    this.start = function (x, y) {
        var offset = layerManager.selectedLayer.canvas.offset();
        if (isWriting) {
            layerManager.selectedLayer.context.font = "";
            var textarea = element;
            layerManager.selectedLayer.context.textBaseline = "top";
            layerManager.selectedLayer.context.textAlign = "left";
            var lineheight = parseInt(textarea.css('font-size')) + 5;
            layerManager.selectedLayer.context.font = textarea.css('font-size') + "  " + textarea.css('font-family');
            var values = textarea.text().split("\n");
            var textoffset = textarea.offset();
            var x = textoffset.left - offset.left;
            var y = textoffset.top - offset.top;
            values.forEach(function (value, index) {
                layerManager.selectedLayer.context.fillText(
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
            contenteditable:true,
            css: {
                left: x + offset.left,
                top: offset.top + y,
                width:200,
                height: 40,
                color: layerManager.selectedLayer.context.strokeStyle
            }
        }).appendTo(layerManager.selectedLayer.canvas.parent());
        element.focus();
        element.keyup(function(){
            debugger;
        });
        //element.draggable();
        me.base.start(x, y);
    };

    /**
     * @override
     * @return {String}
     */
    this.toString = function () {
        return me.package.shape.ShapeManager.MODE_TEXT;
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
        layerManager.selectedLayer.canvas.css("cursor", "url(/images/cursor/pencil.cur), pointer");
    };
});
