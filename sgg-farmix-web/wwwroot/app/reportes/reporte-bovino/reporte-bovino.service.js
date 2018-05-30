(function () {
    angular.module('app')
        .factory('reporteBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/BovinoConsultar/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/Bovinos/:idAmbitoEstado/:idCampo',
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