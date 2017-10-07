angular.module('starter')
    .service('inseminacionService', function ($http, portalService, $rootScope) {
        var inseminacionUrl = portalService.getUrlServer() + "api/Inseminacion/Insert";
        this.registrarInseminacion = function (inseminacion) {
            $http({
                method: 'POST',
                url: inseminacionUrl,
                params: { inseminacion: inseminacion, listaVacas: $rootScope.idVacas.toString(), listaToros: "" }
            });
        };
    });