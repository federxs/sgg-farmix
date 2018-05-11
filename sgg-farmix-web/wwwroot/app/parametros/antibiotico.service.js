(function () {
    angular.module('app')
        .factory('antibioticoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Antibiotico/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    url: portalService.getUrlServer() + 'api/Antibiotico/GetList',
                    params: {
                        idCampo: '@idCampo'
                    },
                    isArray: true
                }
            });
        });
})();