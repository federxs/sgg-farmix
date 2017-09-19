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
            if ($state.current.name == "app.escribir") {
                var id = $rootScope.idBovino;
                var mensaje = [
                ndef.textRecord(id)];
                nfc.write(mensaje);
                $rootScope.aviso = "";
                alert("Se ha escrito el ID en el tag escaneado");
                $state.reload();
            } else if ($state.current.name == "app.leer") {
                var id = (nfc.bytesToString(nfcEvent.tag.ndefMessage[0].payload)).slice(3);
                $state.go('app.resultado/:id', { id: id });
            } else if ($state.current.name == "app.vacunacion" || $state.current.name == "app.manejo" || $state.current.name == "app.antibiotico") {
                $scope.id = (nfc.bytesToString(nfcEvent.tag.ndefMessage[0].payload)).slice(3);
                if ($rootScope.idVacas == undefined || estaEscaneado($scope.id) == false) {
                    showIonicLoading().then(obtenerBovino).then(function (_bovino) {
                        if (_bovino != null && _bovino.borrado == false) {
                            if ($rootScope.vacas == undefined || $rootScope.vacas == null) {
                                $rootScope.vacas = [];
                                $rootScope.idVacas = [];
                            }
                            $rootScope.vacas.push({ numCaravana: _bovino.numCaravana, apodo: _bovino.apodo });
                            $rootScope.idVacas.push($scope.id);
                        } else {
                            alert("El id escaneado no se encuentra dentro de los animales registrados");
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