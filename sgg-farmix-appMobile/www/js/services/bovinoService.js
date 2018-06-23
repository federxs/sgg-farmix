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
                var bovinos = [];
                bovinos.push(respuesta.data[0])
                for (var i = 1; i < respuesta.data.length; i++) {
                    var ban = false;
                    for (var j = 0; j < bovinos.length; j++) {
                        if (bovinos[j].idBovino == respuesta.data[i].idBovino) {
                            ban = true;
                            break;
                        }
                    }
                    if (!ban) {
                        bovinos.push(respuesta.data[i]);
                    }
                }
                return bovinos;
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
            var bovino = $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT B.idBovino, B.numCaravana, B.apodo, B.descripcion, B.fechaNacimiento, B.genero, B.peso, B.fechaEstimadaParto, B.enfermo, C.nombre AS idCategoria, R.nombre AS idRaza, E.nombre AS idEstado FROM Bovino B JOIN Categoria C ON B.idCategoria = C.idCategoria JOIN Raza R ON B.idRaza = R.idRaza JOIN Estado E ON B.idEstado = E.idEstado WHERE idBovino=?", [id],
                  function (resultado) {
                      resolve(resultado.rows.item(0));
                  },
                  reject);
            });
            return bovino;
        }

        this.actualizarDatosBovino = function (bovino) {
            var genero = 0, enfermo = 0;
            if (bovino.genero || bovino.genero == 1) {
                genero = 1;
            }
            if (bovino.enfermo || bovino.enfermo == 1) {
                enfermo = 1;
            }
            $rootScope.db.executeSql("UPDATE Bovino SET numCaravana=?, apodo=?, descripcion=?, fechaNacimiento=?, genero=?, peso=?, pesoAlNacer=?, idCategoria=?, idRaza=?, idRodeo=?, idEstado=?, fechaEstimadaParto=?, enfermo=?, paraActualizar=0 WHERE idBovino=?", [bovino.numCaravana, bovino.apodo, bovino.descripcion, bovino.fechaNacimiento, genero, bovino.peso, bovino.pesoAlNacer, bovino.idCategoria, bovino.idRaza, bovino.idRodeo, bovino.idEstado, bovino.escrito, bovino.fechaEstimada, bovino.enfermo, bovino.idBovino]);
        }

        this.getBovinos = function () {
            return $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT * FROM Bovino ORDER BY numCaravana", [],
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
                sqlStatments.push(["INSERT OR REPLACE INTO Bovino(idBovino, numCaravana, apodo, descripcion, fechaNacimiento, genero, peso, pesoAlNacer, idCategoria, idRaza, idRodeo, idEstado, escrito, enfermo, paraActualizar) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)", [bovino.idBovino, bovino.numCaravana, bovino.apodo, bovino.descripcion, bovino.fechaNacimiento, genero, bovino.peso, bovino.pesoAlNacer, bovino.idCategoria, bovino.idRaza, bovino.idRodeo, bovino.idEstado, escrito, bovino.enfermo]]);
            });

            return $q(function (resolve, reject) {
                $rootScope.db.sqlBatch(sqlStatments, resolve, reject);
            });
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