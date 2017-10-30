(function () {
    'use strict';

    angular
        .module('app')
        .factory('seleccionCampoService', seleccionCampoService);

    seleccionCampoService.$inject = ['$http', 'portalService'];

    function seleccionCampoService($http, portalService) {
        var service = {
            consultar: consultar
        };

        function consultar(credenciales) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Usuario/Validar',
                params: { usuario: credenciales }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();