angular.module('starter')
.controller('InseminacionesPendientesController', function ($scope, $state, $rootScope, inseminacionService, $ionicLoading, $localStorage) {
    if($rootScope.logueado == false){
            $state.go('app.bienvenido');
     }
    function cargarInseminacionesPendientes() {
            showIonicLoading().then(getInseminacionesPendientes).then(function (_inseminaciones) {
                var fechaHoy = new Date();
                fechaHoy = moment(convertirFecha(fechaHoy));
                $scope.inseminaciones = Enumerable.From(_inseminaciones).Where(function (x) {
                    var fechaInsem = x.fechaInseminacion.split('/');
                    fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                    return fechaHoy.diff(fechaInsem, 'days') >= 30
                }).ToArray();
                $scope.inseminacionesTacto = Enumerable.From(_inseminaciones).Where(function (x) {
                    var fechaInsem = x.fechaInseminacion.split('/');
                    fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                    return fechaHoy.diff(fechaInsem, 'days') >= 60
                }).ToArray();
				$scope.$broadcast('scroll.refreshComplete');
            }).then($ionicLoading.hide).catch($ionicLoading.hide);
        }

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }

        function getInseminacionesPendientes() {
            return inseminacionService.getInseminacionesPendientes($localStorage.campo);
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

        $scope.verificar = function (idInseminacion, tipo) {
            $rootScope.evento = {};
            $rootScope.evento.tipoVerificacion = tipo;
            $state.go('app.verificarInseminacion', { idInseminacion: idInseminacion });
        }
        $scope.cargarInseminacionesPendientes = cargarInseminacionesPendientes;

        cargarInseminacionesPendientes();
    });