fm.Package("drawing");
fm.Class("Contrast");

drawing.Contrast = function (me) {

    this.setMe = function (_me) {
        me = _me;
    };

    var layer, image, imageData;
    this.Contrast = function (l, img) {
        layer = l;
        image = img;
    };

    this.setup = function () {
        layer.show();
        layer.setImage(image);
        imageData = layer.getData();
    };

    this.setContrast = function (contrast) {
        me.setup();
        contrastImage(imageData, Utility.parseFloat(contrast, 5));
        layer.context.putImageData(imageData, 0, 0);
        layer.context.stroke();
    };

    this.start = function () {};

    function contrastImage(imageData, contrast) {
        console.log(contrast);
        var data = imageData.data;
        var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        for (var i = 0; i < data.length; i += 4) {
            data[i] = factor * (data[i] - 128) + 128;
            data[i + 1] = factor * (data[i + 1] - 128) + 128;
            data[i + 2] = factor * (data[i + 2] - 128) + 128;
        }
        return imageData;
    }

    this.toString = function () {
        return drawing.Drawing.MODE_CONTRAST;
    };
};
