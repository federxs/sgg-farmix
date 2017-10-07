(function () {
    angular.module('starter')

    .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('views/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('Controller', function ($rootScope, $state, $ionicPlatform, bovinoService, $scope, $ionicLoading) {
        $ionicPlatform.ready(function () {
            nfc.addNdefListener(tagEscaneado);
        });

        tagEscaneado = function (nfcEvent) {
            if ($state.current.name == "app.escribirTag") {
                var id = $rootScope.idEscribir;
                var mensaje = [ndef.textRecord(id)];
                nfc.write(mensaje);
                if ($rootScope.actualizarEscritura) {
                    bovinoService.escribirTag(id);
                }
                alert("Se ha grabado el tag escaneado");
                $state.go('app.escribir');
            } else if ($state.current.name == "app.leer") {
                var id = (nfc.bytesToString(nfcEvent.tag.ndefMessage[0].payload)).slice(3);
                $state.go('app.resultado/:id', { id: id });
            } else if ($state.current.name == "app.vacunacion" || $state.current.name == "app.manejo" || $state.current.name == "app.antibiotico" || $state.current.name == "app.alimento" || $state.current.name == "app.inseminacion") {
                $scope.id = (nfc.bytesToString(nfcEvent.tag.ndefMessage[0].payload)).slice(3);
                if ($rootScope.idVacas == undefined || estaEscaneado($scope.id) == false) {
                    showIonicLoading().then(obtenerBovino).then(function (_bovino) {
                        if (_bovino != null && _bovino.borrado == false) {
                            if ($state.current.name != "app.antibiotico" || _bovino.idEstado == "Enfermo") {
                                if ($state.current.name == "app.inseminacion") {
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
                                        alert("Un toro no puede ser inseminado, modifique el tipo de inseminación");
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
            return bovinoService.getDatosBovino($scope.id);
        }
    });
})();