angular.module('starter')
    .service('verificacionInseminacionServiceHTTP', function ($http, portalService, $rootScope) {
        var verificacionInseminacionUrl = portalService.getUrlServer() + "api/Tacto/Insert";

        this.registrarVerificacionInseminacion = function (inseminacion) {
            $http({
                method: 'POST',
                url: verificacionInseminacionUrl,
                params: { tacto: inseminacion },
                headers: portalService.getHeadersServer()
            });
        };
    })

    .service('verificacionInseminacionServiceDB', function ($q, $rootScope) {
        this.registrarVerificacionInseminacion = function (inseminacion) {
            console.log(inseminacion);
            $rootScope.db.transaction(function (tx) {
                var exitoso = 0;
                if (inseminacion.exitoso) {
                    exitoso = 1;
                }
                tx.executeSql("DELETE FROM InseminacionPendiente WHERE idInseminacion = ?", [inseminacion.idInseminacion]);
                console.log("delete");
                tx.executeSql("INSERT OR IGNORE INTO Tacto(idInseminacion, fechaTacto, exitoso, idTipoTacto) VALUES (?, ?, ?, ?)", [inseminacion.idInseminacion, inseminacion.fechaTacto, exitoso, inseminacion.idTipoTacto]);
                console.log("insert");
            })
        };

        this.getVerificacionesParaActualizarBackend = function () {
            return $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT * FROM Tacto", [],
                  function (resultado) {
                      resolve(rows(resultado));
                  },
                  reject);
            });
        };

        this.limpiarVerificaciones = function () {
            $rootScope.db.executeSql("DELETE FROM Tacto");
        };

        function rows(resultado) {
            var items = [];
            for (var i = 0; i < resultado.rows.length; i++) {
                items.push(resultado.rows.item(i));
            }
            return items;
        };
    })

    .service('verificacionInseminacionService', function ($rootScope, verificacionInseminacionServiceHTTP, verificacionInseminacionServiceDB, $localStorage) {
        this.registrarVerificacionInseminacion = function (inseminacion) {
            if ($rootScope.online) {
                verificacionInseminacionServiceHTTP.registrarVerificacionInseminacion(inseminacion);
            } else {
                console.log("no hay conexion para el tacto");
                $localStorage.actualizar = true;
                verificacionInseminacionServiceDB.registrarVerificacionInseminacion(inseminacion);
            }
        };

        this.actualizarVerificacionesBackend = function () {
            var verificaciones;
            return verificacionInseminacionServiceDB.getVerificacionesParaActualizarBackend()
                .then(function (respuesta) { verificaciones = respuesta; })
                .then(function () {
                    console.log(verificaciones);
                    if (verificaciones.length > 0) {
                        verificaciones.forEach(function (verificacion) {
                            var fechaTacto = verificacion.fechaTacto;
                            verificacion = { idTipoTacto: verificacion.idTipoTacto, exitoso: verificacion.exitoso, idInseminacion: verificacion.idInseminacion, fechaTacto: fechaTacto };
                            verificacionInseminacionServiceHTTP.registrarVerificacionInseminacion(verificacion);
                        });
                        verificacionInseminacionServiceDB.limpiarVerificaciones();
                    }
                });
        }
    });