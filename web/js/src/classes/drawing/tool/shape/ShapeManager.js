fm.Package("drawing.tool.shape");
fm.Class("ShapeManager");
drawing.tool.shape.ShapeManager = function (me) {
    this.setMe = function (_me) {
        me = _me;
    };

    this.init = function () {
        /**
         * @static
         * @constant
         * @type {String}
         */
        Static.Const.MODE_SELECT_OBJECT = 'object_selector';
        Static.Const.MODE_SELECT_AREA = 'select_area';
        Static.Const.MAGIC_WAND = 'magic_wand';
        Static.Const.MODE_COLOR_PICKER = 'color_picker';
        Static.Const.MODE_LINE = 'line';
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
    }

    /**
     * various shape tools
     * @type {Object<drawing.tool.shape.Shape>}
     */
    var shapeList, drawing;

    this.ShapeManager = function (drw) {
        shapeList = {};
        //coming
        drawing = drw;
        shapeList[me.MODE_SELECT_OBJECT] = 'object_selector';
        shapeList[me.MODE_SELECT_AREA]       = 'select_area';
        shapeList[me.MAGIC_WAND]         = 'magic_wand';
        shapeList[me.MODE_COLOR_PICKER]      = 'color_picker';
        shapeList[me.MODE_ANNOTATION]        = 'annotation';
        shapeList[me.MODE_BRUSH]         = 'brush';
        shapeList[me.MODE_BLUR]      = 'blur';
        shapeList[me.MODE_SHARPEN]       = 'sharpen';
        shapeList[me.MODE_CLONE_OBJECT]      = 'clone_object';
        shapeList[me.MODE_CONTRAST]      = 'contrast';
        shapeList[me.MODE_LINE] = "drawing.tool.shape.Line"; // new Line(masterLayer, secondaryLayer);
        shapeList[me.MODE_CIRCLE] = "drawing.tool.shape.Circle"; // new Circle(masterLayer, secondaryLayer);
        shapeList[me.MODE_RECTANGLE] = "drawing.tool.shape.Rotate"; // new Rectangle(masterLayer, secondaryLayer);
        shapeList[me.MODE_ARROW_LINE] = "drawing.tool.shape.Rectangle"; //new ArrowLine(masterLayer, secondaryLayer);
        shapeList[me.MODE_ROTATE] = "drawing.tool.shape.ArrowLine"; //new Rotate(masterLayer, secondaryLayer);
    };

    this.getShape = function (type, cb) {
        var shape = shapeList[type];
        if (typeof shape === 'string') {
            fm.Include(shape, function(){
                shapeList[type]  = new (fm.isExist(shape))(drawing.layerManager);
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
