angular.module('starter')
    .service('alimentoService', function ($http, portalService) {
        var alimentoUrl = portalService.getUrlServer() + "api/Alimento/GetList";
        this.getDatosAlimento = function () {
            return $http.get(alimentoUrl).then(function (respuesta) {
                return respuesta.data;
            });            
        };
    });