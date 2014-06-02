fm.Package("drawing");
fm.Class("BackgroundLayer", "drawing.Layer");

/**
 *@class create canvas BackgroundLayer
 */
drawing.BackgroundLayer = function (base, me) {
   this.setMe=function(_me){me=_me;}
    this.BackgroundLayer = function(image, canvas, color){
        me.base(image, canvas, color);
    };

    this.fill = function(gap){
        var fill;
        for(var i=0; i<300; i=i+gap){
            if(i%(gap*2) == 0){
                fill=true;
            }
            else{
                fill=false;
            }

            for(var j=0; j<300; j=j+gap){
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