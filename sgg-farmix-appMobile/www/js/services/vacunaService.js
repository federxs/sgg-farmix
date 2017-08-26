angular.module('starter')
    .service('vacunaService', function ($http, portalService) {
        var vacunaUrl = portalService.getUrlServer() + "api/Vacuna/GetList";
        this.getDatosVacuna = function () {
            return $http.get(vacunaUrl).then(function (respuesta) {
                return respuesta.data;
            });            
        };
    });