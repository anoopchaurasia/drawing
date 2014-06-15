fm.Package("drawing.layer");
fm.Class("BackgroundLayer", "drawing.layer.Layer");

/**
 *@class create canvas BackgroundLayer
 */
drawing.layer.BackgroundLayer = function (base, me) {
   this.setMe=function(_me){me=_me;}
    this.BackgroundLayer = function(image, canvas, color, canvasCont){
        me.base(image, canvas, color, canvasCont);
        this.changeSize(image.width(), image.height());
    };

    this.changeSize = function (width, height) {
        me.base.changeSize(width, height);
        me.fill(10); 
    };

    this.fill = function(gap){
        var fill;
        var WIDTH = me.canvas[0].width;
        var HEIGHT = me.canvas[0].height;

        for(var i=0; i<WIDTH; i=i+gap){
            if(i%(gap*2) == 0){
                fill=true;
            }
            else{
                fill=false;
            }

            for(var j=0; j<HEIGHT; j=j+gap){
                if(fill==true){
                    me.context.fillStyle = '#eeeeee';
                    me.context.fillRect(i, j, gap, gap);
                    fill = false;
                }
                else{
                    fill = true;
                }
            }
        }
    };
};