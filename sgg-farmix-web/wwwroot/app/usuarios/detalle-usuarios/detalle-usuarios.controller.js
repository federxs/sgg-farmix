(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleUsuariosController', detalleUsuariosController);

    detalleUsuariosController.$inject = ['$scope', 'detalleUsuariosService', '$stateParams', 'toastr'];

    function detalleUsuariosController($scope, detalleUsuariosService, $stateParams, toastr) {
        var vm = $scope;
        //variables
        vm.showSpinner = true;
        //metodos
        vm.inicializar = inicializar;
        inicializar();

        function inicializar() {
            detalleUsuariosService.getUsuario($stateParams.id).then(function success(data) {
                vm.usuario = data;
            }, function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
            vm.showSpinner = false;
        }
    }
})();
