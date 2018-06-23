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
                $rootScope.db.executeSql("DELETE FROM Nacimiento");
                $rootScope.db.executeSql("DELETE FROM InseminacionPendiente");
                $rootScope.db.executeSql("DELETE FROM Tacto");
                $rootScope.db.executeSql("DELETE FROM TorosXInseminacion");
                $rootScope.db.executeSql("DELETE FROM Inseminacion");
                $rootScope.db.executeSql("DELETE FROM EventosXBovino");
                $rootScope.db.executeSql("DELETE FROM Evento");
                $rootScope.db.executeSql("DELETE FROM Bovino");
                $rootScope.db.executeSql("DELETE FROM Vacuna");
                $rootScope.db.executeSql("DELETE FROM Rodeo");
                $rootScope.db.executeSql("DELETE FROM Raza");
                $rootScope.db.executeSql("DELETE FROM Estado");
                $rootScope.db.executeSql("DELETE FROM Categoria");
                $rootScope.db.executeSql("DELETE FROM Antibiotico");
                $rootScope.db.executeSql("DELETE FROM Alimento");
            } else {
                alert("Se necesita conexi\u00F3n para cerrar la sesi\u00F3n");
            }
        };
        $scope.cancelar = function () {
            $state.go('app.bienvenido');
        };
    });