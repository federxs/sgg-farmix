angular.module('starter')
    .service('inseminacionServiceHTTP', function ($http, portalService, $rootScope) {
        var inseminacionUrl = portalService.getUrlServer() + "api/Inseminacion/";

        this.registrarInseminacion = function (inseminacion) {
			listaToros = '';
			if($rootScope.idToros != undefined){
				listaToros = $rootScope.idToros.toString();
			}
            $http({
                method: 'POST',
                url: inseminacionUrl + "Insert",
                params: { inseminacion: inseminacion, listaVacas: $rootScope.idVacas.toString(), listaToros: listaToros }
            });
        };

        this.getInseminacionesPendientes = function (idCampo) {
            return $http.get(inseminacionUrl + "ServicioSinConfirmar?idCampo=" + idCampo, { headers: portalService.getHeadersServer() }).then(function (respuesta) {
                return respuesta.data;
            })
        };

        this.actualizarInseminacionesBackend = function (inseminacion) {
			
            //
        };
    })
     .service('inseminacionServiceDB', function ($q, $rootScope) {
         this.registrarInseminacion = function (inseminacion) {
             var sqlStatments = [];
             $rootScope.idVacas.forEach(function (vaca) {
                 //Ver que id pasarle para la inseminacion
                 sqlStatments.push(["INSERT OR IGNORE INTO Inseminacion(idInseminacion, idVaca, fechaInseminacion, fechaEstimadaNacimiento, tipoInseminacion, paraActualizar) VALUES(?, ?, ?, ?, ?, 1)", [vaca.idVaca, vaca.idVaca, inseminacion.fechaInseminacion, inseminacion.fechaEstimadaNacimiento, inseminacion.tipoInseminacion]]);
                 $rootScope.idToros.forEach(function (id) {
                     sqlStatments.push(["INSERT OR IGNORE INTO TorosXInseminacion(idInseminacion, idToro) VALUES(?, ?)", [vaca.idVaca, id]]);
                 });
             });

             return $q(function (resolve, reject) {
                 $rootScope.db.sqlBatch(sqlStatments, resolve, reject);
             });
         }

         this.getInseminacionesPendientes = function () {
             return $q(function (resolve, reject) {
                 $rootScope.db.executeSql("SELECT i.idInseminacion, i.idVaca, ti.descripcion, i.fechaInseminacion FROM Inseminacion i JOIN TipoInseminacion ti ON i.tipoInseminacion=ti.idTipo", [],
                   function (resultado) {
                       resolve(rows(resultado));
                   },
                   reject);
             });
         };

         this.actualizarInseminaciones = function (inseminaciones) {
             var sqlStatments = [];
             var tipoInseminacion;
             inseminaciones.forEach(function (inseminacion) {
                 if (inseminacion.tipoInseminacion = "Montura") {
                     tipoInseminacion = 2;
                 } else {
                     tipoInseminacion = 1;
                 }
                 sqlStatments.push(["INSERT OR IGNORE INTO Inseminacion(idInseminacion, idVaca, fechaInseminacion, fechaEstimadaNacimiento, tipoInseminacion) VALUES(?, ?, ?, ?, ?)", [inseminacion.idInseminacion, inseminacion.idVaca, inseminacion.fechaInseminacion, inseminacion.fechaEstimadaNacimiento, tipoInseminacion]]);
             });

             return $q(function (resolve, reject) {
                 $rootScope.db.sqlBatch(sqlStatments, resolve, reject);
             });
         }

         this.getInseminacionesParaActualizarBackend = function () {
             //Pasar esto y pasar los Toros por rootScope pero dsp borrarlos
             return $q(function (resolve, reject) {
                 $rootScope.db.executeSql("SELECT * FROM Inseminacion WHERE paraActualizar=1", [],
                   function (resultado) {
                       resolve(rows(resultado));
                   },
                   reject);
             });
         }; 

         function rows(resultado) {
             var items = [];
             for (var i = 0; i < resultado.rows.length; i++) {
                 items.push(resultado.rows.item(i));
             }
             return items;
         };
     })

    .service('inseminacionService', function (inseminacionServiceHTTP, inseminacionServiceDB, conexion) {
        this.getInseminacionesPendientes = function (idCampo) {
            if (conexion.online()) {
                var inseminaciones;
                return inseminacionServiceHTTP.getInseminacionesPendientes(idCampo)
                    .then(function (respuesta) { inseminaciones = respuesta; })
                    .then(function () { inseminacionServiceDB.actualizarInseminaciones(inseminaciones); })
                    .then(function () { return inseminaciones; });
            } else {
                return inseminacionServiceDB.getInseminacionesPendientes();
            }
        }

        this.registrarInseminacion = function (inseminacion) {
            if (conexion.online()) {
                inseminacionServiceHTTP.registrarInseminacion(inseminacion);
            } else {
                inseminacionServiceDB.registrarInseminacion(inseminacion);
            }
        }

        this.actualizarInseminacionesBackend = function (inseminacion) {
            if (conexion.online()) {
                var inseminaciones;
                return inseminacionServiceDB.getInseminacionesParaActualizarBackend()
                    .then(function (respuesta) { inseminaciones = respuesta; })
                    .then(function () { inseminacionServiceHTTP.actualizarInseminacionesBackend(inseminaciones); });
            }
        }
    });