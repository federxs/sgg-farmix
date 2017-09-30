angular.module('starter')
    .service('inseminacionService', function ($http, portalService, $rootScope) {
        var inseminacionUrl = portalService.getUrlServer() + "api/Vacuna/GetList";
        this.registrarInseminacion = function (inseminacion) {

            $http({
                method: 'POST',
                url: inseminacionUrl,
                params: { inseminacion: inseminacion, idVacas: $rootScope.idVacas, idToros: [] }
            });
        };
    });