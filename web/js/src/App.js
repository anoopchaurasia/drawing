angular.module('app', [])
.directive('addImage',[function(){
	return {
		link: function (scope, element) {
			element.change(function(e, data){
			    var url = window.URL || window.webkitURL
			    , src = url.createObjectURL(e.target.files[0]);
			    scope.drawing.layerManager.addImageLayer(src);
			    scope.$apply();
			});
		}
	}
}]);
fm.Include("drawing.Drawing",function(){
    $(document).ready(function(){
        angular.bootstrap(document, ['app']);
    });
});