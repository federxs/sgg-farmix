(function () {
    angular.module('app')
        .factory('registrarCampoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Campo/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/cargarProvinciasAndLoc',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                },
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer(),
                },
                validarCantCamposUsuario: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Campo/validarCantCamposXUsuario',
                    params: {
                        usuario: '@usuario'
                    },
                    headers: portalService.getHeadersServer(),
                    isArray: false
                }
            });
        });
})();