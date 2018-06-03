angular.module('starter')
    .service('nacimientoServiceHTTP', function ($http, portalService) {
        var nacimientoUrl = portalService.getUrlServer() + "api/Inseminacion/";

        this.registrarNacimiento = function (listaBovinosMadres, fechaNacimiento) {

            $http({
                method: 'POST',
                url: nacimientoUrl + "Insert",
                params: { listaMadres: listaBovinosMadres.toString(), fechaNacimiento: fechaNacimiento },
                headers: portalService.getHeadersServer()
            });
        }
    })

     .service('nacimientoServiceDB', function ($q, $rootScope) {
         this.registrarNacimiento = function (listaBovinosMadres, fechaNacimiento) {
             $rootScope.db.transaction(function (tx) {
                 tx.executeSql("INSERT OR IGNORE INTO Nacimiento(fechaNacimiento) VALUES(?)", [fechaNacimiento]);
                 var idNacimiento = tx.executeSql("SELECT last_insert_rowid() FROM Nacimiento", [],
                         function (resultado) {
                             resolve(resultado.rows.item(0));
                         }, reject);
                 listaBovinosMadres.forEach(function (id) {
                     tx.executeSql("INSERT OR IGNORE INTO BovinosXNacimiento(idNacimiento, idBovino) VALUES(?, ?)", [idNacimiento, id]);
                 })
             });
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

         this.getBovinosXNacimientoParaActualizarBackend = function (idNacimiento) {
             return $q(function (resolve, reject) {
                 $rootScope.db.executeSql("SELECT * FROM BovinosXNacimiento WHERE idNacimiento=?", [idNacimiento],
                   function (resultado) {
                       resolve(rows(resultado));
                   },
                   reject);
             });
         };

         this.limpiarNacimientos = function () {
             $rootScope.db.executeSql("DELETE FROM BovinosXNacimiento");
             $rootScope.db.executeSql("DELETE FROM Nacimiento");
         };
     })



    .service('nacimientoService', function (nacimientoServiceHTTP, nacimientoServiceDB, $rootScope, $localStorage) {
        this.registrarNacimiento = function (listaBovinosMadres, fechaNacimiento) {
            if ($rootScope.online) {
                nacimientoServiceHTTP.registrarNacimiento(listaBovinosMadres, fechaNacimiento);
            } else {
                $localStorage.actualizar = true;
                nacimientoServiceDB.registrarNacimiento(listaBovinosMadres, fechaNacimiento);
            }
        }

        this.actualizarNacimientosBackend = function () {
            var nacimientos;
            return nacimientoServiceDB.getNacimientosParaActualizarBackend()
                .then(function (respuesta) { nacimientos = respuesta; })
                .then(function () {
                    if (nacimientos.lenght > 0) {
                        nacimientos.forEach(function (nacimiento) {
                            var bovinos = nacimientoServiceDB.getBovinosXNacimientoParaActualizarBackend(nacimiento.idNacimiento);
                            bovinos.forEach(function (bovino) {
                                listaBovinosMadres.push = [bovino.idBovino];
                            })
                            nacimientoServiceHTTP.registrarNacimiento(listaBovinosMadres, nacimiento.fechaNacimiento);
                        }).then(function () {
                            nacimientoServiceDB.limpiarNacimientos();
                        })
                    }
                });
        }
    });