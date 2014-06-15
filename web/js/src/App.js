angular.module('app', []);
fm.Include("drawing.Drawing",function(){
    $(document).ready(function(){
        $("#image")[0].onload = function(){
          angular.bootstrap(document, ['app']);
        };
        $("#image")[0].src = "/img/tooth_chart.png";
    });
});