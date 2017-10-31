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

        function consultar(usuario) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Campo/GetList',
                params: { usuario: usuario }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();