angular.module('starter')
    .service('vacunaServiceHTTP', function ($http, portalService) {
        var vacunaUrl = portalService.getUrlServer() + "api/Vacuna/GetList?idCampo=";
        this.getDatosVacuna = function (idCampo) {
            return $http.get(vacunaUrl + idCampo, { headers: portalService.getHeadersServer() }).then(function (respuesta) {
                return respuesta.data;
            });            
        };
    })

    .service('vacunaServiceDB', function ($q, $rootScope) {
        this.getDatosVacuna = function () {
            return $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT * FROM Vacuna", [],
                  function (resultado) {
                      resolve(rows(resultado));
                  },
                  reject);
            });
        };

        this.actualizarVacunas = function (vacunas) {
            var sqlStatments = [];
            vacunas.forEach(function (vacuna) {
                sqlStatments.push(["INSERT OR IGNORE INTO Vacuna(idVacuna, nombre) VALUES(?, ?)", [vacuna.idVacuna, vacuna.nombre]]);
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

    .service('vacunaService', function (vacunaServiceHTTP, vacunaServiceDB, conexion) {
        this.getDatosVacuna = function (idCampo) {
            if (conexion.online()) {
                var vacunas;
                return vacunaServiceHTTP.getDatosVacuna(idCampo)
                    .then(function (respuesta) { vacunas = respuesta; })
                    .then(function () { vacunaServiceDB.actualizarVacunas(vacunas); })
                    .then(function () { return vacunas; });
            } else {
                return vacunaServiceDB.getDatosVacuna();
            }
        }
    });