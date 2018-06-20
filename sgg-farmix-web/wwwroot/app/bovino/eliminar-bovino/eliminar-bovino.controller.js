(function () {
    'use strict';

    angular
        .module('app')
        .controller('eliminarBovinoController', eliminarBovinoController);

    eliminarBovinoController.$inject = ['$scope', 'eliminarBovinoService', '$stateParams', 'toastr', '$localStorage'];

    function eliminarBovinoController($scope, eliminarBovinoService, $stateParams, toastr, $localStorage) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.habilitar = false;
        vm.tiposEliminacion = [
            { id: '1', nombre: 'Venta' },
            { id: '2', nombre: 'Defunción' }
        ];
        vm.tipoEliminacionSeleccionada = "1";
        vm.eliminar = eliminar;
        vm.inicializar = inicializar();
        vm.getFecha = getFecha;
        vm.cambiarModoBaja = cambiarModoBaja;

        vm.btnVolver = "Cancelar";
        vm.nroCaravana = '';
        vm.habilitar = true;
        vm.bajaBovino = {};
        vm.fechaDeHoy = new Date();
        $('#datetimepicker7').datetimepicker();
        
        //inicializar();      

        function inicializar() {
            $scope.$parent.blockSpinner();
            eliminarBovinoService.inicializar($stateParams.id, $localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                //bovino
                vm.bovino = data;
                vm.establecimientos = data.establecimientosDestino.establecimientos;
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                vm.habilitar = true;
                vm.nroCaravana = vm.bovino.numCaravana;
                vm.formEliminarBovino.fechaMuerte.$setValidity("min", true);
                vm.formEliminarBovino.fechaMuerte.$setValidity("max", true);
                vm.formEliminarBovino.fechaMuerte.$setValidity("required", true);
                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idBovino') {
                        vm.bovino[key] = '';
                    }
                })
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                //vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }

        function eliminar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            $('#modalConfirmEliminar').modal('hide');
            if (vm.tipoEliminacionSeleccionada === "2") {
                //var fecha = convertirFecha(vm.bajaBovino.fechaMuerte);
                eliminarBovinoService.bajaMuerte(vm.bovino.idBovino, vm.bajaBovino.fechaMuerte, $localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    vm.btnVolver = "Volver";
                    toastr.success('Se dio de baja el bovino con éxito ', 'Éxito');
                }, function error(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
            else {
                vm.bajaBovino.monto = vm.bajaBovino.monto.toString().replace(',', '.');
                vm.bajaBovino.idBovino = vm.bovino.idBovino;
                vm.bajaBovino.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
                eliminarBovinoService.bajaVenta(vm.bajaBovino).then(function success(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    vm.btnVolver = "Volver";
                    toastr.success('Se vendio el bovino con éxito ', 'Éxito');
                }, function error(data) {
                    $scope.$parent.unBlockSpinnerSave();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
        }

        function cambiarModoBaja() {
            if (vm.tipoEliminacionSeleccionada === '1') {
                vm.formEliminarBovino.fechaMuerte.$setValidity("min", true);
                vm.formEliminarBovino.fechaMuerte.$setValidity("max", true);
                vm.formEliminarBovino.fechaMuerte.$setValidity("required", true);
            }
            else {
                vm.formEliminarBovino.establecimientoDestino.$setValidity("required", true);
                vm.formEliminarBovino.monto.$setValidity("required", true);
                vm.formEliminarBovino.monto.$setValidity("min", true);
            }
        }

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = fecha.getMonth().toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };        

        function getFecha() {
            vm.bajaBovino.fechaMuerte = $('#datetimepicker7')[0].value;
            var fechaMuerte = new Date(vm.bajaBovino.fechaMuerte.substring(6, 10), parseInt(vm.bajaBovino.fechaMuerte.substring(3, 5)) - 1, vm.bajaBovino.fechaMuerte.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaMuerte > fechaHoy) {
                vm.formEliminarBovino.fechaMuerte.$setValidity("max", false);
            }
            else {
                vm.formEliminarBovino.fechaMuerte.$setValidity("max", true);
            }
            if (fechaMuerte < fechaMin)
                vm.formEliminarBovino.fechaMuerte.$setValidity("min", false);
            else
                vm.formEliminarBovino.fechaMuerte.$setValidity("min", true);
        }
    }
})();
