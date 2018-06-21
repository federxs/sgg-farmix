(function () {
    'use strict';

    angular
        .module('app')
        .factory('detalleInseminacionService', detalleInseminacionService);

    detalleInseminacionService.$inject = ['$http', 'portalService'];

    function detalleInseminacionService($http, portalService) {
        var service = {
            getInseminacion: getInseminacion,
            getHembrasServicio: getHembrasServicio,
            getLactancias: getLactancias
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
        return service;
    }
})();