(function () {
    angular.module('app')
        .factory('registrarBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Bovino/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/inicializar/:idAmbitoEstado',
                    //headers: portal.getHeadersServer(),                
                    params: {
                        idAmbitoEstado: '@idAmbitoEstado'
                    },
                    isArray: false
                },
                save: {
                    method: 'POST'
                },
                obtenerListaBovinos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/getListaBovinos',
                    isArray:true
                }
            });
        });
})();

//registrarBovinoService.$inject = ['$http', 'portalService', '$resource'];

//function registrarBovinoService($http, portalService, $resource) {
//    var service = {
//        inicializar: inicializar
//    };

//    return service;

//    function inicializar() {
//        return $resource(portalService.getUrlServer() + 'api/Bovino/inicializar', {}, {
//            inicializar: {
//                method: 'GET',
//                //headers: portal.getHeadersServer(),                
//                isArray: true
//            }
//        });
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

//    }
//}
//})();