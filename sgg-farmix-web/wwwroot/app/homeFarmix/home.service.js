(function () {
    angular.module('app').factory('homeService', function ($resource, portalService) {
        return $resource(portalService.getUrlServer() + 'api/Home/', {}, {
            getListMenu: {
                method: 'GET',
                //headers: portal.getHeadersServer(),                
                isArray: true
            }
        });
    });
})();