(function () {
    angular.module('app')
        .factory('estadoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Estado/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                }
            });
        });
})();