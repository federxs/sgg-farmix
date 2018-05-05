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
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("campo", angular.toJson(data));
                        if (data.imagen) {
                            formData.append("file" + 0, data.imagen);
                        }
                        return formData;
                    },
                    headers: portalService.getContentUndefined()
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