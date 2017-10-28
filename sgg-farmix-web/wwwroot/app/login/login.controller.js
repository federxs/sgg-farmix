(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', '$timeout', 'toastr'];

    function loginController($scope, $timeout,toastr) {
        var vm = $scope;

        vm.inicializar = inicializar;
        vm.aceptar = aceptar;

        inicializar();

        function inicializar() {
            var obj = document.getElementById('btn_login');
            obj.click();

        }

        function aceptar() {
            if (validar() === true) {
                console.log("la puta madre anduvo");
            }
        }

        function validar() {
            if (isUndefinedOrNull(vm.usuario)) {
                toastr.info("El usuario se encuentra vacío");
                return false;
            }
            if (isUndefinedOrNull(vm.contrasenia)) {
                toastr.info("La contraseña se encuentra vacía");
                return false;
            }
            return true;
        }

        function isUndefinedOrNull(val){
            return angular.isUndefined(val) || val === null 
        }
    }
})();
