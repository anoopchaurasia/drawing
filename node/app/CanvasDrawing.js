fm.Package("app");
fm.Include("web");
fm.Class("CanvasDrawing", "Base");
app.CanvasDrawing = function (me, Base){this.setMe=function(_me){me=_me;};
	Static.main=function(){
		web = webPath;
		var sock_file = "/tmp/drawing.sock";
		//require('fs').unlinkSync(sock_file);
		var http = require('http');
		var server = http.createServer(function  (c) {});
		Starter.handle(server.listen(8081, 'localhost'));
	};

	this.method = function( req, res ) {
		var path =  web.sources + "/index.html";
		require('fs').readFile(path, function( err, data ) {
			if (err) {

				res.writeHead(400, {'Content-Type': 'text/html'});

				console.log(err);
			}
			else {
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(data);
				res.end();
			}
		});
	};
};