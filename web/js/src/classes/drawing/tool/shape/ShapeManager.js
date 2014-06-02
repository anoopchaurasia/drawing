fm.Package("drawing.tool.shape");
fm.Class("ShapeManager");
drawing.tool.shape.ShapeManager = function (me) {
    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * various shape tools
     * @type {Object<drawing.tool.shape.Shape>}
     */
    var shapeList, masterLayer, secondaryLayer;

    this.ShapeManager = function (ml, sl) {
        shapeList = {};
        masterLayer = ml;
        secondaryLayer = sl;
        var Canvas = drawing.Canvas;
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
        shapeList[Canvas.MODE_LINE] = "drawing.tool.shape.Line"; // new Line(masterLayer, secondaryLayer);
        shapeList[Canvas.MODE_CIRCLE] = "drawing.tool.shape.Circle"; // new Circle(masterLayer, secondaryLayer);
        shapeList[Canvas.MODE_RECTANGLE] = "drawing.tool.shape.Rotate"; // new Rectangle(masterLayer, secondaryLayer);
        shapeList[Canvas.MODE_ARROW_LINE] = "drawing.tool.shape.Rectangle"; //new ArrowLine(masterLayer, secondaryLayer);
        shapeList[Canvas.MODE_ROTATE] = "drawing.tool.shape.ArrowLine"; //new Rotate(masterLayer, secondaryLayer);
    };

    this.getShape = function (type, cb) {
        var shape = shapeList[type];
        if (typeof shape === 'string') {
            fm.Include(shape, function(){
                shapeList[type]  = new (fm.isExist(shape))(masterLayer, secondaryLayer);
                shapeList[type].setStrokeWidth(me.package.Shape.strokeWidth);
                cb(shapeList[type]);
            });
            return shape;
        }else if(typeof shape === 'object'){
            cb(shape);
            return;
        }

        throw "Shape " + type + " either does not exist or not added here";
    };

	this.getShapeList = function(){
		return shapeList;
	}
};
