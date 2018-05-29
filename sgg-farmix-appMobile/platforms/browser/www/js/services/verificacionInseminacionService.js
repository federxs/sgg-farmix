angular.module('starter')
    .service('verificacionInseminacionServiceHTTP', function ($http, portalService, $rootScope) {
        var verificacionInseminacionUrl = portalService.getUrlServer() + "api/Tacto/Insert";

        this.registrarVerificacionInseminacion = function (inseminacion, fechaTacto) {
            $http({
                method: 'POST',
                url: verificacionInseminacionUrl,
                params: { tacto: inseminacion, fechaTacto: fechaTacto },
                headers: portalService.getHeadersServer()
            });
        };
    })

    .service('verificacionInseminacionServiceDB', function ($q, $rootScope) {
        this.registrarVerificacionInseminacion = function (inseminacion, fechaTacto) {
            $rootScope.db.transaction(function (tx) {
                var exitoso = 0;
                if (inseminacion.exitoso) {
                    tx.executeSql("DELETE FROM InseminacionPendiente WHERE idInseminacion = ?", [inseminacion.idInseminacion]);
                    exitoso = 1;
                }
                tx.executeSql("INSERT OR IGNORE INTO Tacto(idInseminacion, fechaTacto, exitoso, idTipoTacto) VALUES (?, ?, ?, ?)", [inseminacion.idInseminacion, fechaTacto, exitoso, inseminacion.idTipoTacto]);
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

    .service('verificacionInseminacionService', function (conexion, verificacionInseminacionServiceHTTP, verificacionInseminacionServiceDB) {
        this.registrarVerificacionInseminacion = function (inseminacion, fechaTacto) {
            if (conexion.online()) {
                verificacionInseminacionServiceHTTP.registrarVerificacionInseminacion(inseminacion, fechaTacto);
            } else {
                verificacionInseminacionServiceDB.registrarVerificacionInseminacion(inseminacion, fechaTacto);
            }
        };

        this.actualizarVerificacionesBackend = function () {
            if (conexion.online()) {
                var verificaciones;
                return verificacionInseminacionServiceDB.getVerificacionesParaActualizarBackend()
                    .then(function (respuesta) { verificaciones = respuesta; })
                    .then(function () {
                        verificaciones.forEach(function (verificacion) {
                            var fechaTacto = verificacion.fechaTacto;
                            verificacion = { idTipoTacto: verificacion.idTipoTacto, exitoso: verificacion.exitoso, idInseminacion: verificacion.idInseminacion };
                            registrarVerificacionInseminacion(verificacion, fechaTacto);
                        }).then(function () {
                            verificacionInseminacionServiceDB.limpiarVerificaciones();
                        })
                    });
            }
        }
    });