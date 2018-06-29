(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarCampoController', registrarCampoController);

    registrarCampoController.$inject = ['$scope', 'registrarCampoService', '$localStorage', 'toastr', 'usuarioInfo', '$state'];

    function registrarCampoController($scope, registrarCampoService, $localStorage, toastr, usuarioInfo, $state) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.campo = {};
        var localidadesOriginales = [];
        vm.imageToUpload = [];
        vm.toDelete = [];
        vm.localidadSeleccionada = {};

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

        //metodos
        vm.inicializar = inicializar();
        vm.registrar = registrar;
        vm.getLocalidades = getLocalidades;
        vm.selectUnselectImage = selectUnselectImage;
        vm.ImageClass = ImageClass;
        vm.deleteImagefromModel = deleteImagefromModel;
        vm.UploadImg = UploadImg;        

        function inicializar() {
            vm.campo = new registrarCampoService();
            spinnerBar.show();
            registrarCampoService.inicializar({}, function (data) {
                vm.provincias = data.provincias;
                localidadesOriginales = data.localidades;
                spinnerBar.hide();
            }, function error(error) {
                spinnerBar.hide();
                $scope.$parent.errorServicio(error.statusText);
            })
        };

        function registrar() {
            vm.habilitar = false;
            spinnerBarGuardado.show();
            vm.campo.usuario = usuarioInfo.getUsuario();
            if (vm.imageToUpload[0])
                vm.campo.imagen = vm.imageToUpload[0];
            vm.campo.idLocalidad = vm.localidadSeleccionada.selected.idLocalidad;
            vm.campo.$save(function success(data) {
                toastr.success('Se agrego con éxito el campo', 'Éxito');
                spinnerBarGuardado.hide();
                $state.go('seleccionCampo');
            }, function error(error) {
                spinnerBarGuardado.hide();
                vm.habilitar = true;
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function getLocalidades() {
            vm.localidades = Enumerable.From(localidadesOriginales).Where(function (x) {
                return x.idProvincia === parseInt(vm.campo.idProvincia);
            }).ToArray();
        };

        function selectUnselectImage(item) {
            var index = vm.toDelete.indexOf(item);
            if (index != -1) {
                vm.toDelete.splice(index, 1);
            } else {
                $scope.toDelete.push(item)
            }
        };

        function ImageClass(item) {
            var index = vm.toDelete.indexOf(item);
            if (index != -1) {
                return true;
            } else {
                return false;
            }
        };

        function deleteImagefromModel() {
            if (vm.toDelete != [] && vm.toDelete.length > 0) {
                angular.forEach($scope.toDelete, function (value, key) {
                    var index = vm.imageToUpload.indexOf(value);
                    var indexToDelete = vm.toDelete.indexOf(value);
                    if (index != -1) {
                        vm.imageToUpload.splice(index, 1);
                        vm.toDelete.splice(indexToDelete, 1);
                    }
                });
            }
            else {
                toastr.info('Debe seleccionar una imágen para borrar', 'Aviso');
            }
        };

        function UploadImg($files, $invalidFiles) {
            $scope.imageToUpload = $files
        };
    }
})();
