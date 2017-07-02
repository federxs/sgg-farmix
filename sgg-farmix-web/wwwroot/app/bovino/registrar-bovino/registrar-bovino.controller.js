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
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.bovino = {};
        vm.fechaDeHoy = new Date();
        vm.showMjeSuccess = false;
        vm.showMjeError = false;
        vm.mjeExiste = '';
        //vm.mostrarModalResultado = false;
        //vm.mensajeModalResultado;

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
            vm.bovino.fechaNacimiento = convertirFecha(vm.bovino.fechaNacimiento);
            vm.bovino.$save(function (data) {
                toastr.success('Se agrego con éxito el bovino ' + data.idBovino, 'Exito');
                $state.go('home.consultarBovino');
            }, function (error) {
                if (error.statusText === 'Bovino ya existe')
                    toastr.error('Ya existe un bovino con ese número de caravana', 'Error');
            });
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
        }

        function validar() {

        }
    }
})();