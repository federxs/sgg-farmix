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
             var toro = null;
             if (idToro != '') {
                 toro = idToro;
             }
             listaBovinosMadres.forEach(function (id) {
                 $rootScope.db.executeSql("INSERT OR IGNORE INTO Nacimiento(fechaNacimiento, idBovinoMadre, idBovinoPadre) VALUES(?, ?, ?)", [fechaNacimiento, id, toro]);
             })
         };

         this.getNacimientosParaActualizarBackend = function () {
             console.log("bd");
             return $q(function (resolve, reject) {
                 $rootScope.db.executeSql("SELECT * FROM Nacimiento", [],
                   function (resultado) {
                       console.log(resultado);
                       resolve(rows(resultado));
                   },
                   reject);
             });
         };

         this.limpiarNacimientos = function () {
             $rootScope.db.executeSql("DELETE FROM Nacimiento");
         };

         function rows(resultado) {
             var items = [];
             for (var i = 0; i < resultado.rows.length; i++) {
                 items.push(resultado.rows.item(i));
             }
             return items;
         };
     })



    .service('nacimientoService', function (nacimientoServiceHTTP, nacimientoServiceDB, $rootScope, $localStorage) {
        this.registrarNacimiento = function (listaBovinosMadres, fechaNacimiento, idToro, idCampo) {
            if ($rootScope.online) {
                nacimientoServiceHTTP.registrarNacimiento(listaBovinosMadres, fechaNacimiento, idToro, idCampo);
            } else {
                $localStorage.actualizar = true;
                nacimientoServiceDB.registrarNacimiento(listaBovinosMadres, fechaNacimiento, idToro);
            }
        }

        this.actualizarNacimientosBackend = function () {
            var nacimientos;
            console.log("aca tamo")
            return nacimientoServiceDB.getNacimientosParaActualizarBackend()
                .then(function (respuesta) {
                    console.log(respuesta);
                    nacimientos = respuesta;
                })
                .then(function () {
                    console.log(nacimientos);
                    if (nacimientos.length > 0) {
                        var toro;
                        nacimientos.forEach(function (nacimiento) {
                            toro = '';
                            if (nacimiento.idBovinoPadre != null) {
                                toro = nacimiento.idBovinoPadre
                            }
                            nacimientoServiceHTTP.registrarNacimiento(nacimiento.idBovinoMadre, nacimiento.fechaNacimiento, toro, $localStorage.campo);
                        })
                    }
                    nacimientoServiceDB.limpiarNacimientos();
                });
        }
    });