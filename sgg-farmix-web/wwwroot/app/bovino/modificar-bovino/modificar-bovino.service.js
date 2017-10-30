(function () {
    'use strict';

    angular
        .module('app')
        .factory('modificarBovinoService', modificarBovinoService);

    modificarBovinoService.$inject = ['$http', 'portalService'];

    function modificarBovinoService($http, portalService) {
        var service = {
            inicializar: inicializar,
            modificar: modificar,
            existeIdCaravana: existeIdCaravana
        };

        function inicializar(idBovino, idCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/initModificacion',
                params: { idBovino: idBovino, idCampo: idCampo }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function modificar(bovino) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Bovino',
                params: { value: bovino }
            })
        }

        function existeIdCaravana(idCaravana) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/existeIdCaravana',
                params: {
                    idCaravana: idCaravana
                },
                isArray: false
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();