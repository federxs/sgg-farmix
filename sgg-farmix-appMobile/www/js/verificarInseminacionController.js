angular.module('starter')
    .controller('VerificarInseminacionController', function ($scope, $state, $rootScope, $stateParams, verificacionInseminacionService) {
        if($rootScope.logueado == false){
            $state.go('app.bienvenido');
        }
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
                    alert("Verificaci\u00F3n registrada con exito");
                    $state.go("app.inseminacionesPendientes");
                } else {
                    alert("Seleccione el tipo de verificaci\u00F3n");
                }
            } else {
                alert("Seleccione el resultado de la verificaci\u00F3n");
            }
        }
    });