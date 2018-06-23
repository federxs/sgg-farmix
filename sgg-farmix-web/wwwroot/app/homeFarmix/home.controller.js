(function () {
    'use strict';

    angular.module('app').controller('homeController', function (
        $scope,
        homeService,
        $state,
        $localStorage,
        usuarioInfo,
        toastr,
        portalService,
        configuracionService
        ) {
        $scope.Menu = [];
        $scope.showBorrar = false;
        $scope.toDelete = [];
        window.scrollTo(0, 0);
        $scope.noCoincidenPass = false;
        $scope.ano = new Date().getFullYear();
        $localStorage.usuarioInfo.periodoConsulta = $scope.ano;

        //Redimenciona el tamaño del body
        var body = document.body;
        var menuLeft = document.getElementById('cbp-spmenu-s1');
        if (body.className.indexOf('cbp-spmenu-push') === -1 || !body.className)
            classie.toggle(body, 'cbp-spmenu-push');
        else if (menuLeft.className.indexOf('cbp-spmenu-left') !== -1 && menuLeft.className.indexOf('cbp-spmenu-open') === -1 && body.className.indexOf('cbp-spmenu-push-toright') !== -1)
            classie.toggle(menuLeft, 'cbp-spmenu-open');

        //$('.sidebar-menu').SidebarNav();

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
            spinnerBar.show();
            homeService.datosUsuario(usuarioInfo.getUsuario(), $localStorage.usuarioInfo.codigoCampo, usuarioInfo.getRol(), $localStorage.usuarioInfo.periodoConsulta).then(function success(data) {
                var path = window.location.hash.split('/')[1] + '.' + window.location.hash.split('/')[2];
                $scope.Menu = data.menus;
                $scope.usuarioInfo = data;
                $scope.usuarioInfo.usuarioImagen = portalService.getUrlServer() + portalService.getFolderImagenUsuario() + '\\' + $scope.usuarioInfo.usuarioImagen + "?cache=" + (new Date()).getTime();
                spinnerBar.hide();
            }, function (error) {
                spinnerBar.hide();
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
            usuarioInfo.set(null);
            $('#modalConfirmCerrarSesion').modal('hide');
            $state.go('login');
        };

        $scope.modificarImagenPerfil = function () {
            $scope.imageToUpload = [];
            $scope.showBorrar = false;
            spinnerBar.show();
            configuracionService.getDatosPerfilUsuario({ campo: $localStorage.usuarioInfo.codigoCampo, usuario: usuarioInfo.getUsuario(), idRol: usuarioInfo.getRol() }, function (data) {
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

        $scope.errorServicio = function (error) {
            if (error === 'Token_Invalido') {
                toastr.error('Lo sentimos, su sesión ha caducado', 'Sesión caducada');
                usuarioInfo.set(null);
                $state.go('login');
            }
            else
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
        };

        $scope.cerrarMenu = function () {
            menuLeft = document.getElementById('cbp-spmenu-s1');
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
            $scope.perfil.usuario = usuarioInfo.getUsuario();
            $scope.perfil.$actualizarPerfilUsuario(function (data) {
                toastr.success('Datos actualizados', 'Éxito');
                spinnerBar.hide();
                $('#modalPerfil').modal('hide');
                $state.reload();
            }, function (error) {
                spinnerBar.hide();
                //$scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        $scope.validarContraseniasRepe = function () {
            if($scope.contrasenia.nueva !== $scope.contrasenia.nuevaRepe)
                $scope.noCoincidenPass = true;
            else
                $scope.noCoincidenPass = false;
        };

        $scope.cambiarContrasenia = function () {
            spinnerBar.show();
            homeService.cambiarPass($scope.contrasenia.anterior, $scope.contrasenia.nueva, usuarioInfo.getUsuario(), usuarioInfo.getRol()).then(function success(data) {
                toastr.success('Contraseña cambiada con éxito', 'Éxito');
                spinnerBar.hide();
                $('#modalCambiarContrania').modal('hide');
            }, function (error) {
                spinnerBar.hide();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };
    });
})();
