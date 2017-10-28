(function () {
    'use strict';

    angular
        .module('app')
        .factory('inicioService', inicioService);

    inicioService.$inject = ['$http', 'portalService'];

    function inicioService($http, portalService) {
        var service = {
            inicializar: inicializar,
            getData: getData
        };

        function inicializar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Dashboard/Get'
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function getData(usuario) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/Validar',
                params: { usuario: usuario }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
    
})();