(function () {
    'use strict';

    angular
        .module('app')
        .controller('seleccionCampoController', seleccionCampoController);

    seleccionCampoController.$inject = ['$scope', 'toastr', 'seleccionCampoService', '$localStorage', '$state', '$sessionStorage', 'registrarCampoService', 'portalService'];

    function seleccionCampoController($scope, toastr, seleccionCampoService, $localStorage, $state, $sessionStorage, registrarCampoService, portalService) {
        var vm = $scope;
        vm.usuario = {};
        window.scrollTo(0, 0);

        vm.inicializar = inicializar();
        vm.seleccionarCampo = seleccionarCampo;
        vm.validarCantCampos = validarCantCampos;
        vm.cerrarSesion = cerrarSesion;
        $localStorage.usuarioInfo = {};
        vm.idRol = $sessionStorage.usuarioInfo.idRol;
        //var imagenes = ['../../images/campo1.jpg', '../../images/campo2.jpg', '../../images/campo3.jpg', '../../images/campo4.jpg', '../../images/campo5.jpg'];

        function inicializar() {
            seleccionCampoService.consultar($sessionStorage.usuarioInfo.usuario, $sessionStorage.usuarioInfo.idRol)
                   .then(function success(data) {
                       $scope.campos = data;
                       for (var i = 0; i < $scope.campos.length; i++) {
                           //if (!$scope.campos[i].imagen)
                           //$scope.campos[i].imagen = imagenes[i];
                           //else
                           $scope.campos[i].imagen = portalService.getUrlServer() + portalService.getFolderImagenCampo() + $scope.campos[i].codigoCampo + '\\' + $scope.campos[i].imagen + "?cache=" + (new Date()).getTime();
                       }
                   }, function error(error) {
                       toastr.error("Se ha producido un error, reintentar.");
                   });
        };

        function seleccionarCampo(codigo) {
            $localStorage.usuarioInfo.codigoCampo = codigo;
            $state.go('home.inicio');
        };

        function validarCantCampos() {
            registrarCampoService.validarCantCamposUsuario({ usuario: $sessionStorage.usuarioInfo.usuario }, function success(data) {
                if (data.resultado)
                    $state.go('registrarCampo');
                else
                    toastr.info("No puede agregar mas campos, verifique su plan contratado.", "Aviso");
            }, function error(error) {
                toastr.error("Se ha producido un error, reintentar.");
            });
        };

        function cerrarSesion() {
            $localStorage.usuarioInfo = undefined;
            $sessionStorage.usuarioInfo = undefined;
            $('#modalConfirmCerrarSesion').modal('hide');
            $state.go('login');
        };
    }
})();
