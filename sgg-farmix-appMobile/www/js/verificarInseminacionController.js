angular.module('starter')
    .controller('VerificarInseminacionController', function ($scope, $state, $rootScope, $stateParams, verificacionInseminacionService) {
        $rootScope.evento.resultado = "0";

        $scope.verificar = function () {
            if ($rootScope.evento.resultado != "0") {
                if ($rootScope.evento.tipoVerificacion != "0") {
                    exitoso = true;
                    if ($rootScope.evento.resultado == "2") {
                        exitoso = false;
                    }
                    var inseminacion = { idTipoTacto: $rootScope.evento.tipoVerificacion, exitoso: exitoso, idInseminacion: $stateParams.idInseminacion };
                    verificacionInseminacionService.registrarVerificacionInseminacion(inseminacion);
                    alert("Verificacion registrada con exito");
                    $state.go("app.inseminacionesPendientes");
                } else {
                    alert("Seleccione el tipo de verificacion");
                }
            } else {
                alert("Seleccione el resultado de la verificacion");
            }
        }
    });