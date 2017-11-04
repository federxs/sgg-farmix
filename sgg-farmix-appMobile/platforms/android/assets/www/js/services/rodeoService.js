angular.module('starter')
    .service('rodeoService', function ($http, portalService) {
        var rodeoUrl = portalService.getUrlServer() + "api/Rodeo/GetList?campo=";
        this.getDatosRodeo = function (idCampo) {
            return $http.get(rodeoUrl + idCampo).then(function (respuesta) {
                return respuesta.data;
            });            
        };
    });