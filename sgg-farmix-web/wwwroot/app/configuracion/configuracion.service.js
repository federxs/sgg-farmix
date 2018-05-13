(function () {
    'use strict';

    angular
        .module('app')
        .factory('configuracionService', configuracionService);

    configuracionService.$inject = ['$http', 'portalService'];

    function configuracionService($http, portalService) {
        var service = {
            inicializar: inicializar
        };

        function inicializar(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Dashboard/Get',
                params: { id: id },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }        

        return service;
    }

})();