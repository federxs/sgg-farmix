angular.module('starter')
    .controller('EscribirController', function ($scope, $rootScope) {
        $scope.txtBovino = {};
        $scope.escribir = function() {
            $rootScope.aviso = "Acerque el tag";
            $rootScope.idBovino = $scope.txtBovino.value;
        }
})