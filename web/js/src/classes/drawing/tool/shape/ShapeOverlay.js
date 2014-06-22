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

    var posList;

    this.ShapeOverlay = function (os, parentElement, s) {
        shape = s;
        posList = ["A", "B", "C", "D"];
        offset = os;
        var position = {
                left: shape.currentStartPoint.x + offset.left,
                top: offset.top + shape.currentStartPoint.y
            };
        element = jQuery("<div></div>", {
            class: 'canvas-text',
            'tabindex': 5,           
            css: position
        }).appendTo(parentElement);
        element.keyup(function(e){
            if (e.which === 46){
                shape.stop(true);
            }
        });
        element.focus();
        var size = this.resize(shape.currentEndPoint.x, shape.currentEndPoint.y);
        position = element.position();
        position = {
            left: position.left - offset.left,
            top: position.top - offset.top
        };
        calculatePostion(shape.currentStartPoint, shape.currentEndPoint, position, size);
    };

    var postionSet;
    function calculatePostion (start, end, position, size) {
       
        if(start.x === position.left){
            if(start.y === position.top){
                postionSet = {start: "A", end: "C"};
            }else{
                postionSet = {start: "B", end: "D"};
            }
        }else{
            if(start.y === position.top){
                postionSet = {start: "D", end: "B"};
            }else{
                postionSet = {start: "C", end: "A"};
            }
        }
    }

    function calculateEdges (position, size) {
        var temp = {};
        var left = position.left - offset.left;
        var top = position.top - offset.top;
        temp.A = {x: left, y: top};
        temp.B = {x: left, y: top + size.height };
        temp.C = {x: left + size.width, y: top + size.height};
        temp.D = {x: left + size.width, y: top};
        return temp;
    }

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
        var width = Math.abs(x - shape.currentStartPoint.x);
        var height = Math.abs(y - shape.currentStartPoint.y);
        element.css({
            width: width,
            height: height
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

        return {width: width, height: height};
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
        
        var edges = calculateEdges (helper.position, {width: helper.helper.width(), height: helper.helper.height()});
        var startPoint = edges[postionSet.start];
        var endPoint = edges[postionSet.end];

        reDrawAfterDragREsize(startPoint, endPoint);
    }

    /**
     * Redraw shape after drag or resize
     * @param  {Float} xChange
     * @param  {Float} yChange
     */
     function reDrawAfterDragREsize(startPoint, endPoint){
        shape.currentStartPoint = startPoint;
        shape.draw(endPoint.x, endPoint.y);
    }

    /**
     * handle overlay resize
     * @param  {jEvent} e
     * @param  {jHelper} helper
     */
    function onResize (e, helper){
        var edges = calculateEdges (helper.position, helper.size);
        var startPoint = edges[postionSet.start];
        var endPoint = edges[postionSet.end];
        reDrawAfterDragREsize(startPoint, endPoint);
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
            handles: 'all',
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
