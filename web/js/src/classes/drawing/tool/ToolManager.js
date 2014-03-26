fm.Package("drawing.tool");
fm.Import("drawing.tool.Filling");
fm.Import("drawing.tool.Pencil");
fm.Import("drawing.tool.Eraser");
fm.Import("drawing.tool.Text");
fm.Class("ToolManager");
drawing.tool.ToolManager = function (me, Filling, Pencil, Eraser, Text) {
    'use strict';
    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * various tools
     * @type {Object<drawing.tool.Tool>}
     */
    var toolList;

    this.ToolManager = function (masterLayer, image, color) {
        toolList = {};
        var Canvas = drawing.Canvas;
        toolList[Canvas.MODE_FILLER] = new Filling(masterLayer, image, color);
        toolList[Canvas.MODE_ERASER] = new Eraser(masterLayer);
        toolList[Canvas.MODE_PENCIL] = new Pencil(masterLayer);
        toolList[Canvas.MODE_TEXT] = new Text(masterLayer);
    };

    this.getTool = function (type) {
        var tool = toolList[type];
        if (tool) {
            return tool;
        }
        throw "Tool " + type + " either does not exist or not added here";
    };

    this.getToolList = function(){
        return toolList;
    };
};
