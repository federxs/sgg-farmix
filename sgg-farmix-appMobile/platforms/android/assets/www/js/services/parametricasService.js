angular.module('starter')
    .service('parametricasService', function ($http, portalService, $q, $rootScope) {
        var parametricasUrl = portalService.getUrlServer() + "api/Bovino/initModificacion?";
        this.getDatosParametricas = function (idCampo) {
            $http.get(parametricasUrl + "idBovino=0&idCampo=" + idCampo, { headers: portalService.getHeadersServer() }).then(function (respuesta) {
                var sqlStatments = [];
                var categoria, raza, estado;
                for (var i = 0; i < respuesta.data.categorias.length; i++) {
                    categoria = respuesta.data.categorias[i];
                    sqlStatments.push(["INSERT OR REPLACE INTO Categoria(idCategoria, nombre, genero) VALUES(?, ?, ?)", [categoria.idCategoria, categoria.nombre, categoria.genero]]);
                }
                $q(function (resolve, reject) {
                    $rootScope.db.sqlBatch(sqlStatments, resolve, reject);
                });
                for (var i = 0; i < respuesta.data.razas.length; i++) {
                    raza = respuesta.data.razas[i];
                    sqlStatments.push(["INSERT OR REPLACE INTO Raza(idRaza, nombre) VALUES(?, ?, ?)", [raza.idRaza, raza.nombre]]);
                }
                $q(function (resolve, reject) {
                    $rootScope.db.sqlBatch(sqlStatments, resolve, reject);
                });
                for (var i = 0; i < respuesta.data.estados.length; i++) {
                    estado = respuesta.data.estados[i];
                    sqlStatments.push(["INSERT OR REPLACE INTO Estado(idEstado, nombre, descripcion) VALUES(?, ?, ?)", [estado.idEstado, estado.nombre, estado.descripcion]]);
                }
                $q(function (resolve, reject) {
                    $rootScope.db.sqlBatch(sqlStatments, resolve, reject);
                });
            })
        };
    });