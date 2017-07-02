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
        //vm.inicializar = inicializar;
        //inicializar();

        function inicializar() {
            modificarBovinoService.inicializar({ idAmbitoEstado: '1' }, function (data) {
                vm.estados = data.estados;
                vm.categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
            });
            vm.bovino = new registrarBovinoService();
        };
        $scope.load();

        function modificar() {
            vm.bovino.$save(function (data) {

            });

        }

        function validar() {

        }
    }
})();