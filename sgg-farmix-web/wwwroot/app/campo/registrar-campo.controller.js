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
            $scope.$parent.blockSpinner();
            registrarCampoService.inicializar({}, function (data) {
                vm.provincias = data.provincias;
                localidadesOriginales = data.localidades;
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            })
        };

        function registrar() {
            vm.habilitar = false;
            $scope.$parent.blockSpinnerSave();
            vm.campo.usuario = usuarioInfo.getUsuario();
            if (vm.imageToUpload[0])
                vm.campo.imagen = vm.imageToUpload[0];
            vm.campo.$save(function success(data) {
                toastr.success('Se agrego con éxito el campo', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $state.go('seleccionCampo');
            }, function error(error) {
                $scope.$parent.unBlockSpinnerSave();
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
