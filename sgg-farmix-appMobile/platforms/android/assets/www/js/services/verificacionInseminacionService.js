angular.module('starter')
    .service('verificacionInseminacionService', function ($http, portalService, $rootScope) {
        var verificacionInseminacionUrl = portalService.getUrlServer() + "api/Tacto/Insert";

        this.registrarVerificacionInseminacion = function (inseminacion) {
            $http({
                method: 'POST',
                url: verificacionInseminacionUrl,
                params: { tacto: inseminacion }
            });
        };
    });