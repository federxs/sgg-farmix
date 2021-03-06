﻿(function () {
    'use strict';

    angular
        .module('app')
        .factory('consultarUsuariosService', consultarUsuariosService);

    consultarUsuariosService.$inject = ['$http', 'portalService'];

    function consultarUsuariosService($http, portalService) {
        var service = {
            inicializar: inicializar,
            obtenerListaUsuarios: obtenerListaUsuarios,
            darBajaUser: darBajaUser,
            activarUser: activarUser,
            validarCantidadUsuariosPlan: validarCantidadUsuariosPlan,
            generarPDF: generarPDF,
            generarExcel: generarExcel
        };

        function inicializar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/Init',
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function obtenerListaUsuarios(filtro) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/GetList',
                params: { filter: filtro },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function darBajaUser(idUsuario, codigoCampo) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Usuario/DarBaja',
                params: { idUsuario: idUsuario, codigoCampo: codigoCampo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function activarUser(idUsuario, codigoCampo) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Usuario/Activar',
                params: { idUsuario: idUsuario, codigoCampo: codigoCampo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function validarCantidadUsuariosPlan(campo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/ValidarCantUsuarios',
                params: { campo: campo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function generarPDF(filtro) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/ExportarUsuariosPDF',
                params: { filtro: filtro },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function generarExcel(filtro) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/ExportarUsuariosExcel',
                params: { filtro: filtro },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();