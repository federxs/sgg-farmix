angular.module('starter')
    .service('rodeoServiceHTTP', function ($http, portalService) {
        var rodeoUrl = portalService.getUrlServer() + "api/Rodeo/GetList?campo=";
        this.getDatosRodeo = function (idCampo) {
            return $http.get(rodeoUrl + idCampo, { headers: portalService.getHeadersServer() }).then(function (respuesta) {
                return respuesta.data;
            });
        };
    })

    .service('rodeoServiceDB', function ($q, $rootScope) {
        this.getDatosRodeo = function () {
            return $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT * FROM Rodeo", [],
                  function (resultado) {
                      resolve(rows(resultado));
                  },
                  reject);
            });
        };

        this.actualizarRodeos = function (rodeos) {
            var sqlStatments = [];
            var confinado;
            rodeos.forEach(function (rodeo) {
                if (rodeo.confinado) {
                    confinado = 1;
                } else {
                    confinado = 0;
                }
                sqlStatments.push(["INSERT OR IGNORE INTO Rodeo(idRodeo, nombre, confinado) VALUES(?, ?, ?)", [rodeo.idAlimento, rodeo.nombre, confinado]]);
            });

            return $q(function (resolve, reject) {
                $rootScope.db.sqlBatch(sqlStatments, resolve, reject);
            });
        }

        function rows(resultado) {
            var items = [];
            for (var i = 0; i < resultado.rows.length; i++) {
                items.push(resultado.rows.item(i));
            }
            return items;
        };
    })

    .service('rodeoService', function (rodeoServiceHTTP, rodeoServiceDB, conexion) {
        this.getDatosRodeo = function (idCampo) {
            if (conexion.online()) {
                var rodeos;
                return rodeoServiceHTTP.getDatosRodeo(idCampo)
                    .then(function (respuesta) { rodeos = respuesta; })
                    .then(function () { rodeoServiceDB.actualizarRodeos(rodeos); })
                    .then(function () { return rodeos; });
            } else {
                return rodeoServiceDB.getDatosRodeo();
            }
        }
    });