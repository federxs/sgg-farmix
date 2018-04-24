(function () {
    'use strict';

    angular
        .module('app')
        .factory('detalleUsuariosService', detalleUsuariosService);

    detalleUsuariosService.$inject = ['$http', 'portalService'];

    function detalleUsuariosService($http, portalService) {
        var service = {
            getUsuario: getUsuario
        };

        function getUsuario(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/GetDetalle',
                params: { idUsuario: id },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();