(function () {
    angular.module('app').factory('homeService', function ($resource, portalService) {
        return $resource(portalService.getUrlServer() + 'api/Home/', {}, {
            getListMenu: {
                method: 'GET',
                //headers: portal.getHeadersServer(),                
                isArray: true
            },
            datosUsuario: {
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Home/GetDatosUserLogueado/:usuario/:codigoCampo',
                params: { usuario: '@usuario', codigoCampo: '@codigoCampo' }
            }
        });
    });
})();