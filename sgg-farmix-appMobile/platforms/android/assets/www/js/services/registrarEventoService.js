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
            $rootScope.db.executeSql("INSERT OR IGNORE INTO Evento(fechaHora, cantidad, idTipoEvento, idVacuna, idAntibiotico, idAlimento, idRodeoDestino) VALUES(?, ?, ?, ?, ?, ?, ?)", [evento.fechaHora, evento.cantidad, evento.idTipoEvento, evento.idVacuna, evento.idAntibiotico, evento.idAlimento, evento.idRodeoDestino]);
            $rootScope.idVacas.forEach(function (vaca) {
                $rootScope.db.executeSql("INSERT OR IGNORE INTO EventosXBovino(idEvento, idBovino) VALUES((SELECT last_insert_rowid() FROM EVENTO), ?)", [vaca]);
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
                $rootScope.db.executeSql("SELECT * FROM EventosXBovino WHERE idEvento = ?", [idEvento],
                  function (resultado) {
                      resolve(rows(resultado));
                  },
                  reject);
            });
        };

        this.limpiarEventos = function () {
            $rootScope.db.executeSql("DELETE FROM EventosXBovino");
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

    .service('registrarEventoService', function (registrarEventoServiceHTTP, registrarEventoServiceDB, $rootScope, $localStorage) {
        this.registrarEvento = function (evento) {
            if ($rootScope.online) {
                registrarEventoServiceHTTP.registrarEvento(evento);
            } else {
                $localStorage.actualizar = true;
                registrarEventoServiceDB.registrarEvento(evento);
            }
        }

        this.actualizarEventosBackend = function () {
            var eventos;
            return registrarEventoServiceDB.getEventosParaActualizarBackend()
                .then(function (respuesta) { eventos = respuesta; })
                .then(function () {
                    if (eventos.length > 0) {
                        eventos.forEach(function (evento) {
                            console.log($rootScope.idVacas);
                            $rootScope.idVacas = [];
                            registrarEventoServiceDB.getListaBovinosParaActualizarBackend(evento.idEvento).then(function (respuesta) {
                                vacas = respuesta;
                                vacas.forEach(function (vaca) {
                                    $rootScope.idVacas.push(vaca.idBovino);
                                })
                                if (evento.idTipoEvento == 1) {
                                    evento = { idTipoEvento: evento.idTipoEvento, idVacuna: evento.idVacuna, cantidad: evento.cantidad, fechaHora: evento.fechaHora };
                                }
                                else if (evento.idTipoEvento == 2) {
                                    evento = { idTipoEvento: evento.idTipoEvento, idAntibiotico: evento.idAntibiotico, cantidad: evento.cantidad, fechaHora: evento.fechaHora };
                                }
                                else if (evento.idTipoEvento == 4) {
                                    evento = { idTipoEvento: evento.idTipoEvento, idAlimento: evento.idAlimento, cantidad: evento.cantidad, fechaHora: evento.fechaHora };
                                }
                                else if (evento.idTipoEvento == 3) {
                                    evento = { idTipoEvento: evento.idTipoEvento, idRodeoDestino: evento.idRodeoDestino, fechaHora: evento.fechaHora };
                                }
                                registrarEventoServiceHTTP.registrarEvento(evento);
                                $rootScope.idVacas = [];
                            })
                        })
                        registrarEventoServiceDB.limpiarEventos();
                    }
                });
        }
    });