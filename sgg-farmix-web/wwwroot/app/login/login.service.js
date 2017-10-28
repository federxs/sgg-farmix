(function () {
    'use strict';

    angular
        .module('app')
        .factory('loginService', loginService);

    loginService.$inject = ['$http', 'portalService'];

    function loginService($http, portalService) {
        var service = {
            consultar: consultar
        };

        function consultar(credenciales) {
            return $http({
                method: 'GET',
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