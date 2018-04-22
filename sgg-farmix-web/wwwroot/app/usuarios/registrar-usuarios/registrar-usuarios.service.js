(function () {
    'use strict';

    angular
        .module('app')
        .factory('registrarUsuariosService', registrarUsuariosService);

    registrarUsuariosService.$inject = ['$http', 'portalService'];

    function registrarUsuariosService($http, portalService) {
        var service = {
            inicializar: inicializar,
            registrar: registrar
        };

        function inicializar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/Init'
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function registrar(usuario, codigoCampo) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Usuario/Post',
                params: { usuario: usuario, codigoCampo: codigoCampo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();