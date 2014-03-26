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
