angular.module('starter')
.controller('ResultadoController', function ($stateParams,$rootScope, $scope, bovinoService, $ionicLoading, $state) {
    showIonicLoading().then(obtenerBovino).then(function (_bovino) {
        if($rootScope.logueado == false){
            $state.go('app.bienvenido');
        }
        if (_bovino != null) {
            $scope.bovino = _bovino;
            var fecha;// = _bovino.fechaNacimiento.substr(0, 10);
            if (_bovino.fechaNacimiento.charAt(1) == '/' && _bovino.fechaNacimiento.charAt(4) == '/') {
                fecha = _bovino.fechaNacimiento.substr(2, 2) + "/0" + _bovino.fechaNacimiento.substr(0, 1) + "/" + _bovino.fechaNacimiento.substr(5, 4)
            } else if (_bovino.fechaNacimiento.charAt(2) == '/' && _bovino.fechaNacimiento.charAt(5) == '/') {
                fecha = _bovino.fechaNacimiento.substr(3, 2) + "/" + _bovino.fechaNacimiento.substr(0, 2) + "/" + _bovino.fechaNacimiento.substr(6, 4)
            } else if (_bovino.fechaNacimiento.charAt(1) == '/' && _bovino.fechaNacimiento.charAt(3) == '/') {
                fecha = "0" + _bovino.fechaNacimiento.substr(2, 1) + "/0"  +  _bovino.fechaNacimiento.substr(0, 1) + "/" + _bovino.fechaNacimiento.substr(4, 4)
            } else {
                fecha = "0" + _bovino.fechaNacimiento.substr(3, 1) + "/" + _bovino.fechaNacimiento.substr(0, 2) + "/" + _bovino.fechaNacimiento.substr(5, 4)
            }
            $scope.bovino.fechaNacimiento = fecha;
            if ($scope.bovino.genero == 0) {
                $scope.bovino.genero = "Hembra";
            } else {
                $scope.bovino.genero = "Macho";
            }
        } else {
            $state.go('app.leer');
            alert("El id escaneado no se encuentra dentro de los animales registrados");
        }
    }).then($ionicLoading.hide).catch($ionicLoading.hide);

    function showIonicLoading() {
        return $ionicLoading.show({
            template: '<ion-spinner icon="lines"/>'
        })
    }

    function obtenerBovino() {
        return bovinoService.getDatosBovino($stateParams.id);
    }
});
