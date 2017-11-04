(function () {
    'use strict';

    angular
        .module('app')
        .factory('registrarUsuariosService', registrarUsuariosService);

    registrarUsuariosService.$inject = ['$http', 'portalService'];

    function registrarUsuariosService($http, portalService) {
        var service = {
            inicializar: inicializar
        };

        function inicializar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/Init'
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();