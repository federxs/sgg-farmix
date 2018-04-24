angular.module('starter')
    .service('inseminacionService', function ($http, portalService, $rootScope) {
        var inseminacionUrl = portalService.getUrlServer() + "api/Inseminacion/";

        this.registrarInseminacion = function (inseminacion) {
			listaToros = '';
			if($rootScope.idToros != undefined){
				listaToros = $rootScope.idToros.toString();
			}
            $http({
                method: 'POST',
                url: inseminacionUrl + "Insert",
                params: { inseminacion: inseminacion, listaVacas: $rootScope.idVacas.toString(), listaToros: listaToros }
            });
        };

        this.getInseminacionesPendientes = function (idCampo) {
            return $http.get(inseminacionUrl + "ServicioSinConfirmar?idCampo=" + idCampo).then(function (respuesta) {
                return respuesta.data;
            })
        };
    });