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
                    if (respuesta.data.bovino != null) {
                        for (var i = 0; i < respuesta.data.categorias.length; i++) {
                            if (respuesta.data.categorias[i].idCategoria == respuesta.data.bovino.idCategoria) {
                                respuesta.data.bovino.idCategoria = respuesta.data.categorias[i].nombre;
                                break;
                            }
                        }
                        for (var i = 0; i < respuesta.data.razas.length; i++) {
                            if (respuesta.data.razas[i].idRaza == respuesta.data.bovino.idRaza) {
                                respuesta.data.bovino.idRaza = respuesta.data.razas[i].nombre;
                                break;
                            }
                        }
                        for (var i = 0; i < respuesta.data.estados.length; i++) {
                            if (respuesta.data.estados[i].idEstado == respuesta.data.bovino.idEstado) {
                                respuesta.data.bovino.idEstado = respuesta.data.estados[i].nombre;
                                break;
                            }
                        }
                    }
                    return respuesta.data.bovino;
                })
            } else {
                return null;
            }
        };
    });