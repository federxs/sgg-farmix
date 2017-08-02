(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleBovinoController', detalleBovinoController);

    detalleBovinoController.$inject = ['$scope', 'detalleBovinoService', '$stateParams'];

    function detalleBovinoController($scope, detalleBovinoService, $stateParams) {
        var vm = $scope;
        //funciones
        vm.inicializar = inicializar;
        //variables
        vm.bovino = {};
        vm.checkH = false;
        vm.checkM = false;

        inicializar();

        function inicializar() {
            detalleBovinoService.inicializar($stateParams.id).then(function success(data) {
                vm.checkH = false;
                vm.checkM = false;
                //bovino
                vm.bovino = data;
                var fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 10).split('/');
                vm.bovino.fechaNacimiento = new Date(fechaNacimiento[2], fechaNacimiento[1], fechaNacimiento[0]);
                if (vm.bovino.sexo === 0) {
                    vm.checkH = true;
                    vm.checkM = false;
                }
                else {
                    vm.checkH = false;
                    vm.checkM = true;
                }
                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idBovino') {
                        vm.bovino[key] = '';
                    }
                })
            });
        }//fin inicializar


    }//fin archivo
})();