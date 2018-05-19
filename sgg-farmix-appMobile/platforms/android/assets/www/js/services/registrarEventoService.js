angular.module('starter')
    .service('registrarEventoServiceHTTP', function ($http, portalService, $rootScope) {
        var eventoUrl = portalService.getUrlServer() + "api/Evento/Insert";
        this.registrarEvento = function (evento) {

            $http({
                method: 'POST',
                url: eventoUrl,
                params: { evento: evento, lista: $rootScope.idVacas.toString() },
                headers: portalService.getHeadersServer()
            });
        };
    })

    .service('registrarEventoServiceDB', function ($q, $rootScope) {
        this.registrarEvento = function (evento) {
            $rootScope.db.transaction(function (tx) {
                tx.executeSql("INSERT OR IGNORE INTO Evento(fechaHora, cantidad, idTipoEvento, idVacuna, idAntibiotico, idAlimento, idRodeoDestino) VALUES(?, ?, ?, ?, ?, ?, ?)", [evento.fechaHora, evento.cantidad, evento.idTipoEvento, evento.idVacuna, evento.idAntibiotico, evento.idAlimento, evento.idRodeoDestino]);
                var idEvento = tx.executeSql("SELECT last_insert_rowid() FROM Evento", [],
                    function (resultado) {
                        resolve(resultado.rows.item(0));
                    }, reject);
                $rootScope.idVacas.forEach(function (vaca) {
                    tx.executeSql("INSERT OR IGNORE INTO BovinosXEvento(idEvento, idBovino) VALUES(?, ?)", [idEvento, vaca.idBovino]);
                });
            });
        };

        this.getEventosParaActualizarBackend = function () {
            return $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT * FROM Evento", [],
                  function (resultado) {
                      resolve(rows(resultado));
                  },
                  reject);
            });
        };

        this.getListaBovinosParaActualizarBackend = function (idEvento) {
            return $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT * FROM BovinosXEvento WHERE idEvento = ?", [idEvento],
                  function (resultado) {
                      resolve(rows(resultado));
                  },
                  reject);
            });
        };

        this.limpiarEventos = function () {
            $rootScope.db.executeSql("DELETE FROM BovinosXEvento");
            $rootScope.db.executeSql("DELETE FROM Evento");
        };

        function rows(resultado) {
            var items = [];
            for (var i = 0; i < resultado.rows.length; i++) {
                items.push(resultado.rows.item(i));
            }
            return items;
        };
    })

    .service('registrarEventoService', function (registrarEventoServiceHTTP, registrarEventoServiceDB, conexion) {
        this.registrarEvento = function (evento) {
            if (conexion.online()) {
                registrarEventoServiceHTTP.registrarEvento(evento);
            } else {
                registrarEventoServiceDB.registrarEvento(evento);
            }
        }

        this.actualizarEventosBackend = function () {
            if (conexion.online()) {
                var eventos;
                return registrarEventoServiceDB.getEventosParaActualizarBackend()
                    .then(function (respuesta) { eventos = respuesta; })
                    .then(function () {
                        eventos.forEach(function (evento) {
                            $rootScope.idVacas = [];
                            var vacas = registrarEventoServiceDB.getListaBovinosParaActualizarBackend(evento.idEvento);
                            vacas.forEach(function (vaca) {
                                $rootScope.idVacas.push = [vaca.idBovino];
                            })
                            //controlar el tema de los ids, cuando es alimento no tiene vacuna
                            evento = { idTipoEvento: evento.idTipoEvento, idAlimento: evento.idAlimento, idVacuna: evento.idVacuna, idAntibiotico: evento.idAntibiotico, idRodeoDestino: evento.idRodeoDestino, cantidad: evento.cantidad, fechaHora: evento.fechaHora };
                            registrarEventoServiceHTTP.registrarEvento(evento);
                        }).then(function () {
                            registrarEventoServiceDB.limpiarEventos();
                        })
                    });
            }
        }
    });