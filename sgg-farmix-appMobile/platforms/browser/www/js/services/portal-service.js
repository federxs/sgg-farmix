(function () {
    'use strict';

    angular.module('starter').service('portalService', function () {//usuarioInfo) {
        var portalService = {};

        portalService.getUrlServer = function () {
            return "http://181.164.11.174:2424/"
            //return "http://localhost:2424/";
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

        return portalService;
    });
})();