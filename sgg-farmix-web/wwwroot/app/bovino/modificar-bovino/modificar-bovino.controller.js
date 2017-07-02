(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarBovinoController', modificarBovinoController);

    modificarBovinoController.$inject = ['$scope', 'modificarBovinoService'];

    function modificarBovinoController($scope, modificarBovinoService) {
        var vm = $scope;
        //funciones
        vm.modificar = modificar;
        vm.inicializar;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.bovino = {};
        vm.fechaDeHoy = new Date();
        vm.inicializar = inicializar;
        inicializar();

        function inicializar() {
            modificarBovinoService.inicializar(2).then(function success(data) {
                vm.bovino = data.bovino;
            })
        };

        function modificar() {
            vm.bovino.$save(function (data) {

            });

        }

        function validar() {

        }
    }
})();