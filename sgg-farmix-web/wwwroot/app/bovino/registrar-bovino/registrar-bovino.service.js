(function () {
    angular.module('app')
        .factory('registrarBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Bovino/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/inicializar/:idAmbitoEstado',              
                    params: {
                        idAmbitoEstado: '@idAmbitoEstado'
                    },
                    isArray: false
                },
                save: {
                    method: 'POST'
                },
                obtenerListaBovinos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/getListaBovinos',
                    isArray:true
                }
            });
        });
})();