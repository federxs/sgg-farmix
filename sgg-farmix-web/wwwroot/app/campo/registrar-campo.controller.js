(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarCampoController', registrarCampoController);

    registrarCampoController.$inject = ['$scope', 'registrarCampoService', '$localStorage', 'toastr', '$sessionStorage', '$state'];

    function registrarCampoController($scope, registrarCampoService, $localStorage, toastr, $sessionStorage, $state) {
        var vm = $scope;
        //variables
        vm.showSpinner = true;
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.campo = {};
        var localidadesOriginales = [];
        vm.imageToUpload = [];
        vm.toDelete = [];
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
            vm.showSpinner = false;
            registrarCampoService.inicializar({}, function (data) {
                vm.provincias = data.provincias;
                localidadesOriginales = data.localidades;
            }, function error(error) {
                vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function registrar() {
            vm.habilitar = false;
            vm.showSpinner = true;
            vm.campo.usuario = $sessionStorage.usuarioInfo.usuario;
            if (vm.imageToUpload[0])
                vm.campo.imagen = vm.imageToUpload[0];
            vm.campo.$save(function success(data) {
                toastr.success('Se agrego con éxito el campo', 'Éxito');
                vm.showSpinner = false;
                $state.go('seleccionCampo');
            }, function error(error) {
                vm.showSpinner = false;
                vm.habilitar = true;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
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
