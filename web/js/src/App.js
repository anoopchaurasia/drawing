angular.module('app', [])
.directive('addImage',[function(){
	return {
		link: function (scope, element) {
			element.change(function(e, data){
			    var url = window.URL || window.webkitURL
			    , src = url.createObjectURL(e.target.files[0]);
			    scope.drawing.layerManager.addImageLayer(src, e.target.files[0].name);
			    scope.$apply();
			});
		}
	}
}])
.directive('resize', [
	function () {
		function linker (scope, element) {
			element.resizable({
				resize: function (e, helper) {
	            	scope.drawing.onLayoutChange(helper.size.width, helper.size.height);
	        	}
	        });
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