angular.module('starter')
    .service('campoService', function ($http, portalService) {
        var campoUrl = portalService.getUrlServer() + "api/Campo/GetList";
        this.getDatosCampo = function () {
            return $http.get(campoUrl).then(function (respuesta) {
                return respuesta.data;
            });            
        };
    });