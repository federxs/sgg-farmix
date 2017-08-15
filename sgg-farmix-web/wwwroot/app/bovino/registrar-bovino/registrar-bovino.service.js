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
                }
				,
				existeIdCaravana: {
					method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/existeIdCaravana/:idCaravana',              
                    params: {
                        idCaravana: '@idCaravana'
                    },
                    isArray: false
				}
            });
        });
})();