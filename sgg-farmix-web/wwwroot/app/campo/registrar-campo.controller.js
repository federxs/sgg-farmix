(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarCampoController', registrarCampoController);

    registrarCampoController.$inject = ['$scope', 'registrarCampoService', '$localStorage', 'toastr', '$sessionStorage', '$state'];

    function registrarCampoController($scope, registrarCampoService, $localStorage, toastr, $sessionStorage, $state) {
        var vm = $scope;
        //variables
        vm.showSpinner = true;
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.campo = {};
        var localidadesOriginales = [];
        //metodos
        vm.inicializar = inicializar();
        vm.registrar = registrar;
        vm.getLocalidades = getLocalidades;

        function inicializar() {
            vm.campo = new registrarCampoService();
            vm.showSpinner = false;
            registrarCampoService.inicializar({}, function (data) {
                vm.provincias = data.provincias;
                localidadesOriginales = data.localidades;
            }, function error(error) {
                vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function registrar() {
            vm.habilitar = false;
            vm.showSpinner = true;
            vm.campo.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.campo.$save(function success(data) {
                toastr.success('Se agrego con éxito el campo', 'Éxito');
                vm.showSpinner = false;
                $state.go('seleccionCampo');
            }, function error(error) {
                vm.showSpinner = false;
                vm.habilitar = true;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function getLocalidades() {
            vm.localidades = Enumerable.From(localidadesOriginales).Where(function (x) {
                return x.idProvincia === parseInt(vm.campo.idProvincia);
            }).ToArray();
        };
    }
})();
