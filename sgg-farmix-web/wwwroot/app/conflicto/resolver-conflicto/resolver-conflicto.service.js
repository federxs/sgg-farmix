(function () {
    'use strict';

    angular
        .module('app')
        .factory('resolverConflictoService', resolverConflictoService);

    resolverConflictoService.$inject = ['$http', 'portalService'];

    function resolverConflictoService($http, portalService) {
        var service = {
            getDatos: getDatos,
            resolver: resolver
        };

        function getDatos(idTac, fechaTac, idTacC, fechaTacC, idIns, idInsC) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inconsistencia/Get',
                params: {
                    idTacto: idTac,
                    fechaTacto: fechaTac,
                    idTactoConflictivo: idTacC,
                    fechaTactoConflictivo: fechaTacC,
                    idInseminacion: idIns,
                    idInseminacionConflictiva: idInsC
                },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function resolver(resolucion) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Inconsistencia/Post',
                params: { value: resolucion },
                headers: portalService.getHeadersServer()
            })
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