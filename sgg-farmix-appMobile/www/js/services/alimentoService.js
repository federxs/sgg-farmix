angular.module('starter')
    .service('alimentoService', function ($http, portalService) {
        var alimentoUrl = portalService.getUrlServer() + "api/Alimento/GetList?idCampo=";
        this.getDatosAlimento = function (idCampo) {
            return $http.get(alimentoUrl + idCampo).then(function (respuesta) {
                return respuesta.data;
            });            
        };
    });