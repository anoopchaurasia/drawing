fm.Package("drawing.tool");
fm.Class("ToolManager");
drawing.tool.ToolManager = function (me) {
    'use strict';
    this.setMe = function (_me) {
        me = _me;
    };

     this.init = function () {
        /**
         * @static
         * @constant
         * @type {String}
         */
        Static.Const.MODE_FILLER = 'filler';
        Static.Const.MODE_ERASER = 'eraser';
        Static.Const.MODE_PENCIL = 'pencil';
    }


    /**
     * various tools
     * @type {Object<drawing.tool.Tool>}
     */
    var toolList, masterLayer, image, color;

    this.ToolManager = function (ml, img, c) {
        toolList = {};
        masterLayer = ml;
        image = img;
        color = c;
        toolList[me.MODE_FILLER] = "drawing.tool.Filling";// new Filling(masterLayer, image, color);
        toolList[me.MODE_ERASER] = "drawing.tool.Eraser"; // new Eraser(masterLayer);
        toolList[me.MODE_PENCIL] = "drawing.tool.Pencil"; // new Pencil(masterLayer);
    };

    this.getTool = function (type, cb) {
        var toolClass = toolList[type];
        if (typeof toolClass === 'string') {
            fm.Include(toolClass, function(){
                toolList[type] = new (fm.isExist(toolClass))(masterLayer, image, color);
                cb(toolList[type]);
            });
            return toolClass;
        } else if(typeof toolClass === 'object'){
            cb(toolClass);
            return toolClass;
        }
        throw "Tool " + type + " either does not exist or not added here";
    };

    this.getToolList = function(){
        return toolList;
    };
};
