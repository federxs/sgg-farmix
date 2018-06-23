(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarUsuariosController', modificarUsuariosController);

    modificarUsuariosController.$inject = ['$scope', '$stateParams', 'modificarUsuariosService', 'toastr'];

    function modificarUsuariosController($scope, $stateParams, modificarUsuariosService, toastr) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.noCoincidenPass = false;
        //metodos
        vm.inicializar = inicializar;
        vm.modificar = modificar;
        vm.validarContasenias = validarContasenias;
        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.roles = [];
            //vm.roles.push({ idRol: 1, nombre: 'Dueño' });
            vm.roles.push({ idRol: 2, nombre: 'Ingeniero' });
            vm.roles.push({ idRol: 3, nombre: 'Peón' });
            modificarUsuariosService.getUsuario($stateParams.id).then(function success(data) {
                vm.usuario = data;
                vm.usuario.idRol = vm.usuario.idRol.toString();
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                vm.habilitar = false;
                $scope.$parent.errorServicio(error.statusText);
            })
        };

        function modificar() {
            $scope.$parent.blockSpinnerSave();
            if (vm.contrasenia && vm.contraseniaRepetida)
                vm.usuario.contrasenia = vm.contrasenia.contrasenia;
            modificarUsuariosService.modificar(vm.usuario).then(function success(data) {
                vm.habilitar = false;
                $scope.$parent.unBlockSpinnerSave();
                toastr.success('Se modificó el usuario con éxito ', 'Éxito');
            }, function error(error) {
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = false;
                $scope.$parent.errorServicio(error.statusText);
            })
        };

        function validarContasenias() {
            if (vm.contrasenia.contrasenia !== vm.contraseniaRepetida.contraseniaRepetida) {
                vm.noCoincidenPass = true;
            }
            else
                vm.noCoincidenPass = false;
        };
    }
})();
