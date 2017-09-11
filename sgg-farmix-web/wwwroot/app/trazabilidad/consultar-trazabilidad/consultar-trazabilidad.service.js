(function () {
    'use strict';

    angular
        .module('app')
        .factory('consultarTrazabilidadService', consultarTrazabilidadService);

    consultarTrazabilidadService.$inject = ['$http', 'portalService'];

    function consultarTrazabilidadService($http, portalService) {
        var service = {
            getListaEventos: getListaEventos,
            eliminarEvento: eliminarEvento
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

        function eliminarEvento(id) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Evento/DeleteEvento',
                params: { idEvento: id }
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();