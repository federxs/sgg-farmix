(function () {
    'use strict';

    angular
        .module('app')
        .factory('modificarUsuariosService', modificarUsuariosService);

    modificarUsuariosService.$inject = ['$http', 'portalService'];

    function modificarUsuariosService($http, portalService) {
        var service = {
            getUsuario: getUsuario,
            modificar: modificar
        };

        function getUsuario(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/Get',
                params: {idUsuario: id}
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function modificar(usuario) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Usuario',
                params: { usuario: usuario }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();