angular.module('starter')
    .service('vacunaService', function ($http, portalService) {
        var vacunaUrl = portalService.getUrlServer() + "api/Vacuna/GetList?idCampo=";
        this.getDatosVacuna = function (idCampo) {
            return $http.get(vacunaUrl + idCampo).then(function (respuesta) {
                return respuesta.data;
            });            
        };
    });