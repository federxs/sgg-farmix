(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', 'toastr', 'loginService', '$localStorage', '$state', '$sessionStorage'];

    function loginController($scope, toastr, loginService, $localStorage, $state, $sessionStorage) {
        var vm = $scope;
        vm.usuario = {};
        vm.ocultarUsuario = true;
        //vm.showSpinner = false;

        vm.inicializar = inicializar();
        vm.aceptar = aceptar;

        var waitingDialog = waitingDialog || (function ($) {
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
                /**
                 * Opens our dialog
                 * @param message Custom message
                 * @param options Custom options:
                 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
                 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
                 */
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

        function inicializar() {
            var obj = document.getElementById('btn_login');
            obj.click();
            if ($sessionStorage.usuarioInfo) {
                vm.usuario.usuario = $sessionStorage.usuarioInfo.usuario;
                vm.ocultarUsuario = false;
            }
        }

        function aceptar() {
            if (validar()) {
                $('#login-modal').modal('hide');
                waitingDialog.show();
                //vm.showSpinner = true;
                $scope.usuario.idRol = 1;
                loginService.consultar($scope.usuario)
                    .then(function success(data) {
                        if (data.resultado === 1) {
                            if (!$sessionStorage.usuarioInfo) {
                                $sessionStorage.usuarioInfo = {};
                                $sessionStorage.usuarioInfo.usuario = vm.usuario.usuario;
                                $sessionStorage.usuarioInfo.idRol = data.idRol;
                                $sessionStorage.usuarioInfo.token = data.token;
                            }
                            //$('#login-modal').modal('hide');
                            $state.go('seleccionCampo');
                        }
                        else {
                            toastr.error("Los datos son inválidos. Por favor revíselos e intente nuevamente.");
                            $('#login-modal').modal('show');
                        }                            
                        //setTimeout()
                        waitingDialog.hide();
                        //vm.showSpinner = false;
                    },
                    function error(error) {
                        //vm.showSpinner = false;
                        waitingDialog.hide();
                        toastr.error("Ha ocurrido un problema. Reintente nuevamente.");
                        $('#login-modal').modal('show');
                    });
            }
        }

        function validar() {
            if (isUndefinedOrNull(vm.usuario.usuario)) {
                toastr.info("El usuario se encuentra vacío");
                return false;
            }
            if (isUndefinedOrNull(vm.usuario.pass)) {
                toastr.info("La contraseña se encuentra vacía");
                return false;
            }
            return true;
        }

        function isUndefinedOrNull(val) {
            return angular.isUndefined(val) || val === null || val == undefined
        }
    }
})();
