fm.Package("drawing.layer");
fm.Class("Layer");

/**
 *@class create canvas layer
 */
drawing.layer.Layer = function (me) {

    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * image on which layer is drawn
     * @type {jImage}
     */
    var image;

    var drawing;
    /**
     * Create a canvas over given image
     * @param {jImage} image
     * @param {drawing.Drawing} drawing
     * @param {String} color
     */
    this.Layer = function (dwn, preaddedcanvas, cantainer, name) {
        drawing = dwn;
        if(preaddedcanvas){
            me.canvas = preaddedcanvas;
        }else{
            me.canvas = $("<canvas></canvas>").appendTo(cantainer);
        }

        me.canvas.css({
            position: 'absolute',
            left: 0,
            top: 0
        });

        me.name = name;

        me.canvas.attr('width', drawing.settings.width);
        me.canvas.attr('height', drawing.settings.height);
        me.context = me.canvas.get(0).getContext("2d");

        //events
        me.canvas.mousedown(drawing.mousedown);
        me.canvas.mouseleave(drawing.mouseleave);
        me.canvas.mouseup(drawing.stopdrawing);
        me.canvas.dblclick(drawing.enableDisableFreeHand);
        me.canvas.click(drawing.click);
        drawing.onResize(me.reposition);
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

    this.changeSize = function( ){
        var props = me.getContextProps();
        var data  = me.canvas[0].toDataURL("image/png");
        me.canvas[0].width = drawing.settings.width;
        me.canvas[0].height = drawing.settings.height;
        me.setImageDataURL(data);
        me.setContextProps(props);
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

    this.setData = function (data, width, height) {
        me.context.putImageData(data, 0, 0, 0, 0, width, height);
    };

    this.setImage = function (image) {
        me.context.drawImage(image[0], 0, 0, me.canvas[0].width, me.canvas[0].height);
    };

    this.toggle = function () {
        me.canvas.toggle();
    };

    /**
     * set image data to canvas
     * @param {Undefined} imagedata
     */
    this.setImageDataURL = function (imagedata, sizeCB) {
        if (!imagedata) {
            return;
        }
        var image = new Image();
        image.src = imagedata;
        image.onload = function () {
            sizeCB && sizeCB(image.width, image.height);
            me.context.drawImage(image, 0, 0);
        };
    };

    this.destroy = function () {
        me.canvas.remove();
    };

    this.resizeContent = function (width, height) {
        var data = me.getData();
        me.clear();
        me.setData(data, width, height);
    }
};
