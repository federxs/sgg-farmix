(function () {
    'use strict';

    angular
        .module('app')
        .factory('login', login);

    login.$inject = ['$http'];

    function login($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData(usuario) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/Validar',
                params: {usuario: usuario}
            }).then(
            function (data) {
                return data.data || [];
            });
        }
    }
})();