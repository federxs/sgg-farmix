(function () {
    'use strict';

    angular
        .module('app')
        .factory('tipoEventoService', tipoEventoService);

    tipoEventoService.$inject = ['$http', 'portalService'];

    function tipoEventoService($http, portalService) {
        var service = {
            inicializar: inicializar
        };

        function inicializar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/TipoEvento/GetList'
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();