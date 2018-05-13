(function () {
    angular.module('app')
        .factory('razaService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Raza/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo'
                    },
                    isArray: true
                }
            });
        });
})();