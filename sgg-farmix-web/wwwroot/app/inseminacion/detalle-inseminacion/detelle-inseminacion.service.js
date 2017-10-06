(function () {
    'use strict';

    angular
        .module('app')
        .factory('detalleInseminacionService', detalleInseminacionService);

    detalleInseminacionService.$inject = ['$http', 'portalService'];

    function detalleInseminacionService($http, portalService) {
        var service = {
            getInseminacion: getInseminacion
        };

        function getInseminacion(fecha) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Get',
                params: { fechaInseminacion: fecha }
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();