(function () {
    angular.module('app')
        .factory('consultarReportesService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Inconsistencia', {}, {
                obtenerReportes: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Inconsistencia/GetList',
                    headers: portalService.getHeadersServer(),
                    isArray: true
                }
            });
        });
})();