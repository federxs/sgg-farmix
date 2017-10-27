angular.module('starter')
    .service('inseminacionService', function ($http, portalService, $rootScope) {
        var inseminacionUrl = portalService.getUrlServer() + "api/Inseminacion/";

        this.registrarInseminacion = function (inseminacion) {
            $http({
                method: 'POST',
                url: inseminacionUrl + "Insert",
                params: { inseminacion: inseminacion, listaVacas: $rootScope.idVacas.toString(), listaToros: "" }
            });
        };

        this.getInseminacionesPendientes = function () {
            return $http.get(inseminacionUrl + "ServicioSinConfirmar").then(function (respuesta) {
                    return respuesta.data;
                })
        };
    });