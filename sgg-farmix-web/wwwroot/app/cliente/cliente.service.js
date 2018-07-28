
(function () {
    'use strict';

    angular
        .module('app')
        .factory('clienteService', clienteService);

    clienteService.$inject = ['$http', 'portalService'];

    function clienteService($http, portalService) {
        var service = {
            inicializar: inicializar,
            getClientes: getClientes
        };
        function getClientes() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/GetClientes',
                headers: portalService.getHeadersServer(),
                isArray: false
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        function inicializar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/GetPlanes',
                headers: portalService.getHeadersServer(),
                isArray: false
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();
