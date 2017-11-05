(function () {
    'use strict';

    angular.module('app').service('portalService', function (){//usuarioInfo) {
        var portalService = {};

        portalService.getUrlServer = function () {
            return "http://localhost:2424/";
            //return "http://farmix.somee.com/";
            //return "http://ec2-54-232-203-99.sa-east-1.compute.amazonaws.com:2424/";
            //return "http://54.232.203.99:2424/";
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