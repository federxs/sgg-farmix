angular.module('starter')
    .controller('BienvenidoCtrl', function ($scope) {
        $scope.escribirNFC = function () {
            var mensaje = [
                ndef.textRecord("hello world")
            ];
            nfc.write(mensaje, alert("Success"), alert("Failure"));
        };
    });