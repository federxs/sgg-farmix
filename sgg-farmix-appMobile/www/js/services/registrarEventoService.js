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
    })

    .service('registrarEventoService', function (registrarEventoServiceHTTP, registrarEventoServiceDB, conexion) {
        this.registrarEvento = function (evento) {
            if (conexion.online()) {
                registrarEventoServiceHTTP.registrarEvento(evento);
            } else {
                registrarEventoServiceDB.registrarEvento(evento);
            }
        }
    });