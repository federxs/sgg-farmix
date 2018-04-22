(function () {
    angular.module('app')
        .factory('categoriaService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Categoria/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                }
            });
        });
})();