angular.module('starter')
    .service('inseminacionServiceHTTP', function ($http, portalService, $rootScope) {
        var inseminacionUrl = portalService.getUrlServer() + "api/Inseminacion/";

        this.registrarInseminacion = function (inseminacion) {
            listaToros = '';
            if ($rootScope.idToros != undefined) {
                listaToros = $rootScope.idToros.toString();
            }
            $http({
                method: 'POST',
                url: inseminacionUrl + "Insert",
                params: { inseminacion: inseminacion, listaVacas: $rootScope.idVacas.toString(), listaToros: listaToros },
                headers: portalService.getHeadersServer()
            });
        };

        this.getInseminacionesPendientes = function (idCampo) {
            return $http.get(inseminacionUrl + "ServicioSinConfirmar?idCampo=" + idCampo, { headers: portalService.getHeadersServer() }).then(function (respuesta) {
                return respuesta.data;
            })
        };
    })

     .service('inseminacionServiceDB', function ($q, $rootScope) {
         this.registrarInseminacion = function (inseminacion) {
             $rootScope.idVacas.forEach(function (id) {
                 $rootScope.db.executeSql("INSERT OR IGNORE INTO Inseminacion(idVaca, fechaInseminacion, tipoInseminacion) VALUES(?, ?, ?)", [id, inseminacion.fechaInseminacion, inseminacion.tipoInseminacion]);
                 if ($rootScope.idToros != undefined) {
                     $rootScope.idToros.forEach(function (idToro) {
                         $rootScope.db.executeSql("INSERT OR IGNORE INTO TorosXInseminacion(idInseminacion, idToro) VALUES((SELECT last_insert_rowid() FROM Inseminacion), ?)", [idToro]);
                     })
                 };
             })
         }

         this.getInseminacionesPendientes = function () {
             return $q(function (resolve, reject) {
                 $rootScope.db.executeSql("SELECT * FROM InseminacionPendiente", [],
                   function (resultado) {
                       resolve(rows(resultado));
                   },
                   reject);
             });
         };

         this.actualizarInseminacionesPendientes = function (inseminaciones) {
             var sqlStatments = [];
             var tipoInseminacion;
             inseminaciones.forEach(function (inseminacion) {
                 if (inseminacion.tipoInseminacion = "Montura") {
                     tipoInseminacion = 2;
                 } else {
                     tipoInseminacion = 1;
                 }
                 sqlStatments.push(["INSERT OR IGNORE INTO InseminacionPendiente(idInseminacion, fechaInseminacion, tipoInseminacion, idVaca) VALUES(?, ?, ?, ?)", [inseminacion.idInseminacion, inseminacion.fechaInseminacion, inseminacion.tipoInseminacion, inseminacion.idVaca]]);
             });

             return $q(function (resolve, reject) {
                 $rootScope.db.sqlBatch(sqlStatments, resolve, reject);
             });
         }

         this.getInseminacionesParaActualizarBackend = function () {
             return $q(function (resolve, reject) {
                 $rootScope.db.executeSql("SELECT * FROM Inseminacion", [],
                   function (resultado) {
                       resolve(rows(resultado));
                   },
                   reject);
             });
         };

         this.getListaTorosParaActualizarBackend = function (idInseminacion) {
             return $q(function (resolve, reject) {
                 $rootScope.db.executeSql("SELECT * FROM TorosXInseminacion WHERE idInseminacion = ?", [idInseminacion],
                   function (resultado) {
                       resolve(rows(resultado));
                   },
                   reject);
             });
         };

         this.limpiarInseminaciones = function () {
             $rootScope.db.executeSql("DELETE FROM TorosXInseminacion");
             $rootScope.db.executeSql("DELETE FROM Inseminacion");
         };

         function rows(resultado) {
             var items = [];
             for (var i = 0; i < resultado.rows.length; i++) {
                 items.push(resultado.rows.item(i));
             }
             return items;
         };
     })

    .service('inseminacionService', function (inseminacionServiceHTTP, inseminacionServiceDB, $rootScope, $localStorage) {
        this.getInseminacionesPendientes = function (idCampo) {
            if ($rootScope.online) {
                var inseminaciones;
                return inseminacionServiceHTTP.getInseminacionesPendientes(idCampo)
                    .then(function (respuesta) { inseminaciones = respuesta; })
                    .then(function () { inseminacionServiceDB.actualizarInseminacionesPendientes(inseminaciones); })
                    .then(function () { return inseminaciones; });
            } else {
                return inseminacionServiceDB.getInseminacionesPendientes();
            }
        }

        this.registrarInseminacion = function (inseminacion) {
            if ($rootScope.online) {
                inseminacionServiceHTTP.registrarInseminacion(inseminacion);
            } else {
                $localStorage.actualizar = true;
                inseminacionServiceDB.registrarInseminacion(inseminacion);
            }
        }

        this.actualizarInseminacionesBackend = function () {
            var inseminaciones;
            return inseminacionServiceDB.getInseminacionesParaActualizarBackend()
                .then(function (respuesta) { inseminaciones = respuesta; })
                .then(function () {
                    if (inseminaciones.length > 0) {
                        inseminaciones.forEach(function (inseminacion) {
                            $rootScope.idVacas = [];
                            $rootScope.idVacas.push(inseminacion.idVaca);
                            $rootScope.idToros = [];
                            inseminacionServiceDB.getListaTorosParaActualizarBackend(inseminacion.idInseminacion).then(function (toros) {
                                if (toros != undefined) {
                                    toros.forEach(function (toro) {
                                        $rootScope.idToros.push(toro.idToro);
                                    })
                                }
                                inseminacion = { tipoInseminacion: inseminacion.tipoInseminacion, fechaInseminacion: inseminacion.fechaInseminacion };
                                inseminacionServiceHTTP.registrarInseminacion(inseminacion);
                                $rootScope.idVacas = [];
                                $rootScope.idToros = [];
                            })
                        })
                        inseminacionServiceDB.limpiarInseminaciones();
                    }
                });
        }
    });