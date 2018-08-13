(function () {
    'use strict';

    angular
        .module('app')
        .controller('seleccionCampoController', seleccionCampoController);

    seleccionCampoController.$inject = ['$scope', 'toastr', 'seleccionCampoService', '$localStorage', '$state', 'usuarioInfo', 'registrarCampoService', 'portalService'];

    function seleccionCampoController($scope, toastr, seleccionCampoService, $localStorage, $state, usuarioInfo, registrarCampoService, portalService) {
        var vm = $scope;
        vm.usuario = {};
        window.scrollTo(0, 0);
        $('.modal-backdrop').remove();

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


        vm.inicializar = inicializar();
        vm.seleccionarCampo = seleccionarCampo;
        vm.validarCantCampos = validarCantCampos;
        vm.cerrarSesion = cerrarSesion;
        vm.abrirModalEliminarCampo = abrirModalEliminarCampo;
        vm.eliminarCampo = eliminarCampo;
        $localStorage.usuarioInfo = {};
        vm.idRol = usuarioInfo.getRol();
        var codigoCampoEliminar = 0;

        function inicializar() {
            spinnerBar.show();
            seleccionCampoService.consultar(usuarioInfo.getUsuario(), usuarioInfo.getRol())
                   .then(function success(data) {
                       $scope.campos = data;
                       for (var i = 0; i < $scope.campos.length; i++) {
                           if ($scope.campos[i].imagenNombre)
                               $scope.campos[i].imagenNombre = portalService.getUrlServer() + portalService.getFolderImagenCampo() + $scope.campos[i].codigoCampo + '\\' + $scope.campos[i].imagenNombre + "?cache=" + (new Date()).getTime();
                           else
                               $scope.campos[i].imagenNombre = 'images/campo_defecto.jpg';
                       }
                       spinnerBar.hide();
                       $('.modal-backdrop').remove();
                   }, function error(error) {
                       spinnerBar.hide();
                       if (error.statusText === 'Token_Invalido') {
                           toastr.error('Lo sentimos, su sesión ha caducado', 'Sesión caducada');
                           vm.cerrarSesion();
                       }
                       else if (error.statusText === 'Not Found') {
                           usuarioInfo.set(null);
                           $state.go('login');
                       }
                       else
                           toastr.error('Ha ocurrido un error, reintentar', 'Error');
                   });
        };

        function seleccionarCampo(codigo) {
            $localStorage.usuarioInfo.codigoCampo = codigo;
            $state.go('home.inicio');
        };

        function validarCantCampos() {
            spinnerBar.show();
            registrarCampoService.validarCantCamposUsuario({ usuario: usuarioInfo.getUsuario() }, function success(data) {
                if (data.resultado) {
                    spinnerBar.hide();
                    $state.go('registrarCampo');
                }                    
                else {
                    spinnerBar.hide();
                    toastr.info("No puede agregar mas campos, verifique su plan contratado.", "Aviso");
                }                    
            }, function error(error) {
                if (error.statusText === 'Token_Invalido') {
                    toastr.error('Lo sentimos, su sesión ha caducado', 'Sesión caducada');
                    vm.cerrarSesion();
                }
                else
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function cerrarSesion() {
            $localStorage.usuarioInfo = undefined;
            usuarioInfo.set(null);
            $('#modalConfirmCerrarSesion').modal('hide');
            $state.go('login');
        };

        function abrirModalEliminarCampo(nombre, id) {
            vm.campoAEliminar = nombre;
            codigoCampoEliminar = id;
            $('#modalEliminarCampo').modal('show');
        };

        function eliminarCampo() {
            spinnerBar.show('Eliminando...');
            seleccionCampoService.borrarCampo(codigoCampoEliminar)
                   .then(function success(data) {
                       spinnerBar.hide();
                       toastr.success('Campo Eliminado con éxito!', 'Éxito');
                       $('#modalEliminarCampo').modal('hide');
                       $('.modal-backdrop').remove();
                       inicializar();
                   }, function error(error) {
                       spinnerBar.hide();
                       if (error.statusText === 'Token_Invalido') {
                           toastr.error('Lo sentimos, su sesión ha caducado', 'Sesión caducada');
                           vm.cerrarSesion();
                       }
                       else if (error.statusText === 'Not Found') {
                           usuarioInfo.set(null);
                           $state.go('login');
                       }
                       else
                           toastr.error('Ha ocurrido un error, reintentar', 'Error');
                   });
        }
    }
})();
