angular.module('starter')
    .service('bovinoService', function ($http, portalService) {
        var bovinoUrl = portalService.getUrlServer() + "api/Bovino/initModificacion?idBovino=";
        this.getDatosBovino = function (id) {
            if (id != "") {
                for (var i = 0; i < id.length; i++) {
                    if (id.charAt(i) != '0' && id.charAt(i) != '1' && id.charAt(i) != '2' && id.charAt(i) != '3' && id.charAt(i) != '4' && id.charAt(i) != '5' && id.charAt(i) != '6' && id.charAt(i) != '7' && id.charAt(i) != '8' && id.charAt(i) != '9') {
                        return null
                    }
                }
                return $http.get(bovinoUrl + id).then(function (respuesta) {
                    return respuesta.data.bovino;
                })
            } else {
                return null;
            }
        };
    });