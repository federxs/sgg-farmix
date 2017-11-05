(function () {
    'use strict';

    angular
        .module('app')
        .factory('consultarUsuariosService', consultarUsuariosService);

    consultarUsuariosService.$inject = ['$http', 'portalService'];

    function consultarUsuariosService($http, portalService) {
        var service = {
            inicializar: inicializar,
            obtenerListaUsuarios: obtenerListaUsuarios,
            darBajaUser: darBajaUser,
            activarUser: activarUser
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

        function obtenerListaUsuarios(filtro) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/GetList',
                params: { filter: filtro }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function darBajaUser(idUsuario) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Usuario/DarBaja',
                params: { idUsuario: idUsuario }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function activarUser(idUsuario) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Usuario/Activar',
                params: { idUsuario: idUsuario }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();