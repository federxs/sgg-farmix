(function () {
    angular.module('app')
        .factory('consultarBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/conflictos', {}, {
                obtenerConflictos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/conflictos',
                    headers: portalService.getHeadersServer(),
                    isArray: true
                }
            });
        });
})();