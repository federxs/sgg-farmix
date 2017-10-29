(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', 'toastr', 'loginService', '$localStorage', '$state'];

    function loginController($scope, toastr, loginService, $localStorage, $state) {
        var vm = $scope;
        vm.usuario = {};
        vm.ocultarUsuario = true;

        vm.inicializar = inicializar();
        vm.aceptar = aceptar;        

        function inicializar() {
            var obj = document.getElementById('btn_login');
            obj.click();
            if ($localStorage.usuarioInfo !== undefined) {
                vm.usuario.usuario = $localStorage.usuarioInfo.usuario;
                vm.ocultarUsuario = false;
            }                
        }

        function aceptar() {
            if (validar()) {
                $scope.usuario.idRol = 1;
                loginService.consultar($scope.usuario)
                    .then(function success(data) {
                        if (data.resultado === 1) {
                            if ($localStorage.usuarioInfo === undefined) {
                                $localStorage.usuarioInfo = {};
                                $localStorage.usuarioInfo.usuario = vm.usuario.usuario;
                                $localStorage.usuarioInfo.idRol = vm.usuario.idRol;
                            }
                            $('#login-modal').modal('hide');
                            $state.go('home');
                        }
                        else
                            toastr.error("Los datos son inválidos. Por favor revíselos e intente nuevamente.")
                    },
                    function error(error) {
                     toastr.error("Los datos son inválidos. Por favor revíselos e intente nuevamente.")
                    });
            }
        }

        function validar() {
            if (isUndefinedOrNull(vm.usuario.usuario)) {
                toastr.info("El usuario se encuentra vacío");
                return false;
            }
            if (isUndefinedOrNull(vm.usuario.pass)) {
                toastr.info("La contraseña se encuentra vacía");
                return false;
            }
            return true;
        }

        function isUndefinedOrNull(val) {
            return angular.isUndefined(val) || val === null || val == undefined
        }
    }
})();
