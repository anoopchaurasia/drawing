function mainController($scope, $rootScope) {

    function safeApply(){

        if($rootScope.$$phase != '$apply' &&$rootScope.$$phase != '$digest'){
            $rootScope.$apply();
        }
    }

	$rootScope.drawing = new drawing.Drawing(safeApply);

	this.colorChanged = function(color){
       $scope.drawing.colorChanged(color);
    };

    this.getSelectedClass = function(type){

    };

    this.setSelectedColorType = function(type){

    };

    this.addLayer = function(){
    	$scope.drawing.addLayer();
    };

    this.createNewLayer = function(){
        $scope.drawing.layerManager.addLayer();
    };

    $scope.hasClass = function (shape) {
        return !!shape.class;
    }
}