angular.module('starter')
    .controller('cerrarSesionController', function ($scope, $rootScope, $state, $localStorage, conexion) {
        if ($rootScope.logueado == false) {
            $state.go('app.login');
        }
        $scope.aceptar = function () {
            if (conexion.online()) {
                $rootScope.logueado = false;
                $localStorage.usuario = undefined;
                $localStorage.pass = undefined;
                $state.go('app.bienvenido');
                //esta negrada es del luki
                $rootScope.db.executeSql("DELETE FROM Alimento");
                $rootScope.db.executeSql("DELETE FROM Antibiotic");
                $rootScope.db.executeSql("DELETE FROM Bovino");
                $rootScope.db.executeSql("DELETE FROM Rodeo");
                $rootScope.db.executeSql("DELETE FROM Vacuna");
            } else {
                alert("Se necesita conexi\u00F3n para cerrar la sesi\u00F3n");
            }
        };
        $scope.cancelar = function () {
            $state.go('app.bienvenido');
        };
    });