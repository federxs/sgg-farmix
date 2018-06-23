(function () {
    angular.module('app')
        .factory('estadisticaEventoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Estadisticas/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Estadisticas/Eventos',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo'
                    },
                    isArray: true
                }
            });
        });
})();