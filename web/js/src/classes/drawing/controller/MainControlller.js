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
        this.type = "foreground";
		this.canvas = new Canvas(jImage, fileTagging, color);
		drawing.controller.MainControlller.setTemplate($("#header")[0],  this.getClass()+"");
        new DomManager($("#header"), me);
	};

    this.colorChanged = function(color){
        if (this.type === 'foreground'){
            me.canvas.colorChanged(color);
        } else if (this.type === 'background'){
            me.canvas.currentTool.setFillColor(color);
        }
        me.callAll('change');
    };

    this.getSelectedClass = function(type){
        if(type === this.type){
            return 'selected';
        }
    };

    this.setSelectedColorType = function(type){
        this.type = type;
         me.callAll('change');
    };
};