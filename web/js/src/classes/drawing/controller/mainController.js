function mainController($scope, $rootScope) {
    
	$rootScope.drawing = new drawing.Drawing();

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