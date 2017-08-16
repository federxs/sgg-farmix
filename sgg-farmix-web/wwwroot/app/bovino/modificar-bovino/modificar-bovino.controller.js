(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarBovinoController', modificarBovinoController);

    modificarBovinoController.$inject = ['$scope', 'modificarBovinoService', 'toastr', '$stateParams'];

    function modificarBovinoController($scope, modificarBovinoService, toastr, $stateParams) {
        var vm = $scope;
        vm.showSpinner = true;
        //funciones
        vm.modificar = modificar;
        vm.inicializar = inicializar();
        vm.cambiarSexo = cambiarSexo;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.bovino = {};
        vm.fechaDeHoy = new Date();
        vm.habilitar = true;
        vm.inicializar = inicializar;
        vm.btnVolver = "Volver";
        vm.checkH = false;
        vm.checkM = false;
        inicializar();

        function inicializar() {
            vm.showSpinner = true;
            modificarBovinoService.inicializar($stateParams.id).then(function success(data) {
                vm.habilitar = true;
                //combos
                vm.estados = data.estados;
                vm.categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;

                //bovino
                vm.bovino = data.bovino;
                if (vm.bovino.fechaNacimiento[8] === " ")
                    var fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 8).split('/');
                else
                    var fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 10).split('/');
                vm.bovino.fechaNacimiento = new Date(fechaNacimiento[2], fechaNacimiento[0], fechaNacimiento[1]);
                if (vm.bovino.genero === 0) {
                    vm.checkH = true;
                    vm.checkM = false;
                }
                else {
                    vm.checkH = false;
                    vm.checkM = true;
                }
                //seteo combos
                vm.bovino.idRaza = data.bovino.idRaza.toString();
                vm.bovino.idCategoria = data.bovino.idCategoria.toString();
                vm.bovino.idEstado = data.bovino.idEstado.toString();
                vm.bovino.idRodeo = data.bovino.idRodeo.toString();
                if (data.bovino.idEstablecimientoOrigen != 0) {
                    vm.bovino.idEstablecimientoOrigen = data.bovino.idEstablecimientoOrigen.toString();
                } else {
                    vm.bovino.idEstablecimientoOrigen = "";
                }

                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idBovino') {
                        vm.bovino[key] = '';
                    }
                });
                vm.showSpinner = false;
            })
        };

        function cambiarSexo() {
            if (vm.checkH === true) {
                vm.checkH = false;
                vm.checkM = true;
            }
            else {
                vm.checkH = true;
                vm.checkM = false;
            }
        };

        function modificar() {
            vm.bovino.peso = vm.bovino.peso.toString().replace(',', '.');
            vm.bovino.pesoAlNacer = vm.bovino.pesoAlNacer.toString().replace(',', '.');
            vm.bovino.fechaNacimiento = convertirFecha(vm.bovino.fechaNacimiento);
            if (vm.bovino.pesoAlNacer === '' || vm.bovino.pesoAlNacer === undefined)
                vm.bovino.pesoAlNacer = 0;
            if (vm.bovino.idBovinoMadre === '' || vm.bovino.idBovinoMadre === undefined)
                vm.bovino.idBovinoMadre = 0;
            if (vm.bovino.idBovinoPadre === '' || vm.bovino.idBovinoPadre === undefined)
                vm.bovino.idBovinoPadre = 0;
            if (vm.bovino.idEstablecimientoOrigen === '' || vm.bovino.idEstablecimientoOrigen === undefined)
                vm.bovino.idEstablecimientoOrigen = 0;
            if (vm.checkH === true) vm.bovino.genero = 0;
            else if (vm.checkM === true) vm.bovino.genero = 1;
            modificarBovinoService.modificar(vm.bovino).then(function success(data) {
                vm.habilitar = false;
                toastr.success('Se modificó el bovino con éxito ', 'Éxito');
            }, function error(data) {
                toastr.success('La operación no se pudo completar', 'Error');
            })
        };

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

        function validar() {

        }
    }
})();