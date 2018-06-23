(function () {
    'use strict';

    angular.module('app').service('usuarioInfo', function ($sessionStorage) {
        var usuarioInfo = {};

        usuarioInfo.set = function (usuarioInfo) {
            $sessionStorage.usuarioInfo = usuarioInfo;
        };

        usuarioInfo.get = function () {
            return $sessionStorage.usuarioInfo;
        };

        usuarioInfo.getUsuario = function () {
            if ($sessionStorage.usuarioInfo)
                return $sessionStorage.usuarioInfo.usuario;
        };

        usuarioInfo.getRol = function () {
            if ($sessionStorage.usuarioInfo)
                return $sessionStorage.usuarioInfo.idRol;
        };

        usuarioInfo.getToken = function () {
            if ($sessionStorage.usuarioInfo !== undefined && $sessionStorage.usuarioInfo !== null)
                return $sessionStorage.usuarioInfo.token;
            else
                return "";
        };

        usuarioInfo.setToken = function (value) {
            $sessionStorage.usuarioInfo.token = value;
        };

        usuarioInfo.getUsuarioId = function () {
            if ($sessionStorage.usuarioInfo !== undefined && $sessionStorage.usuarioInfo !== null)
                return $sessionStorage.usuarioInfo.Usu_Id;
            else
                return -1;
        };

        return usuarioInfo;
    });
})();