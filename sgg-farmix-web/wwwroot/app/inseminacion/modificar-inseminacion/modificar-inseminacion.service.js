(function () {
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
            update: update
        };

        function getInseminacion(fecha) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Get',
                params: { fechaInseminacion: fecha },
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

        function update(inseminacion) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Inseminacion/Update',
                params: { value: inseminacion },
                headers: portalService.getHeadersServer()
            })
        }
        return service;
    }
})();