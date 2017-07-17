    angular.module('starter')
    .controller('LeerCtrl', function (FuncionesSvc) {
        nfc.addMimeTypeListener("text/json", FuncionesSvc.leerMime);
        nfc.addNdefListener(FuncionesSvc.leer);
        nfc.removeTagDiscoveredListener(FuncionesSvc.escribir);
    });
