(function () {
    'use strict';

    angular.module('starter').service('portalService', function ($localStorage) {//usuarioInfo) {
        var portalService = {};

        portalService.getUrlServer = function () {
            //return "http://181.164.11.174:2424/";
            //return "http://farmix.somee.com/";
            //return "http://54.232.203.99:2424/";
            return "https://ec2-54-232-203-99.sa-east-1.compute.amazonaws.com/";
            //return "http://localhost:2424/";
            // return "http://190.104.236.39/websiteyo/";
            // return "http://yo.sooft.com.ar/";
        };

        /*portal.getDefaultUsuarioImagen = function () {
            return "../images/portal/default-user.png";
        };

        portal.getDefaultUsuarioRecursos = function () {
            return "recursos.es-AR.json";
        };*/

        portalService.getHeadersServer = function () {
            var headers = { 'Authorization': $localStorage.token };
            return headers;
        };
        /*portal.getContentUndefined = function () {
            var headers = { 'Authorization': usuarioInfo.getToken(), 'Content-Type': undefined };
            return headers;
        };*/
        
        return portalService;
    });
})();