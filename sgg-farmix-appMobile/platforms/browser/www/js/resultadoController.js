angular.module('starter')
.controller('ResultadoController', function ($stateParams, $scope, bovinoService, $ionicLoading, $state) {
    showIonicLoading().then(obtenerBovino).then(function (_bovino) {
        if (_bovino != null) {
            $scope.peso = _bovino.peso;
            $scope.apodo = _bovino.apodo;
            $scope.numCaravana = _bovino.numCaravana;
            var fecha;
            if (_bovino.fechaNacimiento.charAt(1) == '/' && _bovino.fechaNacimiento.charAt(4) == '/') {
                fecha = _bovino.fechaNacimiento.substr(2, 2) + "/" + _bovino.fechaNacimiento.substr(0, 1) + "/" + _bovino.fechaNacimiento.substr(5, 4)
            } else if (_bovino.fechaNacimiento.charAt(2) == '/' && _bovino.fechaNacimiento.charAt(4) == '/') {
                fecha = _bovino.fechaNacimiento.substr(3, 1) + "/" + _bovino.fechaNacimiento.substr(0, 2) + "/" + _bovino.fechaNacimiento.substr(5, 4)
            } else if (_bovino.fechaNacimiento.charAt(2) == '/' && _bovino.fechaNacimiento.charAt(5) == '/') {
                fecha = _bovino.fechaNacimiento.substr(3, 2) + "/" + _bovino.fechaNacimiento.substr(0, 2) + "/" + _bovino.fechaNacimiento.substr(5, 4)
            } else {
                fecha = _bovino.fechaNacimiento.substr(2, 1) + "/" + _bovino.fechaNacimiento.substr(0, 1) + "/" + _bovino.fechaNacimiento.substr(4, 4)
            }
            $scope.fechaNacimiento = fecha;
        } else {
            alert("El id escaneado no se encuentra dentro de los animales registrados");
            $state.go('app.leer');
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
