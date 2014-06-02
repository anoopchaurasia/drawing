fm.Package("drawing.tool.shape");
fm.Import("drawing.tool.shape.Line");
fm.Import("drawing.tool.shape.Circle");
fm.Import("drawing.tool.shape.Rotate");
fm.Import("drawing.tool.shape.Rectangle");
fm.Import("drawing.tool.shape.ArrowLine");
fm.Class("ShapeManager");
drawing.tool.shape.ShapeManager = function (me, Line, Circle, Rotate, Rectangle, ArrowLine) {
    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * various shape tools
     * @type {Object<drawing.tool.shape.Shape>}
     */
    var shapeList;

    this.ShapeManager = function (masterLayer, secondaryLayer) {
        shapeList = {};
        var Canvas = drawing.Canvas;
        shapeList[Canvas.MODE_LINE] = new Line(masterLayer, secondaryLayer);
        shapeList[Canvas.MODE_CIRCLE] = new Circle(masterLayer, secondaryLayer);
        shapeList[Canvas.MODE_RECTANGLE] = new Rectangle(masterLayer, secondaryLayer);
        shapeList[Canvas.MODE_ARROW_LINE] = new ArrowLine(masterLayer, secondaryLayer);
        shapeList[Canvas.MODE_ROTATE] = new Rotate(masterLayer, secondaryLayer);

        //coming
        shapeList[Canvas.MODE_SELECT_OBJECT] = 'object_selector';
        shapeList[Canvas.MODE_SELECT_AREA]       = 'select_area';
        shapeList[Canvas.MAGIC_WAND]         = 'magic_wand';
        shapeList[Canvas.MODE_COLOR_PICKER]      = 'color_picker';
        shapeList[Canvas.MODE_TEXT]      = 'text_input';
        shapeList[Canvas.MODE_ANNOTATION]        = 'annotation';
        shapeList[Canvas.MODE_BRUSH]         = 'brush';
        shapeList[Canvas.MODE_BLUR]      = 'blur';
        shapeList[Canvas.MODE_SHARPEN]       = 'sharpen';
        shapeList[Canvas.MODE_CLONE_OBJECT]      = 'clone_object';
        shapeList[Canvas.MODE_CONTRAST]      = 'contrast';
    };

    this.getShape = function (type) {
        var shape = shapeList[type];
        if (shape) {
            shape.setStrokeWidth(me.package.Shape.strokeWidth);
            return shape;
        }

        throw "Shape " + type + " either does not exist or not added here";
    };

	this.getShapeList = function(){
		return shapeList;
	}
};
