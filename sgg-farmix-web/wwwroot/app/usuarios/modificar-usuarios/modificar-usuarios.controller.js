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
        //metodos
        vm.inicializar = inicializar;
        vm.modificar = modificar;
        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.roles = [];
            //vm.roles.push({ idRol: 1, nombre: 'Dueño' });
            vm.roles.push({ idRol: 2, nombre: 'Ingeniero' });
            vm.roles.push({ idRol: 3, nombre: 'Peón' });
            modificarUsuariosService.getUsuario($stateParams.id).then(function success(data){
                vm.usuario = data;
                vm.usuario.idRol = vm.usuario.idRol.toString();
                $scope.$parent.unBlockSpinner();
                //vm.showSpinner = false;
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                vm.habilitar = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })            
        }

        function modificar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            modificarUsuariosService.modificar(vm.usuario).then(function success(data) {
                vm.habilitar = false;
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                toastr.success('Se modificó el usuario con éxito ', 'Éxito');
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })            
        }
    }
})();
