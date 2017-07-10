(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleBovinoController', detalleBovinoController);

    detalleBovinoController.$inject = ['$scope', 'detalleBovinoService'];

    function detalleBovinoController($scope, detalleBovinoService) {
        var vm = $scope;
        //funciones
        vm.inicializar = inicializar;
        //variables
        vm.bovino = {};

        inicializar();

        function inicializar() {
            detalleBovinoService.inicializar($stateParams.id).then(function success(data) {
                //bovino
                vm.bovino = data.bovino;
                var fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 10).split('/');
                vm.bovino.fechaNacimiento = new Date(fechaNacimiento[2], fechaNacimiento[1], fechaNacimiento[0]);

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