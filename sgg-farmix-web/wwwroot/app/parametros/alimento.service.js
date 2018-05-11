(function () {
    angular.module('app')
        .factory('alimentoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Alimento/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    url: portalService.getUrlServer() + 'api/Alimento/GetList',
                    params: {
                        idCampo: '@idCampo'
                    },
                    isArray: true
                }
            });
        });
})();