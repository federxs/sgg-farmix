(function () {
    'use strict';

    angular
        .module('app')
        .factory('loginService', loginService);

    loginService.$inject = ['$http', 'portalService'];

    function loginService($http, portalService) {
        var service = {
            inicializar: inicializar
        };

        function consultar(credenciales) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Login/consultar',
                params: { credenciales: credenciales }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();