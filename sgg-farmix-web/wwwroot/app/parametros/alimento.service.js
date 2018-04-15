(function () {
    angular.module('app')
        .factory('alimentoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Alimento/', {}, {
                save: {
                    method: 'POST'
                }
            });
        });
})();