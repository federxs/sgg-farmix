angular.module('starter')
    .service('nacimientoServiceHTTP', function ($http, portalService) {
        var nacimientoUrl = portalService.getUrlServer() + "api/Inseminacion/";

        this.registrarNacimiento = function (idBovinoMadre, fechaNacimiento) {
            
            $http({
                method: 'POST',
                url: nacimientoUrl + "Insert",
                params: { idBovino: idBovinoMadre, fechaNacimiento: fechaNacimiento },
                headers: portalService.getHeadersServer()
            });
        }
    })

     .service('nacimientoServiceDB', function ($q) {


         function rows(resultado) {
             var items = [];
             for (var i = 0; i < resultado.rows.length; i++) {
                 items.push(resultado.rows.item(i));
             }
             return items;
         };
     })


    .service('nacimientoService', function (inseminacionServiceHTTP, inseminacionServiceDB, conexion) {
        this.registrarInseminacion = function (inseminacion) {
            if (conexion.online()) {
                inseminacionServiceHTTP.registrarInseminacion(inseminacion);
            } else {
                inseminacionServiceDB.registrarInseminacion(inseminacion);
            }
        }
    });