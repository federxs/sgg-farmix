﻿(function () {
    'use strict';

    angular
        .module('app')
        .factory('modificarInseminacionService', modificarInseminacionService);

    modificarInseminacionService.$inject = ['$http', 'portalService'];

    function modificarInseminacionService($http, portalService) {
        var service = {
            getInseminacion: getInseminacion,
            getHembrasServicio: getHembrasServicio,
            getLactancias: getLactancias,
            modificar: modificar,
            update: update,
            getTorosCampo: getTorosCampo
        };

        function getInseminacion(fecha, tipoInseminacion) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Get',
                params: { fechaInseminacion: fecha, tipoInseminacion: tipoInseminacion },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function getHembrasServicio() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/HembrasServicio',
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function getLactancias() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Lactancias',
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function modificar(inseminacion, lista, listaT , fechaInsemOriginal) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Inseminacion',
                params: { value: inseminacion, listaVacas: lista, listaToros: listaT, fechaAnterior: fechaInsemOriginal },
                headers: portalService.getHeadersServer()
            })
        }

        function update(inseminacion, tacto) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Inseminacion/Update',
                params: { value: inseminacion, tacto: tacto },
                headers: portalService.getHeadersServer()
            })
        }

        function getTorosCampo(codigoCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Campo/GetToros',
                params: { codigoCampo: codigoCampo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();