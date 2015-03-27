/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
 fm.Package("");
 fm.Class("webPath");
 webPath = function (me) {
     Static.path = {
        "drawing" : {'class':"app.CanvasDrawing"}
	};
    Static.sources = './web/';
	Static.packages = {drawing: "F:/practo/Public_html/js/classes"};
};
