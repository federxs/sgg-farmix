angular.module('starter')
    .service('rodeoService', function ($http, portalService) {
        var rodeoUrl = portalService.getUrlServer() + "api/Rodeo/GetList";
        this.getDatosRodeo = function () {
            return $http.get(rodeoUrl).then(function (respuesta) {
                return respuesta.data;
            });            
        };
    });