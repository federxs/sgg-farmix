(function () {
    'use strict';

    angular.module('app').service('portal', function (){//usuarioInfo) {
        var portal = {};

        portal.getUrlServer = function () {
            return "http://localhost:2424/";
            // return "http://190.104.236.39/websiteyo/";
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

        return portal;
    });
})();