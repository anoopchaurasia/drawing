fm.Package("drawing.tool");
fm.Class("Filling > drawing.tool.Tool", function ( me) {

    'use strict';

    this.setMe = function (_me) {
        me = _me
    };

    var canvasWidth, sensitivity, outlineLayer, canvasHeight, outlineLayerData, clickedColorR, clickedColorG, clickedColorB, layerManager;
    var newColorR, newColorG, newColorB;
    this.Filling = function (drawing) {
       me.base(drawing);
        sensitivity = 0;
        layerManager = drawing.layerManager;
    };


    function matchClickedColor(pixelPos) {
        var r = outlineLayerData[pixelPos];
        var g = outlineLayerData[pixelPos + 1];
        var b = outlineLayerData[pixelPos + 2];
        var a = outlineLayerData[pixelPos + 3];
        if (Math.abs(r - clickedColorR) > sensitivity || Math.abs(g - clickedColorG) > sensitivity || Math.abs(b - clickedColorB) > sensitivity) {
            return false;
        }
        if(r + g + b === 0 && a > 0){
            return false;
        }
        if(r == clickedColorR && g == clickedColorG && b == clickedColorB){
            return false;
        }
        return true;
    }

    this.fill = function (startX, startY, color) {
        var layer = layerManager.getSelectedLayer();
        startX = Math.floor(startX);
        startY = Math.floor(startY);
        canvasWidth = layer.canvas[0].width;
        canvasHeight = layer.canvas[0].height;
        outlineLayer = layer.getData();
        outlineLayerData = outlineLayer.data;

        var pixelPos = (startY * canvasWidth + startX) * 4;
        clickedColorR = outlineLayerData[pixelPos + 0];
        clickedColorG = outlineLayerData[pixelPos + 1];
        clickedColorB = outlineLayerData[pixelPos + 2];
        this.setStrokeColor(color);
        var pixelStack = [
            [startX, startY]
        ];
        me.floodFill(pixelStack);

    };

    this.floodFill = function (pixelStack) {
        var newPos, x, y, pixelPos, reachLeft, reachRight;
        var drawingBoundLeft = 0;
        var drawingBoundTop = 0;
        completed = [];
        var drawingBoundRight = 0 + canvasWidth - 1;
        var drawingBoundBottom = 0 + canvasHeight - 1;

        while (pixelStack.length) {
            newPos = pixelStack.pop();
            x = newPos[0];
            y = newPos[1];

            //console.log("POP: " + (x - drawingAreaX - 2) + "," + (y - drawingAreaY - 2));

            pixelPos = (y * canvasWidth + x) * 4;
            // Go up as long as the color matches and are inside the canvas
            while (y-- >= drawingBoundTop && matchClickedColor(pixelPos)) {
                //console.log("UP: " + (x - drawingAreaX - 2) + "," + (y - drawingAreaY - 2));
                pixelPos -= canvasWidth * 4;
            }
            pixelPos += canvasWidth * 4;
            ++y;
            reachLeft = false;
            reachRight = false;
            // Go down as long as the color matches and in inside the canvas
            while (y++ < drawingBoundBottom && matchClickedColor(pixelPos)) {
                colorPixel(outlineLayerData, pixelPos);
                //console.log("COLOR: " + (x - drawingAreaX - 2) + "," + (y - drawingAreaY - 2));

                if (x > drawingBoundLeft) {
                    if (matchClickedColor(pixelPos - 4)) {
                        if (!reachLeft) {
                            pixelStack.push([x - 1, y]);
                            //console.log("PUSH: " + ((x-1) - drawingAreaX - 2) + "," + (y - drawingAreaY - 2));
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }
                if (x < drawingBoundRight) {
                    if (matchClickedColor(pixelPos + 4)) {
                        if (!reachRight) {
                            pixelStack.push([x + 1, y]);
                            //console.log("PUSH: " + ((x+1) - drawingAreaX - 2) + "," + (y - drawingAreaY - 2));
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                pixelPos += canvasWidth * 4;
            }
        }
        layerManager.getSelectedLayer().context.putImageData(outlineLayer, 0, 0);
        layerManager.getSelectedLayer().context.stroke();
    }

    var completed = [];

    function colorPixel(outlineLayerData, pixelPos) {
        outlineLayerData[pixelPos] = newColorR;
        outlineLayerData[pixelPos + 1] = newColorG;
        outlineLayerData[pixelPos + 2] = newColorB;
        outlineLayerData[pixelPos + 3] = 255;
    }

    this.toString = function () {
        return me.package.ToolManager.MODE_FILLER;
    };

    this.setStrokeColor = function (color) {
        newColorR = parseInt(color.substring(1, 3), 16);
        newColorG = parseInt(color.substring(3, 5), 16);
        newColorB = parseInt(color.substring(5, 7), 16);
    };

    this.setCursor = function () {
        layerManager.getSelectedLayer().canvas.css("cursor", "url(/images/cursor/fill.cur), pointer");
    };
});
