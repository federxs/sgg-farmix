(function () {
    'use strict';

    angular.module('app').service('portalService', function (){//usuarioInfo) {
        var portalService = {};

        portalService.getUrlServer = function () {
            //return "http://localhost:2424/";
            return "http://farmix.somee.com/";
            // return "http://yo.sooft.com.ar/";
        };

        /*portal.getDefaultUsuarioImagen = function () {
            return "../images/portal/default-user.png";
        };

        portal.getDefaultUsuarioRecursos = function () {
            return "recursos.es-AR.json";
        };

        portal.getHeadersServer = function () {
            var headers = { 'Authorization': usuarioInfo.getToken() };
            return headers;
        };
        portal.getContentUndefined = function () {
            var headers = { 'Authorization': usuarioInfo.getToken(), 'Content-Type': undefined };
            return headers;
        };*/

        return portalService;
    });
})();