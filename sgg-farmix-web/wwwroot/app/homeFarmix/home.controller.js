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
        $scope.showBorrar = false;
        $scope.toDelete = [];

        var body = document.body;
        classie.toggle(body, 'cbp-spmenu-push');

        $('.sidebar-menu').SidebarNav();

        var spinnerBar = spinnerBar || (function ($) {
            'use strict';

            // Creating modal dialog's DOM
            var $dialog = $(
                '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
                '<div class="modal-dialog modal-m">' +
                '<div class="modal-content">' +
                    '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
                    '<div class="modal-body">' +
                        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
                    '</div>' +
                '</div></div></div>');
            return {
                show: function (message, options) {
                    // Assigning defaults
                    if (typeof options === 'undefined') {
                        options = {};
                    }
                    if (typeof message === 'undefined') {
                        message = 'Cargando...';
                    }
                    var settings = $.extend({
                        dialogSize: 'm',
                        progressType: '',
                        onHide: null // This callback runs after the dialog was hidden
                    }, options);

                    // Configuring dialog
                    $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
                    $dialog.find('.progress-bar').attr('class', 'progress-bar');
                    if (settings.progressType) {
                        $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
                    }
                    $dialog.find('h3').text(message);
                    // Adding callbacks
                    if (typeof settings.onHide === 'function') {
                        $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                            settings.onHide.call($dialog);
                        });
                    }
                    // Opening dialog
                    $dialog.modal();
                },
                /**
                 * Closes dialog
                 */
                hide: function () {
                    $dialog.modal('hide');
                }
            };

        })(jQuery);

        var spinnerBarGuardado = spinnerBarGuardado || (function ($) {
            'use strict';

            // Creating modal dialog's DOM
            var $dialog = $(
                '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
                '<div class="modal-dialog modal-m">' +
                '<div class="modal-content">' +
                    '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
                    '<div class="modal-body">' +
                        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%;background-color: green;"></div></div>' +
                    '</div>' +
                '</div></div></div>');
            return {
                show: function (message, options) {
                    // Assigning defaults
                    if (typeof options === 'undefined') {
                        options = {};
                    }
                    if (typeof message === 'undefined') {
                        message = 'Guardando...';
                    }
                    var settings = $.extend({
                        dialogSize: 'm',
                        progressType: '',
                        onHide: null // This callback runs after the dialog was hidden
                    }, options);

                    // Configuring dialog
                    $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
                    $dialog.find('.progress-bar').attr('class', 'progress-bar');
                    if (settings.progressType) {
                        $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
                    }
                    $dialog.find('h3').text(message);
                    // Adding callbacks
                    if (typeof settings.onHide === 'function') {
                        $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                            settings.onHide.call($dialog);
                        });
                    }
                    // Opening dialog
                    $dialog.modal();
                },
                /**
                 * Closes dialog
                 */
                hide: function () {
                    $dialog.modal('hide');
                }
            };

        })(jQuery);

        $scope.load = function () {
            //$scope.showSpinner = true;
            spinnerBar.show();
            homeService.datosUsuario($sessionStorage.usuarioInfo.usuario, $localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                var path = window.location.hash.split('/')[1] + '.' + window.location.hash.split('/')[2];
                $scope.Menu = data.menus;
                $scope.usuarioInfo = data;
                $scope.usuarioInfo.usuarioImagen = portalService.getUrlServer() + portalService.getFolderImagenUsuario() + '\\' + $scope.usuarioInfo.usuarioImagen + "?cache=" + (new Date()).getTime();
                spinnerBar.hide();
                //for (var i = 0; i < $scope.Menu.length; i++) {
                //    if ($scope.Menu[i].urlMenu === path)
                //        $scope.Menu[i].activo = 'background-color:#E59866';
                //    else if ($scope.Menu[i].menu_Hijos !== null && $scope.Menu[i].menu_Hijos.length > 0) {
                //        $scope.Menu[i].activo = 'background-color:#FAE5D3';
                //        for (var j = 0; j < $scope.Menu[i].menu_Hijos.length; j++) {
                //            $scope.Menu[i].menu_Hijos[j].activo = 'background-color:#FAE5D3';
                //        }
                //    }
                //    else
                //        $scope.Menu[i].activo = 'background-color:#FAE5D3';
                //}
                //if (path === 'home.undefined') {
                //    $scope.Menu[0].activo = 'background-color:#E59866';
                //    //spinnerBar.hide();
                //    $state.go('home.inicio');
                //}
            }, function (error) {
                spinnerBar.hide();
                //$scope.showSpinner = false;
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
            spinnerBar.show();
            configuracionService.getDatosPerfilUsuario({ campo: $localStorage.usuarioInfo.codigoCampo, usuario: $sessionStorage.usuarioInfo.usuario }, function (data) {
                $scope.perfil = data;
                $scope.perfil.usuarioImagen = portalService.getUrlServer() + portalService.getFolderImagenUsuario() + '\\' + $scope.perfil.usuarioImagen + "?cache=" + (new Date()).getTime();
                spinnerBar.hide();
                $('#modalPerfil').modal('show');
            }, function (error) {
                spinnerBar.hide();
                //$scope.showSpinner = false;
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
            spinnerBar.show();
        };

        $scope.unBlockSpinner = function () {
            spinnerBar.hide();
        };

        $scope.blockSpinnerSave = function () {
            spinnerBarGuardado.show();
        };

        $scope.unBlockSpinnerSave = function () {
            spinnerBarGuardado.hide();
        };

        $scope.cerrarMenu = function () {
            var menuLeft = document.getElementById('cbp-spmenu-s1');
            var showLeftPush = document.getElementById('showLeftPush');
			body = document.body;

            //showLeftPush.onclick = function () {
			    classie.toggle(showLeftPush, 'active');
                classie.toggle(body, 'cbp-spmenu-push-toright');
                classie.toggle(menuLeft, 'cbp-spmenu-open');
                disableOther('showLeftPush');
            //};


            function disableOther(button) {
                if (button !== 'showLeftPush') {
                    classie.toggle(showLeftPush, 'disabled');
                }
            }          

        };

        $scope.guardarImagenPerfil = function () {
            spinnerBar.show();
            if ($scope.imageToUpload[0])
                $scope.perfil.imagen = $scope.imageToUpload[0];
            $scope.perfil.usuario = $sessionStorage.usuarioInfo.usuario;
            $scope.perfil.$actualizarPerfilUsuario(function (data) {
                toastr.success('Imágen actualizada', 'Éxito');
                spinnerBar.hide();
                $('#modalPerfil').modal('hide');
                $state.reload();
            }, function (error) {
                spinnerBar.hide();
                //$scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };
    });
})();
