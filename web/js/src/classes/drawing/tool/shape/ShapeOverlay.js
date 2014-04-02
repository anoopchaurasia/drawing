/**
 * @namespace drawing.tool.shape
 */
fm.Package("drawing.tool.shape");
fm.Class("ShapeOverlay");

/**
 * @class
 */
drawing.tool.shape.ShapeOverlay = function (me) {
'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * recatangle over current drawing
     * @type {jElement}
     */
    var element;

    /**
     *
     * @type {Boolean}
     */
    var isDraggingOrResizing;

    /**
     * canvas layer offset
     * @type {Object}
     */
    var offset;

    /**
     * @type {drawing.tool.shape.Shape}
     */
    var shape;

    this.ShapeOverlay = function (os, x, y, parentElement, color, s) {
        shape = s;
        offset = os;
        element = jQuery("<div></div>", {
            class: 'canvas-text',
            // html:   "<span class='draggable top-left'></span>\
            //         <span class='draggable top-middle'></span>\
            //         <span class='draggable top-right'></span>\
            //         <span class='draggable right-middle'></span>\
            //         <span class='draggable bottom-right'></span>\
            //         <span class='draggable bottom-middle'></span>\
            //         <span class='draggable bottom-left'></span>\
            //         <span class='draggable left-middle'></span>",
            css: {
                left: x + offset.left,
                top: offset.top + y,
                color: color
            },
          ///  tabindex: 1,
            // keyup: function(e){
            //     if( !e.ctrlKey && !e.shiftKey && !e.altKey && e.which === 46 ){
            //        // me.getSub().
            //     }
            // }
        }).appendTo(parentElement);
    };

    /**
     * return if current drawing has active overlay
     * @return {Boolean}
     */
    this.isActive = function(){
        return !!element;
    };

    /**
     * resize overlay according to new cordinates
     * @param  {Float} x
     * @param  {Float} y
     */
    this.resize = function (x, y){
        var negativeX = x - shape.currentStartPoint.x < 0;
        var negativeY = y - shape.currentStartPoint.y < 0;
        element.css({
            width: Math.abs(x - shape.currentStartPoint.x),
            height: Math.abs(y - shape.currentStartPoint.y)
        });
        if (negativeX) {
            element.css({
                left: shape.currentStartPoint.x + offset.left - Math.abs(x - shape.currentStartPoint.x)
            });
        }
        if (negativeY) {
            element.css({
                top: shape.currentStartPoint.y + offset.top - Math.abs(y - shape.currentStartPoint.y)
            });
        }
    }

    /**
     * initialize variables before drag or resize start
     */
    function dragOrResizeStart (){
        lastChangeX = 0, lastChangeY = 0;
        isDraggingOrResizing = true;
    }

    /**
     * handle overlay drag
     * create new cordinate for current shape based on drag
     * @param  {jEvent} e
     * @param  {jHelper} helper
     */
    function onDrag (e, helper) {
        var xChange = helper.originalPosition.left - helper.position.left;
        var yChange = helper.originalPosition.top - helper.position.top;
        shape.currentStartPoint.x -= xChange - lastChangeX;
        shape.currentStartPoint.y -= yChange - lastChangeY;
        reDrawAfterDragREsize(xChange, yChange );

    }

    /**
     * Redraw shape after drag or resize
     * @param  {Float} xChange
     * @param  {Float} yChange
     */
     function reDrawAfterDragREsize(xChange, yChange ){
        shape.draw(shape.currentEndPoint.x - (xChange - lastChangeX), shape.currentEndPoint.y - (yChange - lastChangeY));
        lastChangeX = xChange;
        lastChangeY = yChange;
    }

    /**
     * handle overlay resize
     * @param  {jEvent} e
     * @param  {jHelper} helper
     */
    function onResize (e, helper){
        var xChange = helper.originalSize.width - helper.size.width;
        var yChange = helper.originalSize.height - helper.size.height;
        reDrawAfterDragREsize(xChange, yChange );
    }

    function onIconDrag(e, helper) {
        var xChange = helper.originalPosition.left - helper.position.left;
        var yChange = helper.originalPosition.top - helper.position.top;
        reDrawAfterDragREsize(xChange, yChange );
    }

    /**
     * handle resize/drag stop
     */
    function onDragOrResizeStop () {
        isDraggingOrResizing = false;
    }

    var lastChangeX, lastChangeY;

    /**
     * enable dragging for current shape;
     */
    this.enableDrag = function(){
        element.draggable({
            start:dragOrResizeStart,
            drag: onDrag,
            stop: onDragOrResizeStop
        });

        // element.find(".draggable").draggable({
        //     start:dragOrResizeStart,
        //     drag: onIconDrag,
        //     stop: onDragOrResizeStop
        // });
    };

    /**
     * enable resizing for curernt shape
     */
    this.enableResize = function(){
        element.resizable({
            start: dragOrResizeStart,
            resize: onResize,
            stop: onDragOrResizeStop
        });
        element.on('keyup', function (e) {
            if(!e.ctrlKey && !e.altKey && !e.shiftKey && e.which === 46 ){
                shape.getSub().stop(true);
            }
        });
    };

    /**
     * destroy current overlay
     */
    this.destroy = function(){
        element.resizable('destroy');
        //element.draggable('destroy');
        element.remove();
        element = null;
    };

    /**
     * set color of overay
     */
    this.setColor = function(color){
        element && element.css('color', color);
    };

};
