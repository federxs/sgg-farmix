(function () {
    angular.module('app')
        .factory('reporteInseminacionService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Inseminacion/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/Inseminacion',
                    headers: portalService.getHeadersServer(),
                    params: {
                        idAmbitoEstado: '@idAmbitoEstado',
                        idCampo: '@idCampo'
                    },
                    isArray: false
                }
            });
        });
})();