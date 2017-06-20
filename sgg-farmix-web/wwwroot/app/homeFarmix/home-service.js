(function () {
    angular.module('app').factory('homeService', function ($resource, portal) {
        return $resource(portal.getUrlServer() + 'api/Home/', {}, {
            getListMenu: {
                method: 'GET',
                //headers: portal.getHeadersServer(),                
                isArray: true
            }
        });
    });
})();