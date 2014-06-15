function mainController($scope, $rootScope) {
	$rootScope.drawing = new drawing.Drawing($("#image"), {}, "#ff0000");

	this.colorChanged = function(color){
       
    };

    this.getSelectedClass = function(type){
        
    };

    this.setSelectedColorType = function(type){
        
    };

    this.addLayer = function(){
    	$scope.drawing.addLayer();
    };
}