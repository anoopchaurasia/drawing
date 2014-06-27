angular.module('app', [])
.directive('addImage',[function(){
	return {
		link: function (scope, element) {
			var input = element.find("input");
			element.change(function(e, data){
			    var url = window.URL || window.webkitURL
			    , src = url.createObjectURL(e.target.files[0]);
			    scope.drawing.layerManager.addImageLayer(src, e.target.files[0].name);
			    scope.$apply();
			});
			element.click(function (e) {
				if(e.taget.nodeName === "INPUT"){
					return false;
				}
				input.click();
			});
		}
	}
}])
.directive('resize', [
	function () {
		function linker (scope, element) {
			element.resizable({
				stop: function (e, helper) {
	            	scope.drawing.onLayoutChange(helper.size.width, helper.size.height);
	        	}
	        });
	        $(window).resize(function (e) {
	        	reposition(element, scope);
	        });
	        reposition(element, scope);
		}
	    function reposition(element, scope){
	    	element.css({
        		top: ($(window).height()/2 - element.height()/2),
        		left: ($(window).width()/2 - element.width()/2),
        	});
        	scope.drawing.settings.offset = element.offset();
	    }
		return {
			link: linker
		}
	}
])
.directive('colorpicker', [
	function () {
		function linker (scope, element) {
			element.ColorPicker({
				onSubmit:function (e, color) {
					scope.drawing.colorChanged("#"+color);
					element.css('background', "#" + color);
				},
				color: "#ff0000"
			});
			element.css('background', "#ff0000");
		}

		return {
			link: linker
		}
	}
]);
fm.Include("drawing.Drawing",function(){
    $(document).ready(function(){
        angular.bootstrap(document, ['app']);
    });
});