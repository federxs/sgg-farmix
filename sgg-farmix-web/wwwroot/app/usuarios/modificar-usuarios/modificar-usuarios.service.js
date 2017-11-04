(function () {
    'use strict';

    angular
        .module('app')
        .factory('modificarUsuariosService', modificarUsuariosService);

    modificarUsuariosService.$inject = ['$http', 'portalService'];

    function modificarUsuariosService($http, portalService) {
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