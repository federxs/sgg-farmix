angular.module('starter')
.controller('ResultadoController', function ($stateParams, $rootScope, $scope, bovinoService, $ionicLoading, $state, $localStorage) {
    showIonicLoading().then(obtenerBovino).then(function (_bovino) {
        if ($rootScope.logueado == false) {
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
                fecha = "0" + _bovino.fechaNacimiento.substr(2, 1) + "/0" + _bovino.fechaNacimiento.substr(0, 1) + "/" + _bovino.fechaNacimiento.substr(4, 4)
            } else {
                fecha = "0" + _bovino.fechaNacimiento.substr(3, 1) + "/" + _bovino.fechaNacimiento.substr(0, 2) + "/" + _bovino.fechaNacimiento.substr(5, 4)
            }
            $scope.bovino.fechaNacimiento = fecha;
            if ($scope.bovino.fechaEstimadaParto != undefined) {
                var fechaHoy = new Date();
                fechaHoy = moment(convertirFecha(fechaHoy));
                var fechaEstimado = $scope.bovino.fechaEstimadaParto.split('/');
                fechaEstimado = moment(fechaEstimado[2] + '/' + fechaEstimado[1] + '/' + fechaEstimado[0]);
                if (fechaHoy.diff(fechaEstimado, 'days') >= 1) {
                    $scope.bovino.fechaEstimadaParto = '';
                }
            } else {
                $scope.bovino.fechaEstimadaParto = '';
            }
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
        return bovinoService.getDatosBovino($stateParams.id, $localStorage.campo);
    }

    function convertirFecha(fecha) {
        var dia = fecha.getDate().toString();
        if (dia.length === 1) {
            dia = '0' + dia;
        }
        var mes = (fecha.getMonth() + 1).toString();
        if (mes.length === 1) {
            mes = '0' + mes;
        }
        var ano = fecha.getFullYear().toString();
        return ano + '/' + mes + '/' + dia;
    }
});
