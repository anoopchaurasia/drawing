fm.Package("drawing");
fm.Class("Layer");

/**
 *@class create canvas layer
 */
drawing.Layer = function (me) {

    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * image on which layer is drawn
     * @type {jImage}
     */
    var image;
    /**
     * Create a canvas over given image
     * @param {jImage} image
     * @param {drawing.Canvas} canvasHandler
     * @param {String} color
     */
    this.Layer = function (img, canvasHandler, color) {
        image = img;
        me.canvas = $("<canvas></canvas>", {
            css: {
                position: 'absolute',
                left: image.position().left,
                top: image.position().top
            },
        }).appendTo(image.parent());

        me.canvas.attr('width', image.width());
        me.canvas.attr('height', image.height());
        me.context = me.canvas.get(0).getContext("2d");

        //events
        me.canvas.mousedown(canvasHandler.mousedown);
        me.canvas.mouseleave(canvasHandler.mouseleave);
        me.canvas.mouseup(canvasHandler.stopdrawing);
        me.canvas.dblclick(canvasHandler.enableDisableFreeHand);
        me.context.strokeStyle = color;
        me.context.fillStyle = color;
        me.canvas.click(canvasHandler.click);
        canvasHandler.onResize(me.reposition);
    };

    /**
     * Clear canvas
     * @return {Undefined}
     */
    this.clear = function () {
        var w = me.canvas[0].width,
            props = me.getContextProps();
        me.canvas[0].width = 0;
        me.canvas[0].width = w;
        me.setContextProps(props);
    };

    this.reposition = function () {
        me.canvas.css({
            left: image.position().left,
            top: image.position().top
        });
    };

    /**
     * return context properties
     * @return {Object}
     */
    this.getContextProps = function () {
        var saveProperty = {};
        for (var i in me.context) {
            if (me.context.hasOwnProperty(i) && typeof me.context[i] !== 'object' && typeof me.context[i] !== 'function') {
                saveProperty[i] = me.context[i];
            }
        }
        return saveProperty;
    };

    /**
     * hide canvas
     * @return {Undefined}]
     */
    this.hide = function () {
        me.canvas.hide();
    };

    /**
     * show canvas
     * @return {Undefined}
     */
    this.show = function () {
        me.clear();
        me.canvas.show();
    };


    /**
     * set properties to canvas
     * @param {Undefined} props
     */
    this.setContextProps = function (props) {
        for (var i in props) {
            if (props.hasOwnProperty(i)) {
                me.context[i] = props[i];
            }
        }
    };

    /**
     * Return image data
     * @return {Array}
     */
    this.getImageData = function (image) {
        me.setImage(image);
        var outlineLayerData = me.getData();
        me.clear();
        return outlineLayerData;
    };

    this.getData = function () {
        return me.context.getImageData(0, 0, me.canvas[0].width, me.canvas[0].height);
    };

    this.setImage = function (image) {
        me.context.drawImage(image[0], 0, 0, me.canvas[0].width, me.canvas[0].height);
    };

    /**
     * set image data to canvas
     * @param {Undefined} imagedata
     */
    this.setImageDataURL = function (imagedata) {
        if (!imagedata) {
            return;
        }
        var image = new Image();
        image.src = imagedata;
        image.onload = function () {
            me.context.drawImage(image, 0, 0);
        };
    };
};
