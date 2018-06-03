angular.module('starter')
    .service('bovinoServiceHTTP', function ($http, portalService) {
        var bovinoUrl = portalService.getUrlServer() + "api/Bovino/initModificacion?";
        var bovinosUrl = portalService.getUrlServer() + "api/Bovino/getListaTags?idCampo=";
        var escribirUrl = portalService.getUrlServer() + "api/Bovino/escribirTag";
        this.getDatosBovino = function (id, idCampo) {
            if (id != "" || id != undefined) {
                for (var i = 0; i < id.length; i++) {
                    if (id.charAt(i) != '0' && id.charAt(i) != '1' && id.charAt(i) != '2' && id.charAt(i) != '3' && id.charAt(i) != '4' && id.charAt(i) != '5' && id.charAt(i) != '6' && id.charAt(i) != '7' && id.charAt(i) != '8' && id.charAt(i) != '9') {
                        return null
                    }
                }
                return $http.get(bovinoUrl + "idBovino=" + id + "&idCampo=" + idCampo, { headers: portalService.getHeadersServer() }).then(function (respuesta) {
                    if (respuesta.data.bovino != null) {
                        for (var i = 0; i < respuesta.data.categorias.length; i++) {
                            if (respuesta.data.categorias[i].idCategoria == respuesta.data.bovino.idCategoria) {
                                respuesta.data.bovino.idCategoria = respuesta.data.categorias[i].nombre;
                                break;
                            }
                        }
                        for (var i = 0; i < respuesta.data.razas.length; i++) {
                            if (respuesta.data.razas[i].idRaza == respuesta.data.bovino.idRaza) {
                                respuesta.data.bovino.idRaza = respuesta.data.razas[i].nombre;
                                break;
                            }
                        }
                        for (var i = 0; i < respuesta.data.estados.length; i++) {
                            if (respuesta.data.estados[i].idEstado == respuesta.data.bovino.idEstado) {
                                respuesta.data.bovino.idEstado = respuesta.data.estados[i].nombre;
                                break;
                            }
                        }
                    }
                    return respuesta.data.bovino;
                })
            } else {
                return null;
            }
        }

        this.getBovinos = function (idCampo) {
            return $http.get(bovinosUrl + idCampo, { headers: portalService.getHeadersServer() }).then(function (respuesta) {
                return respuesta.data;
            })
        }

        this.escribirTag = function (id) {
            $http({
                method: 'PUT',
                url: escribirUrl,
                params: { idBovino: id },
                headers: portalService.getHeadersServer()
            });
        };
    })

    .service('bovinoServiceDB', function ($q, $rootScope, $localStorage) {
        this.getDatosBovino = function (id) {
            return $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT * FROM Bovino WHERE idBovino=?", [id],
                  function (resultado) {
                      resolve(resultado.rows.item(0));
                  },
                  reject);
            });
        }

        this.actualizarDatosBovino = function (bovino) {
            var genero = 0;//, escrito = 0;
            if (bovino.genero) {
                genero = 1;
            }
            /*if (bovino.escrito) {
                escrito = 1;
            }*/
            $rootScope.db.executeSql("UPDATE Bovino SET numCaravana=?, apodo=?, descripcion=?, fechaNacimiento=?, genero=?, peso=?, pesoAlNacer=?, idCategoria=?, idRaza=?, idRodeo=?, idEstado=?, escrito=?, fechaEstimadaParto=?, paraActualizar=0 WHERE idBovino=?", [bovino.numCaravana, bovino.apodo, bovino.descripcion, bovino.fechaNacimiento, genero, bovino.peso, bovino.pesoAlNacer, bovino.idCategoria, bovino.idRaza, bovino.idRodeo, bovino.idEstado, bovino.escrito, bovino.fechaEstimada, bovino.idBovino]);
        }

        this.getBovinos = function () {
            return $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT * FROM Bovino", [],
                  function (resultado) {
                      resolve(rows(resultado));
                  },
                  reject);
            });
        }

        this.actualizarBovinos = function (bovinos) {
            var sqlStatments = [];
            var genero, escrito;
            bovinos.forEach(function (bovino) {
                if (bovino.genero) {
                    genero = 1;
                } else {
                    genero = 0;
                }
                if (bovino.escrito) {
                    escrito = 1;
                } else {
                    escrito = 0;
                }
                //igual nos quedarian los bovinos que fueron borrados desde el sistema, nos quedarian en nuestra bd local... (supongo que no hay drama).
                sqlStatments.push(["INSERT OR REPLACE INTO Bovino(idBovino, numCaravana, apodo, descripcion, fechaNacimiento, genero, peso, pesoAlNacer, idCategoria, idRaza, idRodeo, idEstado, escrito, paraActualizar, fechaEstimadaParto) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)", [bovino.idBovino, bovino.numCaravana, bovino.apodo, bovino.descripcion, bovino.fechaNacimiento, genero, bovino.peso, bovino.pesoAlNacer, bovino.idCategoria, bovino.idRaza, bovino.idRodeo, bovino.idEstado, escrito, bovino.fechaEstimada]]);
                /* if ($localStorage.actualizar) {
                     sqlStatments.push(["UPDATE Bovino SET numCaravana=?, apodo=?, descripcion=?, fechaNacimiento=?, genero=?, peso=?, pesoAlNacer=?, idCategoria=?, idRaza=?, idRodeo=?, idEstado=?, escrito=?, fechaEstimadaParto=?, paraActualizar=0 WHERE idBovino=?"], [bovino.numCaravana, bovino.apodo, bovino.descripcion, bovino.fechaNacimiento, genero, bovino.peso, bovino.pesoAlNacer, bovino.idCategoria, bovino.idRaza, bovino.idRodeo, bovino.idEstado, bovino.escrito, bovino.fechaEstimada, bovino.idBovino]);
                 } else {
                     sqlStatments.push(["INSERT OR IGNORE INTO Bovino(idBovino, numCaravana, apodo, descripcion, fechaNacimiento, genero, peso, pesoAlNacer, idCategoria, idRaza, idRodeo, idEstado, escrito, paraActualizar, fechaEstimadaParto) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)", [bovino.idBovino, bovino.numCaravana, bovino.apodo, bovino.descripcion, bovino.fechaNacimiento, genero, bovino.peso, bovino.pesoAlNacer, bovino.idCategoria, bovino.idRaza, bovino.idRodeo, bovino.idEstado, escrito, bovino.fechaEstimada]]);
                 }*/
            });

            return $q(function (resolve, reject) {
                $rootScope.db.sqlBatch(sqlStatments, resolve, reject);
            });
            //$localStorage.actualizar = true;
        }

        this.escribirTag = function (id) {
            $rootScope.db.executeSql("UPDATE Bovino SET escrito=1, paraActualizar=1 WHERE idBovino=?", [id]);
        };

        this.getBovinosParaActualizarBackend = function () {
            return $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT * FROM Bovino WHERE paraActualizar=1", [],
                  function (resultado) {
                      resolve(rows(resultado));
                  },
                  reject);
            });
        };

        this.actualizarBovinoActualizado = function (bovino) {
            $rootScope.db.executeSql("UPDATE Bovino SET paraActualizar=0 WHERE idBovino=?", [bovino.idBovino]);
        };

        function rows(resultado) {
            var items = [];
            for (var i = 0; i < resultado.rows.length; i++) {
                items.push(resultado.rows.item(i));
            }
            return items;
        };
    })

    .service('bovinoService', function (bovinoServiceHTTP, bovinoServiceDB, $rootScope, $localStorage) {
        this.getDatosBovino = function (id, idCampo) {
            if ($rootScope.online) {
                var bovino;
                return bovinoServiceHTTP.getDatosBovino(id, idCampo)
                    .then(function (respuesta) { bovino = respuesta; })
                    .then(function () { bovinoServiceDB.actualizarDatosBovino(bovino); })
                    .then(function () { return bovino; });
            } else {
                return bovinoServiceDB.getDatosBovino(id);
            }
        }

        this.getBovinos = function (idCampo) {
            if ($rootScope.online) {
                var bovinos;
                return bovinoServiceHTTP.getBovinos(idCampo)
                    .then(function (respuesta) { bovinos = respuesta; })
                    .then(function () { bovinoServiceDB.actualizarBovinos(bovinos); })
                    .then(function () { return bovinos; });
            } else {
                return bovinoServiceDB.getBovinos();
            }
        }

        this.escribirTag = function (id) {
            if ($rootScope.online) {
                bovinoServiceHTTP.escribirTag(id)
            } else {
                $localStorage.actualizar = true;
                bovinoServiceDB.escribirTag(id);
            }
        };

        this.actualizarBovinosBackend = function () {
            var bovinos;
            return bovinoServiceDB.getBovinosParaActualizarBackend()
                .then(function (respuesta) {
                    bovinos = respuesta;
                    for (var i = 0; i < bovinos.length; i++) {
                        bovinoServiceHTTP.escribirTag(bovinos[i].idBovino);
                        bovinoServiceDB.actualizarBovinoActualizado(bovinos[i]);
                    }
                })
        }
    });