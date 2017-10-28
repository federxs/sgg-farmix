(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', '$timeout', 'toastr', 'loginService'];

    function loginController($scope, $timeout, toastr, loginService) {
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
                loginService.consultar({ usuario: vm.usuario, pass: vm.contrasenia, idRol: 1 })
                    .then(function success(data) {

                    },
                    function error(error) {
                     toastr.error("Los datos son inválidos. Por favor revíselos e intente nuevamente.")
                    });
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

        function isUndefinedOrNull(val) {
            return angular.isUndefined(val) || val === null
        }
    }
})();
