(function () {
    angular.module('app')
        .factory('estadisticaBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Estadisticas/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Estadisticas/Bovinos',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo'
                    },
                    isArray: true
                }
            });
        });
})();