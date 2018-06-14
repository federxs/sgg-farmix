(function () {
    angular.module('app')
        .factory('consultarBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/BovinoConsultar/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/inicializar/:idAmbitoEstado/:idCampo',
                    headers: portalService.getHeadersServer(),
                    params: {
                        idAmbitoEstado: '@idAmbitoEstado',
                        idCampo: '@idCampo'
                    },
                    isArray: false
                },
                obtenerListaBovinos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/BovinoConsultar/getListaBovinos',
                    headers: portalService.getHeadersServer(),
                    isArray: true
                },
                validarCantBovinos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/verificarCantBovinosXAdmin',
                    params: {
                        campo: '@campo'
                    },
                    headers: portalService.getHeadersServer(),
                    isArray: false
                }
            });
        });
})();