fm.Package("drawing.tool");
fm.Class("ToolManager", function (me) {
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
        Static.Const.MODE_COLOR_PICKER = 'color_picker';
        Static.Const.MODE_PENCIL = 'pencil';
        Static.Const.MODE_TEXT = 'text_input';
    }


    /**
     * various tools
     * @type {Object<drawing.tool.Tool>}
     */
    var toolList, drawing;

    this.ToolManager = function (drw) {
        drawing = drw;
        toolList = [
            {
                name: me.MODE_COLOR_PICKER,
                class: 'drawing.tool.ColorPicker'
            },
            {
                name: me.MODE_TEXT,
                class: 'drawing.tool.Text'
            },
            {
                name: me.MODE_FILLER,
                class: 'drawing.tool.Filling'
            },
            {
                name: me.MODE_ERASER,
                class: 'drawing.tool.Eraser'
            },
            {
                name: me.MODE_PENCIL,
                class: 'drawing.tool.Pencil'
            }
        ];

    };

    this.getTool = function (type, cb) {
        var tool = getToolByType(type);
        if(!tool){
            throw new Error("This tool does not exist");
        }
        if (typeof tool.class === 'string') {
            fm.Include(tool.class, function(){
                tool.class = new (fm.isExist(tool.class))(drawing);
                cb(tool.class);
            });
            return tool.class;
        } else if(typeof tool.class === 'object'){
            cb(tool.class);
            return tool.class;
        }
        throw "Tool " + type + " either does not exist or not added here";
    };

    this.getToolList = function(){
        return toolList;
    };

    function getToolByType (type) {
        for(var index = 0; index < toolList.length; index++){
            if( type === toolList[index].name){
                return toolList[index];
            }
        }
    }
});
