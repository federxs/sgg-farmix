(function () {
    'use strict';

    angular
        .module('app')
        .factory('detalleEventoService', detalleEventoService);

    detalleEventoService.$inject = ['$http', 'portalService'];

    function detalleEventoService($http, portalService) {
        var service = {
            getEvento: getEvento
        };

        function getEvento(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/Get',
                params: { idEvento: id },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();