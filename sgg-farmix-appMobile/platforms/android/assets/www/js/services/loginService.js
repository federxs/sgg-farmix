angular.module('starter')
    .service('loginService', function ($http, portalService) {
        var loginUrl = portalService.getUrlServer() + "api/Usuario/Validar";
        this.validarLogin = function (usuario) {
            return $http({
                method: 'POST',
                url: loginUrl,
                params: { usuario: usuario }
            }).then(function (respuesta) {
                alert(respuesta);
                return respuesta.data;
            });
        };
    });