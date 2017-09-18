(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarBovinoController', registrarBovinoController);

    registrarBovinoController.$inject = ['$scope', 'registrarBovinoService', 'toastr', '$state'];

    function registrarBovinoController($scope, registrarBovinoService, toastr, $state) {
        var vm = $scope;
        vm.showSpinner = true;
        vm.habilitar = false;
        //funciones
        vm.registrar = registrar;
        vm.validar = validar;
        vm.inicializar = inicializar();
        vm.idCaravanaChange = idCaravanaChange;
        vm.changeSexo = changeSexo;
        //variables
        $scope.$state = $state;
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.rodeos = [];
        vm.establecimientos = [];
        vm.bovino = {};
        vm.fechaDeHoy = new Date();
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.showMjeSuccess = false;
        vm.showMjeError = false;
        vm.mjeExiste = '';
        var categorias = [];

        function inicializar() {
            vm.habilitar = false;
            registrarBovinoService.inicializar({ idAmbitoEstado: '1' }, function (data) {
                vm.estados = data.estados;
                categorias = data.categorias;
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 0)
                        vm.categorias.push(categorias[i]);
                }
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
                vm.showSpinner = false;
                vm.habilitar = true;
                vm.bovino = new registrarBovinoService();
                vm.bovino.genero = 0;
            }, function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function registrar() {
            vm.showSpinner = true;
            vm.habilitar = false;
            vm.bovino.peso = vm.bovino.peso.toString().replace(',', '.');
            if (vm.bovino.pesoAlNacer !== undefined && vm.bovino.pesoAlNacer !== '')
                vm.bovino.pesoAlNacer = vm.bovino.pesoAlNacer.toString().replace(',', '.');
            vm.bovino.fechaNacimiento = convertirFecha(vm.bovino.fechaNacimiento);
            vm.bovino.$save(function (data) {
                toastr.success('Se agrego con éxito el bovino ', 'Éxito');
                //vm.habilitar = false;
                vm.btnVolver = "Volver";
                vm.showSpinner = false;
            }, function (error) {
                if (error.statusText === 'Bovino ya existe') {
                    toastr.warning('Ya existe un bovino con ese número de caravana', 'Advertencia');
                    var fecha = vm.bovino.fechaNacimiento.split('/');
                    vm.bovino.fechaNacimiento = new Date(fecha[2], fecha[1], fecha[0]);
                }
                else {
                    toastr.error('La operación no se pudo completar', 'Error');
                }
            });
        };

        function idCaravanaChange() {
            registrarBovinoService.existeIdCaravana({ idCaravana: vm.bovino.numCaravana }, function (data) {
                if (data[0] === "1") {
                    vm.formRegistrarBovino.idCaravana.$setValidity("existeIdCaravana", false);
                }
                else {
                    vm.formRegistrarBovino.idCaravana.$setValidity("existeIdCaravana", true);
                }
            }, function (error) {
                toastr.error('La operación no se pudo completar', 'Error');
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
        }

        function validar() {

        }

        function changeSexo() {
            vm.categorias = [];
            if (vm.bovino.genero === '0') {
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 0)
                        vm.categorias.push(categorias[i]);
                }
            }
            else {
                for (var j = 0; j < categorias.length; j++) {
                    if (categorias[j].genero === 1)
                        vm.categorias.push(categorias[j]);
                }
            }
        }
    }
})();