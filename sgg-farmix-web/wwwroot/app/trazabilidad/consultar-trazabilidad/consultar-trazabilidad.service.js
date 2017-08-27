(function () {
    'use strict';

    angular
        .module('app')
        .factory('consultarTrazabilidadService', consultarTrazabilidadService);

    consultarTrazabilidadService.$inject = ['$http', 'portalService'];

    function consultarTrazabilidadService($http, portalService) {
        var service = {
            getListaEventos: getListaEventos
        };

        function getListaEventos(filtro) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/GetListaEventos',
                params: { filtro: filtro }
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();