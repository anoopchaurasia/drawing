fm.Package("drawing");
fm.Class("BackgroundLayer", "drawing.Layer");

/**
 *@class create canvas BackgroundLayer
 */
drawing.BackgroundLayer = function (base, me) {
   this.setMe=function(_me){me=_me;}
    this.BackgroundLayer = function(image, canvas, color){
        me.base(image, canvas, color);
        this.changeSize();
    };

    this.changeSize = function () {
        me.base.changeSize($(window).width() - 150, $(window).height());
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