(function () {
    'use strict';

    angular
        .module('app')
        .factory('inicioService', inicioService);

    inicioService.$inject = ['$http', 'portalService'];

    function inicioService($http, portalService) {
        var service = {
            inicializar: inicializar,
            prueba: prueba
        };

        function inicializar(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Dashboard/Get',
                params: {id: id}
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function prueba(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/getListaTags',
                params: { idCampo: id }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
    
})();