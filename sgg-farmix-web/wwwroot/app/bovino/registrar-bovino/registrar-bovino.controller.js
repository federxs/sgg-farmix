(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarBovinoController', registrarBovinoController);

    registrarBovinoController.$inject = ['$scope', 'registrarBovinoService'];

    function registrarBovinoController($scope, registrarBovinoService) {
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
        vm.mostrarModalResultado = false;
        vm.mensajeModalResultado;

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
            });
            //}).success(function () {
            //    vm.mostrarModalResultado = true;
            //    vm.mensajeModalResultado = "¡La operación se realizó exitosamente!";
            //}).catch(function (error) {
            //    vm.mostrarModalResultado = true;
            //    vm.mensajeModalResultado = "Ha ocurrido un error";
            //});
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