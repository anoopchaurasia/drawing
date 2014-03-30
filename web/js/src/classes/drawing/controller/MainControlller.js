fm.Package("drawing.controller");
fm.Import("jfm.dom.DomManager");
fm.Import("drawing.Canvas");
fm.Class("MainControlller", "jfm.dom.Controller");
drawing.controller.MainControlller = function(base, me, DomManager, Canvas){

	this.setMe = function (_me) {
		me = _me;
	}

	this.MainControlller = function(jImage, fileTagging, color){
		new base();
		this.canvas = new Canvas(jImage, fileTagging, color);
		drawing.controller.MainControlller.setTemplate($("#header")[0],  this.getClass()+"");
        new DomManager($("#header"), me);
	};
};