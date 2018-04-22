(function () {
    angular.module('app')
        .factory('registrarBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Bovino/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/inicializar/:idAmbitoEstado/:idCampo',              
                    params: {
                        idAmbitoEstado: '@idAmbitoEstado',
                        idCampo: '@idCampo'
                    },
                    headers: portalService.getHeadersServer(),
                    isArray: false
                },
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer(),
                },
				existeIdCaravana: {
					method: 'GET',
					url: portalService.getUrlServer() + 'api/Bovino/existeIdCaravana/:idCaravana',
					headers: portalService.getHeadersServer(),
                    params: {
                        idCaravana: '@idCaravana'
                    },
                    isArray: false
				},
				cargarProvinciasyLocalidades: {
				    method: 'GET',
				    url: portalService.getUrlServer() + 'api/Bovino/cargarProvinciasAndLoc',
				    headers: portalService.getHeadersServer(),
				    isArray: false
				}
            });
        });
})();