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

        $scope.leer = function (){
            $rootScope.leer = true;
        }
        $scope.escribir = function () {
            $rootScope.leer = false;
        }
    })

    .controller('Controller', function ($rootScope, $state, $ionicModal) {
        leerMime = function (nfcEvent) {
            console.log("mime" + nfcEvent.tag.ndefMessage[0]);
            $rootScope.texto = nfcEvent.tag.ndefMessage[0].payload;
            if ($rootScope.texto != "") {
                $state.go('app.resultado');
            }
        };
        leer = function (nfcEvent) {
            $state.go('app.leer');
            console.log("ndef" + nfcEvent.tag.ndefMessage[0]);
            $rootScope.texto = nfcEvent.tag.ndefMessage[0].payload;
            if ($rootScope.texto != "") {
                $state.go('app.resultado');
            }
        };
        escribir = function () {
            var mensaje = [
                ndef.textRecord("ID Vaca")
            ];
            nfc.write(mensaje, $rootScope.modal2.hide());
            nfc.removeTagDiscoveredListener(function () {
                var mensaje = [
                    ndef.textRecord("ID Vaca")
                ];
                nfc.write(mensaje, $rootScope.modal2.hide());
            });
        };
        if ($rootScope.leer == true) {
            //esto para leer
            console.log("leer");
            nfc.addMimeTypeListener("text/json", leerMime);
            nfc.addNdefListener(leer);
            nfc.removeTagDiscoveredListener(escribir);
        } else {
            //esto para escribir
            console.log("escribir");
            $ionicModal.fromTemplateUrl('views/leerParaEscanear.html', {
                scope: $rootScope
            }).then(function (modal) {
                $rootScope.modal2 = modal;
            });
            $rootScope.escribirNFC = function () {
                $rootScope.modal2.show();
                nfc.addTagDiscoveredListener(escribir);
            };
            nfc.removeMimeTypeListener("text/json", leerMime);
            nfc.removeNdefListener(leer);
        }
    });
})();
