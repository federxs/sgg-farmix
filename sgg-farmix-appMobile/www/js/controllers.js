(function () {
    angular.module('starter')
    .controller('Controller', function ($rootScope, $state, $ionicPlatform, bovinoService, $scope, loginService, $ionicLoading, $localStorage) {

        $ionicPlatform.ready(function () {
			nfc.addNdefListener(tagEscaneado, iniciar, cancelar);
        });
		
        if ($rootScope.logueado == false) {
            $state.go('app.bienvenido');
        }
		
		function iniciar(){
			return;
		}
		
		function cancelar(){
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
                            if ($state.current.name != "app.antibiotico" || _bovino.idEstado == "Enfermo") {
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
                                alert("El animal registrado no se encuentra enfermo");
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