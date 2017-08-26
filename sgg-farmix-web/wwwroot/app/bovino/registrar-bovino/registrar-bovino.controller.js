(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarBovinoController', registrarBovinoController);

    registrarBovinoController.$inject = ['$scope', 'registrarBovinoService', 'toastr', '$state'];

    function registrarBovinoController($scope, registrarBovinoService, toastr, $state) {
        var vm = $scope;
        //funciones
        vm.registrar = registrar;
        vm.validar = validar;
        vm.inicializar = inicializar;
        vm.idCaravanaChange = idCaravanaChange;
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

        vm.inicializar();

        function inicializar() {
            registrarBovinoService.inicializar({ idAmbitoEstado: '1' }, function (data) {
                vm.estados = data.estados;
                vm.categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
            });
            vm.bovino = new registrarBovinoService();
        };

        function registrar() {
            vm.bovino.peso = vm.bovino.peso.toString().replace(',', '.');
            if (vm.bovino.pesoAlNacer !== undefined && vm.bovino.pesoAlNacer !== '')
                vm.bovino.pesoAlNacer = vm.bovino.pesoAlNacer.toString().replace(',', '.');
            vm.bovino.fechaNacimiento = convertirFecha(vm.bovino.fechaNacimiento);
            vm.bovino.$save(function (data) {
                toastr.success('Se agrego con éxito el bovino ', 'Éxito');
                vm.habilitar = false;
                vm.btnVolver = "Volver";
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

            //.then(function success(data) {
            //    if (data.existeIdCaravana) {
            //        formRegistrarBovino.idCaravana.$error.existeIdCaravana = true;
            //    } else {
            //        formRegistrarBovino.idCaravana.$error.existeIdCaravana = false;
            //    }
            //});
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
    }
})();