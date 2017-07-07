(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarBovinoController', modificarBovinoController);

    modificarBovinoController.$inject = ['$scope', 'modificarBovinoService', '$stateParams'];

    function modificarBovinoController($scope, modificarBovinoService, $stateParams) {
        var vm = $scope;
        //funciones
        vm.modificar = modificar;
        vm.inicializar = inicializar();
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.bovino = {};
        vm.fechaDeHoy = new Date();
        vm.habilitar = true;
        vm.inicializar = inicializar;
        vm.btnVolver = "Volver";
        inicializar();

        function inicializar() {
            modificarBovinoService.inicializar($stateParams.id).then(function success(data) {
                //combos
                vm.estados = data.estados;
                vm.categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;

                //bovino
                vm.bovino = data.bovino;
                var fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 10).split('/');
                vm.bovino.fechaNacimiento = new Date(fechaNacimiento[2], fechaNacimiento[1], fechaNacimiento[0]);

                //seteo combos
                vm.bovino.idRaza = data.bovino.idRaza.toString();
                vm.bovino.idCategoria = data.bovino.idCategoria.toString();
                vm.bovino.idEstado = data.bovino.idEstado.toString();
                vm.bovino.idRodeo = data.bovino.idRodeo.toString();
                if (data.bovino.idEstablecimientoOrigen != 0) {
                    vm.bovino.idEstablecimientoOrigen = data.bovino.idEstablecimiento.toString();
                } else {
                    vm.bovino.idEstablecimientoOrigen = "";
                }

                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) == 0 && key != 'idBovino') {
                        vm.bovino[key] = '';
                    }
                })
            })
        }

        function modificar() {
            modificarBovinoService.modificar(vm.bovino).then(function success(data) {
                vm.habilitar = false;
            })
        }

        function validar() {

        }
    }
})();