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
        //coming
        drawing = drw;
        
        shapeList = [
            {
                name: me.MODE_SELECT_OBJECT
            },
            {
                name: me.MODE_SELECT_AREA
            },
            {
                name: me.MAGIC_WAND
            },
            {
                name: me.MODE_ANNOTATION
            },
            {
                name: me.MODE_BRUSH
            },
            {
                name: me.MODE_BLUR
            },
            {
                name: me.MODE_SHARPEN
            },
            {
                name: me.MODE_CLONE_OBJECT
            },
            {
                name: me.MODE_CONTRAST
            },
            {
                name: me.MODE_LINE,
                class: 'drawing.tool.shape.Line'
            },
            {
                name: me.MODE_CIRCLE,
                class: 'drawing.tool.shape.Circle'
            },
            {
                name: me.MODE_ARROW_LINE,
                class: "drawing.tool.shape.ArrowLine"
            },
            {
                name: me.MODE_RECTANGLE,
                class: "drawing.tool.shape.Rectangle"
            },
            {
                name: me.MODE_ROTATE,
                class: "drawing.tool.shape.Rotate"
            }
        ];

    };

    this.getShape = function (type, cb) {
        var shape = getShapeByType(type);
        if(!shape ){
            throw "Shape " + type + " either does not exist";
        }
        if (typeof shape.class === 'string') {
            fm.Include(shape.class, function(){
                shape.class  = new (fm.isExist(shape.class))(drawing);
                cb(shape.class);
            });
            return shape;
        }else if(typeof shape.class === 'object'){
            cb(shape);
            return;
        }
        throw new Error("This does not has class");
    };

	this.getShapeList = function(){
		return shapeList;
	};

    function getShapeByType (type) {
        for(var index = 0; index < shapeList.length; index++){
            if( type === shapeList[index].name){
                return shapeList[index];
            }
        }
    }
};
