(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarInseminacionController', modificarInseminacionController);

    modificarInseminacionController.$inject = ['$scope', 'modificarInseminacionService', 'toastr', '$stateParams'];

    function modificarInseminacionController($scope, modificarInseminacionService, toastr, $stateParams) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.habilitar = false;
        //funciones
        vm.modificar = modificar;
        vm.inicializar = inicializar();
        vm.getFecha = getFecha;
        vm.getFechaParicion = getFechaParicion;
        vm.openPopUp = openPopUp;
        vm.eliminar = eliminar;
        vm.antesDeModificar = antesDeModificar;
        //variables
        vm.fechaDeHoy = new Date();
        vm.desde = $stateParams.desde;
        vm.showEliminar = true;
        $('#datetimepicker4').datetimepicker();
        var idVacaEliminar = 0;
        var fechaInseminacionOriginal = '';

        function inicializar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.habilitar = false;
            vm.fecha = $stateParams.fecha;
            modificarInseminacionService.getInseminacion($stateParams.fecha).then(function success(data) {
                //inseminacion
                vm.inseminacion = data;
                vm.inseminacion.idTipoInseminacion = vm.inseminacion.idTipoInseminacion.toString();
                fechaInseminacionOriginal = vm.inseminacion.fechaInseminacion;
                if (vm.inseminacion.fechaEstimadaNacimiento !== '') {
                    $('#datetimepicker5').datetimepicker();
                    vm.vaca = vm.inseminacion.listaBovinos[0];
                    vm.tactos = vm.inseminacion.tactos;
                }
                else
                    vm.rowCollection = vm.inseminacion.listaBovinos;
                vm.tituloTabla = 'Bovinos que participaron de la inseminación';
                vm.tiposInseminacion = [
                    { idTipoInseminacion: '1', descripcion: 'Artificial' },
                    { idTipoInseminacion: '2', descripcion: 'Montura' }
                ];
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                vm.habilitar = true;
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function antesDeModificar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.showEliminar = true;
            var lista = [];
            if (vm.rowCollection !== undefined) {
                for (var i = 0; i < vm.rowCollection.length; i++) {
                    lista.push(vm.rowCollection[i].idBovino);
                }
            }
            else
                lista.push(vm.vaca.idBovino);
            vm.inseminacion.tipoInseminacion = vm.inseminacion.idTipoInseminacion;
            if (lista.length === 0)
                $('#modalConfirmEliminarInseminacion').modal('show');
            else
                modificar(lista);
        };

        function modificar(lista) {
            if (vm.desde === 'servicioSinConfirm') {
                modificarInseminacionService.modificar(vm.inseminacion, lista.toString(), fechaInseminacionOriginal).then(function success(data) {
                    //vm.habilitar = false;
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    $('#modalConfirmEliminarInseminacion').modal('hide');
                    vm.showEliminar = false;
                    toastr.success('Se modificó la inseminación con éxito ', 'Éxito');
                }, function error(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBllockSpinnerSave();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
            else {
                modificarInseminacionService.update(vm.inseminacion).then(function success(data) {
                    //vm.habilitar = false;
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    $('#modalConfirmEliminarInseminacion').modal('hide');
                    toastr.success('Se modificó la inseminación con éxito ', 'Éxito');
                }, function error(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
        }

        function openPopUp(id, caravana) {
            idVacaEliminar = id;
            vm.nroCaravana = caravana;
            $('#modalConfirmEliminarVaca').modal('show');
        }

        function eliminar() {
            for (var i = 0; i < vm.rowCollection.length; i++) {
                if (vm.rowCollection[i].idBovino === idVacaEliminar)
                    vm.rowCollection.splice(i, 1);
            }
            $('#modalConfirmEliminarVaca').modal('hide');
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
            vm.inseminacion.fechaInseminacion = $('#datetimepicker4')[0].value;
            var fechaInseminacion = new Date(vm.inseminacion.fechaInseminacion.substring(6, 10), parseInt(vm.inseminacion.fechaInseminacion.substring(3, 5)) - 1, vm.inseminacion.fechaInseminacion.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaInseminacion > fechaHoy) {
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("max", false);
            }
            else {
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("max", true);
            }
            if (fechaInseminacion < fechaMin)
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("min", false);
            else
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("min", true);
        }

        function getFechaParicion() {
            vm.inseminacion.fechaEstimadaNacimiento = $('#datetimepicker5')[0].value;
            var fechaEstNacimiento = new Date(vm.inseminacion.fechaEstimadaNacimiento.substring(6, 10), parseInt(vm.inseminacion.fechaEstimadaNacimiento.substring(3, 5)) - 1, vm.inseminacion.fechaEstimadaNacimiento.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaEstNacimiento < fechaMin)
                vm.formModificarInseminacion.fechaParicion.$setValidity("min", false);
            else
                vm.formModificarInseminacion.fechaParicion.$setValidity("min", true);
        }
    }
})();