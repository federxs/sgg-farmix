(function () {
    angular.module('app')
        .factory('consultarBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/BovinoConsultar/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/inicializar/:idAmbitoEstado',
                    params: {
                        idAmbitoEstado: '@idAmbitoEstado'
                    },
                    isArray: false
                },
                obtenerListaBovinos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/BovinoConsultar/getListaBovinos',
                    isArray: true
                }
            });
        });
})();