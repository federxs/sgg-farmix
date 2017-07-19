angular.module('starter')
    .service('bovinoService', function ($http, portalService) {
        var bovinoUrl = portalService.getUrlServer() + "api/Bovino/initModificacion";
        this.getDatosBovino = function (id) {
            var bovino = null;
            return $http({
                method: 'GET',
                url: bovinoUrl,
                params: { idBovino: id }
            }).then(function (respuesta) {
                return respuesta;
            })
        };
    });