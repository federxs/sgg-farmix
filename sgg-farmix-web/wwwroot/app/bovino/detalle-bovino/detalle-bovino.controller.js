(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleBovinoController', detalleBovinoController);

    detalleBovinoController.$inject = ['$scope', 'detalleBovinoService', '$stateParams', 'toastr'];

    function detalleBovinoController($scope, detalleBovinoService, $stateParams, toastr) {
        var vm = $scope;
        window.scrollTo(0, 0);
        //funciones
        vm.inicializar = inicializar;
        //variables
        vm.bovino = {};
        vm.checkH = false;
        vm.checkM = false;
        vm.volver = 'home.bovino';

        inicializar();

        function inicializar() {
            if ($stateParams.proviene)
                if ($stateParams.proviene === 'DetalleEvento')
                    vm.volver = 'home.detalleEvento({id:' +  $stateParams.evento + '})';
                else if ($stateParams.proviene === 'ModificarEvento')
                    vm.volver = 'home.modificarEvento({id:' + $stateParams.evento + '})';
                else if ($stateParams.proviene === 'DetalleInseminacion')
                    vm.volver = 'home.detalleInseminacion({fecha:"' + $stateParams.fecha + '", desde: "' + $stateParams.desde + '"})';
                else if($stateParams.proviene === 'ModificarInseminacion')
                    vm.volver = 'home.modificarInseminacion({fecha:"' + $stateParams.fecha + '", desde: "' + $stateParams.desde + '"})';
            $scope.$parent.blockSpinner();
            //vm.showSpinner = true;
            detalleBovinoService.inicializar($stateParams.id).then(function success(data) {
                vm.checkH = false;
                vm.checkM = false;
                //bovino
                vm.bovino = data;
                var fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 10).split('/');
                vm.bovino.fechaNacimiento = new Date(fechaNacimiento[2], (parseInt(fechaNacimiento[1] - 1)).toString(), fechaNacimiento[0]);
                if (vm.bovino.sexo === 0) {
                    vm.checkH = true;
                    vm.checkM = false;
                }
                else {
                    vm.checkH = false;
                    vm.checkM = true;
                }
                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idBovino') {
                        vm.bovino[key] = '';
                    }
                });
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        }//fin inicializar


    }//fin archivo
})();