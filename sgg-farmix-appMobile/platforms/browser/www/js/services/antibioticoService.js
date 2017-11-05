angular.module('starter')
    .service('antibioticoService', function ($http, portalService) {
        var antibioticoUrl = portalService.getUrlServer() + "api/Antibiotico/GetList?idCampo=";
        this.getDatosAntibiotico = function (idCampo) {
            return $http.get(antibioticoUrl + idCampo).then(function (respuesta) {
                return respuesta.data;
            });            
        };
    });