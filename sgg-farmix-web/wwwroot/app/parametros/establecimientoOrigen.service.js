(function () {
    angular.module('app')
        .factory('establecimientoOrigenService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/EstablecimientoOrigen/', {}, {
                save: {
                    method: 'POST'
                }
            });
        });
})();