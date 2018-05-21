(function () {
    angular.module('starter')
    .controller('Controller', function ($rootScope, $state, $ionicPlatform, bovinoService, $scope, loginService, $ionicLoading, $localStorage, alimentoService, antibioticoService, rodeoService, vacunaService) {

        $ionicPlatform.ready(function () {
            //abrimos la db acá
            $rootScope.db = window.sqlitePlugin.openDatabase({ name: "farmix.db", location: 'default' });
            nfc.addNdefListener(tagEscaneado, iniciar, cancelar);
            //descomenta Luki para que te funcione sin NFC
            //nfc.addNdefListener(tagEscaneado, cancelar, iniciar);
        });

        if ($rootScope.logueado == false) {
            $state.go('app.bienvenido');
        }
        function cargarDataBase() {
            if ($rootScope.logueado == true && conexion.online) {
                alimentoService.getDatosAlimento($localStorage.campo);
                antibioticoService.getDatosAntibiotico($localStorage.campo);
                bovinoService.getBovinos($localStorage.campo);
                rodeoService.getDatosRodeo($localStorage.campo);
                vacunaService.getDatosVacuna($localStorage.campo);
            }
        }
        function iniciar() {
            //$rootScope.ban = true;
            $rootScope.db.transaction(function (tx) {
                //idCampo irrelevante - el usuario solo tiene acceso a un campo en la app (, idCampo INTEGER)
                //Ambito estado lo mismo (solo hay uno con estado - Bovino)
                //BOOL no existe, se usa INTEGER con valor 0 o 1. INTEGER(1) representa eso.
                //REAL seria Float
                //DATE no existe, se usa TEXT
                //paraActualizar es BOOL para saber si hay que actualizar contra backend (si se hicieron sin conexion)
                //0=false, 1=true
                tx.executeSql("CREATE TABLE IF NOT EXISTS Alimento(idAlimento INTEGER PRIMARY KEY, nombre TEXT)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS Antibiotico(idAntibiotico INTEGER PRIMARY KEY, nombre TEXT)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS Categoria(idCategoria INTEGER PRIMARY KEY, nombre TEXT, genero INTEGER(1))");
                tx.executeSql("CREATE TABLE IF NOT EXISTS Estado(idEstado INTEGER PRIMARY KEY, nombre TEXT, descripcion TEXT)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS Raza(idRaza INTEGER PRIMARY KEY, nombre TEXT)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS Rodeo(idRodeo INTEGER PRIMARY KEY, nombre TEXT, confinado INTEGER(1))");
                tx.executeSql("CREATE TABLE IF NOT EXISTS TipoEvento(idTipoEvento INTEGER PRIMARY KEY, descripcion TEXT)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS TipoTacto(idTipoTacto INTEGER PRIMARY KEY, descripcion TEXT)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS Vacuna(idVacuna INTEGER PRIMARY KEY, nombre TEXT)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS Bovino(idBovino INTEGER PRIMARY KEY, numCaravana INTEGER, apodo TEXT, descripcion TEXT, fechaNacimiento TEXT, genero INTEGER(1), peso REAL, pesoAlNacer REAL, idCategoria INTEGER, idRaza INTEGER, idRodeo INTEGER, idEstado INTEGER, escrito INTEGER(1), paraActualizar INTEGER(1), fechaEstimadaParto TEXT, FOREIGN KEY(idCategoria) REFERENCES Categoria (idCategoria), FOREIGN KEY(idRaza) REFERENCES Raza (idRaza), FOREIGN KEY(idRodeo) REFERENCES Rodeo (idRodeo), FOREIGN KEY(idEstado) REFERENCES Estado (idEstado))");
                tx.executeSql("CREATE TABLE IF NOT EXISTS Evento(idEvento INTEGER PRIMARY KEY, fechaHora TEXT, cantidad REAL, idTipoEvento INTEGER, idVacuna INTEGER, idAntibiotico INTEGER, idAlimento INTEGER, idRodeoDestino INTEGER, FOREIGN KEY(idTipoEvento) REFERENCES TipoEvento (idTipoEvento), FOREIGN KEY(idVacuna) REFERENCES Vacuna (idVacuna), FOREIGN KEY(idAntibiotico) REFERENCES Antibiotico (idAntibiotico), FOREIGN KEY(idAlimento) REFERENCES Alimento (idAlimento), FOREIGN KEY(idRodeoDestino) REFERENCES Rodeo (idRodeo))");
                tx.executeSql("CREATE TABLE IF NOT EXISTS EventosXBovino(idBovino INTEGER, idEvento INTEGER, PRIMARY KEY (idBovino, idEvento), FOREIGN KEY (idBovino) REFERENCES Bovino (idBovino), FOREIGN KEY (idEvento) REFERENCES Evento (idEvento))");
                tx.executeSql("CREATE TABLE IF NOT EXISTS Inseminacion(idInseminacion INTEGER PRIMARY KEY, idVaca INTEGER, fechaInseminacion TEXT, fechaEstimadaNacimiento TEXT, tipoInseminacion INTEGER, FOREIGN KEY (idVaca) REFERENCES Bovino (idBovino), FOREIGN KEY (tipoInseminacion) REFERENCES TipoInseminacion (idTipo))");
                tx.executeSql("CREATE TABLE IF NOT EXISTS TorosXInseminacion(idInseminacion INTEGER, idToro INTEGER, PRIMARY KEY(idInseminacion, idToro), FOREIGN KEY (idInseminacion) REFERENCES Inseminacion (idInseminacion), FOREIGN KEY (idToro) REFERENCES Bovino (idBovino))");
                tx.executeSql("CREATE TABLE IF NOT EXISTS Tacto(idInseminacion INTEGER, fechaTacto TEXT, exitoso INTEGER(1), idTipoTacto INTEGER, PRIMARY KEY (idInseminacion, fechaTacto), FOREIGN KEY (idTipoTacto) REFERENCES TipoTacto (idTipoTacto))");
                tx.executeSql("CREATE TABLE IF NOT EXISTS InseminacionPendiente(idInseminacion INTEGER PRIMARY KEY, fechaInseminacion TEXT, tipoInseminacion INTEGER, idVaca INTEGER, FOREIGN KEY (tipoInseminacion) REFERENCES TipoInseminacion (idTipo))");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TipoInseminacion(idTipo INTEGER PRIMARY KEY, descripcion TEXT)");
                tx.executeSql("INSERT INTO TipoInseminacion(idTipo, descripcion) VALUES(1, 'Artificial')");
                tx.executeSql("INSERT INTO TipoInseminacion(idTipo, descripcion) VALUES(2, 'Montura')");
            });
            cargarDataBase();
            return;
        }

        function cancelar() {
            alert("Por favor, encienda el NFC y reinicie la aplicaci\u00F3n");
            return;
        }

        function tagEscaneado(nfcEvent) {
            if ($state.current.name == "app.escribirTag") {
                var id = $rootScope.idEscribir;
                var mensaje = [ndef.textRecord(id)];
                nfc.write(mensaje);
                if ($rootScope.actualizarEscritura) {
                    bovinoService.escribirTag(id);
                }
                alert("Se ha grabado el tag escaneado");
                $state.go('app.escribir', {}, { reload: true });
            } else if ($state.current.name == "app.leer") {
                var id = (nfc.bytesToString(nfcEvent.tag.ndefMessage[0].payload)).slice(3);
                $state.go('app.resultado/:id', { id: id });
            } else if ($state.current.name == "app.vacunacion" || $state.current.name == "app.manejo" || $state.current.name == "app.antibiotico" || $state.current.name == "app.alimento" || $state.current.name == "app.registrarInseminacion") {
                $scope.id = (nfc.bytesToString(nfcEvent.tag.ndefMessage[0].payload)).slice(3);
                if ($rootScope.idVacas == undefined || estaEscaneado($scope.id) == false) {
                    showIonicLoading().then(obtenerBovino).then(function (_bovino) {
                        if (_bovino != null && _bovino.borrado == false) {
                            if ($state.current.name == "app.registrarInseminacion") {
                                if ($rootScope.evento.tipoInseminacion == "2" && _bovino.genero == 1) {
                                    if ($rootScope.toros == undefined || $rootScope.toros == null) {
                                        $rootScope.toros = [];
                                        $rootScope.idToros = [];
                                    }
                                    $rootScope.toros.push({ numCaravana: _bovino.numCaravana, apodo: _bovino.apodo });
                                    $rootScope.idToros.push($scope.id);
                                } else if (_bovino.genero == 0) {
                                    if (_bovino.idEstado == "Activo" && (_bovino.idCategoria == "Ternera" || _bovino.idCategoria == "Vaquilla" || _bovino.idCategoria == "Vaquillona")) {
                                        if ($rootScope.vacas == undefined || $rootScope.vacas == null) {
                                            $rootScope.vacas = [];
                                            $rootScope.idVacas = [];
                                        }
                                        $rootScope.vacas.push({ numCaravana: _bovino.numCaravana, apodo: _bovino.apodo });
                                        $rootScope.idVacas.push($scope.id);
                                    } else {
                                        alert("Esta vaca no puede ser inseminada");
                                    }
                                } else {
                                    alert("Un toro no puede ser inseminado, modifique el tipo de inseminaci\u00F3n");
                                }
                            } else {
                                if ($rootScope.vacas == undefined || $rootScope.vacas == null) {
                                    $rootScope.vacas = [];
                                    $rootScope.idVacas = [];
                                }
                                $rootScope.vacas.push({ numCaravana: _bovino.numCaravana, apodo: _bovino.apodo });
                                $rootScope.idVacas.push($scope.id);
                            }
                        } else {
                            alert("El tag escaneado no se encuentra dentro de los animales registrados");
                        }
                    }).then($ionicLoading.hide).catch($ionicLoading.hide);
                } else {
                    alert("El Bovino ya esta agreagado en la lista");
                }
            }
        };

        function estaEscaneado(id) {
            for (i = 0; i < $rootScope.idVacas.length; i++) {
                if ($rootScope.idVacas[i] == id) {
                    return true;
                }
            }
            if ($state.current.name == "app.inseminacion" && $rootScope.evento.tipoInseminacion == "2" && $rootScope.toros != undefined && $rootScope.toros != null) {
                for (i = 0; i < $rootScope.idToros.length; i++) {
                    if ($rootScope.idToros[i] == id) {
                        return true;
                    }
                }
            }
            return false;
        }

        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }

        function obtenerBovino() {
            return bovinoService.getDatosBovino($scope.id, $localStorage.campo);
        }
    });
})();