(function () {
    'use strict';

    angular
        .module('app')
        .controller('seleccionCampoController', seleccionCampoController);

    seleccionCampoController.$inject = ['$scope', 'toastr', 'seleccionCampoService', '$localStorage', '$state', 'usuarioInfo', 'registrarCampoService', 'portalService'];

    function seleccionCampoController($scope, toastr, seleccionCampoService, $localStorage, $state, usuarioInfo, registrarCampoService, portalService) {
        var vm = $scope;
        vm.usuario = {};
        window.scrollTo(0, 0);
        $('.modal-backdrop').remove();

        vm.inicializar = inicializar();
        vm.seleccionarCampo = seleccionarCampo;
        vm.validarCantCampos = validarCantCampos;
        vm.cerrarSesion = cerrarSesion;
        $localStorage.usuarioInfo = {};
        vm.idRol = usuarioInfo.getRol();
        //var imagenes = ['../../images/campo1.jpg', '../../images/campo2.jpg', '../../images/campo3.jpg', '../../images/campo4.jpg', '../../images/campo5.jpg'];

        function inicializar() {
            seleccionCampoService.consultar(usuarioInfo.getUsuario(), usuarioInfo.getRol())
                   .then(function success(data) {
                       $scope.campos = data;
                       for (var i = 0; i < $scope.campos.length; i++) {
                           $scope.campos[i].imagenNombre = portalService.getUrlServer() + portalService.getFolderImagenCampo() + $scope.campos[i].codigoCampo + '\\' + $scope.campos[i].imagenNombre + "?cache=" + (new Date()).getTime();
                       }
                   }, function error(error) {
                       if (error.statusText === 'Token_Invalido') {
                           toastr.error('Lo sentimos, su sesión ha caducado', 'Sesión caducada');
                           vm.cerrarSesion();
                       }
                       else if (error.statusText === 'Not Found') {
                           usuarioInfo.set(null);
                           $state.go('login');
                       }
                       else
                           toastr.error('Ha ocurrido un error, reintentar', 'Error');
                   });
        };

        function seleccionarCampo(codigo) {
            $localStorage.usuarioInfo.codigoCampo = codigo;
            $state.go('home.inicio');
        };

        function validarCantCampos() {
            registrarCampoService.validarCantCamposUsuario({ usuario: usuarioInfo.getUsuario() }, function success(data) {
                if (data.resultado)
                    $state.go('registrarCampo');
                else
                    toastr.info("No puede agregar mas campos, verifique su plan contratado.", "Aviso");
            }, function error(error) {
                if (error.statusText === 'Token_Invalido') {
                    toastr.error('Lo sentimos, su sesión ha caducado', 'Sesión caducada');
                    vm.cerrarSesion();
                }
                else
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function cerrarSesion() {
            $localStorage.usuarioInfo = undefined;
            usuarioInfo.set(null);
            $('#modalConfirmCerrarSesion').modal('hide');
            $state.go('login');
        };
    }
})();
