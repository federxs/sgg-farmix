(function () {
    angular.module('app')
        .factory('rodeoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Rodeo/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    url: portalService.getUrlServer() + 'api/Rodeo/GetList',
                    params: {
                        campo: '@campo'
                    },
                    isArray: true
                }
            });
        });
})();