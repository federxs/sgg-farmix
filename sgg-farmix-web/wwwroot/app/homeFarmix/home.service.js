(function () {
    'use strict';

    angular
        .module('app')
        .factory('homeService', homeService);

    homeService.$inject = ['$http', 'portalService'];

    function homeService($http, portalService) {
        var service = {
            datosUsuario: datosUsuario,
            cambiarPass: cambiarPass
        };

        function datosUsuario(usuario, codigoCampo, idRol, periodo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Home/GetDatosUserLogueado',
                params: { usuario: usuario, codigoCampo: codigoCampo, idRol: idRol, periodo: periodo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function cambiarPass(passVieja, passNueva, usuario, rol) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/CambiarPass',
                params: { passVieja: passVieja, passNueva: passNueva, usuario: usuario, rol: rol },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();




/*(function () {
    'use strict';
    angular.module('app')
        .factory('homeService', function ($resource, portalService) {
        return $resource(portalService.getUrlServer() + 'api/Home/', {}, {
            datosUsuario: {
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Home/GetDatosUserLogueado',
                params: { usuario: '@usuario', codigoCampo: '@codigoCampo' },
                headers: portalService.getHeadersServer()
            }
        });
    });
})();*/