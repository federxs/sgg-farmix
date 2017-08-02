(function () {
    'use strict';

    angular
        .module('app')
        .controller('eliminarBovinoController', eliminarBovinoController);

    eliminarBovinoController.$inject = ['$scope', 'eliminarBovinoService', '$stateParams'];

    function eliminarBovinoController($scope, eliminarBovinoService, $stateParams) {
        var vm = $scope;
        vm.tiposEliminacion = [
            { id: '1', nombre: 'Venta' },
            { id: '2', nombre: 'Defunción' }
        ];
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.fechaDeHoy = new Date();
        vm.tipoEliminacionSeleccionada = "1";
        vm.eliminar = eliminar;
        vm.inicializar = inicializar;
        inicializar();


        function inicializar() {
            eliminarBovinoService.inicializar($stateParams.id).then(function success(data) {
                //bovino
                vm.bovino = data;

                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idBovino') {
                        vm.bovino[key] = '';
                    }
                })
            })
        }

        function eliminar() {

        }
    }
})();
