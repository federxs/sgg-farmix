(function () {
    'use strict';

    angular.module('app').controller('homeController', function (
        $scope,
        homeService,
        $state,
        $localStorage,
        $sessionStorage,
        toastr,
        portalService,
        configuracionService
        ) {
        $scope.Menu = [];
        var spinnerBar = angular.element(document.querySelector('#spinnerBar'));
        $scope.showBorrar = false;
        $scope.toDelete = [];

        $scope.load = function () {
            $scope.showSpinner = true;
            homeService.datosUsuario({ usuario: $sessionStorage.usuarioInfo.usuario, codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                var path = window.location.hash.split('/')[1] + '.' + window.location.hash.split('/')[2];
                $scope.Menu = data.menus;
                $scope.usuarioInfo = data;
                $scope.usuarioInfo.usuarioImagen = portalService.getUrlServer() + portalService.getFolderImagenUsuario() + '\\' + $scope.usuarioInfo.usuarioImagen + "?cache=" + (new Date()).getTime();
                for (var i = 0; i < $scope.Menu.length; i++) {
                    if ($scope.Menu[i].urlMenu === path)
                        $scope.Menu[i].activo = 'background-color:#E59866';
                    else if ($scope.Menu[i].menu_Hijos !== null && $scope.Menu[i].menu_Hijos.length > 0) {
                        $scope.Menu[i].activo = 'background-color:#FAE5D3';
                        for (var j = 0; j < $scope.Menu[i].menu_Hijos.length; j++) {
                            $scope.Menu[i].menu_Hijos[j].activo = 'background-color:#FAE5D3';
                        }
                    }
                    else
                        $scope.Menu[i].activo = 'background-color:#FAE5D3';
                }
                if (path === 'home.undefined') {
                    $scope.Menu[0].activo = 'background-color:#E59866';
                    $state.go('home.inicio');
                }
            }, function (error) {
                $scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };
        $scope.load();

        $scope.desactivarMenuHijos = function (menu) {
            var index = $scope.Menu.indexOf(menu);
            for (var i = 0; i < $scope.Menu[index].menu_Hijos.length; i++) {
                $scope.Menu[index].menu_Hijos[i].activo = 'background-color:#FAE5D3';
            }
        };

        $scope.activar = function (id) {
            if (id === 9) {
                $scope.abrirModalCerrarSesion();
            }
            else {
                for (var i = 0; i < $scope.Menu.length; i++) {
                    if ($scope.Menu[i].idMenu === id)
                        $scope.Menu[i].activo = 'background-color:#E59866';
                    else if ($scope.Menu[i].menu_Hijos !== null && $scope.Menu[i].menu_Hijos.length > 0) {
                        for (var j = 0; j < $scope.Menu[i].menu_Hijos.length; j++) {
                            if ($scope.Menu[i].menu_Hijos[j].idMenu === id)
                                $scope.Menu[i].menu_Hijos[j].activo = 'background-color:#E59866';
                            else
                                $scope.Menu[i].menu_Hijos[j].activo = 'background-color:#FAE5D3';
                        }
                    }
                    else
                        $scope.Menu[i].activo = 'background-color:#FAE5D3';
                }
            }
        };

        $scope.abrirModalCerrarSesion = function () {
            $('#modalConfirmCerrarSesion').modal('show');
        };

        $scope.cerrarSesion = function () {
            $localStorage.usuarioInfo = undefined;
            $sessionStorage.usuarioInfo = undefined;
            $('#modalConfirmCerrarSesion').modal('hide');
            $state.go('login');
        };

        $scope.modificarImagenPerfil = function () {
            $scope.imageToUpload = [];
            $scope.showBorrar = false;
            configuracionService.getDatosPerfilUsuario({ campo: $localStorage.usuarioInfo.codigoCampo, usuario: $sessionStorage.usuarioInfo.usuario }, function (data) {
                $scope.perfil = data;
                $scope.perfil.usuarioImagen = portalService.getUrlServer() + portalService.getFolderImagenUsuario() + '\\' + $scope.perfil.usuarioImagen + "?cache=" + (new Date()).getTime();
                $('#modalPerfil').modal('show');
            }, function (error) {
                $scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        $scope.UploadImg = function ($files, $invalidFiles) {
            $scope.imageToUpload = $files;
            if ($scope.perfil.usuarioImagen) {
                $scope.perfil.usuarioImagen = undefined;
            }
        };

        $scope.selectUnselectImage = function (item) {
            if (!$scope.showBorrar) {
                $scope.toDelete = [];
                $scope.showBorrar = true;
                var index = $scope.toDelete.indexOf(item);
                if (index != -1) {
                    $scope.toDelete.splice(index, 1);
                } else {
                    $scope.toDelete.push(item)
                }
            }
            else {
                $scope.toDelete = [];
                $scope.showBorrar = false;
            }
        };

        $scope.ImageClass = function (item) {
            var index = $scope.toDelete.indexOf(item);
            if (index != -1) {
                return true;
            } else {
                return false;
            }
        };

        $scope.deleteImagefromModel = function () {
            if ($scope.toDelete != [] && $scope.toDelete.length > 0) {
                angular.forEach($scope.toDelete, function (value, key) {
                    var index = $scope.imageToUpload.indexOf(value);
                    var indexToDelete = $scope.toDelete.indexOf(value);
                    if (index != -1) {
                        $scope.imageToUpload.splice(index, 1);
                        $scope.toDelete.splice(indexToDelete, 1);
                        $scope.showBorrar = false;
                    }
                });
            }
            else {
                toastr.info('Debe seleccionar una imágen para borrar', 'Aviso');
            }
        };

        $scope.blockSpinner = function () {
            spinnerBar.modal('show');
        };

        $scope.unBlockSpinner = function () {
            spinnerBar.modal('hide');
        };

        $scope.guardarImagenPerfil = function () {
            if ($scope.imageToUpload[0])
                $scope.perfil.imagen = $scope.imageToUpload[0];
            $scope.perfil.usuario = $sessionStorage.usuarioInfo.usuario;
            $scope.perfil.$actualizarPerfilUsuario(function (data) {
                toastr.success('Imágen actualizada', 'Éxito');
                $('#modalPerfil').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };
    });
})();
