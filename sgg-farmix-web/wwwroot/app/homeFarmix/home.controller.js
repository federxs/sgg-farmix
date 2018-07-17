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
        $('.modal-backdrop').remove();

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

        var spinnerBarGenerarArchivo = spinnerBarGenerarArchivo || (function ($) {
            'use strict';

            // Creating modal dialog's DOM
            var $dialog = $(
                '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
                '<div class="modal-dialog modal-m">' +
                '<div class="modal-content">' +
                    '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
                    '<div class="modal-body">' +
                        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%;background-color: orange;"></div></div>' +
                    '</div>' +
                '</div></div></div>');
            return {
                show: function (message, options) {
                    // Assigning defaults
                    if (typeof options === 'undefined') {
                        options = {};
                    }
                    if (typeof message === 'undefined') {
                        message = 'Generando...';
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
            homeService.datosUsuario(!usuarioInfo.getUsuario() ? 0 : usuarioInfo.getUsuario(), $localStorage.usuarioInfo.codigoCampo, !usuarioInfo.getRol() ? 0 : usuarioInfo.getRol(), $localStorage.usuarioInfo.periodoConsulta).then(function success(data) {
                var path = window.location.hash.split('/')[1] + '.' + window.location.hash.split('/')[2];
                $scope.Menu = data.menus;
                $scope.usuarioInfo = data;
                $localStorage.usuarioInfo.campoNombre = $scope.usuarioInfo.campo;
                $scope.usuarioInfo.usuarioImagen = portalService.getUrlServer() + portalService.getFolderImagenUsuario() + '\\' + $scope.usuarioInfo.usuarioImagen + "?cache=" + (new Date()).getTime();
                spinnerBar.hide();
                $('.modal-backdrop').remove();
            }, function (error) {
                spinnerBar.hide();
                $scope.errorServicio(error.statusText);
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
            configuracionService.getDatosPerfilUsuario({ campo: $localStorage.usuarioInfo.codigoCampo, usuario: usuarioInfo.getUsuario(), idRol: usuarioInfo.getRol(), periodo: $localStorage.usuarioInfo.periodoConsulta }, function (data) {
                $scope.perfil = data;
                if ($scope.perfil.usuarioImagen)
                    $scope.perfil.usuarioImagen = portalService.getUrlServer() + portalService.getFolderImagenUsuario() + '\\' + $scope.perfil.usuarioImagen + "?cache=" + (new Date()).getTime();
                else
                    $scope.perfil.usuarioImagen = 'images/usuario_defecto.png';
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

        $scope.blockSpinnerGenerarArchivo = function () {
            spinnerBarGenerarArchivo.show();
        };

        $scope.unBlockSpinnerGenerarArchivo = function () {
            spinnerBarGenerarArchivo.hide();
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
            if ($scope.contrasenia.nueva !== $scope.contrasenia.nuevaRepe)
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

        $scope.ayuda = function () {
            var path = window.location.hash.split('/')[1] + '.' + window.location.hash.split('/')[2];
            switch (path) {
                case 'home.inicio':
                    $scope.textoAyuda = 'Aquí podemos encontrar un resumen general del estado de nuestro campo.  Podemos observar datos referidos a cuantos bovinos registrados tenemos, la cantidad de eventos, cuantas ventas se han concretado y cuantas vacas están preñadas. Además, tenemos un gráfico de torta que muestra en porcentaje la cantidad de vacas por raza y un gráfico de barras que muestra la cantidad de vacunos por categoría.';
                    break;
                case 'home.bovino':
                    $scope.textoAyuda = 'Aquí podemos encontrar toda la información referida a ellos. En la sección superior tenemos un campo para buscar y consultar los datos de un animal. Podemos realizar una búsqueda aplicando filtros de numero de caravana, categoría, sexo, raza, rodeo, estado y peso (mayor o menor a un valor). Se le permite al usuario mostrar una cierta cantidad de registros por página para que la salida de la búsqueda tenga una cierta cantidad de registros. Se utiliza un sistema de paginación cuando la salida es superior a los registros solicitados por el usuario. ' +
            'Por cada bovino que aparezca en la lista podremos consultar sus datos, editarlos o eliminar al animal en cuestión. ' +
            'Además, contamos con la “opción de exportar” que nos permite extraer el listado de bovinos en formato Excel, PDF o imprimirlo.';
                    break;
                case 'home.trazabilidad':
                    $scope.textoAyuda = 'Aquí podemos realizar acciones para consultar, modificar y eliminar eventos de la trazabilidad. La sección superior de la pantalla corresponde a la consulta de la trazabilidad, en donde tenemos que ingresar campos para la búsqueda, como puede ser el número de caravana o el tipo de evento o un rango de fechas. ' +
           'Luego tenemos la sección de los resultados, los cuales se los puede exportar en formato PDF, Excel o imprimirlos. ' +
           'En la sección inferior tenemos la paginación para ordenar la salida en base a la cantidad de registros que se desee. Por cada evento tenemos la sección de Bovinos que participaron y la sección de Acciones. Es decir, para cada evento podremos consultarlo, modificarlo y eliminarlo.';
                    break;
                case 'home.inseminacion':
                    $scope.textoAyuda = 'En esta pantalla se muestra información relevante a las hembras que están para servicio, los servicios sin confirmar, las vacas que estén por parir y las lactancias activas. ' +
            'En la sección superior podemos ver una agrupación de la cantidad de bovinos hembra según lo mencionado anteriormente. Luego tenemos con mayor detalle, información relacionada a cada categoría. Al hacer click en cada una de ellas, el sistema nos mostrará en otra pantalla los datos correspondientes al campo seleccionado.';
                    break;
                case 'home.reportes':
                    $scope.textoAyuda = 'Aquí podremos encontrar reportes y estadísticas para los Bovinos, Eventos e Inseminaciones. Los reportes constan de un listado de información en base al tipo seleccionado. Tenemos la opción de exportarlos en formato PDF y Excel. ' +
            'Las estadísticas están compuestas por gráficos de barra, torta y tablas. Además, tienen una sección de resumen, que nos muestran una síntesis de los datos más relevantes de nuestro campo.';
                    break;
                case 'home.usuarios':
                    $scope.textoAyuda = 'Aquí podremos consultar, editar o eliminar los datos de un usuario. Además, podemos dar de alta a un usuario nuevo y asignarle un rol predeterminado. Si un usuario olvida su contraseña y necesita que se la reseteen se puede realizar desde este módulo. Otra de las funcionalidades que tenemos, es el alta de usuarios "PEÓN" para la aplicación Mobile. ' +
            'En la sección superior podemos observar un campo de búsqueda de usuario en base al nombre, apellido y rol.';
                    break;
                case 'home.configuracion':
                    $scope.textoAyuda = 'Aquí podremos editar las preferencias de uso de nuestro sistema. Como es el período de trabajo(año), modificar aspectos de nuestro perfil y dar de alta a nuevos establecimientos de origen. ' +
                    'También nos permite dar de alta diferentes parámetros como Vacunas, Antibióticos, Razas, Categorías, Estados y Alimentos.';
                    break;
                case 'home.conflictos':
                    $scope.textoAyuda = 'Cuando suceda un conflicto de carga de Inseminaciones, desde esta pantalla podremos resolverlo. Es decir, aquellas Inseminaciones conflictivas que carguen los peones, el sistema nos las listará aquí. Tendremos la opción de resolver un conflicto o eliminarlo.'
                    break;
                case 'home.nacimientos':
                    $scope.textoAyuda = 'Aquí aparecerán los bovinos que recién han nacido y hay que darle de alta en el sistema. En la sección superior tenemos para buscar por número de caravana madre o padre y por rango de fechas.  Además, podemos exportar en PDF o Excel la lista de recién nacidos.';
                    break;
            }
            $('#modalAyuda').modal('show');
        };
    });
})();
