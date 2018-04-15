(function () {
    angular.module('app')
        .factory('razaService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Raza/', {}, {
                save: {
                    method: 'POST'
                }
            });
        });
})();