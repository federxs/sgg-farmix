angular.module('starter')
    .controller('EscribirCtrl', function ($rootScope, $ionicModal) {

        $ionicModal.fromTemplateUrl('views/leerParaEscanear.html', {
            scope: $rootScope
        }).then(function (modal) {
            $rootScope.modal2 = modal;
        });
        $rootScope.escribirNFC = function () {
            $rootScope.modal2.show();
            nfc.addTagDiscoveredListener(FuncionesSvc.escribir);
        };

        nfc.removeMimeTypeListener("text/json", FuncionesSvc.leerMime);
        nfc.removeNdefListener(FuncionesSvc.leer);
    });