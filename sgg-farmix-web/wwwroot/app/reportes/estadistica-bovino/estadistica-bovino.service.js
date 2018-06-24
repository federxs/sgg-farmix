(function () {
    angular.module('app')
        .factory('estadisticaBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Estadisticas/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Estadistica/Bovino',
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