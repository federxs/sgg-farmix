(function () {
    'use strict';

    angular
        .module('app')
        .factory('modificarEventoService', modificarEventoService);

    modificarEventoService.$inject = ['$http', 'portalService'];

    function modificarEventoService($http, portalService) {
        var service = {
            getEventoForModificar: getEventoForModificar,
            initModificacion: initModificacion,
            modificar: modificar,
            getRodeos: getRodeos
        };

        function getEventoForModificar(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/GetEventoForModificacion',
                params: { idEvento: id }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function initModificacion(id, usuario) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/initEvento',
                params: {
                    idEvento: id,
                    usuario: usuario
                }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function modificar(evento, lista) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Evento',
                params: { value: evento, lista: lista }
            })
        }

        function getRodeos(campo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Rodeo/GetList',
                params: {
                    campo: campo
                }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();