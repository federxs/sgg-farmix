angular.module('starter')
    .controller('BienvenidoCtrl', function ($scope, $rootScope) {
        $scope.escribirNFC = function () {
            var mensaje = [
                ndef.textRecord("ID Vaca")
            ];
            nfc.addTagDiscoveredListener(nfc.write(mensaje));
        };
    });