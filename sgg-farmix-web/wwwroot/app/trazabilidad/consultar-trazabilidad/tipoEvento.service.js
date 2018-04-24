(function () {
    'use strict';

    angular
        .module('app')
        .factory('tipoEventoService', tipoEventoService);

    tipoEventoService.$inject = ['$http', 'portalService'];

    function tipoEventoService($http, portalService) {
        var service = {
            inicializar: inicializar,
            insert: insert
        };

        function inicializar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/TipoEvento/GetList',
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        function insert(evento, lista) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Evento/Insert',
                params:{
                    evento: evento,
                    lista: lista
            }
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();