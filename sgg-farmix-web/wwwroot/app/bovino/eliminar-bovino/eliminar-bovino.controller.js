(function () {
    'use strict';

    angular
        .module('app')
        .controller('eliminarBovinoController', eliminarBovinoController);

    eliminarBovinoController.$inject = ['$scope', 'eliminarBovinoService', '$stateParams', 'toastr'];

    function eliminarBovinoController($scope, eliminarBovinoService, $stateParams, toastr) {
        var vm = $scope;
        vm.showSpinner = true;
        vm.habilitar = false;
        vm.tiposEliminacion = [
            { id: '1', nombre: 'Venta' },
            { id: '2', nombre: 'Defunción' }
        ];
        vm.btnVolver = "Cancelar";
        vm.nroCaravana = '';
        vm.habilitar = true;
        vm.fechaDeHoy = new Date();
        vm.tipoEliminacionSeleccionada = "1";
        vm.eliminar = eliminar;
        vm.inicializar = inicializar;
        vm.bajaBovino = {};
        inicializar();
        function inicializar() {
            eliminarBovinoService.inicializar($stateParams.id).then(function success(data) {
                //bovino
                vm.bovino = data;
                vm.establecimientos = data.establecimientosDestino.establecimientos;
                vm.showSpinner = false;
                vm.habilitar = true;
                vm.nroCaravana = vm.bovino.numCaravana;
                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idBovino') {
                        vm.bovino[key] = '';
                    }
                })
            }, function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }

        function eliminar() {
            vm.showSpinner = true;
            vm.habilitar = false;
            $('#modalConfirmEliminar').modal('hide');
            if (vm.tipoEliminacionSeleccionada === "2") {
                var fecha = convertirFecha(vm.bajaBovino.fechaMuerte);
                eliminarBovinoService.bajaMuerte(vm.bovino.idBovino, fecha).then(function success(data) {                    
                    vm.showSpinner = false;
                    vm.btnVolver = "Volver";
                    toastr.success('Se dio de baja el bovino con éxito ', 'Éxito');                    
                }, function error(data) {
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
            else {
                vm.bajaBovino.monto = vm.bajaBovino.monto.toString().replace(',', '.');
                vm.bajaBovino.idBovino = vm.bovino.idBovino;
                eliminarBovinoService.bajaVenta(vm.bajaBovino).then(function success(data) {
                    vm.showSpinner = false;
                    vm.btnVolver = "Volver";
                    toastr.success('Se vendio el bovino con éxito ', 'Éxito');
                }, function error(data) {
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
        }

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = fecha.getMonth().toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };
    }
})();
