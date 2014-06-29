fm.Package("drawing.layer");
fm.Class("BackgroundLayer", "drawing.layer.Layer");

/**
 *@class create canvas BackgroundLayer
 */
drawing.layer.BackgroundLayer = function (base, me, Layer) {
    this.setMe=function(_me){me=_me;}
    
    var bottomLayer;
    this.BackgroundLayer = function(drawing, canvasCont){
        this.closable = false;
        bottomLayer = new Layer(drawing, canvasCont.prev(), undefined, "no name");
        me.base(drawing, canvasCont, undefined, "Background");
        this.changeSize(drawing.settings.width, drawing.settings.height);
    };

    this.changeSize = function (width, height) {
        me.base.changeSize(width, height);
        bottomLayer.changeSize(width, height);
        me.fill(10); 
    };

    this.fill = function(gap){
        var fill;
        var WIDTH = bottomLayer.canvas[0].width;
        var HEIGHT = bottomLayer.canvas[0].height;

        for(var i=0; i<WIDTH; i=i+gap){
            if(i%(gap*2) == 0){
                fill=true;
            }
            else{
                fill=false;
            }

            for(var j=0; j<HEIGHT; j=j+gap){
                if(fill==true){
                    bottomLayer.context.fillStyle = '#ccc';
                    bottomLayer.context.fillRect(i, j, gap, gap);
                    fill = false;
                }
                else{
                    fill = true;
                }
            }
        }
    };
};