/**
 * @namespace drawing
 */
fm.Package("drawing");
fm.Import("drawing.UserActionList");
fm.Import("drawing.Layer");
fm.Import("drawing.Contrast");
fm.Import("drawing.BackgroundLayer");
fm.Import("drawing.tool.shape.ShapeManager");
fm.Import("drawing.tool.ToolManager");
fm.Class("Canvas");

/**
 * Canvas
 * @class create canvas
 */
drawing.Canvas = function (me, UserActionList, Layer, Contrast, BackgroundLayer, ShapeManager, ToolManager) {

    "use strict";

    //Class Initialization
    this.init = function () {
        /**
         * @static
         * @constant
         * @type {String}
         */
        Static.Const.MODE_SELECT_OBJECT = 'object_selector';
        Static.Const.MODE_SELECT_AREA = 'select_area';
        Static.Const.MAGIC_WAND = 'magic_wand';
        Static.Const.MODE_ERASER = 'eraser';
        Static.Const.MODE_FILLER = 'filler';
        Static.Const.MODE_COLOR_PICKER = 'color_picker';
        Static.Const.MODE_PENCIL = 'pencil';
        Static.Const.MODE_LINE = 'line';
        Static.Const.MODE_TEXT = 'text_input';
        Static.Const.MODE_RECTANGLE = 'rect';
        Static.Const.MODE_CIRCLE = 'circle';
        Static.Const.MODE_BRUSH = 'brush';
        Static.Const.MODE_BLUR = 'blur';
        Static.Const.MODE_SHARPEN = 'sharpen';
        Static.Const.MODE_CLONE_OBJECT = 'clone_object';
        Static.Const.MODE_CONTRAST = 'contrast';
        Static.Const.MODE_ARROW_LINE = 'arrow_line';
        Static.Const.MODE_ROTATE = 'rotate';
        Static.Const.MODE_ANNOTATION = 'annotation';
        Static.Const.strokeWidths = [1, 2, 4, 8, 12];
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
     * Annotation tool instance
     * @type {file.FileTagging}
     */
    var fileTagging;

    /**
     * Image over which canvas is get rendered
     * @type {jQueryImage}
     */
    var image;

    /**
     * canvas over which final drawing
     * @type {drawing.Layer}
     */
    var masterLayer;

    /**
     * image offset;
     * @type {Object}
     */
    var offset;

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

    var shapeManage, toolManager;

    this.Canvas = function (img, files, color) {
        image = img;
        userActions = new UserActionList();
        resizeCallbacks = [];
        isMouseDown = false;

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
        $("#imagecontainer")
            .width(image.width())
            .height(image.height())
            .resizable({
                stop: function(){
                    var width = $(this).width();
                    var height = $(this).height();
                    masterLayer.changeSize(width, height);
                    secondaryLayer.changeSize(width, height);
                    imageLayer.changeSize(width, height);
                }
            });
        offset = image.offset();
        image.css('visibility','hidden');
        var backgroudLayer = new BackgroundLayer(image, me, color);
        backgroudLayer.fill(10);
        var imageLayer = new Layer(image, me, color);
        contrast = new Contrast(imageLayer, image);
        contrast.setContrast();
        masterLayer = new Layer(image, me, color);

        /**
         * secodory canvas layer for shape tools
         * @type {drawing.Layer}
         */
        var secondaryLayer = new Layer(image, me, color);
        secondaryLayer.hide();

        //shape manager
        shapeManage = new ShapeManager(masterLayer, secondaryLayer);

        //Tool manager
        toolManager = new ToolManager(masterLayer, image, color);
        //tools
        fileTagging = files.fileTagging;
        fileTagging.hideAllTags = fileTagging.hideAllTags || function noop(){};
        me.currentTool = fileTagging;
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
        var canvas = masterLayer.canvas;
        if ("" + me.currentTool === me.MODE_FILLER) {
            me.currentTool.fill(e.pageX - offset.left, e.pageY - offset.top);
        } else if (fileTagging === me.currentTool) {
            image.trigger('click', [e]);
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
        offset = image.offset();
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

        var x = e.pageX - offset.left,
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
            masterLayer.setImageDataURL(event.target.result);
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
        masterLayer.clear();
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
        return masterLayer.getImageData(image);
    };

    /**
     * set mode as Pencil drawing
     */
    this.setTool = function (type) {
        if(me.currentTool && me.currentTool.stop){
            me.currentTool.stop();
        }
        me.currentTool = toolManager.getTool(type);
        fileTagging.hideAllTags();
        me.currentTool.setCursor();
    };


    /**
     * set current tool as rectangle
     */
    this.setShape = function (type) {
        if(me.currentTool && me.currentTool.stop){
            me.currentTool.stop();
        }
        me.currentTool = shapeManage.getShape(type);
        me.currentTool.setFill(false);
        me.currentTool.fill();
        fileTagging.hideAllTags();
        me.currentTool.setCursor();
    };

    this.setModeContrast = function () {
        me.currentTool = contrast;
        log(me.currentTool)
        fileTagging.hideAllTags();
    };

    /**
     * enable annotation
     * @return {Undefined}
     */
    this.enableAnnotation = function () {
        fileTagging.showAllTags();
        me.currentTool = fileTagging;
        masterLayer.canvas.css("cursor", "");
    };

    /**
     * set stroke width
     * @param {Integer} strokeWidth
     */
    this.setStrokeWidth = function (strokeWidth) {
        me.currentTool.setStrokeWidth(strokeWidth);
    };

    /**
     * return image data in base64
     * @return {String}
     */
    this.getImageDataURL = function () {
        return masterLayer.canvas[0].toDataURL("image/png");
    };

    /**
     * set Image data to canvas
     * @param {String} imagedata
     */
    this.setImageDataURL = function (imagedata) {
        masterLayer.setImageDataURL(imagedata);
    };

    /**
     * change current color
     * @param  {String} color
     * @return {Undefined}
     */
    this.colorChanged = function (color) {
        this.currentTool.setStrokeColor(color);
    };

    this.fillColorChanged =function(color){

    };

    this.getToolList = function(){
        return toolManager.getToolList();
    };

    this.getShapeList = function(){
        return shapeManage.getShapeList();
    }

    this.saveCurrentDrawing = function(){
        localStorage.savedShape = JSON.stringify(me.currentTool.getCurrentShapeInfo() );
    };

    this.applySettings = function(){

        var data = JSON.parse(localStorage.savedShape);
        me.currentTool = shapeManage.getShape(data.type);
        me.currentTool.applyShape(data);
    };
};
