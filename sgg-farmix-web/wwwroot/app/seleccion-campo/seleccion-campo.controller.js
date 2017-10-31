(function () {
    'use strict';

    angular
        .module('app')
        .controller('seleccionCampoController', seleccionCampoController);

    seleccionCampoController.$inject = ['$scope', 'toastr', 'seleccionCampoService', '$localStorage', '$state'];

    function seleccionCampoController($scope, toastr, seleccionCampoService, $localStorage, $state) {
        var vm = $scope;
        vm.usuario = {};
        vm.showSpinner = false;

        vm.inicializar = inicializar();
        vm.seleccionarCampo = seleccionarCampo;
        var imagenes = ['../../images/campo1.jpg', '../../images/campo2.jpg', '../../images/campo3.jpg', '../../images/campo4.jpg', '../../images/campo5.jpg'];

        function inicializar() {
            seleccionCampoService.consultar($localStorage.usuarioInfo.usuario)
                   .then(function success(data) {
                       $scope.campos = data;
                       for (var i = 0; i < $scope.campos.length; i++) {
                           $scope.campos[i].imagen = imagenes[i];
                       }
                   }, function error(error) {
                       toastr.error("Se ha producido un error, reintentar.");
                   });
        }

        function seleccionarCampo(codigo) {
            $localStorage.usuarioInfo.codigoCampo = codigo;
            $state.go('home.inicio');
        }
    }
})();
