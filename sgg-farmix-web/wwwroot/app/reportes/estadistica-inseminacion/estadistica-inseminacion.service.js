(function () {
    angular.module('app')
        .factory('estadisticaInseminacionService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Estadisticas/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Estadistica/Inseminacion',
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