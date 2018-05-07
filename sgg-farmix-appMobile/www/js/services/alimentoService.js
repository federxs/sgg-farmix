angular.module('starter')
    .service('alimentoServiceHTTP', function ($http, portalService) {
        var alimentoUrl = portalService.getUrlServer() + "api/Alimento/GetList?idCampo=";
        this.getDatosAlimento = function (idCampo) {
            return $http.get(alimentoUrl + idCampo, { headers: portalService.getHeadersServer()}).then(function (respuesta) {
                return respuesta.data;
            });
        };
    })

    .service('alimentoServiceDB', function ($q, $rootScope) {
        this.getDatosAlimento = function () {
            return $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT idAlimento, nombre FROM Alimento", [],
                  function (resultado) {
                      resolve(rows(resultado));
                  },
                  reject);
            });
        };

        this.actualizarAlimentos = function (alimentos) {
            var sqlStatments = [];
            alimentos.forEach(function (alimento) {
                sqlStatments.push(["INSERT OR IGNORE INTO Alimento(idAlimento, nombre) VALUES(?, ?)", [alimento.idAlimento, alimento.nombre]]);
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

    .service('alimentoService', function (alimentoServiceHTTP, alimentoServiceDB, conexion) {
        this.getDatosAlimento = function (idCampo) {
            if (conexion.online()) {
                var alimentos;
                return alimentoServiceHTTP.getDatosAlimento(idCampo)
                    .then(function (respuesta) { alimentos = respuesta; })
                    .then(function () { alimentoServiceDB.actualizarAlimentos(alimentos); })
                    .then(function () { return alimentos; });
            } else {
                return alimentoServiceDB.getDatosAlimento();
            }
        }
    });