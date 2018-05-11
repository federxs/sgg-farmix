(function () {
    angular.module('app')
        .factory('vacunaService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Vacuna/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    url: portalService.getUrlServer() + 'api/Vacuna/GetList',
                    params: {
                        idCampo: '@idCampo'
                    },
                    isArray: true
                }
            });
        });
})();