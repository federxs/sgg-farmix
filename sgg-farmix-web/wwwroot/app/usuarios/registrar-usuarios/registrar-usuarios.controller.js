(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarUsuariosController', registrarUsuariosController);

    registrarUsuariosController.$inject = ['$scope', 'registrarUsuariosService', '$localStorage', 'toastr'];

    function registrarUsuariosController($scope, registrarUsuariosService, $localStorage, toastr) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.imageToUpload = [];
        vm.toDelete = [];

        //metodos
        vm.inicializar = inicializar;
        vm.registrar = registrar;
        vm.validarContrasenias = validarContrasenias;
        vm.selectUnselectImage = selectUnselectImage;
        vm.ImageClass = ImageClass;
        vm.deleteImagefromModel = deleteImagefromModel;
        vm.UploadImg = UploadImg;
        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.usuario = new registrarUsuariosService();
            //vm.showSpinner = false;
            vm.roles = [];
            vm.roles.push({ idRol: 2, nombre: 'Ingeniero' });
            vm.roles.push({ idRol: 3, nombre: 'Peón' });
            $scope.$parent.unBlockSpinner();
        };

        function registrar() {
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            if (vm.imageToUpload[0])
                vm.usuario.imagen = vm.imageToUpload[0];
            vm.usuario.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.usuario.$save(function (data) {
                toastr.success('Se agrego con éxito el usuario ', 'Éxito');
                vm.btnVolver = "Volver";
                $scope.$parent.unBlockSpinnerSave();
            }, function error(error) {                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                if (error.data === 'Error: El usuario ya existe para este campo') {
                    vm.habilitar = true;
                    toastr.warning('El usuario ya existe para este campo', 'Advertencia')
                }
                else
                    $scope.$parent.errorServicio(error.statusText);
            });
        };

        function validarContrasenias() {
            if (vm.usuario.pass === vm.contraseniaRepetida.contraseniaRepetida) {
                vm.formRegistrarUsuario.contraseniaRepetida.$setValidity("min", true);
            }
            else {
                vm.formRegistrarUsuario.contraseniaRepetida.$setValidity("min", false);
            }
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
