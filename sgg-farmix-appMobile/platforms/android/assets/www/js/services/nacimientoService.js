angular.module('starter')
    .service('nacimientoServiceHTTP', function ($http, portalService) {
        var nacimientoUrl = portalService.getUrlServer() + "api/Bovino/registrarNacimientos";

        this.registrarNacimiento = function (listaBovinosMadres, fechaNacimiento, idToro, idCampo) {
            $http({
                method: 'POST',
                url: nacimientoUrl,
                params: { fechaNacimiento: fechaNacimiento, listaMadres: listaBovinosMadres.toString(), toro: idToro, codigoCampo: idCampo },
                headers: portalService.getHeadersServer()
            });
        }
    })

     .service('nacimientoServiceDB', function ($q, $rootScope) {
         this.registrarNacimiento = function (listaBovinosMadres, fechaNacimiento, idToro) {
             listaBovinosMadres.forEach(function (id) {
                 $rootScope.db.executeSql("INSERT OR IGNORE INTO Nacimiento(fechaNacimiento, idBovinoMadre, idBovinoPadre) VALUES(?)", [fechaNacimiento, id, idToro]);
             })
         };

         this.getNacimientosParaActualizarBackend = function () {
             return $q(function (resolve, reject) {
                 $rootScope.db.executeSql("SELECT * FROM Nacimiento", [],
                   function (resultado) {
                       resolve(rows(resultado));
                   },
                   reject);
             });
         };

         this.limpiarNacimientos = function () {
             $rootScope.db.executeSql("DELETE FROM Nacimiento");
         };
     })



    .service('nacimientoService', function (nacimientoServiceHTTP, nacimientoServiceDB, $rootScope, $localStorage) {
        this.registrarNacimiento = function (listaBovinosMadres, fechaNacimiento, idToro, idCampo) {
            if ($rootScope.online) {
                nacimientoServiceHTTP.registrarNacimiento(listaBovinosMadres, fechaNacimiento, idToro, idCampo);
            } else {
                $localStorage.actualizar = false;
                nacimientoServiceDB.registrarNacimiento(listaBovinosMadres, fechaNacimiento, idToro);
            }
        }

        this.actualizarNacimientosBackend = function () {
            var nacimientos;
            return nacimientoServiceDB.getNacimientosParaActualizarBackend()
                .then(function (respuesta) { nacimientos = respuesta; })
                .then(function () {
                    if (nacimientos.length > 0) {
                        nacimientos.forEach(function (nacimiento) {
                            listaBovinosMadres.push(nacimiento.idBovinoMadre);
                        })
                        nacimientoServiceHTTP.registrarNacimiento(listaBovinosMadres, fechaNacimiento, idToro, idCampo);
                    }
                    nacimientoServiceDB.limpiarNacimientos();
                });
        }
    });