angular.module('starter')
    .service('servicio', function (bovinoService, inseminacionService, nacimientoService, registrarEventoService, verificacionInseminacionService) {
        this.posts = function () {
            bovinoService.actualizarBovinosBackend();
            inseminacionService.actualizarInseminacionesBackend();
            nacimientoService.actualizarNacimientosBackend();
            registrarEventoService.actualizarEventosBackend();
            verificacionInseminacionService.actualizarVerificacionesBackend();
        }
    })

    .service('conexion', function ($rootScope, servicio, $localStorage) {
        function cambiarEstado(online) {
            $rootScope.$apply(function () {
                $rootScope.online = online;
                if (online && $localStorage.actualizar) {
                    servicio.posts();
                    $localStorage.actualizar = false;
                }
            });
        }

        //function que permite obtener el estado de la conexión 
        this.online = function () {
            return $rootScope.online;
        };

        $rootScope.online = navigator.onLine ? navigator.onLine : navigator.connection.type != "none";
        document.addEventListener("online", function () { cambiarEstado(true); }, false);
        document.addEventListener("offline", function () { cambiarEstado(false); }, false);
    });