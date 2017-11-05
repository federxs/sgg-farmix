(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarUsuariosController', registrarUsuariosController);

    registrarUsuariosController.$inject = ['$scope', 'registrarUsuariosService', '$localStorage', 'toastr'];

    function registrarUsuariosController($scope, registrarUsuariosService, $localStorage, toastr) {
        var vm = $scope;
        //variables
        vm.showSpinner = true;
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;


        //metodos
        vm.inicializar = inicializar;
        vm.registrar = registrar;
        vm.validarContrasenias = validarContrasenias;
        inicializar();

        function inicializar() {
            vm.roles = [];
            vm.roles.push({ idRol: 2, nombre: 'Ingeniero' });
            vm.roles.push({ idRol: 3, nombre: 'Peón' });
        }

        function registrar() {
            vm.usuario.idPlan = 1;
            vm.habilitar = false;
            registrarUsuariosService.registrar(vm.usuario, $localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                toastr.success('Se agrego con éxito el usuario ', 'Éxito');
                vm.btnVolver = "Volver";
                vm.showSpinner = false;
            }, function error(error) {
                vm.showSpinner = false;
                if (error.data === 'Error: El usuario ya existe para este campo') {
                    vm.habilitar = true;
                    toastr.warning('El usuario ya existe para este campo', 'Advertencia')
                }                    
                else
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function validarContrasenias() {
            if (vm.usuario.pass === vm.contraseniaRepetida.contraseniaRepetida) {
                vm.formRegistrarUsuario.contraseniaRepetida.$setValidity("min", true);
            }
            else {
                vm.formRegistrarUsuario.contraseniaRepetida.$setValidity("min", false);
            }
        }
    }
})();
