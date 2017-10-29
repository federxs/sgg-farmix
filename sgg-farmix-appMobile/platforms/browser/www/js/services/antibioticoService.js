angular.module('starter')
    .service('antibioticoService', function ($http, portalService) {
        var antibioticoUrl = portalService.getUrlServer() + "api/Antibiotivo/GetList";
        this.getDatosAntibiotico = function () {
            return $http.get(antibioticoUrl).then(function (respuesta) {
                return respuesta.data;
            });            
        };
    });