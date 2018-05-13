angular.module('starter')
    .service('conexion', function ($rootScope) {
        function cambiarEstado(online) {
            $rootScope.$apply(function () {
                $rootScope.online = online;
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