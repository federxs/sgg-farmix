(function () {
    'use strict';

    angular
        .module('app')
        .factory('detalleBovinoService', detalleBovinoService);

    detalleBovinoService.$inject = ['$http', 'portalService'];

    function detalleBovinoService($http) {
        var service = {
            inicializar: inicializar,
        };

        function inicializar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/initDetalle',
                params: { idBovino: idBovino }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();