angular.module('starter')
    .service('registrarEventoService', function ($http, portalService, $rootScope, $state) {
        var eventoUrl = portalService.getUrlServer() + "api/Evento/Insert";
        this.registrarEvento = function (evento) {
            $http({
                method: 'POST',
                url: eventoUrl,
                params: { evento: evento, lista: $rootScope.idVacas }
            });
        };
    });