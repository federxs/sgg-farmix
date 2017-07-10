angular.module('starter')
    .controller('BienvenidoCtrl', function ($scope, $nfc) {
        $scope.escribirNFC = function () {
            var mensaje = [
                ndef.textRecord("hello world")
            ];
            $nfc.write(mensaje, alert("Success"), aler("Failure"));
        };
    });