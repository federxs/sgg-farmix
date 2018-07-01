(function () {
    angular.module('app')
        .factory('estadisticaEventoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Estadisticas/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Estadistica/Evento',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: false
                }
            });
        });
})();