/**
 * @namespace drawing
 */
fm.Package("drawing");
fm.Include("drawing.controller.mainController");
fm.Include("drawing.controller.toolActionController");
fm.Import("drawing.UserActionList");
fm.Import("drawing.layer.Layer");
fm.Import("drawing.Contrast");
fm.Import("drawing.tool.shape.ShapeManager");
fm.Import("drawing.tool.ToolManager");
fm.Import("drawing.setting.Settings");
fm.Import("drawing.layer.LayerManager");
fm.Class("Drawing");

/**
 * Drawing
 * @class create Drawing
 */
drawing.Drawing = function (me, UserActionList, Layer, Contrast, ShapeManager, ToolManager, Settings, LayerManager) {

    "use strict";

    //Class Initialization
    this.init = function () {
        /**
         * @static
         * @constant
         * @type {String}
         */
        Static.Const.lineWidths = [1, 2, 4, 8, 12];
        Static.Const.colors = ['#FF0000','#FFFF00','#0033FF','#009900','#FF9900','#660099'];
    }

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * true on mouse down reset to false on mouseup
     * @type {Boolean}
     */
    var isMouseDown;

    /**
     * Store user actions
     * @type {drawing.UserActionList}
     */
    var userActions;


    /**
     * mouse down position
     * @type {Object}
     */
    var mouseDownPos;

    /**
     * Image over which canvas is get rendered
     * @type {jQueryImage}
     */
    var image;

    /**
     * canvas over which final drawing
     * @type {drawing.Layer}
     */
    var selectedLayer;

    /**
     * true if mouse left canvas area
     * @type {Boolean}
     */
    var mouseleft;

    /**
     * @type {Array<callback>}
     */
    var resizeCallbacks;

    /**
     * @type {drawing.Contrast}
     */
    var contrast;

    /**
     *  @type {drawing.tool.shape.ShapeManager}
     */

     var safeApply;

    this.Drawing = function (sa) {
        userActions = new UserActionList();
        resizeCallbacks = [];
        isMouseDown = false;

        safeApply = sa;
        //events
        this.mousedown = mousedown;
        this.mousemove = mousemove;
        this.mouseleave = mouseleave;
        this.stopdrawing = stopdrawing;
        $(document).on("mousemove",mousemove);
        this.click = click;
        this.dblclick = enableDisableFreeHand;
        $(document).on('mouseup', stopdrawing);
        $(window).on('resize', this.onResize);
        $(document).bind('paste', onPaste);

        // contrast = new Contrast(imageLayer, image);
        // contrast.setContrast();

        me.settings = new Settings();
        
        me.layerManager = new LayerManager(me);
        //shape manager
        me.shapeManager = new ShapeManager(me);
        //Tool manager
        me.toolManager = new ToolManager(me);

    };

    this.onLayoutChange = function (width, height) {
        me.settings.width = width;
        me.settings.height = height;
        
        me.layerManager.onLayoutChange(width, height);
    };

    /**
     * Handler of click event on canvas
     * @param  {jEvent} e
     * @return {Undefined}
     */

    function click(e) {
        if (mouseDownPos.x !== e.pageX || mouseDownPos.y !== e.pageY) {
            return false;
        }
        var canvas = me.layerManager.getSelectedLayer().canvas;
        if ("" + me.currentTool === "filler") {
            me.currentTool.fill(e.pageX - me.settings.offset.left, e.pageY - me.settings.offset.top, me.settings.selectedColor);
        } if ("" + me.currentTool === "color_picker") {
           var color = me.currentTool.pick(e.pageX - me.settings.offset.left, e.pageY - me.settings.offset.top);
           me.settings.color = color;
           
        } else if (typeof me.currentTool.onClick === 'function') {
            me.currentTool.onClick(e);
        }
        return false;
    }

    /**
     * Double click enable free drawing
     * @return {Undefined}
     */

    function enableDisableFreeHand() {
        isMouseDown = !isMouseDown;
    }

    /**
     * get called when mouse leave canvas
     * @return {Undefined}
     */

    function mouseleave() {
        mouseleft = true;
    }

    /**
     * Mouse down event attached to canvas
     * @param  {jEvent} e
     * @return {Undifined}
     */

    function mousedown(e) {
        mouseDownPos = {
            x: e.pageX,
            y: e.pageY
        };
        var offset = me.settings.offset;
        if (me.currentTool.start) {
            me.currentTool.start(e.pageX - offset.left, e.pageY - offset.top);
        }

        isMouseDown = true;
        e.preventDefault();
    }

    /**
     * Mouse move event attached to canvas
     * @param  {jEvent} e
     * @return {Undifined}
     */

    function mousemove(e) {
        if (!isMouseDown) {
            return;
        }
        e.preventDefault();

        var offset = me.settings.offset,
            x = e.pageX - offset.left,
            y = e.pageY - offset.top;

        if (mouseleft) {
            mouseleft = false;
            if (me.currentTool.mouseReenter) {
                me.currentTool.mouseReenter(x, y);
            }
            return;
        }
        if (me.currentTool.draw) {
            me.currentTool.draw(Math.round(x), Math.round(y));
        }
    }

    /**
     * Mouse event attached to canvas
     * @param  {jEvent} e
     * @return {Undifined}
     */

    function stopdrawing(e) {
        if (!isMouseDown) {
            return;
        }
        isMouseDown = false;
        userActions.addUserAction(me.getImageDataURL());
        if (me.currentTool.end) {
            me.currentTool.end();
        }
    }

    function onPaste (event) {
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        var blob = items[0].getAsFile();
        var reader = new FileReader();
        reader.onload = function(event){
            me.layerManager.getSelectedLayer().setImageDataURL(event.target.result);
        }
        reader.readAsDataURL(blob);
    }

    /**
     * Handle callback for page/container resize
     * add callback method in list
     * if callback method is not provided it assume resize haapend so call all callbacks
     * @param  {Function} cb
     */
    this.onResize = function (cb) {
        if (typeof cb === 'function') {
            resizeCallbacks.push(cb);
            return
        } else {
            resizeCallbacks.forEach(function (cb) {
                cb();
            });
        }
    };


    /**
     * Clear canvas
     * @param {Boolean} donotsavestate
     * @return {Undefined}
     */
    this.clear = function () {
        me.layerManager.getSelectedLayer().clear();
    };

    /**
     * Destroy all global listener
     */
    this.destroy = function () {
        $(document).off('mouseup', stopdrawing);
        $(window).off('resize', this.onResize);
        $(document).off("mousemove",mousemove);
    };

    /**
     * Undo last change
     * @return {Undefined}
     */
    this.undo = function () {
        var imageURLData = userActions.pop();
        if (imageURLData) {
            me.clear(true);
            me.setImageDataURL(imageURLData);
        }
    };


    /**
     * Return image data
     * @return {Array}
     */
    this.getImageData = function () {
        return me.layerManager.getSelectedLayer().getImageData(image);
    };

    /**
     * set mode as Pencil drawing
     */
    this.setTool = function (type) {
        if(me.currentTool && me.currentTool.stop){
            me.currentTool.stop();
        }
        me.toolManager.getTool(type, function(tool){
            me.currentTool = tool;
            me.currentTool.setCursor();
            safeApply();
        });
    };


    /**
     * set current tool as rectangle
     */
    this.setShape = function (type) {
        if(me.currentTool && me.currentTool.stop){
            me.currentTool.stop();
        }
        me.shapeManager.getShape(type, function(shape){
            me.currentTool = shape;    
            me.currentTool.setFill(false);
            me.currentTool.setCursor();
            safeApply();
        });
    };

    this.setModeContrast = function () {
        me.currentTool = contrast;
        log(me.currentTool)
    };

    /**
     * set stroke width
     * @param {Integer} lineWidth
     */
    this.setStrokeWidth = function (lineWidth) {
        me.currentTool.setStrokeWidth(lineWidth);
    };

    /**
     * return image data in base64
     * @return {String}
     */
    this.getImageDataURL = function () {
        return me.layerManager.getSelectedLayer().canvas[0].toDataURL("image/png");
    };

    /**
     * set Image data to canvas
     * @param {String} imagedata
     */
    this.setImageDataURL = function (imagedata) {
        me.layerManager.getSelectedLayer().setImageDataURL(imagedata);
    };

    /**
     * change current color
     * @param  {String} color
     * @return {Undefined}
     */
    this.colorChanged = function (color) {
        this.currentTool.setStrokeColor(color);
        me.settings.selectedColor = color;
    };

    this.fillColorChanged =function(color){

    };

    this.getToolList = function(){
        return me.toolManager.getToolList();
    };

    this.getShapeList = function(){
        return me.shapeManager.getShapeList();
    }

    this.saveCurrentDrawing = function(){
        localStorage.savedShape = JSON.stringify(me.currentTool.getCurrentShapeInfo() );
    };

    this.applySettings = function(){

        var data = JSON.parse(localStorage.savedShape);
        me.currentTool = me.shapeManager.getShape(data.type);
        me.currentTool.applyShape(data);
    };

    this.isSeletedTool = function (tool) {
        return me.currentTool === tool;
    }
};
