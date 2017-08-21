angular.module('starter')
    .service('bovinoService', function ($http, portalService) {
        var bovinoUrl = portalService.getUrlServer() + "api/Bovino/initModificacion?idBovino=";
        this.getDatosBovino = function (id) {
            return $http.get(bovinoUrl + id).then(function(respuesta) {
                return respuesta.data.bovino;
            })
        };
    });