(function () {
    'use strict';

    angular
        .module('app')
        .factory('registrarBovinoService', registrarBovinoService);

    registrarBovinoService.$inject = ['$http'];

    function registrarBovinoService($http) {
        var service = {
            inicializar: inicializar
        };

        return service;

        function inicializar() {
            return $http
                .get(portalService.getUrlServer() + 'api/Home/')
                .then(function (data) {
                    return data.data || [];
                });
        //    otra forma
        //    return $http({
        //        method: 'POST',
        //        url: pageContext + '/TipoReclamo1/registrarTipoReclamo',
        //        data: {tipoReclamo: tipoReclamo}
        //    }).then(
        //        function respuesta(data) {
        //            return data.data;
        //        });
        //}
        //    Otra mas
        //    $resource(portalService.getUrlServer() + 'api/Home/', {}, {
        //    getListMenu: {
        //        method: 'GET',
        //        //headers: portal.getHeadersServer(),                
        //        isArray: true
        //    }
        //});
        }
    }
})();