(function () {
    'use strict';

    angular
        .module('app')
        .factory('resolverConflictoService', resolverConflictoService);

    resolverConflictoService.$inject = ['$http', 'portalService'];

    function resolverConflictoService($http, portalService) {
        var service = {
            getDatos: getDatos
        };

        function getDatos(idEve, idEveC, idIns, idInsC) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inconsistencia/Get',
                params: {
                    idEvento: idEve,
                    idEventoConflictivo: idEveC,
                    idInseminacion: idIns,
                    idInseminacionConflictiva: idInsC
                },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function initModificacion(id, usuario, codigoCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/initEvento',
                params: {
                    idEvento: id,
                    usuario: usuario,
                    idCampo: codigoCampo
                },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function modificar(evento, lista) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Evento',
                params: { value: evento, lista: lista },
                headers: portalService.getHeadersServer()
            })
        }

        function getRodeos(campo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Rodeo/GetList',
                params: {
                    campo: campo
                },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();