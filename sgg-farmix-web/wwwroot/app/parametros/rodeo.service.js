(function () {
    angular.module('app')
        .factory('rodeoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Rodeo/', {}, {
                save: {
                    method: 'POST'
                }
            });
        });
})();