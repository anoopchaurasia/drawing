fm.Package("drawing.tool");
fm.Class("Filling", "drawing.tool.Tool");
drawing.tool.Filling = function (base, me) {

    'use strict';

    this.setMe = function (_me) {
        me = _me
    };

    var canvasWidth, canvasHeight, outlineLayerData, colorLayerData, clickedColorR, clickedColorG, clickedColorB, masterLayer;
    var newColorR, newColorG, newColorB;
    this.Filling = function (ml, image, color) {
        base(ml);
        masterLayer = ml;
        canvasWidth = masterLayer.canvas[0].width;
        canvasHeight = masterLayer.canvas[0].height;
        outlineLayerData = masterLayer.getImageData(image).data;
        this.setStrokeColor(color);
    };


    function matchClickedColor(pixelPos) {
        var r = outlineLayerData[pixelPos];
        var g = outlineLayerData[pixelPos + 1];
        var b = outlineLayerData[pixelPos + 2];
        var a = outlineLayerData[pixelPos + 3];

        if (Math.abs(r - clickedColorR) > 5 || Math.abs(g - clickedColorG) > 5 || Math.abs(b - clickedColorB) > 5) {
            return false;
        }

        r = colorLayerData.data[pixelPos];
        g = colorLayerData.data[pixelPos + 1];
        b = colorLayerData.data[pixelPos + 2];

        if (r + g + b === 0) return true;

        // If current pixel matches the new color
        if (r == newColorR && g == newColorG && b == newColorB) {
            return false;
        }

        return true;
    }

    this.fill = function (startX, startY) {

        startX = Math.floor(startX);
        colorLayerData = masterLayer.context.getImageData(0, 0, canvasWidth, canvasHeight);
        var pixelPos = (startY * canvasWidth + startX) * 4;
        clickedColorR = outlineLayerData[pixelPos + 0];
        clickedColorG = outlineLayerData[pixelPos + 1];
        clickedColorB = outlineLayerData[pixelPos + 2];
        var pixelStack = [
            [startX, startY]
        ];
        me.floodFill(pixelStack);

    };

    var completed = [];

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
                colorPixel(pixelPos);
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
        masterLayer.context.putImageData(colorLayerData, 0, 0);
        masterLayer.context.stroke();
    }

    function colorPixel(pixelPos) {
        colorLayerData.data[pixelPos] = newColorR;
        colorLayerData.data[pixelPos + 1] = newColorG;
        colorLayerData.data[pixelPos + 2] = newColorB;
        colorLayerData.data[pixelPos + 3] = 255;
    }

    this.toString = function () {
        return drawing.Canvas.MODE_FILLER;
    };

    this.setStrokeColor = function (color) {
        newColorR = parseInt(color.substring(1, 3), 16);
        newColorG = parseInt(color.substring(3, 5), 16);
        newColorB = parseInt(color.substring(5, 7), 16);
    };

    this.setCursor = function () {
        masterLayer.canvas.css("cursor", "url(/images/cursor/fill.cur), pointer");
    };
};
