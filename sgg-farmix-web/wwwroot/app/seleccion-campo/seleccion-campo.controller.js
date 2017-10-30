(function () {
    'use strict';

    angular
        .module('app')
        .controller('seleccionCampoController', seleccionCampoController);

    seleccionCampoController.$inject = ['$scope', 'toastr', 'loginService', '$localStorage', '$state'];

    function seleccionCampoController($scope, toastr, loginService, $localStorage, $state) {
        var vm = $scope;
        vm.usuario = {};
        vm.ocultarUsuario = true;
        vm.showSpinner = false;

        vm.inicializar = inicializar();
        vm.aceptar = aceptar;

        function inicializar() {
           
        }

        function aceptar() {
            
        }

        function validar() {
            
        }

        function isUndefinedOrNull(val) {
            return angular.isUndefined(val) || val === null || val == undefined
        }
    }
})();
