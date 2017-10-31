(function () {
    'use strict';

    angular
        .module('app')
        .factory('consultarUsuariosService', consultarUsuariosService);

    consultarUsuariosService.$inject = ['$http', 'portalService'];

    function consultarUsuariosService($http, portalService) {
        var service = {
            inicializar: inicializar
        };

        function inicializar(idBovino) {
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