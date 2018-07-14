(function () {
    angular.module('app')
        .factory('configuracionService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Usuario/', {}, {
                actualizarPerfilUsuario: {
                    method: 'PUT',
                    url: portalService.getUrlServer() + 'api/Usuario/UpdatePerfil',
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("usuario", angular.toJson(data));
                        if (data.imagen) {
                            formData.append("file" + 0, data.imagen);
                        }
                        return formData;
                    },
                    headers: portalService.getContentUndefined()
                },
                getDatosPerfilUsuario: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Usuario/GetDatosPerfil',
                    params: {
                        usuario: '@usuario',
                        campo: '@campo',
                        idRol: '@idRol',
                        periodo: '@periodo'
                    },
                    headers: portalService.getHeadersServer(),
                    isArray: false
                }
            });
        });
})();